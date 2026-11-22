import { CAR, NPC, ROAD } from '../constants';
import type { NpcCar, Vec2 } from '../types';
import { approach } from './math';

const KMH = 1 / 3.6;
const CRUISE = 30 * KMH;
const SLOW = 20 * KMH;
const WAIT = 12 * KMH;
const ACCEL = 2;
const DECEL = 2.5;
const HARD_DECEL = 5;
/** Bumper-to-bumper gap a car keeps to whatever is ahead in its lane, and the braking it plans with. */
const SAFE_GAP = 5;
const FOLLOW_DECEL = 1.8;
/** The lead car lets a slow learner catch up instead of driving out of sight. */
const LEAD_SLOW_GAP = 40;
const LEAD_WAIT_GAP = 65;
const AHEAD = 28 * KMH;
const BRAKE_HOLD = 3;
const ONCOMING_BEHIND = 60;
const ONCOMING_AHEAD = 260;

export interface PlayerPose {
  position: Vec2;
  speed: number;
}

type BrakeState = 'none' | 'braking' | 'holding';

/**
 * Ambient traffic for the road test: a lead car and a second car in the driving lane, plus one
 * oncoming car. The two cars in front wait at the start line until the learner sets off.
 * Deterministic, stepped by the exam.
 */
export class Traffic {
  readonly lead: NpcCar = { id: 'lead', x: ROAD.laneX, z: 30, speed: 0, braking: false, color: '#2563eb' };
  readonly ahead: NpcCar = { id: 'ahead', x: ROAD.laneX, z: 70, speed: 0, braking: false, color: '#b91c1c' };
  readonly oncoming: NpcCar = {
    id: 'oncoming',
    x: ROAD.oncomingX,
    z: 220,
    speed: -CRUISE,
    braking: false,
    color: '#f8fafc',
  };
  readonly cars: NpcCar[] = [this.lead, this.ahead, this.oncoming];
  private brake: BrakeState = 'none';
  private hold = 0;
  private started = false;

  /** The lead car does an emergency stop, waits, then drives on. */
  brakeLead(): void {
    if (this.brake === 'none') this.brake = 'braking';
  }

  get leadStopping(): boolean {
    return this.brake !== 'none';
  }

  step(dt: number, player: PlayerPose): void {
    const { lead, ahead, oncoming } = this;
    const playerInLane = Math.abs(player.position.x - ROAD.laneX) < (CAR.width + NPC.width) / 2;
    const obstacles = [
      { z: ahead.z, speed: ahead.speed, half: NPC.length / 2 },
      { z: lead.z, speed: lead.speed, half: NPC.length / 2 },
      ...(playerInLane ? [{ z: player.position.z, speed: Math.max(0, player.speed), half: CAR.length / 2 }] : []),
    ];
    /** Speed cap from the nearest thing in front of a car in the driving lane. */
    const follow = (car: NpcCar, target: number): number => {
      let capped = target;
      for (const o of obstacles) {
        if (o.z <= car.z) continue;
        // Fastest speed from which the car can still slow to the obstacle's speed in the room it has.
        const room = o.z - o.half - (car.z + NPC.length / 2) - SAFE_GAP;
        capped = Math.min(capped, room <= 0 ? 0 : o.speed + Math.sqrt(2 * FOLLOW_DECEL * room));
      }
      return capped;
    };

    if (player.position.z > 1) this.started = true;
    const gapToPlayer = lead.z - player.position.z;
    let leadTarget = gapToPlayer > LEAD_WAIT_GAP ? WAIT : gapToPlayer > LEAD_SLOW_GAP ? SLOW : CRUISE;
    if (!this.started) leadTarget = 0;
    if (this.brake === 'braking') {
      leadTarget = 0;
      if (lead.speed <= 0.05) {
        this.brake = 'holding';
        this.hold = 0;
      }
    } else if (this.brake === 'holding') {
      leadTarget = 0;
      this.hold += dt;
      if (this.hold >= BRAKE_HOLD) this.brake = 'none';
    }
    this.drive(lead, follow(lead, leadTarget), dt, this.brake === 'none' ? DECEL : HARD_DECEL);
    lead.braking = this.brake !== 'none';
    this.drive(ahead, follow(ahead, this.started ? AHEAD : 0), dt, DECEL);

    oncoming.z += oncoming.speed * dt;
    if (oncoming.z < player.position.z - ONCOMING_BEHIND) oncoming.z = player.position.z + ONCOMING_AHEAD;
  }

  private drive(car: NpcCar, target: number, dt: number, decel: number): void {
    car.speed = approach(car.speed, target, (car.speed > target ? decel : ACCEL) * dt);
    car.z += car.speed * dt;
  }
}
