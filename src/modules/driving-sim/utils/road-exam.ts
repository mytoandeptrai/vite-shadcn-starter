import { CAR, NPC, ROAD } from '../constants';
import type { CarSnapshot, DriverState, ExamEvent, Gear, NpcCar, RoadProgress, Vec2 } from '../types';
import type { Exam } from './exam';
import { Traffic } from './road-traffic';

const STILL_SPEED = 0.05;
const STILL_TIME = 0.5;
/** Above this the car is driving again, not settling on its suspension (m/s). */
const ROLLING_SPEED = 0.3;
const MOVED = 0.3;
/** A speeding excursion ends once the car is back under this speed. */
const SPEEDING_CLEAR_KMH = 38;
const SPEEDING_REPEAT = 5;
/** How far ahead the HUD reports the car in front, metres. */
const SIGHT = 150;
const STEP = { depart: 0, speedUp: 1, slowDown: 2, obstacle: 3, finish: 4 } as const;

const gearNumber = (gear: Gear) => (gear >= '1' && gear <= '5' ? Number(gear) : 0);

/** True when the car's footprint and an axis-aligned NPC car overlap. */
export function hitsNpc(car: CarSnapshot, npc: NpcCar): boolean {
  const hw = NPC.width / 2;
  const hl = NPC.length / 2;
  const inNpc = (p: Vec2) => Math.abs(p.x - npc.x) <= hw && Math.abs(p.z - npc.z) <= hl;
  if (car.corners.some(inNpc)) return true;
  const { forward, position } = car;
  const inCar = (p: Vec2) => {
    const dx = p.x - position.x;
    const dz = p.z - position.z;
    const ahead = dx * forward.x + dz * forward.z;
    const side = dx * forward.z - dz * forward.x;
    return Math.abs(ahead) <= CAR.length / 2 && Math.abs(side) <= CAR.width / 2;
  };
  return [
    { x: npc.x - hw, z: npc.z - hl },
    { x: npc.x + hw, z: npc.z - hl },
    { x: npc.x - hw, z: npc.z + hl },
    { x: npc.x + hw, z: npc.z + hl },
  ].some(inCar);
}

/** Bài thi đường trường: xuất phát, tăng số tăng tốc, giảm số giảm tốc, chướng ngại vật, kết thúc. */
export class RoadExam implements Exam {
  readonly traffic = new Traffic();
  private elapsed = 0;
  private done = false;
  private announced = false;
  /** Furthest point reached, metres from the start line. */
  private distance = 0;
  private offset = 0;
  private leftSignalSeen = false;
  private gap: number | null = null;
  private manual = true;
  private step: number = STEP.depart;

  private moving = false;
  private departChecked = false;
  private speedUpCalled = false;
  private speedUpChecked = false;
  private windowMaxKmh = 0;
  private windowMaxGear = 0;
  private slowDownCalled = false;
  private slowDownChecked = false;
  private obstacleCalled = false;
  private obstacleCleared = false;
  private finishCalled = false;
  private rightSignalSeen = false;
  private still = 0;
  private stopped = false;
  private sinceStop = 0;
  private speeding = false;
  private speedingFor = 0;

  update(car: CarSnapshot, dt: number, driver: DriverState): ExamEvent[] {
    const events: ExamEvent[] = [];
    if (this.done) return events;
    this.elapsed += dt;
    if (!this.announced) {
      this.announced = true;
      events.push({ type: 'voice', text: 'Bắt đầu thi' });
    }
    if (car.stalledNow) events.push({ type: 'penalty', points: 5, reason: 'Xe chết máy' });

    this.traffic.step(dt, car);
    const z = car.position.z;
    const speedKmh = Math.abs(car.speed) * 3.6;
    const gear = gearNumber(driver.gear);
    const manual = driver.transmission === 'B2';
    this.manual = manual;
    this.distance = Math.max(this.distance, z);
    this.offset = car.position.x - ROAD.laneX;
    this.gap = this.gapAhead(car);

    if (this.traffic.cars.some((npc) => hitsNpc(car, npc))) {
      return this.finish(events, { type: 'fail', reason: 'Va chạm với xe khác' });
    }
    if (car.corners.some((c) => Math.abs(c.x) > ROAD.halfWidth)) {
      return this.finish(events, { type: 'fail', reason: 'Xe va vào lề đường' });
    }

    // Common rule: the 40 km/h limit, charged once per excursion and again while it lasts.
    if (speedKmh > ROAD.speedLimitKmh) {
      this.speedingFor = this.speeding ? this.speedingFor + dt : SPEEDING_REPEAT;
      this.speeding = true;
      if (this.speedingFor >= SPEEDING_REPEAT) {
        this.speedingFor = 0;
        events.push(
          { type: 'penalty', points: 5, reason: `Vượt quá tốc độ ${ROAD.speedLimitKmh} km/h` },
          { type: 'beep' }
        );
      }
    } else if (speedKmh < SPEEDING_CLEAR_KMH) {
      this.speeding = false;
    }

    // 1. Xuất phát: left signal on when pulling away, off again within 5 m.
    // The signal counts if it was blinking as the car rolled off, even when it is cancelled at once.
    if (!this.moving) {
      if (driver.signal === 'left') this.leftSignalSeen = true;
      else if (Math.abs(car.speed) < STILL_SPEED) this.leftSignalSeen = false;
    }
    if (!this.moving && z > MOVED) {
      this.moving = true;
      if (!this.leftSignalSeen) {
        this.departChecked = true;
        events.push({ type: 'penalty', points: 5, reason: 'Không bật xi-nhan trái khi xuất phát' });
      }
    }
    if (this.moving && !this.departChecked && driver.signal !== 'left') {
      this.departChecked = true;
      events.push({ type: 'info', message: 'Xuất phát đúng quy trình' });
    }
    if (this.moving && !this.departChecked && z > ROAD.departClear) {
      this.departChecked = true;
      events.push({ type: 'penalty', points: 5, reason: 'Không tắt xi-nhan trái trong 5 m sau khi xuất phát' });
    }

    // 2. Tăng số tăng tốc: within 100 m reach 24 km/h (and third gear with a manual gearbox).
    if (!this.speedUpCalled && z >= ROAD.speedUp.from) {
      this.speedUpCalled = true;
      this.step = STEP.speedUp;
      events.push({ type: 'voice', text: 'Tăng số, tăng tốc' });
    }
    if (this.speedUpCalled && !this.speedUpChecked) {
      this.windowMaxKmh = Math.max(this.windowMaxKmh, speedKmh);
      this.windowMaxGear = Math.max(this.windowMaxGear, gear);
      const speedOk = this.windowMaxKmh > ROAD.speedUp.minKmh;
      const gearOk = !manual || this.windowMaxGear >= ROAD.speedUp.gear;
      if (speedOk && gearOk) {
        this.speedUpChecked = true;
        events.push({ type: 'info', message: 'Đạt bài tăng số tăng tốc' });
      } else if (z >= ROAD.speedUp.to) {
        this.speedUpChecked = true;
        const reason = speedOk
          ? `Không tăng lên số ${ROAD.speedUp.gear} trong 100 m`
          : `Không đạt trên ${ROAD.speedUp.minKmh} km/h trong 100 m`;
        events.push({ type: 'penalty', points: 5, reason });
      }
    }

    // 3. Giảm số giảm tốc: below 20 km/h (and in gear 2 or 1) at the checkpoint sign.
    if (!this.slowDownCalled && z >= ROAD.slowDown.from) {
      this.slowDownCalled = true;
      this.step = STEP.slowDown;
      events.push({ type: 'voice', text: 'Giảm số, giảm tốc' });
    }
    if (this.slowDownCalled && !this.slowDownChecked && z >= ROAD.slowDown.to) {
      this.slowDownChecked = true;
      if (speedKmh >= ROAD.slowDown.maxKmh) {
        events.push({
          type: 'penalty',
          points: 5,
          reason: `Không giảm tốc độ xuống dưới ${ROAD.slowDown.maxKmh} km/h`,
        });
      } else if (manual && gear !== 1 && gear !== 2) {
        events.push({ type: 'penalty', points: 5, reason: 'Không giảm về số 2 hoặc số 1' });
      } else {
        events.push({ type: 'info', message: 'Đạt bài giảm số giảm tốc' });
      }
    }

    // 4. Chướng ngại vật: the car in front does an emergency stop.
    if (!this.obstacleCalled && z >= ROAD.obstacleAt) {
      this.obstacleCalled = true;
      if (this.traffic.lead.z > z) {
        this.step = STEP.obstacle;
        this.traffic.brakeLead();
        events.push({ type: 'voice', text: 'Chú ý! Xe phía trước phanh gấp' }, { type: 'beep' });
      } else {
        this.obstacleCleared = true;
      }
    }
    if (this.obstacleCalled && !this.obstacleCleared && !this.traffic.leadStopping) {
      this.obstacleCleared = true;
      events.push({ type: 'info', message: 'Xe phía trước đã đi tiếp, giữ khoảng cách an toàn' });
    }

    // 5. Kết thúc: right signal, pull over, stop, neutral, handbrake.
    if (!this.finishCalled && z >= ROAD.finishFrom) {
      this.finishCalled = true;
      this.step = STEP.finish;
      events.push({ type: 'voice', text: 'Kết thúc. Bật xi-nhan phải, tấp vào lề và dừng xe' });
    }
    if (this.finishCalled) {
      if (z + (CAR.length / 2) * car.forward.z > ROAD.length) {
        return this.finish(events, { type: 'fail', reason: 'Không dừng xe trước biển dừng cuối bài' });
      }
      // A car that rolls off again has not stopped yet: the stop and its checks start over.
      if (this.stopped && Math.abs(car.speed) > ROLLING_SPEED) {
        this.stopped = false;
        this.still = 0;
        this.sinceStop = 0;
      }
      if (!this.stopped) {
        if (driver.signal === 'right') this.rightSignalSeen = true;
        this.still = Math.abs(car.speed) < STILL_SPEED ? this.still + dt : 0;
        if (this.still >= STILL_TIME) this.stopped = true;
      } else {
        this.sinceStop += dt;
        const neutral = driver.gear === 'N' || driver.gear === 'P';
        if ((neutral && driver.handbrake) || this.sinceStop >= ROAD.settleTime) {
          if (!this.rightSignalSeen) {
            events.push({ type: 'penalty', points: 5, reason: 'Không bật xi-nhan phải khi dừng xe' });
          }
          if (car.position.x > ROAD.pullOverX) {
            events.push({ type: 'penalty', points: 5, reason: 'Không tấp xe vào lề phải' });
          }
          if (!neutral) events.push({ type: 'penalty', points: 5, reason: 'Không về số N khi dừng xe' });
          if (!driver.handbrake) events.push({ type: 'penalty', points: 5, reason: 'Không kéo phanh tay khi dừng xe' });
          return this.finish(events, { type: 'pass', reason: 'Hoàn thành bài thi đường trường' });
        }
      }
    }
    return events;
  }

  clock() {
    return { seconds: this.elapsed, countdown: false };
  }

  hint(): string {
    const left = (to: number) => `còn ${Math.max(0, to - this.distance).toFixed(0)} m`;
    if (!this.moving) return 'Xuất phát: bật xi-nhan trái rồi cho xe lăn bánh';
    if (!this.departChecked) return 'Tắt xi-nhan trái trong 5 m đầu';
    if (!this.speedUpCalled) return `Chuẩn bị tăng số · ${left(ROAD.speedUp.from)}`;
    if (!this.speedUpChecked) {
      const gear = this.manual ? `lên số ${ROAD.speedUp.gear} và ` : '';
      return `Đang trong bài: ${gear}đạt trên ${ROAD.speedUp.minKmh} km/h · ${left(ROAD.speedUp.to)}`;
    }
    if (!this.slowDownCalled) {
      return `Giữ tốc độ dưới ${ROAD.speedLimitKmh} km/h · chuẩn bị giảm số · ${left(ROAD.slowDown.from)}`;
    }
    if (!this.slowDownChecked) {
      const gear = this.manual ? 'về số 2 và ' : '';
      return `Đang trong bài: ${gear}xuống dưới ${ROAD.slowDown.maxKmh} km/h trước biển · ${left(ROAD.slowDown.to)}`;
    }
    if (this.obstacleCalled && !this.obstacleCleared) return 'Xe phía trước phanh gấp: phanh lại, giữ khoảng cách';
    if (!this.finishCalled) {
      return `Giữ tốc độ dưới ${ROAD.speedLimitKmh} km/h, giữ khoảng cách · ${left(ROAD.finishFrom)} tới bài kết thúc`;
    }
    if (!this.stopped) return `Bật xi-nhan phải, tấp vào lề phải và dừng xe · ${left(ROAD.length)}`;
    return this.manual ? 'Về số N và kéo phanh tay' : 'Về số P hoặc N và kéo phanh tay';
  }

  progress(): RoadProgress {
    return {
      distance: Math.min(ROAD.length, Math.max(0, this.distance)),
      total: ROAD.length,
      step: this.step,
      offset: this.offset,
      gap: this.gap,
    };
  }

  /** Distance to the nearest car ahead in the car's own lane, within sight. */
  private gapAhead(car: CarSnapshot): number | null {
    let nearest: number | null = null;
    for (const npc of this.traffic.cars) {
      if (Math.abs(npc.x - car.position.x) > (CAR.width + NPC.width) / 2) continue;
      const gap = npc.z - NPC.length / 2 - (car.position.z + CAR.length / 2);
      if (gap >= 0 && gap <= SIGHT && (nearest === null || gap < nearest)) nearest = gap;
    }
    return nearest;
  }

  private finish(events: ExamEvent[], event: ExamEvent): ExamEvent[] {
    this.done = true;
    events.push(event);
    return events;
  }
}
