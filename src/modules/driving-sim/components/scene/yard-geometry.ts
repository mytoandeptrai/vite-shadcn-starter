import { BufferAttribute, BufferGeometry, ShapeUtils, Vector2 } from 'three';
import { HILL, hillHeightAt } from '../../constants';
import type { Vec2 } from '../../types';
import { KERB, type KerbBlock, kerbBlocks, type Mark, PAVEMENTS, type Surface } from '../../utils/yard';

/** The slope carries the road and its kerbs. */
export const HILL_BODY_WIDTH = HILL.width + 2 * KERB.width + 0.1;
export const HILL_BREAKS = [
  HILL.rampStartZ,
  HILL.rampStartZ + HILL.rampLength,
  HILL.rampStartZ + HILL.rampLength + HILL.plateauLength,
  HILL.rampStartZ + 2 * HILL.rampLength + HILL.plateauLength,
];

const onHill = (x: number) => Math.abs(x - HILL.centerX) <= HILL_BODY_WIDTH / 2;

export const groundHeight = (x: number, z: number) => (onHill(x) ? hillHeightAt(z) : 0);

type P3 = [number, number, number];

/** Adds a triangle wound so that it faces along `n`. */
function tri(out: number[], a: P3, b: P3, c: P3, n: P3) {
  const ux = b[0] - a[0];
  const uy = b[1] - a[1];
  const uz = b[2] - a[2];
  const vx = c[0] - a[0];
  const vy = c[1] - a[1];
  const vz = c[2] - a[2];
  const facing = (uy * vz - uz * vy) * n[0] + (uz * vx - ux * vz) * n[1] + (ux * vy - uy * vx) * n[2];
  if (facing >= 0) out.push(...a, ...b, ...c);
  else out.push(...a, ...c, ...b);
}

function quad(out: number[], a: P3, b: P3, c: P3, d: P3, n: P3) {
  tri(out, a, b, c, n);
  tri(out, a, c, d, n);
}

const UP: P3 = [0, 1, 0];

function toGeometry(positions: number[], worldUv = false): BufferGeometry {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  if (worldUv) {
    const uv = new Float32Array((positions.length / 3) * 2);
    for (let i = 0; i < positions.length / 3; i++) {
      uv[i * 2] = positions[i * 3];
      uv[i * 2 + 1] = positions[i * 3 + 2];
    }
    geometry.setAttribute('uv', new BufferAttribute(uv, 2));
  }
  geometry.computeVertexNormals();
  return geometry;
}

/** Everything paved with one surface, flat, with texture coordinates in metres. */
export function pavementGeometry(surface: Surface, y: number): BufferGeometry {
  const out: number[] = [];
  const at = (p: Vec2): P3 => [p.x, y, p.z];
  for (const pavement of PAVEMENTS) {
    if (pavement.surface !== surface) continue;
    if (pavement.ribbon) {
      const { left, right, closed } = pavement.ribbon;
      const n = left.length;
      for (let i = 0; i < (closed ? n : n - 1); i++) {
        const j = (i + 1) % n;
        quad(out, at(left[i]), at(right[i]), at(right[j]), at(left[j]), UP);
      }
      continue;
    }
    const loop = pavement.loops[0];
    const faces = ShapeUtils.triangulateShape(
      loop.map((p) => new Vector2(p.x, p.z)),
      []
    );
    for (const [a, b, c] of faces) tri(out, at(loop[a]), at(loop[b]), at(loop[c]), UP);
  }
  return toGeometry(out, true);
}

function kerbPositions(blocks: KerbBlock[]): number[] {
  const out: number[] = [];
  for (const { a, b, out: o } of blocks) {
    const ya = groundHeight(a.x, a.z);
    const yb = groundHeight(b.x, b.z);
    const oa = { x: a.x + o.x * KERB.width, z: a.z + o.z * KERB.width };
    const ob = { x: b.x + o.x * KERB.width, z: b.z + o.z * KERB.width };
    const h = KERB.height;
    quad(out, [a.x, ya + h, a.z], [b.x, yb + h, b.z], [ob.x, yb + h, ob.z], [oa.x, ya + h, oa.z], UP);
    quad(out, [a.x, ya, a.z], [b.x, yb, b.z], [b.x, yb + h, b.z], [a.x, ya + h, a.z], [-o.x, 0, -o.z]);
    quad(out, [oa.x, ya, oa.z], [ob.x, yb, ob.z], [ob.x, yb + h, ob.z], [oa.x, ya + h, oa.z], [o.x, 0, o.z]);
  }
  return out;
}

export function kerbGeometry(red: boolean): BufferGeometry {
  return toGeometry(kerbPositions(kerbBlocks().filter((block) => block.red === red)));
}

/** All kerbs as one triangle soup for the physics collider. */
export function kerbCollider(): { vertices: Float32Array; indices: Uint32Array } {
  const vertices = new Float32Array(kerbPositions(kerbBlocks()));
  const indices = new Uint32Array(vertices.length / 3);
  for (let i = 0; i < indices.length; i++) indices[i] = i;
  return { vertices, indices };
}

/** Painted lines and shapes, laid on the ground and draped over the slope. */
export function paintGeometry(marks: readonly Mark[], polygons: readonly { points: Vec2[] }[], lift: number) {
  const out: number[] = [];
  const at = (x: number, z: number): P3 => [x, groundHeight(x, z) + lift, z];
  for (const { a, b, width } of marks) {
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len = Math.hypot(dx, dz) || 1;
    const nx = (-dz / len) * (width / 2);
    const nz = (dx / len) * (width / 2);
    // A line running up the slope bends where the gradient changes.
    const cuts = [0, 1];
    if (dz !== 0 && onHill(a.x) && onHill(b.x)) {
      for (const z of HILL_BREAKS) {
        const t = (z - a.z) / dz;
        if (t > 0 && t < 1) cuts.push(t);
      }
      cuts.sort((p, q) => p - q);
    }
    for (let i = 0; i < cuts.length - 1; i++) {
      const p = { x: a.x + dx * cuts[i], z: a.z + dz * cuts[i] };
      const q = { x: a.x + dx * cuts[i + 1], z: a.z + dz * cuts[i + 1] };
      quad(out, at(p.x + nx, p.z + nz), at(p.x - nx, p.z - nz), at(q.x - nx, q.z - nz), at(q.x + nx, q.z + nz), UP);
    }
  }
  for (const { points } of polygons) {
    for (let i = 1; i < points.length - 1; i++) {
      tri(out, at(points[0].x, points[0].z), at(points[i].x, points[i].z), at(points[i + 1].x, points[i + 1].z), UP);
    }
  }
  return toGeometry(out);
}
