import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { type ReactNode, useLayoutEffect, useMemo, useRef } from 'react';
import {
  CanvasTexture,
  Euler,
  type Group,
  type InstancedMesh,
  Matrix4,
  type MeshStandardMaterial,
  Quaternion,
  SRGBColorSpace,
  Vector3,
} from 'three';
import { NPC, ROAD } from '../../constants';
import { runtime } from '../../utils/runtime';
import { useDisposable } from '../../hooks/use-disposable';
import { Sign, useAsphaltTexture } from './track';

const START_Z = -30;
/** The road runs on past the final stop sign, so the cars in front drive off into the distance. */
const END_Z = ROAD.length + 260;
const LENGTH = END_Z - START_Z;
const CENTER_Z = (START_Z + END_Z) / 2;
const RAIL_X = ROAD.halfWidth + 0.4;
const SIGN_X = -(RAIL_X + 1.6);
const LINE_LIFT = 0.02;
const LINE_X = ROAD.laneWidth;
const DASH = { length: 3, period: 9 };
const LIMIT_SIGNS = [20, 520, 1020, 1520];

const IDENTITY = new Quaternion();
const at = (x: number, y: number, z: number, scale = 1, rotation = IDENTITY) =>
  new Matrix4().compose(new Vector3(x, y, z), rotation, new Vector3(scale, scale, scale));

/** Deterministic 0..1 jitter so the scenery is the same on every run. */
const jitter = (i: number, salt: number) => ((i * 9301 + salt * 49297) % 233280) / 233280;

function buildScenery() {
  const dashes: Matrix4[] = [];
  for (let z = START_Z + 2; z < END_Z; z += DASH.period) dashes.push(at(0, LINE_LIFT, z));

  const trunks: Matrix4[] = [];
  const cones: Matrix4[] = [];
  const rounds: Matrix4[] = [];
  for (let i = 0, z = START_Z + 6; z < END_Z; z += 12, i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const x = side * (RAIL_X + 4.2 + jitter(i, 1) * 5);
    const scale = 1.2 + jitter(i, 2) * 0.9;
    trunks.push(at(x, 0.8 * scale, z, scale));
    (i % 3 === 0 ? rounds : cones).push(at(x, (i % 3 === 0 ? 2.4 : 2.9) * scale, z, scale));
  }

  const posts: Matrix4[] = [];
  for (let z = START_Z; z <= END_Z; z += 6) posts.push(at(-RAIL_X, 0.35, z), at(RAIL_X, 0.35, z));

  const poles: Matrix4[] = [];
  const arms: Matrix4[] = [];
  const heads: Matrix4[] = [];
  for (let i = 0, z = 30; z < END_Z; z += 60, i++) {
    const side = i % 2 === 0 ? 1 : -1;
    const x = side * (RAIL_X + 0.9);
    poles.push(at(x, 3.2, z));
    arms.push(at(x - side * 0.9, 6.3, z));
    heads.push(at(x - side * 1.8, 6.2, z));
  }
  return { dashes, trunks, cones, rounds, posts, poles, arms, heads };
}

/** Many copies of one static mesh in a single draw call. */
function Instances({ matrices, children }: { matrices: Matrix4[]; children: ReactNode }) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    matrices.forEach((matrix, i) => {
      mesh.setMatrixAt(i, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [matrices]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, matrices.length]} frustumCulled={false}>
      {children}
    </instancedMesh>
  );
}

function useLimitTexture() {
  return useDisposable(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const c = canvas.getContext('2d');
    if (c) {
      c.fillStyle = '#dc2626';
      c.beginPath();
      c.arc(128, 128, 126, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#ffffff';
      c.beginPath();
      c.arc(128, 128, 96, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#111827';
      c.font = 'bold 120px sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(String(ROAD.speedLimitKmh), 128, 136);
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, []);
}

/** Round "maximum speed" sign facing the oncoming driver. */
function LimitSign({ z, texture }: { z: number; texture: CanvasTexture }) {
  return (
    <group position={[-(RAIL_X + 0.9), 0, z]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2.4, 8]} />
        <meshStandardMaterial color='#9ca3af' metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 2.6, 0.03]}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
      <mesh position={[0, 2.6, 0.02]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial color='#9ca3af' />
      </mesh>
    </group>
  );
}

/** Line painted across the driving lane where a test step starts or is checked. */
function LaneLine({ z, color }: { z: number; color: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-LINE_X / 2, LINE_LIFT, z]}>
      <planeGeometry args={[LINE_X - 0.3, 0.3]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
}

const FRONT = new Euler(0, 0, 0);
const BACK = new Euler(0, Math.PI, 0);

/** The other road users. They have no colliders: touching one ends the test. */
function NpcCars() {
  const cars = useRef<(Group | null)[]>([]);
  const paint = useRef<(MeshStandardMaterial | null)[]>([]);
  const lamps = useRef<(MeshStandardMaterial | null)[]>([]);

  useFrame(() => {
    cars.current.forEach((group, i) => {
      if (!group) return;
      const npc = runtime.npcs[i];
      group.visible = Boolean(npc);
      if (!npc) return;
      group.position.set(npc.x, 0, npc.z);
      group.rotation.copy(npc.speed < 0 ? BACK : FRONT);
      paint.current[i]?.color.set(npc.color);
      const lamp = lamps.current[i];
      if (lamp) lamp.emissiveIntensity = npc.braking ? 3 : 0.4;
    });
  });

  const hw = NPC.width / 2;
  const hl = NPC.length / 2;
  return (
    <>
      {[0, 1, 2].map((i) => (
        <group
          key={i}
          ref={(el) => {
            cars.current[i] = el;
          }}
          visible={false}
        >
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[NPC.width, 0.6, NPC.length]} />
            <meshStandardMaterial
              ref={(el) => {
                paint.current[i] = el;
              }}
              roughness={0.4}
              metalness={0.2}
            />
          </mesh>
          <mesh position={[0, 1.15, -0.25]} castShadow>
            <boxGeometry args={[NPC.width - 0.2, 0.5, 2.2]} />
            <meshStandardMaterial color='#1e293b' roughness={0.2} metalness={0.4} />
          </mesh>
          {[
            [hw - 0.12, 1.35],
            [-hw + 0.12, 1.35],
            [hw - 0.12, -1.35],
            [-hw + 0.12, -1.35],
          ].map(([x, z]) => (
            <mesh key={`${x}:${z}`} position={[x, 0.3, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 0.22, 14]} />
              <meshStandardMaterial color='#15171a' roughness={0.9} />
            </mesh>
          ))}
          <mesh position={[0, 0.7, -hl - 0.01]}>
            <boxGeometry args={[NPC.width - 0.2, 0.16, 0.04]} />
            <meshStandardMaterial
              ref={(el) => {
                lamps.current[i] = el;
              }}
              color='#b91c1c'
              emissive='#ef4444'
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[0, 0.65, hl + 0.01]}>
            <boxGeometry args={[NPC.width - 0.2, 0.14, 0.04]} />
            <meshStandardMaterial color='#fff7d6' emissive='#fff2b0' emissiveIntensity={0.7} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/** Road test course: a straight two-lane road with markings, signs, guardrails, lamps and trees. */
export function RoadTrack() {
  const asphalt = useAsphaltTexture(ROAD.halfWidth / 2, LENGTH / 4);
  const limit = useLimitTexture();
  const scenery = useMemo(buildScenery, []);

  return (
    <group>
      <RigidBody type='fixed' colliders={false}>
        <CuboidCollider args={[60, 0.5, LENGTH / 2 + 20]} position={[0, -0.5, CENTER_Z]} friction={1} />
        <CuboidCollider args={[0.15, 0.6, LENGTH / 2]} position={[-RAIL_X, 0.6, CENTER_Z]} />
        <CuboidCollider args={[0.15, 0.6, LENGTH / 2]} position={[RAIL_X, 0.6, CENTER_Z]} />
        <CuboidCollider args={[RAIL_X, 0.6, 0.3]} position={[0, 0.6, START_Z]} />
        <CuboidCollider args={[RAIL_X, 0.6, 0.3]} position={[0, 0.6, END_Z]} />
      </RigidBody>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, CENTER_Z]} receiveShadow>
        <planeGeometry args={[900, LENGTH + 700]} />
        <meshStandardMaterial color='#5a9a4a' roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, CENTER_Z]} receiveShadow>
        <planeGeometry args={[ROAD.halfWidth * 2, LENGTH]} />
        <meshStandardMaterial map={asphalt} roughness={0.95} />
      </mesh>

      {/* Solid shoulder lines, kerbs and guardrails on both sides */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[side * LINE_X, LINE_LIFT, CENTER_Z]}>
            <planeGeometry args={[0.15, LENGTH]} />
            <meshStandardMaterial color='#f1f5f9' roughness={0.6} />
          </mesh>
          <mesh position={[side * (ROAD.halfWidth + 0.12), 0.08, CENTER_Z]}>
            <boxGeometry args={[0.24, 0.16, LENGTH]} />
            <meshStandardMaterial color='#d6d3d1' />
          </mesh>
          <mesh position={[side * RAIL_X, 0.62, CENTER_Z]}>
            <boxGeometry args={[0.07, 0.28, LENGTH]} />
            <meshStandardMaterial color='#cbd5e1' metalness={0.6} roughness={0.35} />
          </mesh>
        </group>
      ))}

      {/* Dashed centre line */}
      <Instances matrices={scenery.dashes}>
        <boxGeometry args={[0.15, 0.005, DASH.length]} />
        <meshStandardMaterial color='#fde047' roughness={0.6} />
      </Instances>
      <Instances matrices={scenery.posts}>
        <boxGeometry args={[0.1, 0.7, 0.1]} />
        <meshStandardMaterial color='#94a3b8' />
      </Instances>

      {/* Lamp posts */}
      <Instances matrices={scenery.poles}>
        <cylinderGeometry args={[0.07, 0.1, 6.4, 8]} />
        <meshStandardMaterial color='#64748b' metalness={0.5} roughness={0.4} />
      </Instances>
      <Instances matrices={scenery.arms}>
        <boxGeometry args={[1.9, 0.08, 0.08]} />
        <meshStandardMaterial color='#64748b' metalness={0.5} roughness={0.4} />
      </Instances>
      <Instances matrices={scenery.heads}>
        <boxGeometry args={[0.6, 0.12, 0.26]} />
        <meshStandardMaterial color='#fef9c3' emissive='#fde68a' emissiveIntensity={0.6} />
      </Instances>

      {/* Street trees */}
      <Instances matrices={scenery.trunks}>
        <cylinderGeometry args={[0.15, 0.2, 1.6, 6]} />
        <meshStandardMaterial color='#7c4a21' />
      </Instances>
      <Instances matrices={scenery.cones}>
        <coneGeometry args={[1.2, 3, 7]} />
        <meshStandardMaterial color='#2f7a3a' />
      </Instances>
      <Instances matrices={scenery.rounds}>
        <icosahedronGeometry args={[1.25, 0]} />
        <meshStandardMaterial color='#3f8f45' flatShading />
      </Instances>

      {/* Test steps: start line, speed window, checkpoint, finish zone, final stop */}
      <LaneLine z={0} color='#ffffff' />
      <LaneLine z={ROAD.speedUp.from} color='#38bdf8' />
      <LaneLine z={ROAD.speedUp.to} color='#38bdf8' />
      <LaneLine z={ROAD.slowDown.from} color='#38bdf8' />
      <LaneLine z={ROAD.slowDown.to} color='#38bdf8' />
      <LaneLine z={ROAD.finishFrom} color='#38bdf8' />
      <LaneLine z={ROAD.length} color='#ef4444' />

      <Sign
        position={[SIGN_X, 0, 2]}
        rotationY={Math.PI}
        lines={['BẮT ĐẦU', 'THI ĐƯỜNG TRƯỜNG']}
        background='#15803d'
      />
      <Sign position={[SIGN_X, 0, ROAD.speedUp.from]} rotationY={Math.PI} lines={['TĂNG SỐ', 'TĂNG TỐC']} />
      <Sign
        position={[SIGN_X, 0, ROAD.speedUp.to]}
        rotationY={Math.PI}
        lines={['HẾT 100 M', `TRÊN ${ROAD.speedUp.minKmh} KM/H`]}
      />
      <Sign position={[SIGN_X, 0, ROAD.slowDown.from]} rotationY={Math.PI} lines={['GIẢM SỐ', 'GIẢM TỐC']} />
      <Sign
        position={[SIGN_X, 0, ROAD.slowDown.to]}
        rotationY={Math.PI}
        lines={['KIỂM TRA TỐC ĐỘ', `DƯỚI ${ROAD.slowDown.maxKmh} KM/H`]}
      />
      <Sign position={[SIGN_X, 0, ROAD.finishFrom]} rotationY={Math.PI} lines={['KẾT THÚC', 'TẤP VÀO LỀ PHẢI']} />
      <Sign position={[SIGN_X, 0, ROAD.length]} rotationY={Math.PI} lines={['DỪNG XE']} background='#b91c1c' />
      {LIMIT_SIGNS.map((z) => (
        <LimitSign key={z} z={z} texture={limit} />
      ))}

      <NpcCars />
    </group>
  );
}
