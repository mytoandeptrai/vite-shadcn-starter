export type Transmission = 'B1' | 'B2';
export type Scenario = 'free' | 'hill' | 'parking' | 'exam' | 'road';
export type TurnSignal = 'off' | 'left' | 'right';
export type Gear = 'P' | 'R' | 'N' | 'D' | '1' | '2' | '3' | '4' | '5';
export type CameraMode = 'chase' | 'driver' | 'top';
export type SimPhase = 'menu' | 'driving' | 'finished';

export interface Vec2 {
  x: number;
  z: number;
}

export type LineKind = 'sensor' | 'stop' | 'gate' | 'marking';

export interface TrackLine {
  id: string;
  kind: LineKind;
  a: Vec2;
  b: Vec2;
  width: number;
}

export interface Penalty {
  id: number;
  points: number;
  reason: string;
  time: number;
}

export interface ExamResult {
  passed: boolean;
  reason: string;
}

export type ExamEvent =
  | { type: 'penalty'; points: number; reason: string }
  | { type: 'fail'; reason: string }
  | { type: 'pass'; reason: string }
  | { type: 'info'; message: string }
  /** Spoken examiner command, also shown as a subtitle. */
  | { type: 'voice'; text: string }
  | { type: 'beep' };

/** Per-step snapshot of the car, expressed in world space (metres, seconds). */
export interface CarSnapshot {
  /** Chassis centre on the ground plane. */
  position: Vec2;
  /** Unit forward vector on the ground plane. */
  forward: Vec2;
  /** Signed speed along the forward vector (m/s). */
  speed: number;
  /** Wheel contact patches: front-left, front-right, rear-left, rear-right. */
  wheels: [Vec2, Vec2, Vec2, Vec2];
  /** Body corners: front-left, front-right, rear-left, rear-right. */
  corners: [Vec2, Vec2, Vec2, Vec2];
  /** True on the step where the engine stalled. */
  stalledNow: boolean;
}

/** What the driver has set on the controls, for exams that check procedure. */
export interface DriverState {
  transmission: Transmission;
  gear: Gear;
  signal: TurnSignal;
  handbrake: boolean;
  /** Engine speed, when the exam scores it. */
  rpm?: number;
}

/** Another road user, axis-aligned with the road. */
export interface NpcCar {
  id: string;
  x: number;
  z: number;
  /** Signed speed along +Z, m/s. */
  speed: number;
  braking: boolean;
  color: string;
}

/** Road test progress shown on the HUD. */
export interface RoadProgress {
  /** Metres driven from the start line. */
  distance: number;
  total: number;
  /** Index of the current test step in ROAD_STEPS. */
  step: number;
  /** Lateral offset from the centre of the driving lane, metres, positive = left. */
  offset: number;
  /** Bumper-to-bumper distance to the car in front, metres; null when the lane ahead is clear. */
  gap: number | null;
}

export type LightColor = 'red' | 'yellow' | 'green';

/** Traffic lights of the yard's crossroads: the centre road (ns) and the cross road (ew). */
export interface Lights {
  ns: LightColor;
  ew: LightColor;
}

/** Full yard exam progress shown on the HUD. */
export interface YardProgress {
  /** Exercise being driven, 1 to `total`. */
  step: number;
  total: number;
  title: string;
  /** Where that exercise begins. */
  target: Vec2;
}
