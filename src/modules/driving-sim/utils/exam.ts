import { CAR, HILL, PARKING, PARKING_BAY, TRACK_LINES } from '../constants';
import type { CarSnapshot, DriverState, ExamEvent, RoadProgress, Scenario } from '../types';
import { distanceToSegment } from './math';
import { RoadExam } from './road-exam';
import type { Traffic } from './road-traffic';

const STILL_SPEED = 0.05;
const STILL_TIME = 0.5;
const SENSOR_LINES = TRACK_LINES.filter((line) => line.kind === 'sensor');

export interface Exam {
  update(car: CarSnapshot, dt: number, driver: DriverState): ExamEvent[];
  /** Seconds shown on the HUD clock; negative values never occur. */
  clock(): { seconds: number; countdown: boolean };
  hint(): string;
  /** Road test only: distance and step for the HUD progress bar. */
  progress?(): RoadProgress;
  /** Road test only: the other cars on the road. */
  traffic?: Traffic;
}

/** Bài: Dừng và khởi hành xe ngang dốc. */
export class HillExam implements Exam {
  private stopped = false;
  private passedLine = false;
  private done = false;
  private still = 0;
  private sinceStop = 0;
  private elapsed = 0;
  private peakZ = Number.NEGATIVE_INFINITY;
  /** Distance from the front bumper to the stop line, m. */
  private gap = Number.POSITIVE_INFINITY;

  update(car: CarSnapshot, dt: number): ExamEvent[] {
    const events: ExamEvent[] = [];
    if (this.done) return events;
    this.elapsed += dt;
    if (car.stalledNow) events.push({ type: 'penalty', points: 5, reason: 'Xe chết máy' });

    const centerZ = car.position.z;
    const bumperZ = centerZ + car.forward.z * (CAR.length / 2);
    const lineNear = HILL.stopLineZ;
    const lineFar = lineNear + HILL.stopLineWidth;
    const rampTop = HILL.rampStartZ + HILL.rampLength;
    this.gap = lineNear - bumperZ;

    // The exam is driven on the slope: leaving its lane cannot be used to skip the hill.
    const offLane = Math.abs(car.position.x - HILL.centerX) > HILL.width / 2;
    if (offLane && bumperZ > HILL.rampStartZ && centerZ < HILL.finishZ) {
      return this.finish(events, { type: 'fail', reason: 'Xe đi ra ngoài làn dốc' });
    }

    if (!this.stopped) {
      if (bumperZ > lineFar) {
        return this.finish(events, { type: 'fail', reason: 'Không dừng xe ở vạch dừng quy định' });
      }
      const onRamp = bumperZ > HILL.rampStartZ;
      this.still = onRamp && Math.abs(car.speed) < STILL_SPEED ? this.still + dt : 0;
      if (this.still >= STILL_TIME) {
        this.stopped = true;
        this.peakZ = centerZ;
        const gap = this.gap;
        if (gap > HILL.stopTolerance) {
          events.push({
            type: 'penalty',
            points: 5,
            reason: `Dừng xe chưa đến vạch dừng (cách ${gap.toFixed(2)} m)`,
          });
        } else {
          events.push({ type: 'info', message: 'Dừng đúng vạch — khởi hành trong 30 giây' });
        }
        events.push({ type: 'beep' });
      }
      return events;
    }

    this.peakZ = Math.max(this.peakZ, centerZ);
    if (centerZ < rampTop && this.peakZ - centerZ > HILL.rollbackLimit) {
      return this.finish(events, { type: 'fail', reason: 'Xe tụt dốc quá 50 cm' });
    }

    if (!this.passedLine) {
      this.sinceStop += dt;
      if (centerZ - CAR.wheelBase / 2 > lineFar) {
        this.passedLine = true;
        events.push({ type: 'info', message: 'Đã khởi hành qua vạch dừng' });
      } else if (this.sinceStop > HILL.timeLimit) {
        return this.finish(events, { type: 'fail', reason: 'Quá 30 giây không khởi hành qua vạch dừng' });
      }
      return events;
    }

    if (centerZ > HILL.finishZ) {
      return this.finish(events, { type: 'pass', reason: 'Hoàn thành bài dừng và khởi hành ngang dốc' });
    }
    return events;
  }

  clock() {
    if (this.stopped && !this.passedLine) {
      return { seconds: Math.max(0, HILL.timeLimit - this.sinceStop), countdown: true };
    }
    return { seconds: this.elapsed, countdown: false };
  }

  hint(): string {
    if (!this.stopped) {
      const distance = Number.isFinite(this.gap) ? ` · còn ${Math.max(0, this.gap).toFixed(1)} m` : '';
      return `Dừng xe trước vạch dừng, cản trước cách vạch ≤ 50 cm${distance}`;
    }
    if (!this.passedLine) return 'Khởi hành qua vạch trong 30 giây, không để xe tụt quá 50 cm';
    return 'Tiếp tục qua đỉnh dốc tới vạch kết thúc';
  }

  private finish(events: ExamEvent[], event: ExamEvent): ExamEvent[] {
    this.done = true;
    events.push(event);
    return events;
  }
}

/** Bài: Ghép xe dọc vào nơi đỗ. */
export class ParkingExam implements Exam {
  private started = false;
  private done = false;
  private parked = false;
  private onLine = false;
  private lineHold = 0;
  private offLine = 0;
  private still = 0;
  private elapsed = 0;
  private timePenalties = 0;
  /** The car's centre was past the entry line on the last step. */
  private inside = false;
  /** The car's centre last came out over the entry line itself, not round it over the grass. */
  private leftByGate = false;

  update(car: CarSnapshot, dt: number): ExamEvent[] {
    const events: ExamEvent[] = [];
    if (this.done) return events;
    if (car.stalledNow) events.push({ type: 'penalty', points: 5, reason: 'Xe chết máy' });

    if (!this.started) {
      const bumperX = car.position.x + car.forward.x * (CAR.length / 2);
      const inLane = car.position.z > PARKING.laneBayZ && car.position.z < PARKING.laneFarZ;
      if (!inLane || bumperX < PARKING.entryX || car.position.x > PARKING.entryX) return events;
      this.started = true;
      events.push({ type: 'info', message: 'Bắt đầu bài ghép xe dọc — thời gian 2 phút' });
    }

    this.elapsed += dt;
    if (Math.floor(this.elapsed / PARKING.timeLimit) > this.timePenalties) {
      this.timePenalties += 1;
      events.push({ type: 'penalty', points: 5, reason: 'Quá 2 phút chưa hoàn thành bài' });
    }

    const reach = CAR.tireHalfWidth;
    const touching = car.wheels.some((wheel) =>
      SENSOR_LINES.some((line) => distanceToSegment(wheel, line.a, line.b) <= line.width / 2 + reach)
    );
    if (touching) {
      this.offLine = 0;
      if (!this.onLine) {
        this.onLine = true;
        this.lineHold = 0;
        events.push({ type: 'penalty', points: 5, reason: 'Bánh xe đè vạch chip' }, { type: 'beep' });
      } else {
        this.lineHold += dt;
        if (this.lineHold >= PARKING.lineHoldInterval) {
          this.lineHold = 0;
          events.push({ type: 'penalty', points: 5, reason: 'Bánh xe đè vạch quá 5 giây' }, { type: 'beep' });
        }
      }
    } else {
      this.offLine += dt;
      if (this.offLine > 0.25) this.onLine = false;
    }

    if (!this.parked) {
      const inBay = car.corners.every(
        (c) => c.x > PARKING_BAY.minX && c.x < PARKING_BAY.maxX && c.z > PARKING_BAY.minZ && c.z < PARKING_BAY.maxZ
      );
      this.still = inBay && Math.abs(car.speed) < STILL_SPEED ? this.still + dt : 0;
      if (this.still >= STILL_TIME) {
        this.parked = true;
        events.push({ type: 'info', message: 'Đã ghép xe vào nơi đỗ — tiến ra, quay lại vạch xanh' }, { type: 'beep' });
      }
    }

    // The lane is a dead end: the exercise ends once the whole car is back out through the entry line.
    const inside = car.position.x >= PARKING.entryX;
    if (inside) this.leftByGate = false;
    else if (this.inside) this.leftByGate = car.position.z > PARKING.laneBayZ && car.position.z < PARKING.laneFarZ;
    this.inside = inside;
    if (this.leftByGate && car.corners.every((c) => c.x < PARKING.entryX)) {
      this.done = true;
      if (!this.parked) events.push({ type: 'penalty', points: 5, reason: 'Chưa ghép được xe vào nơi đỗ' });
      events.push({ type: 'pass', reason: 'Hoàn thành bài ghép xe dọc vào nơi đỗ' });
    }
    return events;
  }

  clock() {
    return { seconds: this.elapsed, countdown: false };
  }

  hint(): string {
    if (!this.started) return 'Tiến vào hình qua vạch bắt đầu';
    if (!this.parked) return 'Tiến qua chuồng, vào số lùi và ghép xe vào nơi đỗ, không đè vạch';
    return 'Tiến ra khỏi chuồng, quay lại qua vạch xanh để kết thúc';
  }
}

/** Free roam: nothing is scored. */
class FreeRoam implements Exam {
  private elapsed = 0;

  update(_car: CarSnapshot, dt: number): ExamEvent[] {
    this.elapsed += dt;
    return [];
  }

  clock() {
    return { seconds: this.elapsed, countdown: false };
  }

  hint(): string {
    return 'Tập lái tự do — không chấm điểm';
  }
}

export function createExam(scenario: Scenario): Exam {
  if (scenario === 'hill') return new HillExam();
  if (scenario === 'parking') return new ParkingExam();
  if (scenario === 'road') return new RoadExam();
  return new FreeRoam();
}
