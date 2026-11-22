export type Transmission = 'B1' | 'B2';
export type Scenario = 'free' | 'hill' | 'parking';
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
