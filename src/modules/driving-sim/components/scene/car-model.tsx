import { type RefObject, useEffect, useMemo } from 'react';
import { CanvasTexture, type Group, SRGBColorSpace } from 'three';
import { CAR } from '../../constants';

function useLabelTexture(text: string, background: string, color: string) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const c = canvas.getContext('2d');
    if (c) {
      c.fillStyle = background;
      c.fillRect(0, 0, 256, 64);
      c.fillStyle = color;
      c.font = 'bold 44px sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(text, 128, 34);
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, [text, background, color]);
  // The car remounts on every restart; materials do not dispose their maps.
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/** Low-poly training sedan. Chassis space: +Z forward, +X left, origin at the centre of mass. */
export function CarModel({ steeringWheelRef }: { steeringWheelRef: RefObject<Group | null> }) {
  const sign = useLabelTexture('TẬP LÁI', '#facc15', '#1f2937');
  const plate = useLabelTexture('29A-TL 2024', '#f8fafc', '#111827');
  const hw = CAR.width / 2;
  const hl = CAR.length / 2;

  return (
    <group>
      {/* Lower body */}
      <mesh position={[0, -0.02, 0]} castShadow>
        <boxGeometry args={[CAR.width, 0.52, CAR.length]} />
        <meshStandardMaterial color='#f4f6f8' roughness={0.35} metalness={0.2} />
      </mesh>
      {/* Side stripe */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[CAR.width + 0.01, 0.1, CAR.length - 0.5]} />
        <meshStandardMaterial color='#2563eb' roughness={0.4} />
      </mesh>
      {/* Bumpers */}
      <mesh position={[0, -0.2, hl - 0.02]}>
        <boxGeometry args={[CAR.width - 0.1, 0.16, 0.08]} />
        <meshStandardMaterial color='#1f2937' roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.2, -hl + 0.02]}>
        <boxGeometry args={[CAR.width - 0.1, 0.16, 0.08]} />
        <meshStandardMaterial color='#1f2937' roughness={0.7} />
      </mesh>
      {/* Cabin glass */}
      <mesh position={[0, 0.5, -0.25]} castShadow>
        <boxGeometry args={[CAR.width - 0.2, 0.52, 2.3]} />
        <meshStandardMaterial color='#0f172a' roughness={0.15} metalness={0.5} transparent opacity={0.82} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.78, -0.25]} castShadow>
        <boxGeometry args={[CAR.width - 0.18, 0.05, 2.34]} />
        <meshStandardMaterial color='#f4f6f8' roughness={0.35} />
      </mesh>
      {/* Headliner, seen from the driver camera */}
      <mesh position={[0, 0.752, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CAR.width - 0.2, 2.3]} />
        <meshBasicMaterial color='#39414d' />
      </mesh>
      {/* Cabin pillars */}
      {[
        [-1, 0.9],
        [1, 0.9],
        [-1, -1.4],
        [1, -1.4],
      ].map(([side, z]) => (
        <mesh key={`${side}:${z}`} position={[side * (hw - 0.12), 0.5, z]}>
          <boxGeometry args={[0.07, 0.52, 0.07]} />
          <meshStandardMaterial color='#e5e9ee' roughness={0.4} />
        </mesh>
      ))}
      {/* Roof sign */}
      <mesh position={[0, 0.9, -0.2]}>
        <boxGeometry args={[0.9, 0.2, 0.14]} />
        <meshStandardMaterial color='#facc15' />
      </mesh>
      <mesh position={[0, 0.9, -0.2 + 0.072]}>
        <planeGeometry args={[0.88, 0.19]} />
        <meshBasicMaterial map={sign} />
      </mesh>
      <mesh position={[0, 0.9, -0.2 - 0.072]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.88, 0.19]} />
        <meshBasicMaterial map={sign} />
      </mesh>
      {/* Lights */}
      {[1, -1].map((side) => (
        <group key={side}>
          <mesh position={[side * (hw - 0.3), 0.08, hl + 0.005]}>
            <boxGeometry args={[0.42, 0.14, 0.03]} />
            <meshStandardMaterial color='#fff7d6' emissive='#fff2b0' emissiveIntensity={0.7} />
          </mesh>
          <mesh position={[side * (hw - 0.3), 0.1, -hl - 0.005]}>
            <boxGeometry args={[0.42, 0.14, 0.03]} />
            <meshStandardMaterial color='#b91c1c' emissive='#ef4444' emissiveIntensity={0.6} />
          </mesh>
          {/* Door mirrors */}
          <mesh position={[side * (hw + 0.1), 0.3, 0.72]}>
            <boxGeometry args={[0.2, 0.13, 0.08]} />
            <meshStandardMaterial color='#111827' />
          </mesh>
        </group>
      ))}
      {/* Number plates */}
      <mesh position={[0, -0.05, hl + 0.022]}>
        <planeGeometry args={[0.5, 0.12]} />
        <meshBasicMaterial map={plate} />
      </mesh>
      <mesh position={[0, 0, -hl - 0.022]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.5, 0.12]} />
        <meshBasicMaterial map={plate} />
      </mesh>
      {/* Dashboard and steering wheel, visible from the driver camera */}
      <mesh position={[0, 0.27, 0.88]}>
        <boxGeometry args={[CAR.width - 0.24, 0.14, 0.34]} />
        <meshStandardMaterial color='#1e2530' roughness={0.8} />
      </mesh>
      <group ref={steeringWheelRef} position={[0.38, 0.3, 0.68]}>
        <mesh>
          <torusGeometry args={[0.15, 0.018, 8, 28]} />
          <meshStandardMaterial color='#0b0f14' roughness={0.6} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.28, 0.035, 0.02]} />
          <meshStandardMaterial color='#0b0f14' />
        </mesh>
        <mesh position={[0, -0.07, 0]}>
          <boxGeometry args={[0.035, 0.14, 0.02]} />
          <meshStandardMaterial color='#0b0f14' />
        </mesh>
      </group>
    </group>
  );
}
