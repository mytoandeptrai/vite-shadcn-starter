import { HILL } from '../constants';
import type { Vec2 } from '../types';
import {
  type Arrow,
  type ArrowKind,
  CENTRE_ROAD,
  CROSS_ROAD,
  kerbBlocks,
  LINE_INSET,
  type Mark,
  type MarkColor,
  RING,
  roundPath,
} from './yard';

/** Painted road markings of the sa hình yard. Everything here is decoration: scoring uses TRACK_LINES. */

const HALF = RING.width / 2;
/** Painted lines stop this far from the kerb. */
const EDGE = 0.25;
const ringMinX = RING.minX - HALF + EDGE;
const ringMaxX = RING.minX + HALF - EDGE;
const topMinZ = RING.maxZ - HALF + EDGE;
const topMaxZ = RING.maxZ + HALF - EDGE;
const botMinZ = RING.minZ - HALF + EDGE;
const botMaxZ = RING.minZ + HALF - EDGE;
const cx = CENTRE_ROAD.x;
const cz = CROSS_ROAD.z;

const marks: Mark[] = [];
const polygons: { points: Vec2[]; color: MarkColor }[] = [];
const arrows: Arrow[] = [];

function line(ax: number, az: number, bx: number, bz: number, color: MarkColor = 'white', width = 0.12) {
  marks.push({ a: { x: ax, z: az }, b: { x: bx, z: bz }, width, color });
}

function dashed(ax: number, az: number, bx: number, bz: number, dash: number, gap: number, color: MarkColor = 'white') {
  const len = Math.hypot(bx - ax, bz - az);
  const ux = (bx - ax) / len;
  const uz = (bz - az) / len;
  for (let at = 0; at < len; at += dash + gap) {
    const end = Math.min(len, at + dash);
    line(ax + ux * at, az + uz * at, ax + ux * end, az + uz * end, color);
  }
}

function path(points: Vec2[], color: MarkColor) {
  for (let i = 0; i < points.length - 1; i++) line(points[i].x, points[i].z, points[i + 1].x, points[i + 1].z, color);
}

/** Pedestrian crossing: stripes running along the road, laid across it from `from` to `to`. */
function zebra(along: 'x' | 'z', start: number, end: number, from: number, to: number) {
  const mid = (start + end) / 2;
  const count = Math.max(2, Math.round((to - from) / 1.15));
  const pitch = (to - from) / count;
  for (let i = 0; i < count; i++) {
    const at = from + pitch * (i + 0.5);
    if (along === 'z') marks.push({ a: { x: at, z: start }, b: { x: at, z: end }, width: 0.5, color: 'white' });
    else marks.push({ a: { x: start, z: at }, b: { x: end, z: at }, width: 0.5, color: 'white' });
  }
  return mid;
}

/** Keep-clear box: a border with diagonal stripes. */
function hatch(minX: number, maxX: number, minZ: number, maxZ: number) {
  line(minX, minZ, maxX, minZ);
  line(maxX, minZ, maxX, maxZ);
  line(maxX, maxZ, minX, maxZ);
  line(minX, maxZ, minX, minZ);
  const w = maxX - minX;
  const h = maxZ - minZ;
  // Stripes follow x - z = c; clip each to the box.
  for (let c = -h + 1.2; c < w; c += 1.2) {
    const x0 = Math.max(0, c);
    const x1 = Math.min(w, c + h);
    if (x1 - x0 < 0.3) continue;
    marks.push({
      a: { x: minX + x0, z: minZ + x0 - c },
      b: { x: minX + x1, z: minZ + x1 - c },
      width: 0.3,
      color: 'white',
    });
  }
}

function arrow(x: number, z: number, heading: number, kind: ArrowKind = 'straight') {
  arrows.push({ x, z, heading, kind });
}

const NORTH = 0;
const EAST = Math.PI / 2;
const SOUTH = Math.PI;
const WEST = -Math.PI / 2;

// --- Start side of the ring (two lanes, one way, heading +Z) -------------------------------------
const hillEnd = HILL.rampStartZ + HILL.rampLength * 2 + HILL.plateauLength;
line(RING.minX, -49.5, RING.minX, -8.6);
line(RING.minX, -2.4, RING.minX, HILL.rampStartZ);
dashed(RING.minX, HILL.rampStartZ + 1, RING.minX, hillEnd, 1, 3);
line(RING.minX, hillEnd, RING.minX, 47.5);
// Bài 1: start line.
line(ringMinX, -22.5, ringMaxX, -22.5, 'white', 0.25);
// Bài 2: pedestrian crossing with its stop line and the yellow line that helps judge the distance.
line(ringMinX, -12.45, ringMaxX, -12.45, 'yellow');
line(ringMinX, -8.4, ringMaxX, -8.4, 'white', 0.4);
zebra('z', -6.6, -2.6, ringMinX, ringMaxX);
// Bài 3: the same yellow helper before the stop line on the slope.
line(ringMinX, HILL.stopLineZ - 4.1, ringMaxX, HILL.stopLineZ - 4.1, 'yellow');
for (const x of [RING.minX - HALF / 2, RING.minX + HALF / 2]) {
  arrow(x, -19.5, NORTH);
  arrow(x, 0.3, NORTH);
  arrow(x, 43.6, NORTH, 'left');
}

// --- Top of the ring (one way, heading +X) -------------------------------------------------------
dashed(-44, RING.maxZ, -31, RING.maxZ, 1, 3);
line(-31, RING.maxZ, -14.7, RING.maxZ);
hatch(-14.5, 0.3, topMinZ, topMaxZ);
line(7.8, RING.maxZ, 28.3, RING.maxZ);
arrow(-30.5, RING.maxZ - HALF / 2, EAST, 'straight-left');
arrow(-22.6, RING.maxZ - HALF / 2, EAST, 'left');
// Bài 8: railway crossing.
line(24.4, topMinZ, 24.4, topMaxZ, 'yellow');
line(28.5, topMinZ, 28.5, topMaxZ, 'white', 0.4);
for (const z of [RING.maxZ - HALF / 2, RING.maxZ + HALF / 2]) {
  arrow(15.5, z, EAST);
  arrow(40.5, z, EAST, 'left');
}

// --- Far side and bottom of the ring (two way, yellow centre line) -------------------------------
dashed(RING.maxX, 50, RING.maxX, 37, 3, 3, 'yellow');
line(RING.maxX, 37, RING.maxX, 7.2, 'yellow');
const corner = roundPath(
  [
    { x: RING.maxX, z: -1.2 },
    { x: RING.maxX, z: RING.minZ, r: RING.radius },
    { x: 43, z: RING.minZ },
  ],
  false
);
path(corner, 'yellow');
dashed(43, RING.minZ, 20, RING.minZ, 3, 3, 'yellow');
line(20, RING.minZ, 8, RING.minZ, 'yellow');
// Gore where the cross road joins: a striped triangle with its tip pointing down the cross road.
const goreTip = RING.maxX - 3.3;
line(RING.maxX, cz + 3.3, RING.maxX, cz - 3.3);
line(RING.maxX, cz + 3.3, goreTip, cz);
line(RING.maxX, cz - 3.3, goreTip, cz);
for (const t of [0.25, 0.5, 0.75]) {
  // Each stripe runs from the base towards the lower edge of the triangle.
  const z = cz + 3.3 - t * 6.6 * 0.8;
  const reach = Math.min(1.5, 3.3 * (1 - Math.abs(z - 1.2 - cz) / 3.3) * 0.8);
  marks.push({ a: { x: RING.maxX, z }, b: { x: RING.maxX - reach, z: z - reach }, width: 0.25, color: 'white' });
}
arrow(RING.maxX - HALF / 2, 25, NORTH, 'right');
arrow(RING.maxX - HALF / 2, 12.6, NORTH, 'straight-right');
arrow(RING.maxX - HALF / 2, -6.6, NORTH, 'right');
arrow(RING.maxX - HALF / 2, -37.5, NORTH, 'straight-right');
arrow(RING.maxX + HALF / 2, -44, SOUTH, 'left');
arrow(RING.maxX + HALF / 2, 26, SOUTH);
hatch(-7, 0.3, botMinZ, botMaxZ);
line(-7.2, RING.minZ, -44, RING.minZ);
// Bài 11: finish line.
line(-28, botMinZ, -28, botMaxZ, 'red', 0.25);
arrow(14, RING.minZ - HALF / 2, WEST, 'left');
arrow(38, RING.minZ + HALF / 2, EAST, 'right');
for (const z of [RING.minZ - HALF / 2, RING.minZ + HALF / 2]) arrow(-13, z, WEST);
arrow(-30.5, RING.minZ + HALF / 2, WEST, 'left');
arrow(-30.5, RING.minZ - HALF / 2, WEST);

// --- Centre road and cross road, bài 5: the crossroads with traffic lights -----------------------
line(cx, 53.4, cx, 11.6, 'yellow');
line(cx, -5.5, cx, -53, 'yellow');
line(12.6, cz, 45.5, cz, 'yellow');
line(-4.6, cz, -23.4, cz, 'yellow');
const lane = HALF - EDGE;
// North arm (traffic heading -Z keeps to +X).
zebra('z', 7.9, 10.9, cx - lane, cx + lane);
line(cx, 11.6, cx + lane, 11.6, 'white', 0.4);
line(cx, 15.6, cx + lane, 15.6, 'yellow');
// South arm.
zebra('z', -4.9, -1.9, cx - lane, cx + lane);
line(cx - lane, -5.5, cx, -5.5, 'white', 0.4);
line(cx - lane, -9.7, cx, -9.7, 'yellow');
// East arm (+X): traffic heading -X keeps to -Z.
zebra('x', 9, 12, cz - lane, cz + lane);
line(12.6, cz - lane, 12.6, cz, 'white', 0.4);
line(16.7, cz - lane, 16.7, cz, 'yellow');
// West arm.
zebra('x', -4, -1, cz - lane, cz + lane);
line(-4.6, cz, -4.6, cz + lane, 'white', 0.4);
line(-8.7, cz, -8.7, cz + lane, 'yellow');
arrow(cx + HALF / 2, 21, SOUTH);
arrow(cx - HALF / 2, 46, NORTH, 'left');
arrow(cx - HALF / 2, -17.5, NORTH);
arrow(cx + HALF / 2, -17, SOUTH, 'straight-right');
arrow(cx - HALF / 2, -51, NORTH, 'straight-right');
arrow(cx + HALF / 2, -45, SOUTH, 'right');
arrow(21, cz - HALF / 2, WEST, 'left');
arrow(38.5, cz + HALF / 2, EAST, 'right');
arrow(-13.6, cz + HALF / 2, EAST);
// One-way road down to the finish straight.
arrow(-9.8, -19.5, SOUTH);
arrow(-9.8, -45.5, SOUTH, 'left');

// --- Bài 4: wheel track and right-angle turns ----------------------------------------------------
line(-18.6, 51.2, -14.9, 51.2, 'yellow');
line(-26.9, 51.2, -22.1, 51.2, 'yellow');
for (const x of [-15.2, -15.75]) line(x, 27.6, x, 19.6, 'yellow', 0.1);
for (const x of [-22.4, -23.3]) line(x, 40.7, x, 32.7, 'yellow', 0.1);
line(-27.5, 9.7, -23.7, 9.7, 'yellow');
line(-42.9, 12.5, -38.1, 12.5, 'yellow');
arrow(-25.6, 9, SOUTH, 'right');
arrow(-40.5, 11.8, SOUTH, 'right');

// --- Bài 6: S-curves -----------------------------------------------------------------------------
line(9.3, 45.95, 9.3, 49.95, 'yellow');
line(9.3, 37.75, 9.3, 42.65, 'yellow');
line(43.2, 28.45, 43.2, 32.45, 'yellow');
line(43.2, 13.85, 43.2, 18.75, 'yellow');
// The curves are driven from the ring towards the centre road.
arrow(15.5, 47.95, WEST, 'right');
arrow(15.5, 40.2, WEST, 'right');

// --- Bài 7 and 10: parking --------------------------------------------------------------------------
// The way out of the dead-end lane.
arrow(15.5, -24.2, WEST, 'right');
const pocket = (minX: number, maxX: number, minZ: number, maxZ: number) => {
  line(minX, minZ, maxX, minZ, 'yellow');
  line(maxX, minZ, maxX, maxZ, 'yellow');
  line(maxX, maxZ, minX, maxZ, 'yellow');
  line(minX, maxZ, minX, minZ, 'yellow');
  line(minX, minZ + (maxZ - minZ) * 0.25, maxX, minZ + (maxZ - minZ) * 0.25, 'yellow');
};
pocket(39.85, 42.8, -29.3, -15.6);
pocket(-5, -2.75, -26.5, -19.8);
pocket(-5, -2.75, -42.4, -35.7);
dashed(45.6, -33.5, 45.6, -11, 1, 2.2);
dashed(0.3, -46.5, 0.3, -13.2, 1, 2.2);
// Car park stalls.
for (let z = -23; z >= -48; z -= 2.5) line(-24.2, z, -19.5, z);

// White edge lines just inside every kerb.
for (const block of kerbBlocks()) {
  marks.push({
    a: { x: block.a.x - block.out.x * LINE_INSET, z: block.a.z - block.out.z * LINE_INSET },
    b: { x: block.b.x - block.out.x * LINE_INSET, z: block.b.z - block.out.z * LINE_INSET },
    width: 0.1,
    color: 'white',
  });
}

/** Arrow outlines in arrow space: +z ahead, +x to the left, origin at the tail. Each is a convex piece. */
function arrowPieces(kind: ArrowKind): [number, number][][] {
  const shaft = (to: number): [number, number][] => [
    [-0.08, 0],
    [0.08, 0],
    [0.08, to],
    [-0.08, to],
  ];
  const head: [number, number][] = [
    [-0.32, 2.4],
    [0.32, 2.4],
    [0, 3.6],
  ];
  // A branch that leaves the shaft at `at` and points diagonally to the side `s` (1 = left).
  const branch = (s: number, at: number): [number, number][][] => [
    [
      [0, at - 0.12],
      [0, at + 0.12],
      [s * 0.7, at + 0.72],
      [s * 0.7, at + 0.48],
    ],
    [
      [s * 0.45, at + 0.95],
      [s * 0.9, at + 0.2],
      [s * 1.35, at + 1.2],
    ],
  ];
  if (kind === 'straight') return [shaft(2.4), head];
  if (kind === 'left') return [shaft(2.1), ...branch(1, 2)];
  if (kind === 'right') return [shaft(2.1), ...branch(-1, 2)];
  return [shaft(2.4), head, ...branch(kind === 'straight-left' ? 1 : -1, 1)];
}

for (const a of arrows) {
  const fx = Math.sin(a.heading);
  const fz = Math.cos(a.heading);
  for (const piece of arrowPieces(a.kind)) {
    polygons.push({
      color: 'white',
      points: piece.map(([left, ahead]) => ({ x: a.x + fx * ahead + fz * left, z: a.z + fz * ahead - fx * left })),
    });
  }
}

export const MARKS: readonly Mark[] = marks;
/** Filled convex shapes: the direction arrows. */
export const MARK_POLYGONS: readonly { points: Vec2[]; color: MarkColor }[] = polygons;

export interface GroundText {
  text: string;
  x: number;
  z: number;
  /** Direction the text is read from: the heading of the traffic it faces. */
  heading: number;
  width: number;
  color: MarkColor;
}

export const GROUND_TEXTS: GroundText[] = [
  { text: 'XUẤT PHÁT', x: RING.minX - HALF / 2, z: -24.6, heading: NORTH, width: 3, color: 'white' },
  { text: 'DỪNG', x: RING.minX, z: -10.4, heading: NORTH, width: 2.2, color: 'white' },
  { text: 'DỪNG', x: 26.5, z: RING.maxZ, heading: EAST, width: 2.2, color: 'white' },
  { text: 'KẾT THÚC', x: -25.6, z: RING.minZ, heading: WEST, width: 3, color: 'white' },
];
