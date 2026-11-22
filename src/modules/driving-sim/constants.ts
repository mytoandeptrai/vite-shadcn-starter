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

/** Hill-start course: runs along +Z, 10% grade. */
export const HILL = {
  centerX: -14,
  width: 4.6,
  rampStartZ: 0,
  rampLength: 15,
  height: 1.5,
  plateauLength: 6,
  stopLineZ: 9,
  stopLineWidth: 0.2,
  /** Front bumper must stop within this distance before the line. */
  stopTolerance: 0.5,
  rollbackLimit: 0.5,
  timeLimit: 30,
  finishZ: 39,
} as const;

/** Reverse bay parking course: lane runs along +Z, bay opens on the right (-X). */
export const PARKING = {
  laneLeftX: 16.65,
  laneRightX: 11.35,
  laneStartZ: -4,
  laneEndZ: 24,
  bayCenterZ: 10,
  bayWidth: 2.5,
  bayDepth: 5.6,
  entryZ: -2,
  exitZ: 22,
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

export const SPAWNS: Record<Scenario, SpawnPoint> = {
  free: { x: 0, z: -22, heading: 0 },
  hill: { x: HILL.centerX, z: -9, heading: 0 },
  parking: { x: 14.4, z: -9, heading: 0 },
  road: { x: ROAD.laneX, z: 0, heading: 0 },
};

export const SCENARIO_LABELS: Record<Scenario, { title: string; subtitle: string }> = {
  free: { title: 'Free Roam', subtitle: 'Tập lái tự do trên sân, không chấm điểm' },
  hill: { title: 'Đề-pa Dốc', subtitle: 'Dừng và khởi hành xe ngang dốc 10%' },
  parking: { title: 'Ghép Chuồng Dọc', subtitle: 'Ghép xe dọc vào nơi đỗ (lùi chuồng)' },
  road: { title: 'Thi Đường Trường', subtitle: 'Lái 2 km trên đường giao thông theo lệnh sát hạch viên' },
};

const bayMinZ = PARKING.bayCenterZ - PARKING.bayWidth / 2;
const bayMaxZ = PARKING.bayCenterZ + PARKING.bayWidth / 2;
const bayBackX = PARKING.laneRightX - PARKING.bayDepth;
const hillMinX = HILL.centerX - HILL.width / 2;
const hillMaxX = HILL.centerX + HILL.width / 2;

export const PARKING_BAY = { minX: bayBackX, maxX: PARKING.laneRightX, minZ: bayMinZ, maxZ: bayMaxZ } as const;

const sensor = (id: string, ax: number, az: number, bx: number, bz: number): TrackLine => ({
  id,
  kind: 'sensor',
  a: { x: ax, z: az },
  b: { x: bx, z: bz },
  width: PARKING.lineWidth,
});

export const TRACK_LINES: TrackLine[] = [
  // Parking: lane edges and bay outline are chip sensor lines.
  sensor('park-lane-left', PARKING.laneLeftX, PARKING.laneStartZ, PARKING.laneLeftX, PARKING.laneEndZ),
  sensor('park-lane-right-a', PARKING.laneRightX, PARKING.laneStartZ, PARKING.laneRightX, bayMinZ),
  sensor('park-lane-right-b', PARKING.laneRightX, bayMaxZ, PARKING.laneRightX, PARKING.laneEndZ),
  sensor('park-bay-side-a', bayBackX, bayMinZ, PARKING.laneRightX, bayMinZ),
  sensor('park-bay-side-b', bayBackX, bayMaxZ, PARKING.laneRightX, bayMaxZ),
  sensor('park-bay-back', bayBackX, bayMinZ, bayBackX, bayMaxZ),
  {
    id: 'park-entry',
    kind: 'gate',
    a: { x: PARKING.laneRightX, z: PARKING.entryZ },
    b: { x: PARKING.laneLeftX, z: PARKING.entryZ },
    width: 0.15,
  },
  {
    id: 'park-exit',
    kind: 'gate',
    a: { x: PARKING.laneRightX, z: PARKING.exitZ },
    b: { x: PARKING.laneLeftX, z: PARKING.exitZ },
    width: 0.15,
  },
  // Hill: stop line and lane edges.
  {
    id: 'hill-stop',
    kind: 'stop',
    a: { x: hillMinX + 0.3, z: HILL.stopLineZ + HILL.stopLineWidth / 2 },
    b: { x: hillMaxX - 0.3, z: HILL.stopLineZ + HILL.stopLineWidth / 2 },
    width: HILL.stopLineWidth,
  },
  {
    id: 'hill-edge-left',
    kind: 'marking',
    a: { x: hillMaxX - 0.25, z: -10 },
    b: { x: hillMaxX - 0.25, z: HILL.finishZ },
    width: 0.12,
  },
  {
    id: 'hill-edge-right',
    kind: 'marking',
    a: { x: hillMinX + 0.25, z: -10 },
    b: { x: hillMinX + 0.25, z: HILL.finishZ },
    width: 0.12,
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
