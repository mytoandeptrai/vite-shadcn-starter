import { useRef } from 'react';
import { CAR, HILL, NPC, PARKING, PARKING_BAY, ROAD, TRACK_LINES } from '../../constants';
import { useAnimationFrame } from '../../hooks/use-animation-frame';
import { useSimStore } from '../../store/sim-store';
import type { LineKind } from '../../types';
import { runtime } from '../../utils/runtime';

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
const hillLength = HILL.rampLength * 2 + HILL.plateauLength;

type Project = (value: number) => number;
type Rect = (minX: number, maxX: number, minZ: number, maxZ: number) => void;

function drawYard(c: CanvasRenderingContext2D, sx: Project, sy: Project, rect: Rect): void {
  c.fillStyle = '#475569';
  rect(HILL.centerX - HILL.width / 2, HILL.centerX + HILL.width / 2, HILL.rampStartZ, HILL.rampStartZ + hillLength);
  c.fillStyle = '#64748b';
  rect(
    HILL.centerX - HILL.width / 2,
    HILL.centerX + HILL.width / 2,
    HILL.rampStartZ + HILL.rampLength,
    HILL.rampStartZ + HILL.rampLength + HILL.plateauLength
  );
  c.fillStyle = '#334155';
  rect(PARKING.laneRightX, PARKING.laneLeftX, PARKING.laneStartZ, PARKING.laneEndZ);
  rect(PARKING_BAY.minX, PARKING_BAY.maxX, PARKING_BAY.minZ, PARKING_BAY.maxZ);

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
      drawYard(c, sx, sy, rect);
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
    <div
      data-testid='minimap'
      className='ds-area-map ds-panel relative size-24 self-start overflow-hidden rounded-xl md:size-36'
    >
      <canvas ref={canvasRef} width={SIZE} height={SIZE} className='block size-full' />
      <span className='absolute top-0.5 left-1 text-[9px] text-white/70'>Bản đồ</span>
    </div>
  );
}
