import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Suspense, useRef, useState } from 'react';
import type { DirectionalLight } from 'three';
import { useSimStore } from '../../store/sim-store';
import { detectQuality } from '../../utils/quality';
import { CameraRig } from './camera-rig';
import { Track } from './track';
import { Vehicle } from './vehicle';

function World({ shadows }: { shadows: boolean }) {
  const runId = useSimStore((s) => s.runId);
  const scenario = useSimStore((s) => s.scenario);
  const paused = useSimStore((s) => s.phase !== 'driving');
  const sun = useRef<DirectionalLight>(null);

  return (
    <>
      <color attach='background' args={['#a9d3f5']} />
      <fog attach='fog' args={['#a9d3f5', 70, 190]} />
      <hemisphereLight args={['#dbeafe', '#6b7f55', 0.9]} />
      <directionalLight
        ref={sun}
        intensity={2.1}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-bias={-0.0004}
      />
      <Physics gravity={[0, -9.81, 0]} timeStep={1 / 60} paused={paused}>
        <Track runId={runId} />
        <Vehicle key={`${runId}:${scenario}`} />
      </Physics>
      <CameraRig sun={sun} mirrorInterval={shadows ? 1 : 2} />
    </>
  );
}

export default function SimScene() {
  const [quality] = useState(detectQuality);
  const high = quality === 'high';
  return (
    <Canvas
      shadows={high}
      flat
      dpr={high ? [1, 1.5] : 0.7}
      camera={{ fov: 55, near: 0.1, far: 400, position: [-14, 6, -20] }}
      gl={{ antialias: high, powerPreference: 'high-performance' }}
      className='touch-none'
    >
      <Suspense fallback={null}>
        <World shadows={high} />
      </Suspense>
    </Canvas>
  );
}
