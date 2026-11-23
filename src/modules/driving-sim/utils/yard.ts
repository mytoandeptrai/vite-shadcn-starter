import { PARKING, PARKING_BAY } from '../constants';
import type { Vec2 } from '../types';

/**
 * The sa hình yard as plain 2D geometry (metres, world X/Z; heading 0 faces +Z and +X is the car's left).
 * It follows the usual 11-exercise yard: a two-lane ring road driven anticlockwise seen from above
 * (up the -X side, along +Z, down the +X side, back along -Z) with the exercises on and inside it.
 */

export interface Corner extends Vec2 {
  /** Rounding radius of this corner. */
  r?: number;
}

export type Surface = 'asphalt' | 'paving';

export interface Pavement {
  id: string;
  surface: Surface;
  /** Boundary loops. A closed road has two: its outer and inner edge. */
  loops: Vec2[][];
  /** Roads keep their two edges so they can be meshed as a ribbon. */
  ribbon?: { left: Vec2[]; right: Vec2[]; closed: boolean };
}

export type MarkColor = 'white' | 'yellow' | 'red';

export interface Mark {
  a: Vec2;
  b: Vec2;
  width: number;
  color: MarkColor;
}

export interface KerbBlock {
  a: Vec2;
  b: Vec2;
  /** Unit vector pointing away from the asphalt. */
  out: Vec2;
  red: boolean;
}

export type ArrowKind = 'straight' | 'left' | 'right' | 'straight-left' | 'straight-right';

export interface Arrow extends Vec2 {
  heading: number;
  kind: ArrowKind;
}

export const KERB = { width: 0.3, height: 0.1, block: 1 } as const;
/** Painted edge lines run this far inside the kerb. */
export const LINE_INSET = 0.15;

const ARC_STEP = Math.PI / 18;

function norm(x: number, z: number): Vec2 {
  const len = Math.hypot(x, z) || 1;
  return { x: x / len, z: z / len };
}

/** Polyline through `points`, with each corner that has a radius replaced by an arc. */
export function roundPath(points: Corner[], closed: boolean): Vec2[] {
  const out: Vec2[] = [];
  const n = points.length;
  // Two arcs that meet share a point; keeping it once keeps every segment a real direction.
  const add = (x: number, z: number) => {
    const last = out[out.length - 1];
    if (!last || Math.hypot(last.x - x, last.z - z) > 1e-4) out.push({ x, z });
  };
  for (let i = 0; i < n; i++) {
    const p = points[i];
    const inner = closed || (i > 0 && i < n - 1);
    if (!p.r || !inner) {
      add(p.x, p.z);
      continue;
    }
    const a = points[(i - 1 + n) % n];
    const b = points[(i + 1) % n];
    const lenA = Math.hypot(a.x - p.x, a.z - p.z);
    const lenB = Math.hypot(b.x - p.x, b.z - p.z);
    const ua = norm(a.x - p.x, a.z - p.z);
    const ub = norm(b.x - p.x, b.z - p.z);
    const angle = Math.acos(Math.max(-1, Math.min(1, ua.x * ub.x + ua.z * ub.z)));
    const turn = Math.PI - angle;
    if (turn < 1e-3) {
      add(p.x, p.z);
      continue;
    }
    const half = Math.tan(angle / 2);
    const t = Math.min(p.r / half, lenA, lenB);
    const r = t * half;
    const bis = norm(ua.x + ub.x, ua.z + ub.z);
    const cx = p.x + (bis.x * r) / Math.sin(angle / 2);
    const cz = p.z + (bis.z * r) / Math.sin(angle / 2);
    const from = Math.atan2(p.z + ua.z * t - cz, p.x + ua.x * t - cx);
    const to = Math.atan2(p.z + ub.z * t - cz, p.x + ub.x * t - cx);
    let sweep = to - from;
    while (sweep > Math.PI) sweep -= 2 * Math.PI;
    while (sweep < -Math.PI) sweep += 2 * Math.PI;
    const steps = Math.max(2, Math.ceil(Math.abs(sweep) / ARC_STEP));
    for (let s = 0; s <= steps; s++) {
      const at = from + (sweep * s) / steps;
      add(cx + Math.cos(at) * r, cz + Math.sin(at) * r);
    }
  }
  return out;
}

/** The path moved `d` metres to its left (negative: right), mitred at the joints. */
export function offsetPath(path: Vec2[], d: number, closed: boolean): Vec2[] {
  const n = path.length;
  return path.map((p, i) => {
    const prev = closed ? path[(i - 1 + n) % n] : path[Math.max(0, i - 1)];
    const next = closed ? path[(i + 1) % n] : path[Math.min(n - 1, i + 1)];
    const before = i === 0 && !closed ? norm(next.x - p.x, next.z - p.z) : norm(p.x - prev.x, p.z - prev.z);
    const after = i === n - 1 && !closed ? before : norm(next.x - p.x, next.z - p.z);
    // Left of a direction (dx, dz) is (dz, -dx).
    const m = norm(before.z + after.z, -(before.x + after.x));
    const cos = m.x * before.z - m.z * before.x;
    const k = d / Math.max(0.3, cos);
    return { x: p.x + m.x * k, z: p.z + m.z * k };
  });
}

function road(id: string, points: Corner[], width: number, closed = false): Pavement {
  const centre = roundPath(points, closed);
  const left = offsetPath(centre, width / 2, closed);
  const right = offsetPath(centre, -width / 2, closed);
  return {
    id,
    surface: 'asphalt',
    loops: closed ? [left, right] : [[...left, ...[...right].reverse()]],
    ribbon: { left, right, closed },
  };
}

function area(id: string, points: Corner[], surface: Surface = 'asphalt'): Pavement {
  return { id, surface, loops: [roundPath(points, true)] };
}

/**
 * Rounds the kerb where two roads meet at `(x, z)`: fills the corner towards `(sx, sz)` up to an
 * arc of radius `r`. It reaches a little into both roads so the three pieces overlap cleanly.
 */
function fillet(x: number, z: number, sx: 1 | -1, sz: 1 | -1, r: number): Pavement {
  const lap = 0.4;
  const loop: Vec2[] = [
    { x: x - sx * lap, z: z - sz * lap },
    { x: x + sx * r, z: z - sz * lap },
  ];
  const steps = 9;
  for (let s = 0; s <= steps; s++) {
    const at = (s / steps) * (Math.PI / 2);
    loop.push({ x: x + sx * r - sx * r * Math.sin(at), z: z + sz * r - sz * r * Math.cos(at) });
  }
  loop.push({ x: x - sx * lap, z: z + sz * r });
  return { id: `fillet:${x}:${z}`, surface: 'asphalt', loops: [loop] };
}

/** Ring road: centre line of its four sides and the rounding of its corners. */
export const RING = { minX: -49.9, maxX: 49.5, minZ: -56.85, maxZ: 57.5, width: 7.6, radius: 7.2 } as const;
const HALF = RING.width / 2;
/** Inner kerb lines of the ring road. */
const IN = { minX: RING.minX + HALF, maxX: RING.maxX - HALF, minZ: RING.minZ + HALF, maxZ: RING.maxZ - HALF };
/** Centre road (through the crossroads) and cross road. */
export const CENTRE_ROAD = { x: 4, width: 7.6 } as const;
export const CROSS_ROAD = { z: 3, width: 7.6 } as const;
const CR = { minX: CENTRE_ROAD.x - HALF, maxX: CENTRE_ROAD.x + HALF };
const XR = { minZ: CROSS_ROAD.z - HALF, maxZ: CROSS_ROAD.z + HALF };

const ringCorners: Corner[] = [
  { x: RING.minX, z: RING.minZ, r: RING.radius },
  { x: RING.minX, z: RING.maxZ, r: RING.radius },
  { x: RING.maxX, z: RING.maxZ, r: RING.radius },
  { x: RING.maxX, z: RING.minZ, r: RING.radius },
];

export const PAVEMENTS: Pavement[] = [
  road('ring', ringCorners, RING.width, true),
  road(
    'centre',
    [
      { x: CENTRE_ROAD.x, z: RING.maxZ },
      { x: CENTRE_ROAD.x, z: RING.minZ },
    ],
    CENTRE_ROAD.width
  ),
  road(
    'cross',
    [
      { x: RING.maxX, z: CROSS_ROAD.z },
      { x: -39.3, z: CROSS_ROAD.z },
    ],
    CROSS_ROAD.width
  ),
  area('cross-end', [
    { x: -39.5, z: XR.maxZ },
    { x: -43.1, z: XR.maxZ },
    { x: -43.1, z: XR.minZ, r: 3.4 },
    { x: -39.5, z: XR.minZ },
  ]),
  // One-way road from the cross road down to the finish straight.
  road(
    'second',
    [
      { x: -9.8, z: CROSS_ROAD.z },
      { x: -9.8, z: RING.minZ },
    ],
    6
  ),
  // Bài 4: wheel track and right-angle turns, a narrow lane for cars and a wider one beside it.
  road(
    'angle-car',
    [
      { x: -16.75, z: RING.maxZ },
      { x: -16.75, z: 14.45 },
      { x: -25.6, z: 14.45 },
      { x: -25.6, z: CROSS_ROAD.z },
    ],
    4.1
  ),
  road(
    'angle-truck',
    [
      { x: -24.5, z: RING.maxZ },
      { x: -24.5, z: 22.15 },
      { x: -40.5, z: 22.15 },
      { x: -40.5, z: CROSS_ROAD.z },
    ],
    5.2
  ),
  // Bài 6: S-curves from the centre road across to the +X side of the ring.
  road(
    'curve-car',
    [
      { x: CENTRE_ROAD.x, z: 47.95 },
      { x: 41.075, z: 47.95, r: 4.375 },
      { x: 41.075, z: 39.2, r: 4.375 },
      { x: 32.325, z: 39.2, r: 4.375 },
      { x: 32.325, z: 30.45, r: 4.375 },
      { x: RING.maxX, z: 30.45 },
    ],
    4.3
  ),
  road(
    'curve-truck',
    [
      { x: CENTRE_ROAD.x, z: 40.2 },
      { x: 24.65, z: 40.2, r: 5.95 },
      { x: 24.65, z: 28.3, r: 5.95 },
      { x: 12.7, z: 28.3, r: 6 },
      { x: 12.7, z: 16.3, r: 6 },
      { x: RING.maxX, z: 16.3 },
    ],
    5.2
  ),
  // Bài 7: dead-end lane with the reverse bay on its -Z side. The sensor lines sit just inside the kerb.
  area('bay-lane', [
    { x: 6, z: PARKING.laneFarZ + LINE_INSET },
    { x: PARKING.laneEndX + LINE_INSET, z: PARKING.laneFarZ + LINE_INSET },
    { x: PARKING.laneEndX + LINE_INSET, z: PARKING.laneBayZ - LINE_INSET },
    { x: 6, z: PARKING.laneBayZ - LINE_INSET },
  ]),
  area('bay', [
    { x: PARKING_BAY.minX - LINE_INSET, z: PARKING_BAY.maxZ + 0.3 },
    { x: PARKING_BAY.maxX + LINE_INSET, z: PARKING_BAY.maxZ + 0.3 },
    { x: PARKING_BAY.maxX + LINE_INSET, z: PARKING_BAY.minZ - LINE_INSET },
    { x: PARKING_BAY.minX - LINE_INSET, z: PARKING_BAY.minZ - LINE_INSET },
  ]),
  // Car park beside the start line.
  area('car-park', [
    { x: -19.2, z: -20.8, r: 5 },
    { x: -31, z: -20.8, r: 3 },
    { x: -31, z: -26.7, r: 3 },
    { x: -48, z: -26.7 },
    { x: -48, z: -55 },
    { x: -31.2, z: -55 },
    { x: -31.2, z: -49.2, r: 1.9 },
    { x: -19.2, z: -49.2, r: 4 },
  ]),
  // Bài 10: parallel-parking pockets, paved lighter than the road.
  area(
    'pocket-ring',
    [
      { x: IN.maxX, z: -10.2 },
      { x: 42.6, z: -13.4, r: 2 },
      { x: 42.6, z: -15.4 },
      { x: 39.6, z: -15.4 },
      { x: 39.6, z: -29.5 },
      { x: 42.6, z: -29.5 },
      { x: 42.6, z: -31, r: 2 },
      { x: IN.maxX, z: -34.2 },
    ],
    'paving'
  ),
  area(
    'pocket-centre',
    [
      { x: CR.minX, z: -12.4 },
      { x: -2.7, z: -15.4, r: 2 },
      { x: -2.7, z: -19.6 },
      { x: -5.2, z: -19.6 },
      { x: -5.2, z: -26.7 },
      { x: -2.7, z: -26.7 },
      { x: -2.7, z: -35.5 },
      { x: -5.2, z: -35.5 },
      { x: -5.2, z: -42.6 },
      { x: -2.7, z: -42.6 },
      { x: -2.7, z: -44.5, r: 2 },
      { x: CR.minX, z: -47.5 },
    ],
    'paving'
  ),
  // Rounded kerbs at the junctions.
  fillet(CR.maxX, IN.maxZ, 1, -1, 3.4),
  fillet(CR.minX, IN.maxZ, -1, -1, 3.4),
  fillet(CR.maxX, IN.minZ, 1, 1, 3.4),
  fillet(CR.minX, IN.minZ, -1, 1, 3.4),
  fillet(CR.maxX, XR.maxZ, 1, 1, 3.4),
  fillet(CR.minX, XR.maxZ, -1, 1, 3.4),
  fillet(CR.maxX, XR.minZ, 1, -1, 3.4),
  fillet(CR.minX, XR.minZ, -1, -1, 3.4),
  fillet(IN.maxX, XR.maxZ, -1, 1, 3.4),
  fillet(IN.maxX, XR.minZ, -1, -1, 3.4),
  fillet(-6.8, XR.minZ, 1, -1, 3),
  fillet(-12.8, XR.minZ, -1, -1, 3.4),
  fillet(-6.8, IN.minZ, 1, 1, 3.4),
  fillet(-12.8, IN.minZ, -1, 1, 3.4),
  fillet(-14.7, IN.maxZ, 1, -1, 2.5),
  fillet(-18.8, IN.maxZ, -1, -1, 1),
  fillet(-21.9, IN.maxZ, 1, -1, 1),
  fillet(-27.1, IN.maxZ, -1, -1, 2.5),
  fillet(-23.55, XR.maxZ, 1, 1, 1.5),
  fillet(-27.65, XR.maxZ, -1, 1, 1.5),
  fillet(-37.9, XR.maxZ, 1, 1, 2),
  fillet(CR.maxX, 50.1, 1, 1, 1.5),
  fillet(CR.maxX, 45.8, 1, -1, 1.2),
  fillet(CR.maxX, 42.8, 1, 1, 1.2),
  fillet(CR.maxX, 37.6, 1, -1, 2),
  fillet(IN.maxX, 32.6, -1, 1, 2),
  fillet(IN.maxX, 28.3, -1, -1, 2),
  fillet(IN.maxX, 18.9, -1, 1, 2.5),
  fillet(IN.maxX, 13.7, -1, -1, 3.4),
  fillet(CR.maxX, PARKING.laneFarZ + LINE_INSET, 1, 1, 2.5),
  fillet(CR.maxX, PARKING.laneBayZ - LINE_INSET, 1, -1, 2.5),
  fillet(IN.minX, -26.7, 1, 1, 3),
  fillet(-31.2, IN.minZ, 1, 1, 1.9),
];

function inLoop(p: Vec2, loop: Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = loop.length - 1; i < loop.length; j = i++) {
    const a = loop[i];
    const b = loop[j];
    if (a.z > p.z !== b.z > p.z && p.x < ((b.x - a.x) * (p.z - a.z)) / (b.z - a.z) + a.x) inside = !inside;
  }
  return inside;
}

const BOXES = new Map<Pavement, [number, number, number, number]>();
function box(p: Pavement) {
  let b = BOXES.get(p);
  if (!b) {
    const pts = p.loops.flat();
    b = [
      Math.min(...pts.map((v) => v.x)),
      Math.max(...pts.map((v) => v.x)),
      Math.min(...pts.map((v) => v.z)),
      Math.max(...pts.map((v) => v.z)),
    ];
    BOXES.set(p, b);
  }
  return b;
}

export function insidePavement(p: Vec2, pavement: Pavement): boolean {
  const [minX, maxX, minZ, maxZ] = box(pavement);
  if (p.x < minX || p.x > maxX || p.z < minZ || p.z > maxZ) return false;
  let inside = false;
  for (const loop of pavement.loops) if (inLoop(p, loop)) inside = !inside;
  return inside;
}

/** True when the point is on any paved surface of the yard. */
export function onPavement(p: Vec2): boolean {
  return PAVEMENTS.some((pavement) => insidePavement(p, pavement));
}

function distanceToBlock(p: Vec2, block: KerbBlock): number {
  const dx = block.b.x - block.a.x;
  const dz = block.b.z - block.a.z;
  const t = Math.max(0, Math.min(1, ((p.x - block.a.x) * dx + (p.z - block.a.z) * dz) / (dx * dx + dz * dz || 1)));
  return Math.hypot(p.x - block.a.x - dx * t, p.z - block.a.z - dz * t);
}

let kerbCache: KerbBlock[] | null = null;

/** Red and white kerb blocks along the outer boundary of everything paved. */
export function kerbBlocks(): KerbBlock[] {
  if (kerbCache) return kerbCache;
  const blocks: KerbBlock[] = [];
  for (const pavement of PAVEMENTS) {
    const others = PAVEMENTS.filter((p) => p !== pavement);
    for (const loop of pavement.loops) {
      let travelled = 0;
      for (let i = 0; i < loop.length; i++) {
        const from = loop[i];
        const to = loop[(i + 1) % loop.length];
        const len = Math.hypot(to.x - from.x, to.z - from.z);
        if (len < 1e-6) continue;
        const dir = { x: (to.x - from.x) / len, z: (to.z - from.z) / len };
        let done = 0;
        while (done < len - 1e-6) {
          // Cut at whole metres along the loop so the red/white pattern runs evenly round corners.
          const step = Math.min(len - done, KERB.block - (travelled % KERB.block));
          const a = { x: from.x + dir.x * done, z: from.z + dir.z * done };
          const b = { x: a.x + dir.x * step, z: a.z + dir.z * step };
          const red = Math.floor(travelled / KERB.block + 1e-6) % 2 === 0;
          done += step;
          travelled += step;
          if (step < 0.05) continue;
          const mid = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
          const side = (s: number, d: number) => ({ x: mid.x + dir.z * s * d, z: mid.z - dir.x * s * d });
          const leftIn = insidePavement(side(1, 0.06), pavement);
          const rightIn = insidePavement(side(-1, 0.06), pavement);
          if (leftIn === rightIn) continue;
          const s = leftIn ? -1 : 1;
          const near = side(s, 0.06);
          const far = side(s, KERB.width - 0.02);
          if (others.some((p) => insidePavement(near, p) || insidePavement(far, p))) continue;
          const block = { a, b, out: { x: dir.z * s, z: -dir.x * s }, red };
          if (blocks.some((other) => distanceToBlock(mid, other) < 0.12)) continue;
          blocks.push(block);
        }
      }
    }
  }
  kerbCache = blocks;
  return blocks;
}
