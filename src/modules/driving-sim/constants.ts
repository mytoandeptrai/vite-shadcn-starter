import type { Gear, Scenario, TrackLine, Transmission } from './types';

/** Car dimensions (metres), roughly a compact B-segment training sedan. */
export const CAR = {
  mass: 1150,
  length: 4.4,
  width: 1.75,
  wheelBase: 2.6,
  trackWidth: 1.52,
  frontOverhang: 0.9,
  rearOverhang: 0.9,
  wheelRadius: 0.3,
  tireHalfWidth: 0.1,
  /** Steering wheel lock: 1.5 turns each side. */
  maxSteerWheelDeg: 540,
  /** Road wheel angle at full lock. */
  maxRoadWheelRad: (35 * Math.PI) / 180,
} as const;

export const ENGINE = {
  idleRpm: 800,
  stallRpm: 400,
  redlineRpm: 6500,
  peakTorque: 150,
  inertia: 0.16,
  finalDrive: 4.1,
  efficiency: 0.9,
  ratios: { '1': 3.55, '2': 1.9, '3': 1.31, '4': 0.97, '5': 0.82, R: -3.25 } as Record<string, number>,
  /** Automatic gearbox virtual ratios used in D. */
  autoRatios: [2.9, 1.6, 1.05, 0.75],
} as const;

/**
 * Clutch pedal, expressed as release fraction (0 = pedal on the floor, 1 = foot off).
 * Torque starts to transfer in the bite zone at 40-50% release.
 */
export const CLUTCH = {
  biteStart: 0.4,
  biteEnd: 0.5,
  fullEngage: 0.8,
  biteTorque: 60,
  maxTorque: 320,
  /** Pedal must be pressed past this depth to change gear with the engine running. */
  shiftPressed: 0.7,
} as const;

export const GEARS: Record<Transmission, Gear[]> = {
  B1: ['P', 'R', 'N', 'D'],
  B2: ['1', '2', '3', '4', '5', 'R', 'N'],
};

export const PASS_SCORE = 80;
export const START_SCORE = 100;

/** Hill-start course: the start side of the ring road, running along +Z, 10% grade. */
export const HILL = {
  centerX: -49.9,
  /** The whole road climbs: two lanes between the kerbs. */
  width: 7.6,
  rampStartZ: 6.3,
  rampLength: 15,
  height: 1.5,
  plateauLength: 6,
  stopLineZ: 12.1,
  stopLineWidth: 0.2,
  /** Front bumper must stop within this distance before the line. */
  stopTolerance: 0.5,
  rollbackLimit: 0.5,
  timeLimit: 30,
  finishZ: 45.3,
} as const;

/**
 * Reverse bay parking course: a dead-end lane along +X entered from the centre road; the bay opens
 * on its -Z side, the driver's left. Lane and bay values are the centres of the sensor lines.
 */
export const PARKING = {
  laneBayZ: -26.85,
  laneFarZ: -21.55,
  laneStartX: 9,
  laneEndX: 34.35,
  bayCenterX: 24.05,
  bayWidth: 2.5,
  bayDepth: 5.6,
  /** The exercise starts when the front bumper crosses this line and ends when the car is back out. */
  entryX: 10,
  lineWidth: 0.12,
  timeLimit: 120,
  lineHoldInterval: 5,
} as const;

export interface SpawnPoint {
  x: number;
  z: number;
  /** Heading in radians around +Y, 0 = facing +Z. */
  heading: number;
}

/**
 * Road test course: a straight two-lane road along +Z, right-hand traffic, so the driving lane
 * is on -X. Distances are metres from the start line at z = 0.
 */
export const ROAD = {
  length: 2000,
  laneWidth: 3.5,
  shoulder: 1.5,
  /** Asphalt half width: one lane plus its shoulder. Beyond it is the kerb. */
  halfWidth: 5,
  laneX: -1.75,
  oncomingX: 1.75,
  speedLimitKmh: 40,
  /** The left signal must be off again once the car has moved this far. */
  departClear: 5,
  speedUp: { from: 200, to: 300, minKmh: 24, gear: 3 },
  slowDown: { from: 700, to: 800, maxKmh: 20 },
  obstacleAt: 1100,
  finishFrom: 1800,
  /** Car centre at or right of this line counts as pulled over to the shoulder. */
  pullOverX: -3.2,
  /** Seconds allowed after stopping to select neutral and apply the handbrake. */
  settleTime: 5,
} as const;

export const ROAD_STEPS = ['Xuất phát', 'Tăng số tăng tốc', 'Giảm số giảm tốc', 'Chướng ngại vật', 'Kết thúc'] as const;

export const NPC = { length: 4.3, width: 1.75 } as const;

/** Driving lane of the start side of the ring road: its right-hand lane. */
const START_LANE_X = HILL.centerX - HILL.width / 4;

export const SPAWNS: Record<Scenario, SpawnPoint> = {
  // Behind the start line.
  free: { x: START_LANE_X, z: -27, heading: 0 },
  // Just before the pedestrian crossing, the exercise ahead of the slope.
  hill: { x: START_LANE_X, z: -11.2, heading: 0 },
  // On the centre road, facing into the parking lane.
  parking: { x: 3.5, z: (PARKING.laneBayZ + PARKING.laneFarZ) / 2, heading: Math.PI / 2 },
  road: { x: ROAD.laneX, z: 0, heading: 0 },
};

export const SCENARIO_LABELS: Record<Scenario, { title: string; subtitle: string }> = {
  free: { title: 'Free Roam', subtitle: 'Tập lái tự do trên sân, không chấm điểm' },
  hill: { title: 'Đề-pa Dốc', subtitle: 'Dừng và khởi hành xe ngang dốc 10%' },
  parking: { title: 'Ghép Chuồng Dọc', subtitle: 'Ghép xe dọc vào nơi đỗ (lùi chuồng)' },
  road: { title: 'Thi Đường Trường', subtitle: 'Lái 2 km trên đường giao thông theo lệnh sát hạch viên' },
};

const bayMinX = PARKING.bayCenterX - PARKING.bayWidth / 2;
const bayMaxX = PARKING.bayCenterX + PARKING.bayWidth / 2;
const bayBackZ = PARKING.laneBayZ - PARKING.bayDepth;
const hillMinX = HILL.centerX - HILL.width / 2;
const hillMaxX = HILL.centerX + HILL.width / 2;

export const PARKING_BAY = { minX: bayMinX, maxX: bayMaxX, minZ: bayBackZ, maxZ: PARKING.laneBayZ } as const;

const sensor = (id: string, ax: number, az: number, bx: number, bz: number): TrackLine => ({
  id,
  kind: 'sensor',
  a: { x: ax, z: az },
  b: { x: bx, z: bz },
  width: PARKING.lineWidth,
});

export const TRACK_LINES: TrackLine[] = [
  // Parking: lane edges and bay outline are chip sensor lines.
  sensor('park-lane-far', PARKING.laneStartX, PARKING.laneFarZ, PARKING.laneEndX, PARKING.laneFarZ),
  sensor('park-lane-bay-a', PARKING.laneStartX, PARKING.laneBayZ, bayMinX, PARKING.laneBayZ),
  sensor('park-lane-bay-b', bayMaxX, PARKING.laneBayZ, PARKING.laneEndX, PARKING.laneBayZ),
  sensor('park-lane-end', PARKING.laneEndX, PARKING.laneBayZ, PARKING.laneEndX, PARKING.laneFarZ),
  sensor('park-bay-side-a', bayMinX, bayBackZ, bayMinX, PARKING.laneBayZ),
  sensor('park-bay-side-b', bayMaxX, bayBackZ, bayMaxX, PARKING.laneBayZ),
  sensor('park-bay-back', bayMinX, bayBackZ, bayMaxX, bayBackZ),
  {
    id: 'park-entry',
    kind: 'gate',
    a: { x: PARKING.entryX, z: PARKING.laneBayZ },
    b: { x: PARKING.entryX, z: PARKING.laneFarZ },
    width: 0.15,
  },
  // Hill: stop line and finish.
  {
    id: 'hill-stop',
    kind: 'stop',
    a: { x: hillMinX + 0.3, z: HILL.stopLineZ + HILL.stopLineWidth / 2 },
    b: { x: hillMaxX - 0.3, z: HILL.stopLineZ + HILL.stopLineWidth / 2 },
    width: HILL.stopLineWidth,
  },
  {
    id: 'hill-finish',
    kind: 'gate',
    a: { x: hillMinX + 0.3, z: HILL.finishZ },
    b: { x: hillMaxX - 0.3, z: HILL.finishZ },
    width: 0.15,
  },
];

/** Ground height of the hill course at a given z (0 outside the ramp). */
export function hillHeightAt(z: number): number {
  const upEnd = HILL.rampStartZ + HILL.rampLength;
  const downStart = upEnd + HILL.plateauLength;
  const downEnd = downStart + HILL.rampLength;
  if (z <= HILL.rampStartZ || z >= downEnd) return 0;
  if (z < upEnd) return ((z - HILL.rampStartZ) / HILL.rampLength) * HILL.height;
  if (z <= downStart) return HILL.height;
  return (1 - (z - downStart) / HILL.rampLength) * HILL.height;
}
