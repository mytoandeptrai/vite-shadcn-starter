import { CAR, CLUTCH } from '../constants';
import { approach, clamp } from './math';

/**
 * High-frequency control state shared between the DOM controls and the physics loop.
 * Kept outside React so 60Hz updates never trigger re-renders.
 */
export const input = {
  keys: { throttle: false, brake: false, clutch: false, halfClutch: false, left: false, right: false },
  /** Touch/mouse pedal depth, null when not pressed. */
  pedal: { throttle: null as number | null, brake: null as number | null },
  wheelDragging: false,
  /** Quick-turn target: -1 full left, 1 full right, 0 centre, null = free. */
  steerLatch: null as -1 | 0 | 1 | null,
  /** Clutch is releasing on its own after the C/X key was let go. */
  clutchAutoRelease: false,

  /** Steering wheel angle in degrees, positive = clockwise (right). */
  steerDeg: 0,
  throttle: 0,
  brake: 0,
  /** Clutch pedal depth, 1 = on the floor. */
  clutch: 0,
};

export function resetInput(clutch = 0): void {
  input.keys = { throttle: false, brake: false, clutch: false, halfClutch: false, left: false, right: false };
  input.pedal = { throttle: null, brake: null };
  input.wheelDragging = false;
  input.steerLatch = null;
  input.clutchAutoRelease = false;
  input.steerDeg = 0;
  input.throttle = 0;
  input.brake = 0;
  input.clutch = clutch;
}

const KEY_STEER_RATE = 420;
const LATCH_STEER_RATE = 900;
/** Clutch depth held by the half-clutch key: just inside the bite zone. */
const HALF_CLUTCH_DEPTH = 1 - (CLUTCH.biteStart + CLUTCH.biteEnd) / 2 - 0.02;

/** Advances pedal ramps and steering springs by one step. */
export function updateInput(dt: number): void {
  const max = CAR.maxSteerWheelDeg;

  if (!input.wheelDragging) {
    const dir = (input.keys.right ? 1 : 0) - (input.keys.left ? 1 : 0);
    if (dir !== 0) {
      input.steerLatch = null;
      input.steerDeg = clamp(input.steerDeg + dir * KEY_STEER_RATE * dt, -max, max);
    } else if (input.steerLatch !== null) {
      input.steerDeg = approach(input.steerDeg, input.steerLatch * max, LATCH_STEER_RATE * dt);
      if (input.steerLatch === 0 && input.steerDeg === 0) input.steerLatch = null;
    } else {
      // Auto-centering spring with a small constant return so it settles exactly on centre.
      const rate = Math.abs(input.steerDeg) * 3.5 + 40;
      input.steerDeg = approach(input.steerDeg, 0, rate * dt);
    }
  }

  const throttleTarget = input.pedal.throttle ?? (input.keys.throttle ? 1 : 0);
  const throttleRate = input.pedal.throttle !== null ? 6 : throttleTarget > input.throttle ? 1.1 : 4;
  input.throttle = approach(input.throttle, throttleTarget, throttleRate * dt);

  const brakeTarget = input.pedal.brake ?? (input.keys.brake ? 1 : 0);
  const brakeRate = input.pedal.brake !== null ? 8 : brakeTarget > input.brake ? 2.5 : 6;
  input.brake = approach(input.brake, brakeTarget, brakeRate * dt);

  if (input.keys.clutch) {
    input.clutch = approach(input.clutch, 1, 6 * dt);
    input.clutchAutoRelease = true;
  } else if (input.keys.halfClutch) {
    input.clutch = approach(input.clutch, HALF_CLUTCH_DEPTH, 1.4 * dt);
    input.clutchAutoRelease = true;
  } else if (input.clutchAutoRelease) {
    input.clutch = approach(input.clutch, 0, 0.5 * dt);
    if (input.clutch === 0) input.clutchAutoRelease = false;
  }
}

/** Sets the clutch pedal directly (touch slider); cancels any keyboard auto-release. */
export function setClutch(depth: number): void {
  input.clutch = clamp(depth, 0, 1);
  input.clutchAutoRelease = false;
}
