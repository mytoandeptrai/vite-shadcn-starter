import { describe, expect, it } from 'vitest';
import { CAR, HILL, PARKING, PARKING_BAY } from '../constants';
import type { CarSnapshot, ExamEvent, Vec2 } from '../types';
import { HillExam, ParkingExam } from './exam';

const DT = 1 / 60;

/** Builds a snapshot for a car at (x, z) heading along `forward`. */
function car(x: number, z: number, speed = 0, forward: Vec2 = { x: 0, z: 1 }, stalledNow = false): CarSnapshot {
  const left = { x: forward.z, z: -forward.x };
  const at = (f: number, l: number): Vec2 => ({ x: x + forward.x * f + left.x * l, z: z + forward.z * f + left.z * l });
  const hw = CAR.trackWidth / 2;
  const hb = CAR.wheelBase / 2;
  return {
    position: { x, z },
    forward,
    speed,
    stalledNow,
    wheels: [at(hb, hw), at(hb, -hw), at(-hb, hw), at(-hb, -hw)],
    corners: [
      at(CAR.length / 2, CAR.width / 2),
      at(CAR.length / 2, -CAR.width / 2),
      at(-CAR.length / 2, CAR.width / 2),
      at(-CAR.length / 2, -CAR.width / 2),
    ],
  };
}

function run(exam: { update(c: CarSnapshot, dt: number): ExamEvent[] }, snapshot: CarSnapshot, seconds: number) {
  const events: ExamEvent[] = [];
  for (let i = 0; i < Math.round(seconds / DT); i++) events.push(...exam.update(snapshot, DT));
  return events;
}

const penalties = (events: ExamEvent[]) => events.filter((e) => e.type === 'penalty');
const has = (events: ExamEvent[], type: ExamEvent['type']) => events.some((e) => e.type === type);

/** Car centre z that puts the front bumper `gap` metres before the stop line. */
const stopZ = (gap: number) => HILL.stopLineZ - gap - CAR.length / 2;

describe('HillExam', () => {
  it('accepts a stop within 50cm of the line and passes after the finish gate', () => {
    const exam = new HillExam();
    const events = run(exam, car(HILL.centerX, stopZ(0.3)), 1);
    expect(penalties(events)).toHaveLength(0);
    expect(has(events, 'info')).toBe(true);
    events.push(...run(exam, car(HILL.centerX, HILL.stopLineZ + 3, 2), 0.1));
    events.push(...run(exam, car(HILL.centerX, HILL.finishZ + 1, 2), 0.1));
    expect(has(events, 'pass')).toBe(true);
    expect(has(events, 'fail')).toBe(false);
  });

  it('fails instead of accepting a stop on the flat ground beside the slope', () => {
    const events = run(new HillExam(), car(HILL.centerX + HILL.width, stopZ(0.3)), 1);
    expect(has(events, 'fail')).toBe(true);
    expect(has(events, 'info')).toBe(false);
  });

  it('deducts 5 points when stopping more than 50cm short', () => {
    const events = run(new HillExam(), car(HILL.centerX, stopZ(1.2)), 1);
    expect(penalties(events)).toHaveLength(1);
  });

  it('fails when crossing the line without stopping', () => {
    const events = run(new HillExam(), car(HILL.centerX, HILL.stopLineZ, 2), 0.1);
    expect(has(events, 'fail')).toBe(true);
  });

  it('fails when rolling back more than 50cm after the stop', () => {
    const exam = new HillExam();
    run(exam, car(HILL.centerX, stopZ(0.2)), 1);
    expect(has(run(exam, car(HILL.centerX, stopZ(0.2) - 0.4, -0.3), 0.1), 'fail')).toBe(false);
    expect(has(run(exam, car(HILL.centerX, stopZ(0.2) - 0.6, -0.3), 0.1), 'fail')).toBe(true);
  });

  it('fails after 30 seconds without leaving the stop line', () => {
    const exam = new HillExam();
    expect(has(run(exam, car(HILL.centerX, stopZ(0.2)), 29), 'fail')).toBe(false);
    expect(has(run(exam, car(HILL.centerX, stopZ(0.2)), 2.5), 'fail')).toBe(true);
  });

  it('deducts 5 points per stall', () => {
    const exam = new HillExam();
    const events = exam.update(car(HILL.centerX, stopZ(0.2), 0, { x: 0, z: 1 }, true), DT);
    expect(penalties(events)).toEqual([{ type: 'penalty', points: 5, reason: 'Xe chết máy' }]);
  });
});

describe('ParkingExam', () => {
  const laneZ = (PARKING.laneBayZ + PARKING.laneFarZ) / 2;
  const bayZ = (PARKING_BAY.minZ + PARKING_BAY.maxZ) / 2;
  const east: Vec2 = { x: 1, z: 0 };
  const west: Vec2 = { x: -1, z: 0 };
  const inLane = (z = laneZ, speed = 1) => car(PARKING.entryX + 8, z, speed, east);
  const onLine = (speed = 1) => inLane(PARKING.laneFarZ - CAR.trackWidth / 2, speed);
  const outside = car(PARKING.entryX - CAR.length, laneZ, 1, west);

  it('does not start before the entry line', () => {
    const exam = new ParkingExam();
    expect(run(exam, car(PARKING.entryX - 6, laneZ, 0, east), 130)).toHaveLength(0);
  });

  it('does not start when the entry line is crossed outside the lane', () => {
    const exam = new ParkingExam();
    expect(run(exam, car(PARKING.entryX - 1, PARKING.laneFarZ + 6, 0, east), 1)).toHaveLength(0);
  });

  it('deducts 5 points each time a wheel touches a sensor line', () => {
    const exam = new ParkingExam();
    const start = car(PARKING.entryX - 1, laneZ, 1, east);
    const events = [
      ...run(exam, start, 0.1),
      ...run(exam, inLane(), 0.5),
      ...run(exam, onLine(), 1),
      ...run(exam, inLane(), 1),
      ...run(exam, onLine(), 1),
    ];
    expect(penalties(events)).toHaveLength(2);
    expect(events.filter((e) => e.type === 'beep')).toHaveLength(2);
  });

  it('keeps deducting every 5 seconds while a wheel stays on the line', () => {
    const exam = new ParkingExam();
    run(exam, car(PARKING.entryX - 1, laneZ, 1, east), 0.1);
    expect(penalties(run(exam, onLine(0), 11))).toHaveLength(3);
  });

  it('deducts 5 points after 2 minutes', () => {
    const exam = new ParkingExam();
    const events = [...run(exam, car(PARKING.entryX - 1, laneZ, 1, east), 0.1), ...run(exam, inLane(laneZ, 0.1), 121)];
    expect(penalties(events).map((e) => e.type === 'penalty' && e.reason)).toEqual(['Quá 2 phút chưa hoàn thành bài']);
  });

  it('passes cleanly after parking in the bay and driving back out through the entry line', () => {
    const exam = new ParkingExam();
    const events = [
      ...run(exam, car(PARKING.entryX - 1, laneZ, 1, east), 0.1),
      ...run(exam, inLane(), 0.5),
      ...run(exam, car(PARKING.bayCenterX, bayZ, 0, { x: 0, z: 1 }), 1),
      ...run(exam, outside, 0.1),
    ];
    expect(penalties(events)).toHaveLength(0);
    expect(has(events, 'pass')).toBe(true);
  });

  it('deducts 5 points when leaving without parking', () => {
    const exam = new ParkingExam();
    const events = [
      ...run(exam, car(PARKING.entryX - 1, laneZ, 1, east), 0.1),
      ...run(exam, inLane(), 0.5),
      ...run(exam, outside, 0.1),
    ];
    expect(penalties(events)).toHaveLength(1);
    expect(has(events, 'pass')).toBe(true);
  });
});
