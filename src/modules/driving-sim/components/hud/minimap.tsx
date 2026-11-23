import { useRef } from 'react';
import { CAR, HILL, NPC, ROAD, TRACK_LINES } from '../../constants';
import { useAnimationFrame } from '../../hooks/use-animation-frame';
import { useSimStore } from '../../store/sim-store';
import type { LineKind } from '../../types';
import { runtime } from '../../utils/runtime';
import { PAVEMENTS } from '../../utils/yard';
import { EXAM_ROUTE } from '../../utils/yard-exam';

const SIZE = 168;
/** Metres from the car to the edge of the map. */
const RANGE = 24;
/** The road test shows further ahead, so the cars in front stay on the map. */
const ROAD_RANGE = 55;
const ROAD_MARKS = [
  0,
  ROAD.speedUp.from,
  ROAD.speedUp.to,
  ROAD.slowDown.from,
  ROAD.slowDown.to,
  ROAD.finishFrom,
  ROAD.length,
];
const COLORS: Record<LineKind, string> = { sensor: '#facc15', stop: '#ffffff', gate: '#38bdf8', marking: '#cbd5e1' };
type Project = (value: number) => number;
const hillStart = HILL.rampStartZ + HILL.rampLength;
const SURFACES = { asphalt: '#475569', paving: '#64748b' } as const;

/** Outlines of everything paved, in world metres; built once, on first use. */
let yardPaths: { path: Path2D; color: string }[] | null = null;
function getYardPaths() {
  if (!yardPaths) {
    yardPaths = PAVEMENTS.map((pavement) => {
      const path = new Path2D();
      for (const loop of pavement.loops) {
        loop.forEach((p, i) => (i === 0 ? path.moveTo(p.x, p.z) : path.lineTo(p.x, p.z)));
        path.closePath();
      }
      return { path, color: SURFACES[pavement.surface] };
    });
  }
  return yardPaths;
}

function drawYard(c: CanvasRenderingContext2D, cx: number, cz: number, scale: number, sx: Project, sy: Project) {
  // World metres to canvas pixels: screen up = +Z, screen right = -X.
  c.save();
  c.setTransform(-scale, 0, 0, -scale, SIZE / 2 + cx * scale, SIZE / 2 + cz * scale);
  for (const { path, color } of getYardPaths()) {
    c.fillStyle = color;
    c.fill(path, 'evenodd');
  }
  // The level top of the slope.
  c.fillStyle = '#7b8aa0';
  c.fillRect(HILL.centerX - HILL.width / 2, hillStart, HILL.width, HILL.plateauLength);
  c.restore();

  c.lineCap = 'butt';
  for (const line of TRACK_LINES) {
    c.strokeStyle = COLORS[line.kind];
    c.lineWidth = line.kind === 'marking' ? 1 : 2;
    c.beginPath();
    c.moveTo(sx(line.a.x), sy(line.a.z));
    c.lineTo(sx(line.b.x), sy(line.b.z));
    c.stroke();
  }
}

/** North-up (car's initial heading) top-down map centred on the car. */
export function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const road = useSimStore((s) => s.scenario === 'road');
  const scale = SIZE / ((road ? ROAD_RANGE : RANGE) * 2);

  useAnimationFrame(() => {
    const c = canvasRef.current?.getContext('2d');
    if (!c) return;
    const { x: cx, z: cz, heading } = runtime.pose;
    // Screen up = +Z, screen right = -X (the car's right when heading +Z).
    const sx = (x: number) => SIZE / 2 - (x - cx) * scale;
    const sy = (z: number) => SIZE / 2 - (z - cz) * scale;
    const rect = (minX: number, maxX: number, minZ: number, maxZ: number) =>
      c.fillRect(sx(maxX), sy(maxZ), (maxX - minX) * scale, (maxZ - minZ) * scale);

    c.fillStyle = '#1f2937';
    c.fillRect(0, 0, SIZE, SIZE);

    if (road) {
      c.fillStyle = '#334155';
      c.fillRect(sx(ROAD.halfWidth), 0, ROAD.halfWidth * 2 * scale, SIZE);
      c.fillStyle = '#e2e8f0';
      for (const x of [-ROAD.laneWidth, ROAD.laneWidth]) c.fillRect(sx(x) - 0.5, 0, 1, SIZE);
      c.fillStyle = '#fde047';
      const first = Math.floor((cz - ROAD_RANGE) / 9) * 9;
      for (let z = first; z < cz + ROAD_RANGE; z += 9) c.fillRect(sx(0) - 0.5, sy(z + 3), 1, 3 * scale);
      for (const z of ROAD_MARKS) {
        c.fillStyle = z === ROAD.length ? '#ef4444' : '#38bdf8';
        c.fillRect(sx(0), sy(z) - 1, ROAD.laneWidth * scale, 2);
      }
      for (const npc of runtime.npcs) {
        c.fillStyle = npc.braking ? '#ef4444' : npc.color;
        rect(npc.x - NPC.width / 2, npc.x + NPC.width / 2, npc.z - NPC.length / 2, npc.z + NPC.length / 2);
      }
    } else {
      drawYard(c, cx, cz, scale, sx, sy);
      const target = runtime.yard?.target;
      if (target) {
        // Full exam: the route, and a marker where the next exercise begins.
        c.strokeStyle = 'rgba(56, 189, 248, 0.55)';
        c.lineWidth = 2;
        c.lineJoin = 'round';
        c.beginPath();
        EXAM_ROUTE.forEach((p, i) => (i === 0 ? c.moveTo(sx(p.x), sy(p.z)) : c.lineTo(sx(p.x), sy(p.z))));
        c.stroke();
        // Kept on the rim of the map while the exercise is still out of range.
        const dx = sx(target.x) - SIZE / 2;
        const dy = sy(target.z) - SIZE / 2;
        const k = Math.min(1, (SIZE / 2 - 8) / Math.max(Math.abs(dx), Math.abs(dy), 1));
        c.fillStyle = '#facc15';
        c.strokeStyle = '#0f172a';
        c.lineWidth = 1.5;
        c.beginPath();
        c.arc(SIZE / 2 + dx * k, SIZE / 2 + dy * k, 5, 0, Math.PI * 2);
        c.fill();
        c.stroke();
      }
    }
    c.save();
    c.translate(SIZE / 2, SIZE / 2);
    c.rotate(-heading);
    const w = Math.max(4, CAR.width * scale);
    const l = Math.max(8, CAR.length * scale);
    c.fillStyle = '#f8fafc';
    c.strokeStyle = '#0f172a';
    c.lineWidth = 1;
    c.beginPath();
    c.roundRect(-w / 2, -l / 2, w, l, 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#ef4444';
    c.beginPath();
    c.moveTo(0, -l / 2 - 5);
    c.lineTo(-w / 2, -l / 2 + 1);
    c.lineTo(w / 2, -l / 2 + 1);
    c.closePath();
    c.fill();
    c.restore();
  });

  return (
    <div data-testid='minimap' className='ds-area-map ds-panel relative size-24 overflow-hidden rounded-xl md:size-36'>
      <canvas ref={canvasRef} width={SIZE} height={SIZE} className='block size-full' />
      <span className='absolute top-0.5 left-1 text-[9px] text-white/70'>Bản đồ</span>
    </div>
  );
}
