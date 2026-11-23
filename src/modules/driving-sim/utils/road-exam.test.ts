import { describe, expect, it } from 'vitest';
import { CAR, NPC, ROAD } from '../constants';
import type { CarSnapshot, DriverState, ExamEvent, Gear, Transmission, TurnSignal, Vec2 } from '../types';
import { hitsNpc, RoadExam } from './road-exam';
import { Traffic } from './road-traffic';

const DT = 1 / 60;
const KMH = 1 / 3.6;

function snapshot(x: number, z: number, speed = 0, stalledNow = false): CarSnapshot {
  const at = (f: number, l: number): Vec2 => ({ x: x + l, z: z + f });
  const hw = CAR.trackWidth / 2;
  const hb = CAR.wheelBase / 2;
  return {
    position: { x, z },
    forward: { x: 0, z: 1 },
    speed,
    stalledNow,
    wheels: [at(hb, hw), at(hb, -hw), at(-hb, hw), at(-hb, -hw)],
    corners: [
      at(CAR.length / 2, CAR.width / 2),
      at(CAR.length / 2, -CAR.width / 2),
      at(-CAR.length / 2, CAR.width / 2),
      at(-CAR.length / 2, -CAR.width / 2),
    ],
  };
}

/** A scripted learner: holds a speed and control settings while the exam and its traffic run. */
class Learner {
  readonly exam = new RoadExam();
  readonly events: ExamEvent[] = [];
  x: number = ROAD.laneX;
  z = 0;
  gear: Gear;
  signal: TurnSignal = 'off';
  handbrake = false;

  constructor(readonly transmission: Transmission = 'B2') {
    this.gear = transmission === 'B2' ? '1' : 'D';
  }

  private get driver(): DriverState {
    return { transmission: this.transmission, gear: this.gear, signal: this.signal, handbrake: this.handbrake };
  }

  /** Drives at `kmh` until `toZ`, keeping a safe gap to the car in front like a careful driver. */
  driveTo(toZ: number, kmh: number, careful = true): this {
    for (let i = 0; this.z < toZ && i < 200_000; i++) {
      const lead = this.exam.traffic.lead;
      const gap = lead.z - this.z;
      const speed = careful && gap > 0 && gap < 20 ? Math.min(kmh * KMH, lead.speed) : kmh * KMH;
      this.z += speed * DT;
      this.events.push(...this.exam.update(snapshot(this.x, this.z, speed), DT, this.driver));
    }
    return this;
  }

  wait(seconds: number, stalledNow = false): this {
    for (let i = 0; i < Math.round(seconds / DT); i++) {
      this.events.push(...this.exam.update(snapshot(this.x, this.z, 0, stalledNow && i === 0), DT, this.driver));
    }
    return this;
  }

  /** Signals left, pulls away, cancels the signal inside the first 5 m. */
  depart(): this {
    this.signal = 'left';
    this.wait(0.5).driveTo(2, 8);
    this.signal = 'off';
    return this;
  }

  /** Signals right, pulls over, stops, selects neutral and applies the handbrake. */
  pullOver(): this {
    this.signal = 'right';
    this.driveTo(ROAD.finishFrom + 60, 15);
    this.x = ROAD.pullOverX - 0.3;
    this.wait(1);
    this.gear = this.transmission === 'B2' ? 'N' : 'P';
    this.handbrake = true;
    return this.wait(0.2);
  }

  /** Every step driven by the book, up to the "Kết thúc" command. */
  cleanRunUntilFinish(): this {
    this.depart().driveTo(ROAD.speedUp.from + 5, 18);
    if (this.transmission === 'B2') this.gear = '3';
    this.driveTo(ROAD.slowDown.from + 20, 32);
    if (this.transmission === 'B2') this.gear = '2';
    return this.driveTo(ROAD.slowDown.to + 10, 15).driveTo(ROAD.finishFrom, 30);
  }

  cleanRun(): this {
    return this.cleanRunUntilFinish().pullOver();
  }

  get penalties() {
    return this.events.flatMap((e) => (e.type === 'penalty' ? [e.reason] : []));
  }

  get voices() {
    return this.events.flatMap((e) => (e.type === 'voice' ? [e.text] : []));
  }

  get outcome() {
    return this.events.find((e) => e.type === 'pass' || e.type === 'fail');
  }
}

describe('RoadExam', () => {
  it.each(['B2', 'B1'] as const)('passes a %s run driven by the book with no penalties', (transmission) => {
    const learner = new Learner(transmission).cleanRun();
    expect(learner.penalties).toEqual([]);
    expect(learner.outcome).toEqual({ type: 'pass', reason: 'Hoàn thành bài thi đường trường' });
    expect(learner.voices).toEqual([
      'Bắt đầu thi',
      'Tăng số, tăng tốc',
      'Giảm số, giảm tốc',
      'Chú ý! Xe phía trước phanh gấp',
      'Kết thúc. Bật xi-nhan phải, tấp vào lề và dừng xe',
    ]);
  });

  it('reports the step and the distance driven for the HUD', () => {
    const learner = new Learner().depart();
    expect(learner.exam.progress()).toMatchObject({ step: 0, total: ROAD.length, offset: 0 });
    const { lead } = learner.exam.traffic;
    expect(learner.exam.progress().gap).toBeCloseTo(lead.z - NPC.length / 2 - (learner.z + CAR.length / 2), 5);
    learner.driveTo(ROAD.speedUp.from + 1, 18);
    expect(learner.exam.progress().step).toBe(1);
    expect(learner.exam.progress().distance).toBeCloseTo(ROAD.speedUp.from + 1, 0);
    learner.driveTo(ROAD.slowDown.from + 1, 30);
    expect(learner.exam.progress().step).toBe(2);
  });

  it('charges 5 points for pulling away without the left signal', () => {
    const learner = new Learner().driveTo(10, 8);
    expect(learner.penalties).toEqual(['Không bật xi-nhan trái khi xuất phát']);
  });

  it('accepts a left signal cancelled as soon as the car rolls off', () => {
    const learner = new Learner();
    learner.signal = 'left';
    learner.wait(0.5).driveTo(0.1, 2);
    learner.signal = 'off';
    learner.driveTo(10, 8);
    expect(learner.penalties).toEqual([]);
    expect(learner.events).toContainEqual({ type: 'info', message: 'Xuất phát đúng quy trình' });
  });

  it('does not accept a left signal that was cancelled before pulling away', () => {
    const learner = new Learner();
    learner.signal = 'left';
    learner.wait(0.5);
    learner.signal = 'off';
    learner.wait(0.5).driveTo(10, 8);
    expect(learner.penalties).toEqual(['Không bật xi-nhan trái khi xuất phát']);
  });

  it('charges 5 points when the left signal is still on after 5 m', () => {
    const learner = new Learner();
    learner.signal = 'left';
    learner.driveTo(ROAD.departClear - 0.5, 8);
    expect(learner.penalties).toEqual([]);
    learner.driveTo(ROAD.departClear + 1, 8);
    expect(learner.penalties).toEqual(['Không tắt xi-nhan trái trong 5 m sau khi xuất phát']);
  });

  it('charges the speed-up step once: too slow, or fast enough but not in third gear', () => {
    const slow = new Learner().depart().driveTo(ROAD.speedUp.to + 5, 20);
    expect(slow.penalties).toEqual(['Không đạt trên 24 km/h trong 100 m']);

    const lowGear = new Learner().depart();
    lowGear.gear = '2';
    lowGear.driveTo(ROAD.speedUp.to + 5, 30);
    expect(lowGear.penalties).toEqual(['Không tăng lên số 3 trong 100 m']);

    const automatic = new Learner('B1').depart().driveTo(ROAD.speedUp.to + 5, 30);
    expect(automatic.penalties).toEqual([]);
  });

  it('does not count speed gained before the speed-up sign as failing the step', () => {
    const learner = new Learner().depart();
    learner.gear = '3';
    learner.driveTo(ROAD.speedUp.from + 2, 30);
    expect(learner.events.some((e) => e.type === 'info' && e.message.includes('tăng số tăng tốc'))).toBe(true);
    expect(learner.penalties).toEqual([]);
  });

  it('charges the slow-down step when the car passes the checkpoint at 20 km/h or more, or in a high gear', () => {
    const fast = new Learner('B1').depart().driveTo(ROAD.slowDown.to + 5, 30);
    expect(fast.penalties).toEqual(['Không giảm tốc độ xuống dưới 20 km/h']);

    const highGear = new Learner().depart();
    highGear.gear = '3';
    highGear.driveTo(ROAD.slowDown.from, 30).driveTo(ROAD.slowDown.to + 5, 15);
    expect(highGear.penalties).toEqual(['Không giảm về số 2 hoặc số 1']);
  });

  it('charges speeding once per excursion and again every 5 s it lasts', () => {
    const learner = new Learner('B1');
    // An empty road, so the learner can speed without running into the car in front.
    for (const npc of learner.exam.traffic.cars) npc.x = ROAD.halfWidth + 50;
    learner.depart().driveTo(ROAD.speedUp.to + 10, 30, false);
    expect(learner.penalties).toEqual([]);
    const from = learner.z;
    learner.driveTo(from + 45 * KMH * 6, 45, false);
    expect(learner.penalties).toEqual(['Vượt quá tốc độ 40 km/h', 'Vượt quá tốc độ 40 km/h']);
    learner
      .driveTo(learner.z + 30, 39, false)
      .driveTo(learner.z + 40, 30, false)
      .driveTo(learner.z + 10, 41, false);
    expect(learner.penalties).toHaveLength(3);
  });

  it('charges 5 points for a stall', () => {
    const learner = new Learner().wait(0.1, true);
    expect(learner.penalties).toEqual(['Xe chết máy']);
  });

  it('fails at once on touching another car or the kerb', () => {
    const crash = new Learner('B1').depart().driveTo(400, 40, false);
    expect(crash.outcome).toEqual({ type: 'fail', reason: 'Va chạm với xe khác' });

    const kerb = new Learner('B1').depart();
    kerb.x = -(ROAD.halfWidth - CAR.width / 2) - 0.05;
    kerb.driveTo(kerb.z + 1, 10);
    expect(kerb.outcome).toEqual({ type: 'fail', reason: 'Xe va vào lề đường' });
  });

  it('makes the car in front brake to a stop at the obstacle step, then drive on', () => {
    const learner = new Learner('B1').depart().driveTo(ROAD.obstacleAt + 0.5, 30);
    const { lead } = learner.exam.traffic;
    expect(lead.braking).toBe(true);
    expect(learner.exam.progress().step).toBe(3);
    learner.wait(3);
    expect(lead.speed).toBe(0);
    expect(lead.z - learner.z).toBeGreaterThan(CAR.length);
    learner.wait(6);
    expect(lead.braking).toBe(false);
    expect(lead.speed).toBeGreaterThan(3);
    expect(learner.outcome).toBeUndefined();
  });

  it('charges each forgotten finish action and still ends the test 5 s after stopping', () => {
    const learner = new Learner().cleanRunUntilFinish();
    learner.driveTo(ROAD.finishFrom + 40, 15).wait(ROAD.settleTime + 1);
    expect(learner.penalties).toEqual([
      'Không bật xi-nhan phải khi dừng xe',
      'Không tấp xe vào lề phải',
      'Không về số N khi dừng xe',
      'Không kéo phanh tay khi dừng xe',
    ]);
    expect(learner.outcome?.type).toBe('pass');
  });

  it('fails when the car runs past the final stop sign', () => {
    const learner = new Learner().cleanRunUntilFinish();
    learner.signal = 'right';
    learner.driveTo(ROAD.length, 15);
    expect(learner.outcome).toEqual({ type: 'fail', reason: 'Không dừng xe trước biển dừng cuối bài' });
  });

  it('fails when the car stops short of the final sign and then rolls past it', () => {
    const learner = new Learner('B1').cleanRunUntilFinish();
    learner.signal = 'right';
    learner.driveTo(ROAD.length - 6, 15).wait(1);
    expect(learner.outcome).toBeUndefined();
    learner.driveTo(ROAD.length, 5);
    expect(learner.outcome).toEqual({ type: 'fail', reason: 'Không dừng xe trước biển dừng cuối bài' });
  });

  it('judges the place where the car finally stops, not where it first paused', () => {
    const learner = new Learner().cleanRunUntilFinish();
    learner.signal = 'right';
    learner.driveTo(ROAD.finishFrom + 30, 15);
    learner.x = ROAD.pullOverX - 0.3;
    learner.wait(1);
    learner.x = ROAD.laneX;
    learner.driveTo(ROAD.finishFrom + 60, 10).wait(1);
    learner.gear = 'N';
    learner.handbrake = true;
    learner.wait(0.2);
    expect(learner.penalties).toEqual(['Không tấp xe vào lề phải']);
    expect(learner.outcome?.type).toBe('pass');
  });
});

describe('hitsNpc', () => {
  const npc = { id: 'n', x: ROAD.laneX, z: 100, speed: 0, braking: false, color: '#fff' };

  it('detects bumper contact and ignores a car in the next lane or a car length away', () => {
    const touching = 100 - NPC.length / 2 - CAR.length / 2 + 0.05;
    expect(hitsNpc(snapshot(ROAD.laneX, touching), npc)).toBe(true);
    expect(hitsNpc(snapshot(ROAD.laneX, touching - 0.2), npc)).toBe(false);
    expect(hitsNpc(snapshot(ROAD.oncomingX, 100), npc)).toBe(false);
  });
});

describe('Traffic', () => {
  const player = (z: number, speed = 0, x: number = ROAD.laneX) => ({ position: { x, z }, speed });
  const run = (traffic: Traffic, seconds: number, pose: () => ReturnType<typeof player>) => {
    for (let i = 0; i < Math.round(seconds / DT); i++) traffic.step(DT, pose());
  };

  it('keeps every car between 20 and 30 km/h while the learner keeps up', () => {
    const traffic = new Traffic();
    let z = 2;
    run(traffic, 60, () => {
      z += 30 * KMH * DT;
      return player(z, 30 * KMH);
    });
    for (const car of traffic.cars) {
      expect(Math.abs(car.speed) * 3.6).toBeGreaterThanOrEqual(19.9);
      expect(Math.abs(car.speed) * 3.6).toBeLessThanOrEqual(30.1);
    }
    expect(traffic.lead.z).toBeGreaterThan(z);
  });

  it('keeps the cars in front waiting at the start until the learner sets off', () => {
    const traffic = new Traffic();
    run(traffic, 60, () => player(0));
    expect(traffic.lead).toMatchObject({ z: 30, speed: 0 });
    expect(traffic.ahead).toMatchObject({ z: 70, speed: 0 });
    run(traffic, 10, () => player(2, 1));
    expect(traffic.lead.speed).toBeGreaterThan(3);
    expect(traffic.ahead.speed).toBeGreaterThan(3);
  });

  it('has the lead car slow down for a learner who falls far behind', () => {
    const traffic = new Traffic();
    run(traffic, 120, () => player(2));
    expect(traffic.lead.z).toBeLessThan(500);
    expect(traffic.lead.speed * 3.6).toBeLessThan(20);
  });

  it('never lets a car behind run into a learner who slows down in its lane', () => {
    const traffic = new Traffic();
    const z = traffic.lead.z + 30;
    run(traffic, 30, () => player(z, 0));
    expect(traffic.lead.speed).toBe(0);
    expect(z - CAR.length / 2 - (traffic.lead.z + NPC.length / 2)).toBeGreaterThan(1);
  });

  it('brings the oncoming car back ahead of the learner after it has passed', () => {
    const traffic = new Traffic();
    run(traffic, 60, () => player(0));
    expect(traffic.oncoming.z).toBeGreaterThan(-60);
    expect(traffic.oncoming.speed).toBeLessThan(0);
  });
});
