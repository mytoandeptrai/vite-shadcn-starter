import type { DynamicRayCastVehicleController, RigidBody, World } from '@dimforge/rapier3d-compat';
import { CAR } from '../constants';
import type { CarSnapshot, Vec2 } from '../types';
import { clamp } from './math';

export const SUSPENSION = { restLength: 0.3, anchorY: -0.1 } as const;

/** Wheel anchors in chassis space (+X = left, +Z = forward): FL, FR, RL, RR. */
export const WHEEL_ANCHORS: [number, number][] = [
  [CAR.trackWidth / 2, CAR.wheelBase / 2],
  [-CAR.trackWidth / 2, CAR.wheelBase / 2],
  [CAR.trackWidth / 2, -CAR.wheelBase / 2],
  [-CAR.trackWidth / 2, -CAR.wheelBase / 2],
];

const GRAVITY = 9.81;
const MAX_FOOT_BRAKE = 11000;
const HANDBRAKE_PER_WHEEL = 2600;
const PARK_LOCK_PER_WHEEL = 3500;
/** Front/rear brake split per wheel. */
const BRAKE_SHARE = [0.3, 0.3, 0.2, 0.2];
const TRACTION_LIMIT = CAR.mass * GRAVITY * 0.58 * 0.95;
const HOLD_SPEED = 0.2;

export interface VehicleControls {
  /** Road wheel angle in radians, positive = right. */
  steer: number;
  /** Drivetrain force along the forward axis, N. */
  driveForce: number;
  /** 0..1 */
  footBrake: number;
  handbrake: boolean;
  parkLock: boolean;
}

/** Raycast-wheel vehicle on top of Rapier's DynamicRayCastVehicleController. */
export class VehicleRig {
  readonly controller: DynamicRayCastVehicleController;

  constructor(
    private readonly world: World,
    private readonly chassis: RigidBody
  ) {
    const vc = world.createVehicleController(chassis);
    vc.indexUpAxis = 1;
    vc.setIndexForwardAxis = 2;
    for (const [x, z] of WHEEL_ANCHORS) {
      vc.addWheel(
        { x, y: SUSPENSION.anchorY, z },
        { x: 0, y: -1, z: 0 },
        { x: -1, y: 0, z: 0 },
        SUSPENSION.restLength,
        CAR.wheelRadius
      );
    }
    for (let i = 0; i < 4; i++) {
      vc.setWheelSuspensionStiffness(i, 28);
      vc.setWheelSuspensionCompression(i, 3.2);
      vc.setWheelSuspensionRelaxation(i, 4.2);
      vc.setWheelMaxSuspensionTravel(i, 0.25);
      vc.setWheelFrictionSlip(i, 2);
      vc.setWheelSideFrictionStiffness(i, 1);
    }
    this.controller = vc;
  }

  /** Unit forward vector of the chassis in world space. */
  forward(): { x: number; y: number; z: number } {
    const r = this.chassis.rotation();
    return {
      x: 2 * (r.x * r.z + r.w * r.y),
      y: 2 * (r.y * r.z - r.w * r.x),
      z: 1 - 2 * (r.x * r.x + r.y * r.y),
    };
  }

  /** Signed speed along the forward axis, m/s. */
  speed(): number {
    const v = this.chassis.linvel();
    const f = this.forward();
    return v.x * f.x + v.y * f.y + v.z * f.z;
  }

  /** Applies controls for the coming physics step. */
  step(dt: number, controls: VehicleControls): void {
    const vc = this.controller;
    const f = this.forward();
    const speed = this.speed();

    // Rapier steering is positive to the left.
    vc.setWheelSteering(0, -controls.steer);
    vc.setWheelSteering(1, -controls.steer);

    let brakeCapacity = 0;
    for (let i = 0; i < 4; i++) {
      let force = BRAKE_SHARE[i] * MAX_FOOT_BRAKE * controls.footBrake;
      if (controls.handbrake && i >= 2) force += HANDBRAKE_PER_WHEEL;
      if (controls.parkLock && i < 2) force += PARK_LOCK_PER_WHEEL;
      brakeCapacity += force;
      vc.setWheelBrake(i, force * dt);
    }

    const grounded = vc.wheelIsInContact(0) || vc.wheelIsInContact(1);
    const drive = grounded ? clamp(controls.driveForce, -TRACTION_LIMIT, TRACTION_LIMIT) : 0;
    const rolling = -Math.sign(speed) * Math.min(1, Math.abs(speed) / 0.5) * 140;
    const drag = -0.42 * speed * Math.abs(speed);
    let force = drive + rolling + drag;

    // The raycast brake is a velocity impulse and lets the car creep downhill, so while the
    // brakes can hold the car, model static friction by cancelling gravity and drive directly.
    const gravityAlong = -CAR.mass * GRAVITY * f.y;
    const holding = Math.abs(speed) < HOLD_SPEED && brakeCapacity > Math.abs(gravityAlong + drive);
    if (holding) force = -gravityAlong;

    this.chassis.resetForces(true);
    this.chassis.addForce({ x: f.x * force, y: f.y * force, z: f.z * force }, true);
    vc.updateVehicle(dt);
  }

  suspensionLength(i: number): number {
    return this.controller.wheelSuspensionLength(i) ?? SUSPENSION.restLength;
  }

  wheelRotation(i: number): number {
    return this.controller.wheelRotation(i) ?? 0;
  }

  snapshot(stalledNow: boolean): CarSnapshot {
    const t = this.chassis.translation();
    const f3 = this.forward();
    const len = Math.hypot(f3.x, f3.z) || 1;
    const forward = { x: f3.x / len, z: f3.z / len };
    const left = { x: forward.z, z: -forward.x };
    const at = (ahead: number, side: number): Vec2 => ({
      x: t.x + forward.x * ahead + left.x * side,
      z: t.z + forward.z * ahead + left.z * side,
    });
    const hl = CAR.length / 2;
    const hw = CAR.width / 2;
    return {
      position: { x: t.x, z: t.z },
      forward,
      speed: this.speed(),
      stalledNow,
      wheels: [
        at(WHEEL_ANCHORS[0][1], WHEEL_ANCHORS[0][0]),
        at(WHEEL_ANCHORS[1][1], WHEEL_ANCHORS[1][0]),
        at(WHEEL_ANCHORS[2][1], WHEEL_ANCHORS[2][0]),
        at(WHEEL_ANCHORS[3][1], WHEEL_ANCHORS[3][0]),
      ],
      corners: [at(hl, hw), at(hl, -hw), at(-hl, hw), at(-hl, -hw)],
    };
  }

  dispose(): void {
    this.world.removeVehicleController(this.controller);
  }
}
