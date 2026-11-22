import { CuboidCollider, ConvexHullCollider, RigidBody } from '@react-three/rapier';
import { useMemo } from 'react';
import { BufferAttribute, BufferGeometry, CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import { HILL, hillHeightAt, PARKING, PARKING_BAY, TRACK_LINES } from '../../constants';
import type { LineKind, TrackLine } from '../../types';

const GROUND_HALF = { x: 46, z: 60 };
const GROUND_CENTER_Z = 10;
const LINE_LIFT = 0.02;
const LINE_COLORS: Record<LineKind, string> = {
  sensor: '#ffd21f',
  stop: '#ffffff',
  gate: '#38bdf8',
  marking: '#f1f5f9',
};

const hillMinX = HILL.centerX - HILL.width / 2;
const hillMaxX = HILL.centerX + HILL.width / 2;
const hillBreaks = [
  HILL.rampStartZ,
  HILL.rampStartZ + HILL.rampLength,
  HILL.rampStartZ + HILL.rampLength + HILL.plateauLength,
  HILL.rampStartZ + 2 * HILL.rampLength + HILL.plateauLength,
];

const groundHeight = (x: number, z: number) => (x >= hillMinX && x <= hillMaxX ? hillHeightAt(z) : 0);

export function useAsphaltTexture(repeatX = GROUND_HALF.x / 2, repeatY = GROUND_HALF.z / 2) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const c = canvas.getContext('2d');
    if (c) {
      c.fillStyle = '#4a4f57';
      c.fillRect(0, 0, 256, 256);
      // Deterministic speckle so the surface gives a sense of motion.
      let seed = 7;
      for (let i = 0; i < 2600; i++) {
        seed = (seed * 16807) % 2147483647;
        const x = seed % 256;
        seed = (seed * 16807) % 2147483647;
        const y = seed % 256;
        const shade = 60 + (seed % 60);
        c.fillStyle = `rgb(${shade},${shade + 3},${shade + 8})`;
        c.fillRect(x, y, 2, 2);
      }
    }
    const texture = new CanvasTexture(canvas);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, [repeatX, repeatY]);
}

function useTextTexture(text: string, background: string, color: string) {
  return useMemo(() => {
    const lines = text.split('\n');
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 192;
    const c = canvas.getContext('2d');
    if (c) {
      c.fillStyle = background;
      c.fillRect(0, 0, 512, 192);
      c.strokeStyle = color;
      c.lineWidth = 8;
      c.strokeRect(8, 8, 496, 176);
      c.fillStyle = color;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      const step = 150 / lines.length;
      lines.forEach((line, i) => {
        let size = lines.length === 1 ? 72 : i === 0 ? 50 : 40;
        c.font = `bold ${size}px sans-serif`;
        // Shrink long lines to fit the board.
        while (c.measureText(line).width > 460 && size > 18) {
          size -= 2;
          c.font = `bold ${size}px sans-serif`;
        }
        c.fillText(line, 256, 96 - (150 - step) / 2 + i * step);
      });
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, [text, background, color]);
}

/** Splits a line at the hill's slope changes and builds one quad per piece, draped on the ground. */
function buildLineGeometry(line: TrackLine): BufferGeometry {
  const { a, b, width } = line;
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const len = Math.hypot(dx, dz) || 1;
  const nx = (-dz / len) * (width / 2);
  const nz = (dx / len) * (width / 2);

  const cuts = [0, 1];
  if (dz !== 0 && Math.max(a.x, b.x) >= hillMinX && Math.min(a.x, b.x) <= hillMaxX) {
    for (const z of hillBreaks) {
      const t = (z - a.z) / dz;
      if (t > 0 && t < 1) cuts.push(t);
    }
  }
  cuts.sort((p, q) => p - q);

  const positions: number[] = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const p0 = { x: a.x + dx * cuts[i], z: a.z + dz * cuts[i] };
    const p1 = { x: a.x + dx * cuts[i + 1], z: a.z + dz * cuts[i + 1] };
    const corner = (p: { x: number; z: number }, s: number) => {
      const x = p.x + nx * s;
      const z = p.z + nz * s;
      return [x, groundHeight(p.x, z) + LINE_LIFT, z];
    };
    const v0 = corner(p0, 1);
    const v1 = corner(p0, -1);
    const v2 = corner(p1, 1);
    const v3 = corner(p1, -1);
    positions.push(...v0, ...v2, ...v1, ...v1, ...v2, ...v3);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  geometry.computeVertexNormals();
  return geometry;
}

function GroundLine({ line }: { line: TrackLine }) {
  const geometry = useMemo(() => buildLineGeometry(line), [line]);
  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color={LINE_COLORS[line.kind]} roughness={0.6} side={2} />
    </mesh>
  );
}

function Hill() {
  const { vertices, geometry } = useMemo(() => {
    const [z0, z1, z2, z3] = hillBreaks;
    const h = HILL.height;
    const profile: [number, number][] = [
      [0, z0],
      [h, z1],
      [h, z2],
      [0, z3],
    ];
    const pts: number[] = [];
    for (const x of [hillMinX, hillMaxX]) {
      for (const [y, z] of profile) pts.push(x, y, z);
      // Bury the base so the hull is a solid prism.
      pts.push(x, -0.5, z0, x, -0.5, z3);
    }
    const L = (i: number) => [hillMinX, profile[i][0], profile[i][1]];
    const R = (i: number) => [hillMaxX, profile[i][0], profile[i][1]];
    const tris: number[] = [];
    // Driving surface: up-ramp, plateau, down-ramp.
    for (let i = 0; i < 3; i++) tris.push(...L(i), ...L(i + 1), ...R(i), ...R(i), ...L(i + 1), ...R(i + 1));
    // Side walls.
    tris.push(...L(0), ...L(3), ...L(1), ...L(1), ...L(3), ...L(2));
    tris.push(...R(0), ...R(1), ...R(3), ...R(1), ...R(2), ...R(3));
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(tris), 3));
    geo.computeVertexNormals();
    return { vertices: new Float32Array(pts), geometry: geo };
  }, []);

  return (
    <RigidBody type='fixed' colliders={false}>
      <ConvexHullCollider args={[vertices]} friction={1} />
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial color='#5d636d' roughness={0.95} side={2} />
      </mesh>
    </RigidBody>
  );
}

export function Sign({
  position,
  rotationY = 0,
  lines,
  background = '#1d4ed8',
}: {
  position: [number, number, number];
  rotationY?: number;
  lines: string[];
  background?: string;
}) {
  const texture = useTextTexture(lines.join('\n'), background, '#ffffff');
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2.2, 8]} />
        <meshStandardMaterial color='#9ca3af' metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[2.4, 0.9, 0.06]} />
        <meshStandardMaterial color='#e5e7eb' />
      </mesh>
      <mesh position={[0, 2.5, 0.035]}>
        <planeGeometry args={[2.3, 0.82]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      <mesh position={[0, 2.5, -0.035]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.3, 0.82]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </group>
  );
}

function Pole({ x, z, color = '#f97316' }: { x: number; z: number; color?: string }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.2, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.18, 8]} />
        <meshStandardMaterial color='#ffffff' />
      </mesh>
    </group>
  );
}

function Cone({ x, z }: { x: number; z: number }) {
  return (
    <RigidBody position={[x, 0.25, z]} colliders='hull' mass={3}>
      <mesh castShadow>
        <coneGeometry args={[0.18, 0.5, 12]} />
        <meshStandardMaterial color='#f97316' />
      </mesh>
    </RigidBody>
  );
}

const TREES: [number, number, number][] = [];
for (let i = 0; i < 26; i++) {
  const side = i % 2 === 0 ? -1 : 1;
  TREES.push([side * (GROUND_HALF.x + 4 + ((i * 7) % 9)), GROUND_CENTER_Z - 58 + i * 4.6, 0.8 + ((i * 13) % 7) / 10]);
}
for (let i = 0; i < 12; i++) {
  TREES.push([-40 + i * 7.3, GROUND_CENTER_Z + GROUND_HALF.z + 5 + ((i * 5) % 6), 0.9 + ((i * 11) % 6) / 10]);
}

const CONES: [number, number][] = [
  [-3, -8],
  [3, -8],
  [-3, 0],
  [3, 0],
  [-3, 8],
  [3, 8],
  [0, 30],
  [-2, 34],
  [2, 38],
];

export function Track({ runId }: { runId: number }) {
  const asphalt = useAsphaltTexture();
  const bayCenterX = (PARKING_BAY.minX + PARKING_BAY.maxX) / 2;
  const laneCenterX = (PARKING.laneLeftX + PARKING.laneRightX) / 2;

  return (
    <group>
      <RigidBody type='fixed' colliders={false}>
        <CuboidCollider args={[200, 0.5, 200]} position={[0, -0.5, 0]} friction={1} />
        {/* Perimeter walls keep the car on the yard. */}
        <CuboidCollider args={[GROUND_HALF.x, 1, 0.3]} position={[0, 1, GROUND_CENTER_Z - GROUND_HALF.z]} />
        <CuboidCollider args={[GROUND_HALF.x, 1, 0.3]} position={[0, 1, GROUND_CENTER_Z + GROUND_HALF.z]} />
        <CuboidCollider args={[0.3, 1, GROUND_HALF.z]} position={[-GROUND_HALF.x, 1, GROUND_CENTER_Z]} />
        <CuboidCollider args={[0.3, 1, GROUND_HALF.z]} position={[GROUND_HALF.x, 1, GROUND_CENTER_Z]} />
      </RigidBody>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[600, 600]} />
        <meshStandardMaterial color='#5a9a4a' roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, GROUND_CENTER_Z]} receiveShadow>
        <planeGeometry args={[GROUND_HALF.x * 2, GROUND_HALF.z * 2]} />
        <meshStandardMaterial map={asphalt} roughness={0.95} />
      </mesh>
      {/* Kerb around the yard */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * GROUND_HALF.x, 0.1, GROUND_CENTER_Z]}>
            <boxGeometry args={[0.4, 0.2, GROUND_HALF.z * 2]} />
            <meshStandardMaterial color='#d6d3d1' />
          </mesh>
          <mesh position={[0, 0.1, GROUND_CENTER_Z + s * GROUND_HALF.z]}>
            <boxGeometry args={[GROUND_HALF.x * 2, 0.2, 0.4]} />
            <meshStandardMaterial color='#d6d3d1' />
          </mesh>
        </group>
      ))}

      <Hill />
      {TRACK_LINES.map((line) => (
        <GroundLine key={line.id} line={line} />
      ))}

      {/* Parking bay surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[bayCenterX, 0.008, PARKING.bayCenterZ]} receiveShadow>
        <planeGeometry args={[PARKING.bayDepth, PARKING.bayWidth]} />
        <meshStandardMaterial color='#3b4350' roughness={0.9} />
      </mesh>
      <Pole x={PARKING_BAY.maxX} z={PARKING_BAY.minZ} />
      <Pole x={PARKING_BAY.maxX} z={PARKING_BAY.maxZ} />
      <Pole x={PARKING_BAY.minX} z={PARKING_BAY.minZ} />
      <Pole x={PARKING_BAY.minX} z={PARKING_BAY.maxZ} />

      {/* Hill guide poles at the stop line */}
      <Pole x={hillMinX - 0.3} z={HILL.stopLineZ} color='#ef4444' />
      <Pole x={hillMaxX + 0.3} z={HILL.stopLineZ} color='#ef4444' />

      <Sign position={[hillMaxX + 1.6, 0, -3]} rotationY={Math.PI} lines={['BÀI 1', 'DỪNG & KHỞI HÀNH', 'NGANG DỐC']} />
      <Sign
        position={[hillMaxX + 1.6, 0, HILL.stopLineZ]}
        rotationY={Math.PI}
        lines={['DỪNG LẠI']}
        background='#b91c1c'
      />
      <Sign
        position={[PARKING.laneLeftX + 1.6, 0, PARKING.entryZ]}
        rotationY={Math.PI}
        lines={['BÀI 2', 'GHÉP XE DỌC', 'VÀO NƠI ĐỖ']}
      />
      <Sign
        position={[PARKING_BAY.minX - 1.2, 0, PARKING.bayCenterZ]}
        rotationY={Math.PI / 2}
        lines={['NƠI ĐỖ XE']}
        background='#15803d'
      />
      <Sign position={[laneCenterX - 12, 0, -30]} rotationY={Math.PI} lines={['SÂN TẬP LÁI', 'SA HÌNH B1 / B2']} />

      {CONES.map(([x, z]) => (
        <Cone key={`${runId}:${x}:${z}`} x={x} z={z} />
      ))}

      {TREES.map(([x, z, scale]) => (
        <group key={`${x}:${z}`} position={[x, 0, z]} scale={scale * 1.6}>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 1.6, 6]} />
            <meshStandardMaterial color='#7c4a21' />
          </mesh>
          <mesh position={[0, 2.6, 0]}>
            <coneGeometry args={[1.2, 3, 7]} />
            <meshStandardMaterial color='#2f7a3a' />
          </mesh>
        </group>
      ))}
    </group>
  );
}
