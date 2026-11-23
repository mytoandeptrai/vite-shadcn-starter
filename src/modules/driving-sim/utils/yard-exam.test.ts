import { describe, expect, it } from 'vitest';
import { CAR, YARD_EXAM } from '../constants';
import type { CarSnapshot, DriverState, ExamEvent, Gear, TurnSignal, Vec2 } from '../types';
import { type Corner, roundPath } from './yard';
import { lightsAt, YardExam } from './yard-exam';

const DT = 1 / 60;
const CRUISE = 3;

function snapshot(p: Vec2, forward: Vec2, speed: number, stalledNow = false): CarSnapshot {
  const left = { x: forward.z, z: -forward.x };
  const at = (f: number, l: number): Vec2 => ({
    x: p.x + forward.x * f + left.x * l,
    z: p.z + forward.z * f + left.z * l,
  });
  const hw = CAR.trackWidth / 2;
  const hb = CAR.wheelBase / 2;
  const hl = CAR.length / 2;
  return {
    position: p,
    forward,
    speed,
    stalledNow,
    wheels: [at(hb, hw), at(hb, -hw), at(-hb, hw), at(-hb, -hw)],
    corners: [at(hl, CAR.width / 2), at(hl, -CAR.width / 2), at(-hl, CAR.width / 2), at(-hl, -CAR.width / 2)],
  };
}

const c = (x: number, z: number, r?: number): Corner => ({ x, z, r });

/** Lane centres of the exam route, split where the car is put into a parking bay. */
const LEGS: Corner[][] = [
  [
    c(-51.8, -27),
    c(-51.8, 59.4, 9.1),
    c(-42, 59.4, 8),
    c(-34, 55.6, 8),
    c(-16.235, 55.6, 3),
    c(-16.235, 14.45, 2.2),
    c(-25.6, 14.45, 2.2),
    c(-25.6, 4.9, 3.4),
    c(47.6, 4.9, 5.3),
    c(47.6, 30.45, 4),
    c(32.325, 30.45, 4.375),
    c(32.325, 39.2, 4.375),
    c(41.075, 39.2, 4.375),
    c(41.075, 47.95, 4.375),
    c(5.9, 47.95, 3.2),
    c(5.9, -24.2, 4.6),
    c(14, -24.2),
  ],
  [
    c(16, -24.2),
    c(5.9, -24.2, 4.6),
    c(5.9, -54.95, 5.3),
    c(47.6, -54.95, 5.3),
    c(47.6, 1.1, 5.3),
    c(2.1, 1.1, 3),
    c(2.1, 59.4, 5),
    c(51.4, 59.4, 9.1),
    c(51.4, -58.75, 9.1),
    c(2.1, -58.75, 5),
    c(2.1, -34),
  ],
  [c(2.1, -33), c(2.1, 1.1, 5.3), c(-9.8, 1.1, 6), c(-9.8, -56.85, 5), c(-36, -56.85)],
];
/** Where the car stands in the bay after each of the first two legs. */
const BAYS: { p: Vec2; forward: Vec2 }[] = [
  { p: { x: 24.05, z: -29.65 }, forward: { x: 0, z: 1 } },
  { p: { x: -3.95, z: -39.05 }, forward: { x: 0, z: 1 } },
];

const STOP_LINES = [
  YARD_EXAM.pedestrian,
  YARD_EXAM.railway,
  YARD_EXAM.cross.west,
  YARD_EXAM.cross.north,
  YARD_EXAM.cross.east,
  YARD_EXAM.cross.south,
];
const HILL_LINE = { axis: 'z', dir: 1, at: 12.1, min: -53.7, max: -46.1 } as const;

interface Habits {
  /** Skip the stop at the pedestrian crossing and the railway. */
  noStops?: boolean;
  /** Drive through red lights. */
  runReds?: boolean;
  signal?: (step: number, title: string, fallback: TurnSignal) => TurnSignal;
  speed?: (p: Vec2, fallback: number) => number;
  gear?: (p: Vec2, fallback: Gear) => Gear;
  /** Distance left to a stop line when stopping. */
  gap?: number;
}

/** Drives a car along the route the way a careful learner would, minus the given habits. */
class Ghost {
  readonly exam = new YardExam();
  readonly events: ExamEvent[] = [];
  private leg = 0;
  private path: Vec2[] = roundPath(LEGS[0], false);
  private segment = 0;
  private along = 0;
  private stopped = new Set<object>();
  private wait = 0;
  p: Vec2 = this.path[0];
  forward: Vec2 = { x: 0, z: 1 };
  finished = false;

  constructor(private readonly habits: Habits = {}) {}

  get over(): boolean {
    return this.events.some((e) => e.type === 'pass' || e.type === 'fail');
  }

  private driver(rpm = 1500): DriverState {
    const { step, title } = this.exam.yard();
    const start = step === 1 && this.p.z < YARD_EXAM.start.at;
    const turn: TurnSignal = title.includes('lần 3')
      ? 'left'
      : title.includes('lần 4') || step === 11
        ? 'right'
        : 'off';
    const fallback: TurnSignal = start ? 'left' : turn;
    const inGear = this.p.x > 49.5 && this.p.z < YARD_EXAM.gear.startZ && this.p.z > YARD_EXAM.gear.greenZ - 3;
    const gear: Gear = inGear ? '2' : '1';
    return {
      transmission: 'B2',
      gear: this.habits.gear?.(this.p, gear) ?? gear,
      signal: this.habits.signal?.(step, title, fallback) ?? fallback,
      handbrake: false,
      rpm,
    };
  }

  tick(speed: number, extra: Partial<{ stalled: boolean; rpm: number }> = {}) {
    const events = this.exam.update(snapshot(this.p, this.forward, speed, extra.stalled), DT, this.driver(extra.rpm));
    this.events.push(...events);
  }

  /** Stands still for `seconds`. */
  hold(seconds: number) {
    for (let i = 0; i < Math.round(seconds / DT) && !this.over; i++) this.tick(0);
  }

  place(p: Vec2, forward: Vec2) {
    this.p = p;
    this.forward = forward;
  }

  private bumper(): Vec2 {
    return { x: this.p.x + this.forward.x * (CAR.length / 2), z: this.p.z + this.forward.z * (CAR.length / 2) };
  }

  /** The stop line just ahead, if the car should be standing at it now. */
  private mustStop(): boolean {
    const b = this.bumper();
    const gap = this.habits.gap ?? 0.3;
    for (const line of [...STOP_LINES, HILL_LINE]) {
      const side = line.axis === 'x' ? b.z : b.x;
      const ahead = line.dir * (line.at - (line.axis === 'x' ? b.x : b.z));
      if (side < line.min || side > line.max || ahead < 0 || ahead > gap) continue;
      const crossing = Object.values(YARD_EXAM.cross).includes(line as never);
      if (crossing) {
        if (this.habits.runReds) return false;
        const axis = line === YARD_EXAM.cross.north || line === YARD_EXAM.cross.south ? 'ns' : 'ew';
        return this.exam.lights()[axis] !== 'green';
      }
      if (this.habits.noStops && line !== HILL_LINE) return false;
      if (this.stopped.has(line)) return false;
      if (this.wait === 0) this.wait = 1;
      this.wait -= DT;
      if (this.wait <= 0) {
        this.wait = 0;
        this.stopped.add(line);
        return false;
      }
      return true;
    }
    return false;
  }

  /** One step along the route; false once the route has run out. */
  step(): boolean {
    if (this.finished || this.over) return false;
    if (this.mustStop()) {
      this.tick(0);
      return true;
    }
    const inGear = this.p.x > 49.5 && this.p.z < YARD_EXAM.gear.startZ && this.p.z > YARD_EXAM.gear.greenZ - 3;
    const cruise = inGear ? 8 : CRUISE;
    const speed = this.habits.speed?.(this.p, cruise) ?? cruise;
    let left = speed * DT;
    while (left > 0) {
      const a = this.path[this.segment];
      const b = this.path[this.segment + 1];
      if (!b) {
        if (!this.nextLeg()) return false;
        return true;
      }
      const len = Math.hypot(b.x - a.x, b.z - a.z);
      const room = len - this.along;
      const go = Math.min(room, left);
      this.along += go;
      left -= go;
      this.forward = { x: (b.x - a.x) / len, z: (b.z - a.z) / len };
      this.p = { x: a.x + this.forward.x * this.along, z: a.z + this.forward.z * this.along };
      if (this.along >= len - 1e-9) {
        this.segment += 1;
        this.along = 0;
      }
    }
    this.tick(speed);
    return true;
  }

  /** Parks in the bay at the end of a leg, then carries on from the next one. */
  private nextLeg(): boolean {
    const bay = BAYS[this.leg];
    this.leg += 1;
    if (!LEGS[this.leg]) {
      this.finished = true;
      return false;
    }
    if (bay && !this.skipBay) {
      this.place(bay.p, bay.forward);
      this.hold(1);
    }
    this.path = roundPath(LEGS[this.leg], false);
    this.segment = 0;
    this.along = 0;
    this.p = this.path[0];
    return true;
  }

  skipBay = false;

  run() {
    while (this.step());
    return this;
  }

  /** Drives until the exam reaches the given exercise (and crossing, for bài 5). */
  until(step: number, pass?: number) {
    while (!this.over) {
      const yard = this.exam.yard();
      if (yard.step === step && (pass === undefined || yard.title.includes(`lần ${pass}`))) break;
      if (!this.step()) break;
    }
    return this;
  }

  /** Drives until the car reaches a place. */
  reach(test: (p: Vec2) => boolean) {
    while (!this.over && !test(this.p) && this.step());
    return this;
  }

  get penalties() {
    return this.events.filter((e): e is Extract<ExamEvent, { type: 'penalty' }> => e.type === 'penalty');
  }

  get failure() {
    return this.events.find((e): e is Extract<ExamEvent, { type: 'fail' }> => e.type === 'fail')?.reason;
  }

  get passed() {
    return this.events.some((e) => e.type === 'pass');
  }
}

const reasons = (ghost: Ghost) => ghost.penalties.map((p) => `${p.points}:${p.reason}`);

describe('lightsAt', () => {
  it('gives each road green in turn, with yellow before red', () => {
    expect(lightsAt(0)).toEqual({ ns: 'green', ew: 'red' });
    expect(lightsAt(13)).toEqual({ ns: 'yellow', ew: 'red' });
    expect(lightsAt(16)).toEqual({ ns: 'red', ew: 'green' });
    expect(lightsAt(28)).toEqual({ ns: 'red', ew: 'yellow' });
    expect(lightsAt(30)).toEqual({ ns: 'green', ew: 'red' });
  });
});

describe('YardExam', () => {
  it('passes a clean run of all 11 exercises without a penalty', () => {
    const ghost = new Ghost().run();
    expect(reasons(ghost)).toEqual([]);
    expect(ghost.failure).toBeUndefined();
    expect(ghost.passed).toBe(true);
  });

  it('announces every exercise in order', () => {
    const ghost = new Ghost().run();
    const spoken = ghost.events.filter((e) => e.type === 'voice').map((e) => (e.type === 'voice' ? e.text : ''));
    expect(spoken.map((text) => text.match(/Bài (\d+)/)?.[1])).toEqual(
      ['1', '2', '3', '4', '5', '6', '5', '7', '5', '8', '9', '10', '5', '11'].map(String)
    );
  });

  it('takes about seven minutes at walking pace, well inside the 18 allowed', () => {
    const ghost = new Ghost().run();
    expect(ghost.exam.clock().seconds).toBeGreaterThan(300);
    expect(ghost.exam.clock().seconds).toBeLessThan(YARD_EXAM.totalTime);
  });

  describe('bài 1: xuất phát', () => {
    it('deducts 5 points for moving off without the left signal', () => {
      const ghost = new Ghost({ signal: (step, _t, fallback) => (step === 1 ? 'off' : fallback) }).until(2);
      expect(reasons(ghost)).toEqual(['5:Không bật xi nhan trái khi xuất phát']);
    });

    it('deducts 5 points for leaving the left signal on past the start line', () => {
      const ghost = new Ghost({ signal: (step, _t, fallback) => (step === 1 ? 'left' : fallback) }).until(2);
      expect(reasons(ghost)).toEqual(['5:Không tắt xi nhan trái sau vạch xuất phát 5 m']);
    });

    it('deducts 5 points after 20 seconds and fails after 30', () => {
      const slow = new Ghost();
      slow.hold(21);
      slow.until(2);
      expect(reasons(slow)).toEqual(['5:Quá 20 giây chưa qua vạch xuất phát']);
      const stuck = new Ghost();
      stuck.hold(31);
      expect(stuck.failure).toBe('Quá 30 giây không qua vạch xuất phát');
    });
  });

  describe('bài 2 and 8: stop lines', () => {
    const at = (gap: number) => ({ x: -51.8, z: YARD_EXAM.pedestrian.at - gap - CAR.length / 2 });

    it('deducts 5 points at each line driven through without stopping', () => {
      const ghost = new Ghost({ noStops: true }).run();
      expect(reasons(ghost)).toEqual(['5:Không dừng xe ở vạch dừng quy định', '5:Không dừng xe ở vạch dừng quy định']);
      expect(ghost.passed).toBe(true);
    });

    it('deducts 5 points for stopping more than 50 cm short', () => {
      const ghost = new Ghost().until(2);
      ghost.place(at(1.2), { x: 0, z: 1 });
      ghost.hold(1);
      expect(reasons(ghost)).toEqual(['5:Dừng xe chưa đến vạch dừng (cách 1.20 m)']);
      ghost.until(3);
      expect(ghost.penalties).toHaveLength(1);
    });

    it('deducts 5 points for stopping over the line', () => {
      const ghost = new Ghost().until(2);
      ghost.place(at(-0.2), { x: 0, z: 1 });
      ghost.hold(1);
      expect(reasons(ghost)).toEqual(['5:Dừng xe quá vạch dừng']);
    });

    it('ignores a stop made well before the line', () => {
      const ghost = new Ghost().until(2);
      ghost.place(at(6), { x: 0, z: 1 });
      ghost.hold(2);
      expect(ghost.penalties).toHaveLength(0);
    });
  });

  it('bài 3: fails when the car drives over the stop line on the slope without stopping', () => {
    const ghost = new Ghost().until(3);
    ghost.place({ x: -51.8, z: 13 }, { x: 0, z: 1 });
    ghost.tick(2);
    expect(ghost.failure).toBe('Không dừng xe ở vạch dừng quy định');
  });

  describe('bài 4: wheel track and right angles', () => {
    const south = { x: 0, z: -1 };

    it('fails when the right wheels miss the wheel track', () => {
      const ghost = new Ghost().until(4).reach((p) => p.x > -17 && p.z < 30);
      ghost.place({ x: -17.4, z: 24 }, south);
      ghost.tick(2);
      expect(ghost.failure).toBe('Bánh xe trước bên phải không đi qua vệt bánh xe');
    });

    it('deducts 5 points for a wheel on the edge line, and 5 more every 5 seconds', () => {
      const ghost = new Ghost().until(4).reach((p) => p.x > -17 && p.z < 45);
      ghost.place({ x: -15.66, z: 40 }, south);
      ghost.hold(1);
      expect(reasons(ghost)).toEqual(['5:Bánh xe đè vạch giới hạn hình']);
      ghost.hold(5);
      expect(reasons(ghost)).toEqual(['5:Bánh xe đè vạch giới hạn hình', '5:Bánh xe đè vạch quá 5 giây']);
    });

    it('deducts 5 points for every 2 minutes spent in the exercise', () => {
      const ghost = new Ghost().until(4).reach((p) => p.x > -17 && p.z < 45);
      ghost.hold(121);
      expect(reasons(ghost)).toEqual(['5:Quá 2 phút chưa qua hết bài']);
    });

    it('fails a driver who skips the exercise and reaches a later one', () => {
      const ghost = new Ghost().until(4);
      ghost.place({ x: 20, z: 59.4 }, { x: 1, z: 0 });
      ghost.tick(2);
      ghost.place({ x: 27, z: 59.4 }, { x: 1, z: 0 });
      ghost.tick(2);
      expect(ghost.failure).toBe('Đi không đúng trình tự bài thi (chưa xong bài 4)');
    });
  });

  describe('bài 5: crossroads', () => {
    it('deducts 10 points for running a red light', () => {
      const ghost = new Ghost({ runReds: true }).run();
      expect(reasons(ghost)).toContain('10:Vượt đèn đỏ');
    });

    it('deducts 5 points for stopping at a red light more than 50 cm short', () => {
      const ghost = new Ghost().until(5, 1).reach((p) => p.x > -15);
      const waitForRed = () => ghost.exam.lights().ew !== 'red';
      ghost.place({ x: YARD_EXAM.cross.west.at - 2 - CAR.length / 2, z: 4.9 }, { x: 1, z: 0 });
      while (waitForRed()) ghost.tick(0);
      // A stop made on green is not judged; the one standing at the red light is.
      ghost.hold(1);
      expect(reasons(ghost)).toEqual(['5:Dừng xe chưa đến vạch dừng (cách 2.00 m)']);
    });

    it('deducts 5 points for turning without the signal', () => {
      const off = (_s: number, title: string, fallback: TurnSignal): TurnSignal =>
        title.includes('lần 3') || title.includes('lần 4') ? 'off' : fallback;
      const ghost = new Ghost({ signal: off }).run();
      expect(reasons(ghost)).toEqual(['5:Không bật xi nhan trái khi rẽ', '5:Không bật xi nhan phải khi rẽ']);
    });

    it('fails after 30 seconds of green without crossing', () => {
      const ghost = new Ghost().until(5, 1).reach((p) => p.x > -10);
      ghost.hold(100);
      // Standing 3 m from the line through the red phase is also a stop made too short.
      expect(reasons(ghost)).toEqual([
        '5:Dừng xe chưa đến vạch dừng (cách 2.99 m)',
        '5:Quá 20 giây từ khi đèn xanh chưa qua ngã tư',
      ]);
      expect(ghost.failure).toBe('Quá 30 giây từ khi đèn xanh không qua ngã tư');
    });

    it('fails a driver who leaves the crossroads by the wrong road', () => {
      const ghost = new Ghost({ runReds: true }).until(5, 1).reach((p) => p.x > 2);
      ghost.place({ x: 2.1, z: 16 }, { x: 0, z: 1 });
      ghost.tick(2);
      expect(ghost.failure).toBe('Đi không đúng trình tự bài thi');
    });
  });

  it('bài 6: deducts 5 points for a wheel on the edge line of the curves', () => {
    const ghost = new Ghost().until(6).reach((p) => p.z > 30 && p.x < 40);
    // Channel between z = 28.3 and 32.6: the left wheels 0.2 m from the lower kerb.
    ghost.place({ x: 38, z: 28.3 + 0.2 + CAR.trackWidth / 2 }, { x: -1, z: 0 });
    ghost.hold(1);
    expect(reasons(ghost)).toEqual(['5:Bánh xe đè vạch giới hạn hình']);
  });

  it('bài 7 and 10: deducts 5 points for each bay left without parking', () => {
    const ghost = new Ghost();
    ghost.skipBay = true;
    ghost.run();
    expect(reasons(ghost)).toEqual(['5:Chưa ghép được xe vào nơi đỗ', '5:Chưa ghép được xe vào nơi đỗ']);
    expect(ghost.passed).toBe(true);
  });

  describe('bài 9: changing gear', () => {
    it('deducts 5 points each for the speed and the gear missed at the green sign', () => {
      const ghost = new Ghost({ speed: (_p, v) => Math.min(v, CRUISE), gear: () => '1' }).until(10);
      expect(reasons(ghost)).toEqual([
        '5:Không đạt tốc độ trên 24 km/h tới biển 24 xanh',
        '5:Không tăng từ số 1 lên số 2 tới biển 24 xanh',
      ]);
    });

    it('deducts 5 points each for the speed and the gear missed at the red sign', () => {
      const fast = (p: Vec2, v: number) => (p.x > 49.5 && p.z < YARD_EXAM.gear.startZ && p.z > -14 ? 8 : v);
      const second = (p: Vec2, g: Gear): Gear => (p.x > 49.5 && p.z < YARD_EXAM.gear.startZ && p.z > -14 ? '2' : g);
      const ghost = new Ghost({ speed: fast, gear: second }).until(10);
      expect(reasons(ghost)).toEqual([
        '5:Không giảm tốc độ dưới 24 km/h tới biển 24 đỏ',
        '5:Không giảm từ số 2 về số 1 tới biển 24 đỏ',
      ]);
    });

    it('does not ask an automatic for gears', () => {
      const ghost = new Ghost({ gear: () => 'D' });
      const update = ghost.exam.update.bind(ghost.exam);
      ghost.exam.update = (car, dt, driver) => update(car, dt, { ...driver, transmission: 'B1' });
      ghost.run();
      expect(reasons(ghost)).toEqual([]);
      expect(ghost.passed).toBe(true);
    });
  });

  it('bài 11: deducts 5 points for crossing the finish line without the right signal', () => {
    const ghost = new Ghost({ signal: (step, _t, fallback) => (step === 11 ? 'off' : fallback) }).run();
    expect(reasons(ghost)).toEqual(['5:Không bật xi nhan phải khi qua vạch kết thúc']);
    expect(ghost.passed).toBe(true);
  });

  describe('rules for the whole run', () => {
    it('deducts 1 point for every 3 seconds above 24 km/h', () => {
      const ghost = new Ghost({ speed: (p, v) => (p.x < -50 && p.z > 46 && p.z < 50 ? 8 : v) }).until(5);
      // 4 m at 8 m/s is under a second: no penalty yet.
      expect(ghost.penalties).toHaveLength(0);
      const fast = new Ghost({ speed: (p, v) => (p.z > 54 && p.x < -20 ? 8 : v) }).until(5);
      expect(fast.penalties.length).toBeGreaterThan(0);
      expect(new Set(reasons(fast))).toEqual(new Set(['1:Chạy quá 24 km/h']));
    });

    it('deducts 5 points for a stall and for revving past 4000 rpm, once per burst', () => {
      const ghost = new Ghost().until(2);
      ghost.tick(CRUISE, { stalled: true });
      for (let i = 0; i < 90; i++) ghost.tick(CRUISE, { rpm: 4500 });
      for (let i = 0; i < 10; i++) ghost.tick(CRUISE, { rpm: 3000 });
      for (let i = 0; i < 90; i++) ghost.tick(CRUISE, { rpm: 4500 });
      expect(reasons(ghost)).toEqual([
        '5:Xe chết máy',
        '5:Tốc độ động cơ vượt 4.000 vòng/phút',
        '5:Tốc độ động cơ vượt 4.000 vòng/phút',
      ]);
    });

    it('fails when a wheel stays on the kerb', () => {
      const ghost = new Ghost().until(2);
      ghost.place({ x: -53.4, z: -15 }, { x: 0, z: 1 });
      ghost.hold(0.5);
      expect(ghost.failure).toBe('Bánh xe đè lên vỉa hè');
    });

    it('deducts 1 point for every 3 seconds past 18 minutes', () => {
      const ghost = new Ghost().until(2);
      ghost.hold(YARD_EXAM.totalTime + 7 - ghost.exam.clock().seconds);
      expect(reasons(ghost)).toEqual(['1:Quá tổng thời gian 18 phút', '1:Quá tổng thời gian 18 phút']);
    });
  });
});
