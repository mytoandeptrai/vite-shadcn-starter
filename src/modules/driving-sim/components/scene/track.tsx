import { useFrame } from '@react-three/fiber';
import { ConvexHullCollider, CuboidCollider, RigidBody, TrimeshCollider } from '@react-three/rapier';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  type InstancedMesh,
  type MeshBasicMaterial,
  Object3D,
  RepeatWrapping,
  SRGBColorSpace,
} from 'three';
import { HILL, hillHeightAt, PARKING, PARKING_BAY, TRACK_LINES, YARD_EXAM } from '../../constants';
import { useDisposable } from '../../hooks/use-disposable';
import type { LightColor, Lights, LineKind } from '../../types';
import { runtime } from '../../utils/runtime';
import { CENTRE_ROAD, CROSS_ROAD, KERB, onPavement, RING } from '../../utils/yard';
import { GROUND_TEXTS, type GroundText, MARK_POLYGONS, MARKS } from '../../utils/yard-marks';
import {
  HILL_BODY_WIDTH,
  HILL_BREAKS,
  kerbCollider,
  kerbGeometry,
  paintGeometry,
  pavementGeometry,
} from './yard-geometry';

const HALF = RING.width / 2;
/** Fence line: a strip of grass outside the ring road. */
const FENCE = {
  minX: RING.minX - HALF - 4,
  maxX: RING.maxX + HALF + 4,
  minZ: RING.minZ - HALF - 4,
  maxZ: RING.maxZ + HALF + 4,
};
const PAINT = { white: '#eef2f6', yellow: '#f2b01e', red: '#dc2626' } as const;
const LINE_COLORS: Record<LineKind, string> = {
  sensor: '#ffd21f',
  stop: '#ffffff',
  gate: '#38bdf8',
  marking: '#f1f5f9',
};
const LINE_KINDS: LineKind[] = ['sensor', 'stop', 'gate', 'marking'];

/** Speckled asphalt. The yard maps it in metres, one tile every 4 m. */
export function useAsphaltTexture(repeatX = 0.25, repeatY = 0.25) {
  return useDisposable(() => {
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
  return useDisposable(() => {
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

function useGroundTextTexture(text: string) {
  return useDisposable(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const c = canvas.getContext('2d');
    if (c) {
      c.fillStyle = '#ffffff';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      let size = 104;
      c.font = `bold ${size}px sans-serif`;
      while (c.measureText(text).width > 490 && size > 20) {
        size -= 4;
        c.font = `bold ${size}px sans-serif`;
      }
      c.fillText(text, 256, 70);
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, [text]);
}

/** Word painted on the road, read by traffic driving along `heading`. */
function RoadText({ text, x, z, heading, width }: GroundText) {
  const texture = useGroundTextTexture(text);
  return (
    <group position={[x, 0.03, z]} rotation={[0, heading + Math.PI, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, width / 4]} />
        <meshBasicMaterial map={texture} transparent depthWrite={false} color={PAINT.white} />
      </mesh>
    </group>
  );
}

function Yard() {
  const asphalt = useAsphaltTexture();
  const geometry = useMemo(
    () => ({
      asphalt: pavementGeometry('asphalt', 0),
      paving: pavementGeometry('paving', 0.006),
      kerbRed: kerbGeometry(true),
      kerbWhite: kerbGeometry(false),
      white: paintGeometry(
        MARKS.filter((m) => m.color === 'white'),
        MARK_POLYGONS,
        0.02
      ),
      yellow: paintGeometry(
        MARKS.filter((m) => m.color === 'yellow'),
        [],
        0.024
      ),
      red: paintGeometry(
        MARKS.filter((m) => m.color === 'red'),
        [],
        0.028
      ),
      lines: LINE_KINDS.map((kind) =>
        paintGeometry(
          TRACK_LINES.filter((line) => line.kind === kind).map((line) => ({ ...line, color: 'white' as const })),
          [],
          0.032
        )
      ),
    }),
    []
  );
  const kerbs = useMemo(kerbCollider, []);
  useEffect(
    () => () => {
      const { lines, ...meshes } = geometry;
      for (const buffers of [...Object.values(meshes), ...lines]) buffers.dispose();
    },
    [geometry]
  );

  return (
    <>
      <RigidBody type='fixed' colliders={false}>
        <CuboidCollider args={[200, 0.5, 200]} position={[0, -0.5, 0]} friction={1} />
        <TrimeshCollider args={[kerbs.vertices, kerbs.indices]} friction={1} />
        {/* The fence keeps the car on the yard. */}
        <CuboidCollider
          args={[(FENCE.maxX - FENCE.minX) / 2, 1, 0.3]}
          position={[(FENCE.minX + FENCE.maxX) / 2, 1, FENCE.minZ]}
        />
        <CuboidCollider
          args={[(FENCE.maxX - FENCE.minX) / 2, 1, 0.3]}
          position={[(FENCE.minX + FENCE.maxX) / 2, 1, FENCE.maxZ]}
        />
        <CuboidCollider
          args={[0.3, 1, (FENCE.maxZ - FENCE.minZ) / 2]}
          position={[FENCE.minX, 1, (FENCE.minZ + FENCE.maxZ) / 2]}
        />
        <CuboidCollider
          args={[0.3, 1, (FENCE.maxZ - FENCE.minZ) / 2]}
          position={[FENCE.maxX, 1, (FENCE.minZ + FENCE.maxZ) / 2]}
        />
      </RigidBody>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[600, 600]} />
        <meshStandardMaterial color='#5a9a4a' roughness={1} />
      </mesh>
      <mesh geometry={geometry.asphalt} receiveShadow>
        <meshStandardMaterial map={asphalt} roughness={0.95} />
      </mesh>
      <mesh geometry={geometry.paving} receiveShadow>
        <meshStandardMaterial color='#8b8680' roughness={0.95} />
      </mesh>
      <mesh geometry={geometry.kerbRed}>
        <meshStandardMaterial color='#b3261e' roughness={0.8} />
      </mesh>
      <mesh geometry={geometry.kerbWhite}>
        <meshStandardMaterial color='#e7e5e4' roughness={0.8} />
      </mesh>
      {(['white', 'yellow', 'red'] as const).map((color) => (
        <mesh key={color} geometry={geometry[color]} receiveShadow>
          <meshStandardMaterial color={PAINT[color]} roughness={0.6} />
        </mesh>
      ))}
      {LINE_KINDS.map((kind, i) => (
        <mesh key={kind} geometry={geometry.lines[i]} receiveShadow>
          <meshStandardMaterial color={LINE_COLORS[kind]} roughness={0.6} />
        </mesh>
      ))}
      {GROUND_TEXTS.map((text) => (
        <RoadText key={`${text.text}:${text.x}:${text.z}`} {...text} />
      ))}
    </>
  );
}

function Hill() {
  const asphalt = useAsphaltTexture();
  const { vertices, surface, walls } = useMemo(() => {
    const [z0, z1, z2, z3] = HILL_BREAKS;
    const h = HILL.height;
    const minX = HILL.centerX - HILL_BODY_WIDTH / 2;
    const maxX = HILL.centerX + HILL_BODY_WIDTH / 2;
    const profile: [number, number][] = [
      [0, z0],
      [h, z1],
      [h, z2],
      [0, z3],
    ];
    const pts: number[] = [];
    for (const x of [minX, maxX]) {
      for (const [y, z] of profile) pts.push(x, y, z);
      // Bury the base so the hull is a solid prism.
      pts.push(x, -0.5, z0, x, -0.5, z3);
    }
    const L = (i: number) => [minX, profile[i][0], profile[i][1]];
    const R = (i: number) => [maxX, profile[i][0], profile[i][1]];
    const top: number[] = [];
    for (let i = 0; i < 3; i++) top.push(...L(i), ...L(i + 1), ...R(i), ...R(i), ...L(i + 1), ...R(i + 1));
    const sides = [...L(0), ...L(3), ...L(1), ...L(1), ...L(3), ...L(2)];
    sides.push(...R(0), ...R(1), ...R(3), ...R(1), ...R(2), ...R(3));
    const build = (positions: number[]) => {
      const geo = new BufferGeometry();
      geo.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
      const uv = new Float32Array((positions.length / 3) * 2);
      for (let i = 0; i < positions.length / 3; i++) {
        uv[i * 2] = positions[i * 3];
        uv[i * 2 + 1] = positions[i * 3 + 2];
      }
      geo.setAttribute('uv', new BufferAttribute(uv, 2));
      geo.computeVertexNormals();
      return geo;
    };
    return { vertices: new Float32Array(pts), surface: build(top), walls: build(sides) };
  }, []);
  useEffect(
    () => () => {
      surface.dispose();
      walls.dispose();
    },
    [surface, walls]
  );

  // Guard rails: one rail per gradient on each side, a post where they meet.
  const railX = HILL.width / 2 + KERB.width / 2;
  const rails = [0, 1, 2].map((i) => {
    const z0 = HILL_BREAKS[i];
    const z1 = HILL_BREAKS[i + 1];
    const y0 = hillHeightAt(z0 + 0.01);
    const y1 = hillHeightAt(z1 - 0.01);
    return {
      z: (z0 + z1) / 2,
      y: (y0 + y1) / 2,
      length: Math.hypot(z1 - z0, y1 - y0),
      tilt: -Math.atan2(y1 - y0, z1 - z0),
    };
  });

  return (
    <RigidBody type='fixed' colliders={false}>
      <ConvexHullCollider args={[vertices]} friction={1} />
      <mesh geometry={surface} receiveShadow>
        <meshStandardMaterial map={asphalt} color='#c9ccd2' roughness={0.95} side={2} />
      </mesh>
      <mesh geometry={walls} castShadow>
        <meshStandardMaterial color='#6b7280' roughness={0.95} side={2} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[HILL.centerX + side * railX, 0, 0]}>
          {rails.map((rail) => (
            <mesh key={rail.z} position={[0, rail.y + 0.75, rail.z]} rotation={[rail.tilt, 0, 0]}>
              <boxGeometry args={[0.08, 0.12, rail.length]} />
              <meshStandardMaterial color='#f1f5f9' />
            </mesh>
          ))}
          {HILL_BREAKS.map((z) => (
            <mesh key={z} position={[0, hillHeightAt(z) + 0.4, z]}>
              <boxGeometry args={[0.1, 0.9, 0.1]} />
              <meshStandardMaterial color='#dc2626' />
            </mesh>
          ))}
        </group>
      ))}
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

/** Start gantry over the start line. */
function StartGate() {
  const span = RING.width + 1.6;
  const board = useTextTexture('XUẤT PHÁT', '#1d4ed8', '#ffffff');
  return (
    <group position={[RING.minX, 0, -22.5]}>
      <RigidBody type='fixed' colliders={false}>
        {[-1, 1].map((side) => (
          <CuboidCollider key={side} args={[0.12, 2.6, 0.12]} position={[(side * span) / 2, 2.6, 0]} />
        ))}
      </RigidBody>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[(side * span) / 2, 2.6, 0]} castShadow>
          <boxGeometry args={[0.22, 5.2, 0.22]} />
          <meshStandardMaterial color='#e2e8f0' />
        </mesh>
      ))}
      <mesh position={[0, 5.1, 0]}>
        <boxGeometry args={[span + 0.22, 0.3, 0.26]} />
        <meshStandardMaterial color='#1d4ed8' />
      </mesh>
      {[0, Math.PI].map((turn) => (
        <mesh key={turn} position={[0, 5.95, turn === 0 ? 0.02 : -0.02]} rotation={[0, turn, 0]}>
          <planeGeometry args={[3.8, 1.4]} />
          <meshBasicMaterial map={board} />
        </mesh>
      ))}
    </group>
  );
}

function Building() {
  return (
    <group position={[-38.75, 0, -21.15]}>
      <RigidBody type='fixed' colliders={false}>
        <CuboidCollider args={[4.45, 1.6, 3.55]} position={[0, 1.6, 0]} />
      </RigidBody>
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[8.9, 3.2, 7.1]} />
        <meshStandardMaterial color='#f1ede4' />
      </mesh>
      <mesh position={[0, 3.35, 0]} castShadow>
        <boxGeometry args={[9.5, 0.3, 7.7]} />
        <meshStandardMaterial color='#a8473c' />
      </mesh>
      <mesh position={[0, 1.7, -3.56]}>
        <planeGeometry args={[6.6, 1.2]} />
        <meshStandardMaterial color='#5b7f95' side={2} />
      </mesh>
    </group>
  );
}

/** Railway crossing on the top road: sleepers, two rails and a warning cross on each side. */
function Railway() {
  const x = 34.25;
  return (
    <group position={[x, 0, RING.maxZ]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <planeGeometry args={[2.5, RING.width - 0.5]} />
        <meshStandardMaterial color='#40342b' roughness={1} />
      </mesh>
      {[-0.72, 0.72].map((dx) => (
        <mesh key={dx} position={[dx, 0.03, 0]}>
          <boxGeometry args={[0.1, 0.05, RING.width + 3]} />
          <meshStandardMaterial color='#9ca3af' metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <group key={side} position={[-2.2 * side, 0, side * (HALF + 1)]}>
          <mesh position={[0, 1.3, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2.6, 8]} />
            <meshStandardMaterial color='#e5e7eb' />
          </mesh>
          {[-1, 1].map((turn) => (
            <mesh key={turn} position={[0, 2.5, 0]} rotation={[turn * 0.7, 0, 0]}>
              <boxGeometry args={[0.05, 0.16, 1.3]} />
              <meshStandardMaterial color='#f8fafc' />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

const LAMPS: [number, LightColor, string][] = [
  [0.32, 'red', '#ef4444'],
  [0, 'yellow', '#facc15'],
  [-0.32, 'green', '#22c55e'],
];

/** Signal head for one arm of the crossroads; it follows the live light cycle. */
function TrafficLight({ x, z, rotationY, axis }: { x: number; z: number; rotationY: number; axis: keyof Lights }) {
  const materials = useRef<(MeshBasicMaterial | null)[]>([]);
  const shown = useRef<LightColor | null>(null);
  useFrame(() => {
    const color = runtime.lights[axis];
    if (shown.current === color) return;
    shown.current = color;
    LAMPS.forEach(([, name, lit], i) => materials.current[i]?.color.set(name === color ? lit : '#374151'));
  });
  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 3.2, 8]} />
        <meshStandardMaterial color='#475569' />
      </mesh>
      <mesh position={[0, 3.4, 0]}>
        <boxGeometry args={[0.38, 1.1, 0.26]} />
        <meshStandardMaterial color='#1f2937' />
      </mesh>
      {LAMPS.map(([y, name], i) => (
        <mesh key={name} position={[0, 3.4 + y, 0.14]}>
          <circleGeometry args={[0.12, 14]} />
          <meshBasicMaterial
            ref={(material) => {
              materials.current[i] = material;
            }}
            color='#374151'
          />
        </mesh>
      ))}
    </group>
  );
}

const LAMP_POSTS: [number, number][] = [
  [-37, 38],
  [-3, 38],
  [29, 38.5],
  [26, -2.5],
  [26.5, -36.5],
  [-2.5, -2.5],
  [-14.5, -36.5],
  [-41, 0.5],
];

function LampPost({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.9, 0.2, 0.9]} />
        <meshStandardMaterial color='#d6d3d1' />
      </mesh>
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 8, 8]} />
        <meshStandardMaterial color='#94a3b8' metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[1.6, 0.12, 0.3]} />
        <meshStandardMaterial color='#e2e8f0' />
      </mesh>
    </group>
  );
}

/** Trees outside the fence and on the wider grass islands, clear of everything paved. */
const TREES: [number, number, number][] = (() => {
  const trees: [number, number, number][] = [];
  const size = (i: number) => 0.8 + ((i * 13) % 7) / 10;
  for (let i = 0; i < 30; i++) {
    const t = i / 30;
    trees.push([FENCE.minX - 3 - ((i * 7) % 5), FENCE.minZ + t * (FENCE.maxZ - FENCE.minZ), size(i)]);
    trees.push([FENCE.maxX + 3 + ((i * 5) % 6), FENCE.minZ + t * (FENCE.maxZ - FENCE.minZ) + 2, size(i + 3)]);
  }
  for (let i = 0; i < 24; i++) {
    const t = i / 24;
    trees.push([FENCE.minX + t * (FENCE.maxX - FENCE.minX), FENCE.maxZ + 3 + ((i * 5) % 6), size(i + 1)]);
    trees.push([FENCE.minX + t * (FENCE.maxX - FENCE.minX) + 2, FENCE.minZ - 3 - ((i * 7) % 5), size(i + 5)]);
  }
  // Islands: a coarse grid, kept only where there is grass for a few metres around.
  const clear = (x: number, z: number) =>
    [0, 1, 2, 3, 4, 5, 6, 7].every((k) => {
      const at = (k * Math.PI) / 4;
      return !onPavement({ x: x + Math.cos(at) * 4.5, z: z + Math.sin(at) * 4.5 });
    });
  let n = 0;
  for (let x = RING.minX + 9; x < RING.maxX - 6; x += 9.5) {
    for (let z = RING.minZ + 9; z < RING.maxZ - 6; z += 8.5) {
      n += 1;
      const px = x + ((n * 37) % 5) - 2;
      const pz = z + ((n * 53) % 5) - 2;
      const building = px < -32 && px > -46 && pz < -15 && pz > -28;
      if (n % 3 !== 0 && !building && !onPavement({ x: px, z: pz }) && clear(px, pz)) trees.push([px, pz, size(n)]);
    }
  }
  return trees;
})();

function Trees() {
  const trunks = useRef<InstancedMesh>(null);
  const crowns = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const dummy = new Object3D();
    TREES.forEach(([x, z, scale], i) => {
      const s = scale * 1.6;
      dummy.scale.setScalar(s);
      dummy.position.set(x, 0.8 * s, z);
      dummy.updateMatrix();
      trunks.current?.setMatrixAt(i, dummy.matrix);
      dummy.position.set(x, 2.6 * s, z);
      dummy.updateMatrix();
      crowns.current?.setMatrixAt(i, dummy.matrix);
    });
    for (const mesh of [trunks.current, crowns.current]) if (mesh) mesh.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <>
      <instancedMesh ref={trunks} args={[undefined, undefined, TREES.length]} frustumCulled={false}>
        <cylinderGeometry args={[0.15, 0.2, 1.6, 6]} />
        <meshStandardMaterial color='#7c4a21' />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, TREES.length]} frustumCulled={false}>
        <coneGeometry args={[1.2, 3, 7]} />
        <meshStandardMaterial color='#2f7a3a' />
      </instancedMesh>
    </>
  );
}

/** Practice slalom in the car park. */
const CONES: [number, number][] = [
  [-36, -31],
  [-36, -36],
  [-36, -41],
  [-36, -46],
  [-28.5, -33.5],
  [-28.5, -38.5],
  [-28.5, -43.5],
];

export function Track({ runId }: { runId: number }) {
  const cx = CENTRE_ROAD.x;
  const cz = CROSS_ROAD.z;
  const hillSignX = HILL.centerX - HILL.width / 2 - 2;
  const gearSignX = RING.maxX + HALF + 1.6;

  return (
    <group>
      <Yard />
      <Hill />
      <StartGate />
      <Building />
      <Railway />

      {/* Fence */}
      {[FENCE.minZ, FENCE.maxZ].map((z) => (
        <mesh key={z} position={[(FENCE.minX + FENCE.maxX) / 2, 0.5, z]}>
          <boxGeometry args={[FENCE.maxX - FENCE.minX, 1, 0.12]} />
          <meshStandardMaterial color='#cbd5e1' />
        </mesh>
      ))}
      {[FENCE.minX, FENCE.maxX].map((x) => (
        <mesh key={x} position={[x, 0.5, (FENCE.minZ + FENCE.maxZ) / 2]}>
          <boxGeometry args={[0.12, 1, FENCE.maxZ - FENCE.minZ]} />
          <meshStandardMaterial color='#cbd5e1' />
        </mesh>
      ))}

      {/* Crossroads */}
      <TrafficLight x={cx + HALF + 1} z={cz + HALF + 5.2} rotationY={0} axis='ns' />
      <TrafficLight x={cx - HALF - 1} z={cz - HALF - 5.2} rotationY={Math.PI} axis='ns' />
      <TrafficLight x={cx + HALF + 5.2} z={cz - HALF - 1} rotationY={Math.PI / 2} axis='ew' />
      <TrafficLight x={cx - HALF - 5.2} z={cz + HALF + 1} rotationY={-Math.PI / 2} axis='ew' />

      {/* Parking bay corners and the stop line on the slope */}
      <Pole x={PARKING_BAY.minX} z={PARKING_BAY.maxZ} />
      <Pole x={PARKING_BAY.maxX} z={PARKING_BAY.maxZ} />
      <Pole x={PARKING_BAY.minX - 0.5} z={PARKING_BAY.minZ - 0.5} />
      <Pole x={PARKING_BAY.maxX + 0.5} z={PARKING_BAY.minZ - 0.5} />

      <Sign position={[hillSignX, 0, -24]} rotationY={Math.PI} lines={['BÀI 1', 'XUẤT PHÁT']} />
      <Sign position={[hillSignX, 0, -13]} rotationY={Math.PI} lines={['BÀI 2', 'NHƯỜNG ĐƯỜNG', 'NGƯỜI ĐI BỘ']} />
      <Sign position={[hillSignX, 0, 2.5]} rotationY={Math.PI} lines={['BÀI 3', 'DỪNG & KHỞI HÀNH', 'NGANG DỐC']} />
      <Sign
        position={[hillSignX, hillHeightAt(HILL.stopLineZ), HILL.stopLineZ]}
        rotationY={Math.PI}
        lines={['DỪNG LẠI']}
        background='#b91c1c'
      />
      <Sign
        position={[-20.3, 0, RING.maxZ - HALF - 2.2]}
        rotationY={-Math.PI / 2}
        lines={['BÀI 4', 'VỆT BÁNH XE', 'ĐƯỜNG VUÔNG GÓC']}
      />
      <Sign
        position={[cx - HALF - 5.2, 0, cz + HALF + 2.6]}
        rotationY={-Math.PI / 2}
        lines={['BÀI 5', 'NGÃ TƯ', 'CÓ ĐÈN TÍN HIỆU']}
      />
      <Sign
        position={[cx + HALF + 4.5, 0, 44.3]}
        rotationY={-Math.PI / 2}
        lines={['BÀI 6', 'ĐƯỜNG VÒNG', 'QUANH CO']}
      />
      <Sign
        position={[PARKING.entryX, 0, PARKING.laneFarZ + 1.6]}
        rotationY={-Math.PI / 2}
        lines={['BÀI 7', 'GHÉP XE DỌC', 'VÀO NƠI ĐỖ']}
      />
      <Sign
        position={[PARKING.bayCenterX, 0, PARKING_BAY.minZ - 1.4]}
        rotationY={0}
        lines={['NƠI ĐỖ XE']}
        background='#15803d'
      />
      <Sign
        position={[22, 0, RING.maxZ + HALF + 1.6]}
        rotationY={-Math.PI / 2}
        lines={['BÀI 8', 'DỪNG XE NƠI', 'ĐƯỜNG SẮT CHẠY QUA']}
      />
      <Sign
        position={[RING.maxX + HALF + 1.6, 0, 45]}
        rotationY={0}
        lines={['BÀI 9', 'THAY ĐỔI SỐ', 'TRÊN ĐƯỜNG BẰNG']}
      />
      <Sign position={[gearSignX, 0, YARD_EXAM.gear.startZ]} rotationY={0} lines={['BẮT ĐẦU', 'TĂNG TỐC']} />
      <Sign
        position={[gearSignX, 0, YARD_EXAM.gear.greenZ]}
        rotationY={0}
        lines={['24 km/h', 'SỐ 2 · TRÊN 24']}
        background='#15803d'
      />
      <Sign
        position={[gearSignX, 0, YARD_EXAM.gear.redZ]}
        rotationY={0}
        lines={['24 km/h', 'SỐ 1 · DƯỚI 24']}
        background='#b91c1c'
      />
      <Sign position={[cx - HALF - 3.6, 0, -11]} rotationY={Math.PI} lines={['BÀI 10', 'GHÉP XE NGANG']} />
      <Sign position={[-24, 0, RING.minZ - HALF - 1.6]} rotationY={Math.PI / 2} lines={['BÀI 11', 'KẾT THÚC']} />
      <Sign position={[-38.75, 0, -26.2]} rotationY={Math.PI} lines={['SÂN TẬP LÁI', 'SA HÌNH B1 / B2']} />

      {LAMP_POSTS.map(([x, z]) => (
        <LampPost key={`${x}:${z}`} x={x} z={z} />
      ))}
      {CONES.map(([x, z]) => (
        <Cone key={`${runId}:${x}:${z}`} x={x} z={z} />
      ))}
      <Trees />
    </group>
  );
}
