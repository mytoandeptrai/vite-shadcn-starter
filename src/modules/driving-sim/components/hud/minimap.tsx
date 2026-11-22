import { useRef } from 'react';
import { CAR, HILL, PARKING, PARKING_BAY, TRACK_LINES } from '../../constants';
import { useAnimationFrame } from '../../hooks/use-animation-frame';
import type { LineKind } from '../../types';
import { runtime } from '../../utils/runtime';

const SIZE = 168;
/** Metres from the car to the edge of the map. */
const RANGE = 24;
const SCALE = SIZE / (RANGE * 2);
const COLORS: Record<LineKind, string> = { sensor: '#facc15', stop: '#ffffff', gate: '#38bdf8', marking: '#cbd5e1' };
const hillLength = HILL.rampLength * 2 + HILL.plateauLength;

/** North-up (car's initial heading) top-down map centred on the car. */
export function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useAnimationFrame(() => {
    const c = canvasRef.current?.getContext('2d');
    if (!c) return;
    const { x: cx, z: cz, heading } = runtime.pose;
    // Screen up = +Z, screen right = -X (the car's right when heading +Z).
    const sx = (x: number) => SIZE / 2 - (x - cx) * SCALE;
    const sy = (z: number) => SIZE / 2 - (z - cz) * SCALE;
    const rect = (minX: number, maxX: number, minZ: number, maxZ: number) =>
      c.fillRect(sx(maxX), sy(maxZ), (maxX - minX) * SCALE, (maxZ - minZ) * SCALE);

    c.fillStyle = '#1f2937';
    c.fillRect(0, 0, SIZE, SIZE);

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

    c.save();
    c.translate(SIZE / 2, SIZE / 2);
    c.rotate(-heading);
    const w = CAR.width * SCALE;
    const l = CAR.length * SCALE;
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
      className='ds-area-map ds-panel relative size-24 self-start overflow-hidden rounded-xl md:size-40'
    >
      <canvas ref={canvasRef} width={SIZE} height={SIZE} className='block size-full' />
      <span className='absolute top-0.5 left-1 text-[9px] text-white/70'>Bản đồ</span>
    </div>
  );
}
