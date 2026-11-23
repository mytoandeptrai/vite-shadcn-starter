import { CAR, HILL, PARKING, YARD_EXAM } from '../constants';
import type {
  CarSnapshot,
  DriverState,
  ExamEvent,
  Gear,
  LightColor,
  Lights,
  TurnSignal,
  Vec2,
  YardProgress,
} from '../types';
import { type Exam, HillExam, ParkingExam } from './exam';
import { distanceToSegment } from './math';
import { type KerbBlock, kerbBlocks, onPavement } from './yard';

/**
 * Thi liên hoàn: the 11 exercises of the yard driven in one run, in the order the road arrows lead.
 * Each stage waits for the car on its own entry line, so the driving in between is only timed.
 */

const STILL_SPEED = 0.05;
const STILL_TIME = 0.5;
const ROLLING_SPEED = 0.3;
/** A wheel this close to a kerb is on the painted line that runs along it. */
const LINE_REACH = 0.3;
const HALF_LENGTH = CAR.length / 2;

const gearNumber = (gear: Gear) => (gear >= '1' && gear <= '5' ? Number(gear) : 0);

/** Lights of the crossroads `t` seconds into the cycle: the centre road (ns) goes first. */
export function lightsAt(t: number): Lights {
  const { green, yellow } = YARD_EXAM.lights;
  const at = ((t % (2 * (green + yellow))) + 2 * (green + yellow)) % (2 * (green + yellow));
  const phase = (from: number): LightColor => {
    const local = at - from;
    if (local < 0 || local >= green + yellow) return 'red';
    return local < green ? 'green' : 'yellow';
  };
  return { ns: phase(0), ew: phase(green + yellow) };
}

/** A line across a lane, crossed in one direction. */
export interface Gate {
  axis: 'x' | 'z';
  /** Direction of travel along the axis. */
  dir: 1 | -1;
  at: number;
  /** Extent of the lane on the other axis. */
  min: number;
  max: number;
}

/** Distance travelled past the gate (negative before it). */
function past(gate: Gate, p: Vec2): number {
  return gate.dir * ((gate.axis === 'x' ? p.x : p.z) - gate.at);
}

function inLane(gate: Gate, p: Vec2): boolean {
  const side = gate.axis === 'x' ? p.z : p.x;
  return side >= gate.min && side <= gate.max;
}

function crossed(gate: Gate, from: Vec2, to: Vec2): boolean {
  return past(gate, from) < 0 && past(gate, to) >= 0 && inLane(gate, to);
}

interface Frame {
  car: CarSnapshot;
  dt: number;
  driver: DriverState;
  bumper: Vec2;
  /** Front bumper on the previous step. */
  lastBumper: Vec2;
  rear: Vec2;
  lights: Lights;
  events: ExamEvent[];
}

interface Stage {
  /** Exercise number, 1 to 11. */
  step: number;
  title: string;
  /** Crossing this line early means the exercises are being driven out of order. */
  entry?: Gate;
  /** Where the exercise begins, for the minimap. */
  target: Vec2;
  /** The 24 km/h limit does not apply (bài 9). */
  fast?: boolean;
  /** Returns true once the exercise is over. */
  update(frame: Frame): boolean;
  hint(): string;
}

const penalty = (frame: Frame, points: number, reason: string) =>
  frame.events.push({ type: 'penalty', points, reason });

/** Counts the wheels-on-line penalty: 5 points on touching, 5 more for every 5 s it stays there. */
class LineSensor {
  private readonly blocks: KerbBlock[];
  private onLine = false;
  private hold = 0;
  private clear = 0;

  constructor(minX: number, maxX: number, minZ: number, maxZ: number) {
    this.blocks = kerbBlocks().filter((b) => {
      const x = (b.a.x + b.b.x) / 2;
      const z = (b.a.z + b.b.z) / 2;
      return x >= minX && x <= maxX && z >= minZ && z <= maxZ;
    });
  }

  update(frame: Frame) {
    const touching = frame.car.wheels.some((w) =>
      this.blocks.some(
        (b) => Math.abs(b.a.x - w.x) < 2 && Math.abs(b.a.z - w.z) < 2 && distanceToSegment(w, b.a, b.b) <= LINE_REACH
      )
    );
    if (!touching) {
      this.clear += frame.dt;
      if (this.clear > 0.25) this.onLine = false;
      return;
    }
    this.clear = 0;
    if (!this.onLine) {
      this.onLine = true;
      this.hold = 0;
      penalty(frame, 5, 'Bánh xe đè vạch giới hạn hình');
      frame.events.push({ type: 'beep' });
      return;
    }
    this.hold += frame.dt;
    if (this.hold >= YARD_EXAM.lineHold) {
      this.hold = 0;
      penalty(frame, 5, 'Bánh xe đè vạch quá 5 giây');
      frame.events.push({ type: 'beep' });
    }
  }
}

/** Counts the 5 points lost for every full time limit spent in an exercise. */
class Timer {
  elapsed = 0;
  private charged = 0;

  update(frame: Frame, limit: number = YARD_EXAM.exerciseTime) {
    this.elapsed += frame.dt;
    if (Math.floor(this.elapsed / limit) > this.charged) {
      this.charged += 1;
      penalty(frame, 5, 'Quá 2 phút chưa qua hết bài');
    }
  }
}

/** Judges the first full stop made in front of a stop line. */
class StopJudge {
  judged = false;
  private still = 0;

  constructor(private readonly line: Gate) {}

  /** Bumper to line, metres; negative once over it. */
  gap(frame: Frame): number {
    return -past(this.line, frame.bumper);
  }

  update(frame: Frame): boolean {
    if (this.judged) return true;
    const gap = this.gap(frame);
    const inZone = gap < YARD_EXAM.stopZone && inLane(this.line, frame.bumper);
    this.still = inZone && Math.abs(frame.car.speed) < STILL_SPEED ? this.still + frame.dt : 0;
    if (this.still < STILL_TIME) return false;
    this.judged = true;
    if (gap < 0) penalty(frame, 5, 'Dừng xe quá vạch dừng');
    else if (gap > YARD_EXAM.stopTolerance) penalty(frame, 5, `Dừng xe chưa đến vạch dừng (cách ${gap.toFixed(2)} m)`);
    else frame.events.push({ type: 'info', message: 'Dừng đúng vạch' }, { type: 'beep' });
    return true;
  }
}

/** Bài 1. */
class StartStage implements Stage {
  step = 1;
  title = 'Xuất phát';
  target = { x: YARD_EXAM.start.min + 1.9, z: YARD_EXAM.start.at };
  private time = 0;
  private moved = false;
  private crossedLine = false;

  update(frame: Frame): boolean {
    const line = YARD_EXAM.start;
    if (!this.moved && Math.abs(frame.car.speed) > ROLLING_SPEED) {
      this.moved = true;
      if (frame.driver.signal !== 'left') penalty(frame, 5, 'Không bật xi nhan trái khi xuất phát');
    }
    if (!this.crossedLine) {
      this.time += frame.dt;
      if (past(line, frame.bumper) >= 0) {
        this.crossedLine = true;
        if (this.time > 20) penalty(frame, 5, 'Quá 20 giây chưa qua vạch xuất phát');
      } else if (this.time > 30) {
        frame.events.push({ type: 'fail', reason: 'Quá 30 giây không qua vạch xuất phát' });
      }
      return false;
    }
    if (past(line, frame.bumper) < YARD_EXAM.signalClear) return false;
    if (frame.driver.signal === 'left') penalty(frame, 5, 'Không tắt xi nhan trái sau vạch xuất phát 5 m');
    return true;
  }

  hint(): string {
    if (!this.moved) return 'Bật xi nhan trái rồi cho xe chạy, qua vạch xuất phát trong 20 giây';
    return this.crossedLine ? 'Tắt xi nhan trái trong 5 m sau vạch xuất phát' : 'Qua vạch xuất phát trong 20 giây';
  }
}

/** Bài 2 and 8: stop in front of a line, then drive on. */
class StopStage implements Stage {
  entry: Gate;
  target: Vec2;
  private readonly judge: StopJudge;

  constructor(
    public step: number,
    public title: string,
    private readonly line: Gate,
    private readonly approach: string
  ) {
    this.entry = line;
    this.judge = new StopJudge(line);
    const mid = (line.min + line.max) / 2;
    this.target = line.axis === 'x' ? { x: line.at, z: mid } : { x: mid, z: line.at };
  }

  update(frame: Frame): boolean {
    this.judge.update(frame);
    // The line is 0.4 m wide: over its far edge the car has driven through.
    if (this.judge.gap(frame) > -0.6 || !inLane(this.line, frame.bumper)) return false;
    if (!this.judge.judged) penalty(frame, 5, 'Không dừng xe ở vạch dừng quy định');
    return true;
  }

  hint(): string {
    return this.judge.judged ? 'Đi tiếp qua vạch dừng' : this.approach;
  }
}

/** Bài 3 and 7 reuse the single-exercise exams; their own stall penalty is left to the common rules. */
class WrappedStage implements Stage {
  constructor(
    public step: number,
    public title: string,
    public target: Vec2,
    private readonly exam: Exam,
    public entry?: Gate
  ) {}

  update(frame: Frame): boolean {
    let done = false;
    for (const event of this.exam.update({ ...frame.car, stalledNow: false }, frame.dt, frame.driver)) {
      if (event.type === 'pass') done = true;
      else frame.events.push(event);
    }
    return done;
  }

  hint(): string {
    return this.exam.hint();
  }
}

interface LaneOptions {
  step: number;
  title: string;
  entry: Gate;
  exit: Gate;
  /** Box holding the kerbs of the exercise: minX, maxX, minZ, maxZ. */
  box: readonly [number, number, number, number];
  approach: string;
  inside: string;
  wheelTrack?: boolean;
}

/** Bài 4 and 6: a narrow lane driven without touching its lines. */
class LaneStage implements Stage {
  step: number;
  title: string;
  entry: Gate;
  target: Vec2;
  private readonly sensor: LineSensor;
  private readonly timer = new Timer();
  private started = false;
  /** Right wheels (front, rear): went off the wheel track / have left it. */
  private missed = [false, false];

  constructor(private readonly options: LaneOptions) {
    this.step = options.step;
    this.title = options.title;
    this.entry = options.entry;
    this.sensor = new LineSensor(...options.box);
    const mid = (options.entry.min + options.entry.max) / 2;
    this.target = options.entry.axis === 'x' ? { x: options.entry.at, z: mid } : { x: mid, z: options.entry.at };
  }

  update(frame: Frame): boolean {
    if (!this.started) {
      if (past(this.entry, frame.bumper) < 0 || !inLane(this.entry, frame.bumper)) return false;
      this.started = true;
    }
    this.timer.update(frame);
    this.sensor.update(frame);
    if (this.options.wheelTrack) this.checkTrack(frame);
    return past(this.options.exit, frame.rear) >= 0 && inLane(this.options.exit, frame.rear);
  }

  private checkTrack(frame: Frame) {
    const track = YARD_EXAM.wheelTrack;
    [frame.car.wheels[1], frame.car.wheels[3]].forEach((wheel, i) => {
      if (this.missed[i] || wheel.z > track.fromZ || wheel.z < track.toZ) return;
      if (wheel.x >= track.minX && wheel.x <= track.maxX) return;
      this.missed[i] = true;
      const which = i === 0 ? 'trước' : 'sau';
      frame.events.push({ type: 'fail', reason: `Bánh xe ${which} bên phải không đi qua vệt bánh xe` });
    });
  }

  hint(): string {
    return this.started ? this.options.inside : this.options.approach;
  }
}

interface CrossOptions {
  /** 1 to 4: the crossroads is driven four times. */
  pass: number;
  axis: 'ns' | 'ew';
  line: Gate;
  exit: Gate;
  turn: Exclude<TurnSignal, 'off'> | null;
  approach: string;
}

/** Bài 5: the crossroads with traffic lights. */
class CrossStage implements Stage {
  step = 5;
  title: string;
  entry: Gate;
  target: Vec2;
  private readonly judge: StopJudge;
  private arrived = false;
  private overLine = false;
  private greenTime = 0;
  private late = false;
  private color: LightColor = 'green';

  constructor(private readonly options: CrossOptions) {
    this.title = `Qua ngã tư có đèn tín hiệu (lần ${options.pass}/4)`;
    this.entry = options.line;
    this.judge = new StopJudge(options.line);
    const mid = (options.line.min + options.line.max) / 2;
    this.target = options.line.axis === 'x' ? { x: options.line.at, z: mid } : { x: mid, z: options.line.at };
  }

  update(frame: Frame): boolean {
    const { line, exit, turn, axis } = this.options;
    const gap = this.judge.gap(frame);
    this.color = frame.lights[axis];
    if (!this.arrived) {
      if (gap > YARD_EXAM.stopZone || !inLane(line, frame.bumper)) return false;
      this.arrived = true;
    }
    if (!this.overLine) {
      if (this.color !== 'green') this.judge.update(frame);
      // Through the 0.4 m line on red: the light has been run.
      if (gap < -0.4) {
        this.overLine = true;
        if (this.color === 'red') penalty(frame, 10, 'Vượt đèn đỏ');
        if (turn && frame.driver.signal !== turn) {
          penalty(frame, 5, `Không bật xi nhan ${turn === 'left' ? 'trái' : 'phải'} khi rẽ`);
        }
      }
    }
    if (this.color === 'green' || this.overLine) {
      this.greenTime += frame.dt;
      if (!this.late && this.greenTime > 20) {
        this.late = true;
        penalty(frame, 5, 'Quá 20 giây từ khi đèn xanh chưa qua ngã tư');
      }
      if (this.greenTime > 30)
        frame.events.push({ type: 'fail', reason: 'Quá 30 giây từ khi đèn xanh không qua ngã tư' });
    }
    if (past(exit, frame.car.position) >= 0 && inLane(exit, frame.car.position)) return true;
    const box = YARD_EXAM.junction;
    const { x, z } = frame.car.position;
    const out = x < box.minX || x > box.maxX || z < box.minZ || z > box.maxZ;
    // Out of the junction by another arm than the route's, or back out the way it came.
    if (this.overLine && out && past(line, frame.car.position) > 0) {
      frame.events.push({ type: 'fail', reason: 'Đi không đúng trình tự bài thi' });
    }
    return false;
  }

  hint(): string {
    if (!this.arrived) return this.options.approach;
    const way =
      this.options.turn === 'left'
        ? 'rẽ trái (xi nhan trái)'
        : this.options.turn === 'right'
          ? 'rẽ phải (xi nhan phải)'
          : 'đi thẳng';
    if (this.overLine) return `Qua ngã tư: ${way}`;
    if (this.color === 'green') return `Đèn xanh: ${way} qua ngã tư trong 20 giây`;
    return `Đèn ${this.color === 'red' ? 'đỏ' : 'vàng'}: dừng trước vạch, cản trước cách vạch ≤ 50 cm, rồi ${way}`;
  }
}

/** Bài 9: change up and speed up to the green sign, change down and slow down to the red one. */
class GearStage implements Stage {
  step = 9;
  title = 'Thay đổi số trên đường bằng';
  entry: Gate = { ...YARD_EXAM.gear.lane, at: YARD_EXAM.gear.startZ };
  target = { x: (YARD_EXAM.gear.lane.min + YARD_EXAM.gear.lane.max) / 2, z: YARD_EXAM.gear.startZ };
  fast = false;
  private readonly timer = new Timer();
  private phase: 'approach' | 'up' | 'down' = 'approach';

  update(frame: Frame): boolean {
    const { lane, greenZ, redZ, kmh } = YARD_EXAM.gear;
    const speed = Math.abs(frame.car.speed) * 3.6;
    const gear = gearNumber(frame.driver.gear);
    const manual = frame.driver.transmission === 'B2';
    if (this.phase === 'approach') {
      if (past(this.entry, frame.bumper) < 0 || !inLane(lane, frame.bumper)) return false;
      this.phase = 'up';
      this.fast = true;
    }
    this.timer.update(frame);
    if (this.phase === 'up') {
      if (past({ ...lane, at: greenZ }, frame.bumper) < 0) return false;
      this.phase = 'down';
      if (speed <= kmh) penalty(frame, 5, `Không đạt tốc độ trên ${kmh} km/h tới biển 24 xanh`);
      if (manual && gear < 2) penalty(frame, 5, 'Không tăng từ số 1 lên số 2 tới biển 24 xanh');
      return false;
    }
    if (past({ ...lane, at: redZ }, frame.bumper) < 0) return false;
    if (speed >= kmh) penalty(frame, 5, `Không giảm tốc độ dưới ${kmh} km/h tới biển 24 đỏ`);
    if (manual && gear !== 1) penalty(frame, 5, 'Không giảm từ số 2 về số 1 tới biển 24 đỏ');
    this.fast = false;
    return true;
  }

  hint(): string {
    if (this.phase === 'approach') return 'Đi tiếp theo làn ngoài tới biển "Bắt đầu tăng tốc"';
    if (this.phase === 'up') return 'Tăng tốc, lên số 2 và chạy trên 24 km/h trước biển 24 xanh';
    return 'Giảm tốc dưới 24 km/h và về số 1 trước biển 24 đỏ';
  }
}

/** Bài 10: parallel parking in one of the two bays on the right. */
class ParallelStage implements Stage {
  step = 10;
  title = 'Ghép xe ngang vào nơi đỗ';
  entry: Gate = YARD_EXAM.parallel.entry;
  target = { x: -1.2, z: YARD_EXAM.parallel.entry.at };
  private readonly sensor: LineSensor;
  private readonly timer = new Timer();
  private started = false;
  private parked = false;
  private still = 0;

  constructor() {
    const { box } = YARD_EXAM.parallel;
    this.sensor = new LineSensor(box.minX, box.maxX, box.minZ, box.maxZ);
  }

  update(frame: Frame): boolean {
    const { entry, exit, bays } = YARD_EXAM.parallel;
    if (!this.started) {
      if (past(entry, frame.bumper) < 0 || !inLane(entry, frame.bumper)) return false;
      this.started = true;
      frame.events.push({ type: 'info', message: 'Bắt đầu bài ghép xe ngang — thời gian 2 phút' });
    }
    this.timer.update(frame);
    this.sensor.update(frame);
    if (!this.parked) {
      const inBay = bays.some((bay) =>
        frame.car.corners.every((c) => c.x > bay.minX && c.x < bay.maxX && c.z > bay.minZ && c.z < bay.maxZ)
      );
      this.still = inBay && Math.abs(frame.car.speed) < STILL_SPEED ? this.still + frame.dt : 0;
      if (this.still >= STILL_TIME) {
        this.parked = true;
        frame.events.push({ type: 'info', message: 'Đã ghép xe vào nơi đỗ — tiến ra, đi tiếp' }, { type: 'beep' });
      }
    }
    if (past(exit, frame.rear) < 0 || !inLane(exit, frame.rear)) return false;
    if (!this.parked) penalty(frame, 5, 'Chưa ghép được xe vào nơi đỗ');
    return true;
  }

  hint(): string {
    if (!this.started) return 'Rẽ trái vào đường giữa sân, nơi đỗ ghép ngang nằm bên phải';
    if (!this.parked) return 'Tiến qua nơi đỗ, lùi hết lái phải vào nơi đỗ bên phải, không đè vạch';
    return 'Tiến ra khỏi nơi đỗ, đi tiếp tới ngã tư';
  }
}

/** Bài 11. */
class FinishStage implements Stage {
  step = 11;
  title = 'Kết thúc';
  target = { x: YARD_EXAM.finish.at, z: (YARD_EXAM.finish.min + YARD_EXAM.finish.max) / 2 };

  update(frame: Frame): boolean {
    if (past(YARD_EXAM.finish, frame.bumper) < 0 || !inLane(YARD_EXAM.finish, frame.bumper)) return false;
    if (frame.driver.signal !== 'right') penalty(frame, 5, 'Không bật xi nhan phải khi qua vạch kết thúc');
    return true;
  }

  hint(): string {
    return 'Rẽ phải xuống đường một chiều, rẽ trái ra đường dưới, bật xi nhan phải rồi qua vạch kết thúc';
  }
}

function buildStages(): Stage[] {
  const E = YARD_EXAM;
  return [
    new StartStage(),
    new StopStage(
      2,
      'Dừng xe nhường đường cho người đi bộ',
      E.pedestrian,
      'Dừng trước vạch người đi bộ, cản trước cách vạch ≤ 50 cm'
    ),
    new WrappedStage(
      3,
      'Dừng và khởi hành xe ngang dốc',
      { x: HILL.centerX - HILL.width / 4, z: HILL.stopLineZ },
      new HillExam()
    ),
    new LaneStage({
      step: 4,
      title: 'Qua vệt bánh xe và đường vòng vuông góc',
      entry: E.angle.entry,
      exit: E.angle.exit,
      box: E.angle.box,
      approach: 'Qua góc sân, rẽ trái vào làn xe con của bài 4 (làn thứ hai)',
      inside: 'Cho hai bánh phải đi giữa hai vạch vàng, rồi qua hai góc vuông không đè vạch',
      wheelTrack: true,
    }),
    new CrossStage({
      pass: 1,
      axis: 'ew',
      line: E.cross.west,
      exit: E.cross.exitEast,
      turn: null,
      approach: 'Rẽ phải ra đường ngang, đi thẳng tới ngã tư',
    }),
    new LaneStage({
      step: 6,
      title: 'Qua đường vòng quanh co',
      entry: E.curve.entry,
      exit: E.curve.exit,
      box: E.curve.box,
      approach: 'Cuối đường ngang rẽ phải, rồi rẽ phải vào đường vòng chữ S của xe con (lối thứ hai)',
      inside: 'Đi hết đường chữ S, không để bánh xe đè vạch',
    }),
    new CrossStage({
      pass: 2,
      axis: 'ns',
      line: E.cross.north,
      exit: E.cross.exitSouth,
      turn: null,
      approach: 'Rẽ phải xuống đường giữa sân, đi thẳng tới ngã tư',
    }),
    new WrappedStage(
      7,
      'Ghép xe dọc vào nơi đỗ',
      { x: PARKING.entryX, z: (PARKING.laneBayZ + PARKING.laneFarZ) / 2 },
      new ParkingExam(),
      { axis: 'x', dir: 1, at: PARKING.entryX, min: PARKING.laneBayZ, max: PARKING.laneFarZ }
    ),
    new CrossStage({
      pass: 3,
      axis: 'ew',
      line: E.cross.east,
      exit: E.cross.exitNorth,
      turn: 'left',
      approach: 'Ra khỏi làn ghép dọc rẽ phải, cuối đường rẽ phải, lên hết đường bên rồi rẽ phải vào đường ngang',
    }),
    new StopStage(
      8,
      'Tạm dừng ở chỗ có đường sắt chạy qua',
      E.railway,
      'Cuối đường giữa rẽ trái, dừng trước vạch đường sắt, cản trước cách vạch ≤ 50 cm'
    ),
    new GearStage(),
    new ParallelStage(),
    new CrossStage({
      pass: 4,
      axis: 'ns',
      line: E.cross.south,
      exit: E.cross.exitWest,
      turn: 'right',
      approach: 'Đi thẳng tới ngã tư',
    }),
    new FinishStage(),
  ];
}

/** Lane centres the exam is driven along, for the minimap. */
export const EXAM_ROUTE: Vec2[] = [
  [-51.8, -27],
  [-51.8, 55.6],
  [-16.75, 55.6],
  [-16.75, 14.45],
  [-25.6, 14.45],
  [-25.6, 4.9],
  [47.6, 4.9],
  [47.6, 30.45],
  [32.33, 30.45],
  [32.33, 39.2],
  [41.08, 39.2],
  [41.08, 47.95],
  [5.9, 47.95],
  [5.9, -24.2],
  [24, -24.2],
  [5.9, -24.2],
  [5.9, -54.95],
  [47.6, -54.95],
  [47.6, 1.1],
  [2.1, 1.1],
  [2.1, 57.5],
  [51.4, 57.5],
  [51.4, -58.75],
  [2.1, -58.75],
  [2.1, 1.1],
  [-9.8, 1.1],
  [-9.8, -56.85],
  [-32, -56.85],
].map(([x, z]) => ({ x, z }));

export class YardExam implements Exam {
  private readonly stages = buildStages();
  private index = 0;
  private elapsed = 0;
  private done = false;
  private announced = false;
  private lastBumper: Vec2 | null = null;
  private speeding = 0;
  private overtime = 0;
  private revving = 0;
  private revCharged = false;
  private offRoad = 0;

  update(car: CarSnapshot, dt: number, driver: DriverState): ExamEvent[] {
    const events: ExamEvent[] = [];
    if (this.done) return events;
    this.elapsed += dt;
    const bumper = { x: car.position.x + car.forward.x * HALF_LENGTH, z: car.position.z + car.forward.z * HALF_LENGTH };
    const rear = { x: car.position.x - car.forward.x * HALF_LENGTH, z: car.position.z - car.forward.z * HALF_LENGTH };
    const frame: Frame = {
      car,
      dt,
      driver,
      bumper,
      rear,
      lastBumper: this.lastBumper ?? bumper,
      lights: this.lights(),
      events,
    };
    this.lastBumper = bumper;
    if (!this.announced) {
      this.announced = true;
      events.push({ type: 'voice', text: 'Bắt đầu bài thi. Bài 1: xuất phát' });
    }

    this.common(frame);
    const stage = this.stages[this.index];
    for (const later of this.stages.slice(this.index + 1)) {
      if (later.entry && crossed(later.entry, frame.lastBumper, bumper)) {
        events.push({ type: 'fail', reason: `Đi không đúng trình tự bài thi (chưa xong bài ${stage.step})` });
      }
    }
    if (stage.update(frame)) {
      this.index += 1;
      const next = this.stages[this.index];
      if (!next) {
        this.done = true;
        events.push({ type: 'pass', reason: 'Hoàn thành 11 bài thi sa hình' });
      } else if (next.step !== stage.step) {
        events.push({ type: 'voice', text: `Bài ${next.step}: ${next.title}` });
      }
    }
    if (events.some((e) => e.type === 'fail')) this.done = true;
    return events;
  }

  /** Rules that hold for the whole run. */
  private common(frame: Frame) {
    const { car, dt, driver } = frame;
    if (car.stalledNow) penalty(frame, 5, 'Xe chết máy');

    const limit = YARD_EXAM.speedLimitKmh;
    const speeding = Math.abs(car.speed) * 3.6 > limit && !this.stages[this.index].fast;
    this.speeding = speeding ? this.speeding + dt : 0;
    if (this.speeding >= 3) {
      this.speeding -= 3;
      penalty(frame, 1, `Chạy quá ${limit} km/h`);
    }

    const rpm = driver.rpm ?? 0;
    if (rpm < YARD_EXAM.maxRpm - 500) this.revCharged = false;
    this.revving = rpm > YARD_EXAM.maxRpm ? this.revving + dt : 0;
    if (this.revving > 1 && !this.revCharged) {
      this.revCharged = true;
      penalty(frame, 5, 'Tốc độ động cơ vượt 4.000 vòng/phút');
    }

    if (this.elapsed > YARD_EXAM.totalTime) {
      this.overtime += dt;
      if (this.overtime >= 3) {
        this.overtime -= 3;
        penalty(frame, 1, 'Quá tổng thời gian 18 phút');
      }
    }

    // A wheel that stays off everything paved has climbed the kerb.
    this.offRoad = car.wheels.some((w) => !onPavement(w)) ? this.offRoad + dt : 0;
    if (this.offRoad > 0.3) frame.events.push({ type: 'fail', reason: 'Bánh xe đè lên vỉa hè' });
  }

  lights(): Lights {
    return lightsAt(this.elapsed);
  }

  clock() {
    return { seconds: this.elapsed, countdown: false };
  }

  hint(): string {
    return this.stages[Math.min(this.index, this.stages.length - 1)].hint();
  }

  yard(): YardProgress {
    const stage = this.stages[Math.min(this.index, this.stages.length - 1)];
    return { step: stage.step, total: 11, title: stage.title, target: stage.target };
  }
}
