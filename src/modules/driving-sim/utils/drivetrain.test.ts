import { describe, expect, it } from 'vitest';
import { CAR } from '../constants';
import { clutchCapacity, createDrivetrainState, stepDrivetrain } from './drivetrain';

const DT = 1 / 60;
const GRADE_FORCE = CAR.mass * 9.81 * Math.sin(Math.atan(0.1));

interface Phase {
  seconds: number;
  throttle: number;
  /** Clutch pedal depth at the start and end of the phase. */
  clutch: [number, number];
}

/** Drives a point-mass car through the phases; returns final speed, travel and stall flag. */
function simulate(phases: Phase[], opts: { gear?: '1' | 'R'; resist?: number } = {}) {
  const state = createDrivetrainState();
  let speed = 0;
  let travel = 0;
  let minTravel = 0;
  let stalled = false;
  for (const phase of phases) {
    const steps = Math.round(phase.seconds / DT);
    for (let i = 0; i < steps; i++) {
      const clutch = phase.clutch[0] + ((phase.clutch[1] - phase.clutch[0]) * i) / Math.max(1, steps - 1);
      const out = stepDrivetrain(state, {
        transmission: 'B2',
        gear: opts.gear ?? '1',
        throttle: phase.throttle,
        clutch,
        speed,
        dt: DT,
      });
      stalled ||= out.stalled;
      speed += ((out.driveForce - (opts.resist ?? 0)) / CAR.mass) * DT;
      travel += speed * DT;
      minTravel = Math.min(minTravel, travel);
    }
  }
  return { speed, travel, minTravel, stalled, rpm: state.rpm, running: state.running };
}

describe('manual drivetrain (B2)', () => {
  it('transfers no torque until the 40% bite point', () => {
    expect(clutchCapacity(0.39)).toBe(0);
    expect(clutchCapacity(0.45)).toBeGreaterThan(0);
    expect(clutchCapacity(0.9)).toBeGreaterThan(clutchCapacity(0.5));
  });

  it('idles in gear with the clutch pressed', () => {
    const r = simulate([{ seconds: 3, throttle: 0, clutch: [1, 1] }]);
    expect(r.stalled).toBe(false);
    expect(r.rpm).toBeGreaterThan(700);
    expect(r.rpm).toBeLessThan(950);
    expect(r.speed).toBe(0);
  });

  it('stalls when the clutch is dumped at idle', () => {
    const r = simulate([
      { seconds: 0.5, throttle: 0, clutch: [1, 1] },
      { seconds: 0.15, throttle: 0, clutch: [1, 0] },
      { seconds: 1, throttle: 0, clutch: [0, 0] },
    ]);
    expect(r.stalled).toBe(true);
    expect(r.running).toBe(false);
  });

  it('pulls away without stalling on a slow release with throttle', () => {
    const r = simulate([
      { seconds: 0.5, throttle: 0.3, clutch: [1, 1] },
      { seconds: 3, throttle: 0.3, clutch: [1, 0] },
      { seconds: 1, throttle: 0.3, clutch: [0, 0] },
    ]);
    expect(r.stalled).toBe(false);
    expect(r.speed).toBeGreaterThan(2);
  });

  it('creeps on the flat when held at the bite point without throttle', () => {
    const r = simulate([
      { seconds: 2, throttle: 0, clutch: [1, 0.58] },
      { seconds: 4, throttle: 0, clutch: [0.58, 0.58] },
    ]);
    expect(r.stalled).toBe(false);
    expect(r.speed).toBeGreaterThan(0.3);
  });

  it('cannot climb a 10% grade without throttle', () => {
    const r = simulate(
      [
        { seconds: 2, throttle: 0, clutch: [1, 0.3] },
        { seconds: 3, throttle: 0, clutch: [0.3, 0.3] },
      ],
      { resist: GRADE_FORCE }
    );
    expect(r.stalled || r.travel < 0).toBe(true);
  });

  it('hill-starts on a 10% grade with clutch bite and throttle', () => {
    const r = simulate(
      [
        { seconds: 0.4, throttle: 0.55, clutch: [1, 0.55] },
        { seconds: 2.5, throttle: 0.55, clutch: [0.55, 0.35] },
        { seconds: 2, throttle: 0.55, clutch: [0.35, 0] },
      ],
      { resist: GRADE_FORCE }
    );
    expect(r.stalled).toBe(false);
    expect(r.minTravel).toBeGreaterThan(-0.5);
    expect(r.travel).toBeGreaterThan(2);
  });

  it('drives backwards in reverse', () => {
    const r = simulate(
      [
        { seconds: 3, throttle: 0.3, clutch: [1, 0] },
        { seconds: 1, throttle: 0.3, clutch: [0, 0] },
      ],
      { gear: 'R' }
    );
    expect(r.stalled).toBe(false);
    expect(r.speed).toBeLessThan(-1);
  });
});

describe('automatic drivetrain (B1)', () => {
  const run = (gear: 'D' | 'R' | 'N' | 'P', throttle: number, seconds: number) => {
    const state = createDrivetrainState();
    let speed = 0;
    for (let i = 0; i < seconds / DT; i++) {
      const out = stepDrivetrain(state, { transmission: 'B1', gear, throttle, clutch: 0, speed, dt: DT });
      speed += ((out.driveForce - Math.sign(speed) * 150) / CAR.mass) * DT;
    }
    return speed;
  };

  it('creeps forward in D and backward in R with no throttle', () => {
    const forward = run('D', 0, 6);
    const backward = run('R', 0, 6);
    expect(forward).toBeGreaterThan(0.8);
    expect(forward).toBeLessThan(2.5);
    expect(backward).toBeLessThan(-0.8);
    expect(backward).toBeGreaterThan(-2.5);
  });

  it('does not move in N or P', () => {
    expect(run('N', 0.5, 2)).toBe(0);
    expect(run('P', 0.5, 2)).toBe(0);
  });

  it('accelerates with throttle in D', () => {
    expect(run('D', 0.6, 5)).toBeGreaterThan(8);
  });
});
