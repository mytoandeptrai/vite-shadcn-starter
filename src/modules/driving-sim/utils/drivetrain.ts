import { CAR, CLUTCH, ENGINE } from '../constants';
import type { Gear, Transmission } from '../types';

const RPM_TO_RAD = Math.PI / 30;
const SUBSTEPS = 8;
/** Clutch slip stiffness, N·m per rad/s of slip. */
const CLUTCH_STIFFNESS = 25;

export interface DrivetrainState {
  rpm: number;
  running: boolean;
  /** Virtual gear index used by the automatic gearbox in D. */
  autoGear: number;
}

export interface DrivetrainInput {
  transmission: Transmission;
  gear: Gear;
  /** 0..1 */
  throttle: number;
  /** Clutch pedal depth 0..1 (1 = pedal on the floor). Ignored for B1. */
  clutch: number;
  /** Signed speed along the car's forward axis, m/s. */
  speed: number;
  dt: number;
}

export interface DrivetrainOutput {
  /** Force at the driven wheels along the car's forward axis, N. */
  driveForce: number;
  /** True on the step where the engine stalled. */
  stalled: boolean;
  /** Parking pawl engaged (automatic in P). */
  parkLock: boolean;
}

export function createDrivetrainState(): DrivetrainState {
  return { rpm: ENGINE.idleRpm, running: true, autoGear: 0 };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Full-throttle torque curve, N·m. */
export function maxEngineTorque(rpm: number): number {
  const x = (rpm - 4200) / 5200;
  return ENGINE.peakTorque * Math.max(0.3, 1 - x * x);
}

function frictionTorque(rpm: number): number {
  return 9 + Math.abs(rpm) * 0.0035;
}

/** Torque the clutch can transmit for a given release fraction (0 = pedal down). */
export function clutchCapacity(release: number): number {
  if (release <= CLUTCH.biteStart) return 0;
  if (release <= CLUTCH.biteEnd) {
    return ((release - CLUTCH.biteStart) / (CLUTCH.biteEnd - CLUTCH.biteStart)) * CLUTCH.biteTorque;
  }
  if (release >= CLUTCH.fullEngage) return CLUTCH.maxTorque;
  const t = (release - CLUTCH.biteEnd) / (CLUTCH.fullEngage - CLUTCH.biteEnd);
  return CLUTCH.biteTorque + t * (CLUTCH.maxTorque - CLUTCH.biteTorque);
}

function stepManual(state: DrivetrainState, input: DrivetrainInput): DrivetrainOutput {
  const { gear, throttle, clutch, dt } = input;
  const gearRatio = gear === 'N' ? 0 : (ENGINE.ratios[gear] ?? 0);
  const ratio = gearRatio * ENGINE.finalDrive;
  const capacity = ratio === 0 ? 0 : clutchCapacity(1 - clamp(clutch, 0, 1));
  const h = dt / SUBSTEPS;

  let omega = state.rpm * RPM_TO_RAD;
  let speed = input.speed;
  let forceSum = 0;
  let stalled = false;

  for (let i = 0; i < SUBSTEPS; i++) {
    const rpm = omega / RPM_TO_RAD;
    const wheelOmega = (speed / CAR.wheelRadius) * ratio;
    const clutchTorque = clamp(CLUTCH_STIFFNESS * (omega - wheelOmega), -capacity, capacity);

    let engineTorque = 0;
    if (state.running) {
      const idle = clamp((ENGINE.idleRpm + 50 - rpm) / 300, 0, 0.32);
      const limiter = rpm > ENGINE.redlineRpm ? 0 : 1;
      engineTorque = Math.max(throttle * limiter, idle) * maxEngineTorque(rpm);
    }

    omega += ((engineTorque - clutchTorque) / ENGINE.inertia) * h;
    // Friction opposes rotation and never reverses it.
    const friction = (frictionTorque(rpm) * (state.running ? 1 : 3) * h) / ENGINE.inertia;
    omega = Math.abs(omega) <= friction ? 0 : omega - Math.sign(omega) * friction;

    const force = (clutchTorque * ratio * ENGINE.efficiency) / CAR.wheelRadius;
    forceSum += force;
    speed += (force / CAR.mass) * h;

    if (state.running && omega < ENGINE.stallRpm * RPM_TO_RAD) {
      state.running = false;
      stalled = true;
    }
  }

  state.rpm = omega / RPM_TO_RAD;
  return { driveForce: forceSum / SUBSTEPS, stalled, parkLock: false };
}

const CREEP_SPEED = 1.9;
const CREEP_FORCE = 950;

function stepAutomatic(state: DrivetrainState, input: DrivetrainInput): DrivetrainOutput {
  const { gear, throttle, speed, dt } = input;
  let targetRpm = state.running ? ENGINE.idleRpm + throttle * 2600 : 0;
  let driveForce = 0;

  if (state.running && (gear === 'D' || gear === 'R')) {
    const dir = gear === 'D' ? 1 : -1;
    const along = speed * dir;

    if (gear === 'D') {
      const up = state.autoGear < ENGINE.autoRatios.length - 1;
      const wheelRpmNow = (Math.max(0, along) / CAR.wheelRadius / RPM_TO_RAD) * ENGINE.finalDrive;
      const rpmNow = wheelRpmNow * ENGINE.autoRatios[state.autoGear]!;
      if (up && rpmNow > 2300 + throttle * 3200) state.autoGear += 1;
      else if (state.autoGear > 0 && rpmNow < 1100 + throttle * 900) state.autoGear -= 1;
    } else {
      state.autoGear = 0;
    }

    const gearRatio = gear === 'D' ? ENGINE.autoRatios[state.autoGear]! : 3.1;
    const ratio = gearRatio * ENGINE.finalDrive;
    const lockedRpm = (Math.max(0, along) / CAR.wheelRadius / RPM_TO_RAD) * ratio;
    // Torque converter: engine revs above the wheels at low speed and multiplies torque.
    const slipRpm = ENGINE.idleRpm + throttle * 1500;
    const rpm = Math.max(lockedRpm, slipRpm);
    const multiplication = 1 + 0.7 * clamp(1 - lockedRpm / Math.max(rpm, 1), 0, 1);
    const throttleForce =
      (throttle * maxEngineTorque(rpm) * multiplication * ratio * ENGINE.efficiency) / CAR.wheelRadius;
    const creep = CREEP_FORCE * clamp(1 - along / CREEP_SPEED, 0, 1.2);
    const engineBrake = along > CREEP_SPEED ? 120 + along * 18 : 0;

    driveForce = dir * (Math.max(throttleForce, creep * (1 - throttle)) - engineBrake * (1 - throttle));
    targetRpm = Math.min(rpm, ENGINE.redlineRpm);
  } else {
    state.autoGear = 0;
  }

  state.rpm += (targetRpm - state.rpm) * Math.min(1, dt * 6);
  return { driveForce, stalled: false, parkLock: gear === 'P' };
}

/** Advances the engine + gearbox by one physics step and returns the drive force. */
export function stepDrivetrain(state: DrivetrainState, input: DrivetrainInput): DrivetrainOutput {
  return input.transmission === 'B2' ? stepManual(state, input) : stepAutomatic(state, input);
}

/** Whether the starter may crank: clutch down or neutral (B2), P or N (B1). */
export function canStartEngine(transmission: Transmission, gear: Gear, clutch: number): boolean {
  if (transmission === 'B1') return gear === 'P' || gear === 'N';
  return gear === 'N' || clutch >= CLUTCH.shiftPressed;
}

export function startEngine(state: DrivetrainState): void {
  state.running = true;
  state.rpm = ENGINE.idleRpm;
}
