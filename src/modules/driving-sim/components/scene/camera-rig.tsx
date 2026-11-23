import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { type DirectionalLight, MathUtils, PerspectiveCamera, Quaternion, Vector3, WebGLRenderTarget } from 'three';
import { CAR } from '../../constants';
import { useSimStore } from '../../store/sim-store';
import { runtime } from '../../utils/runtime';

const MIRROR_SIZE = { width: 224, height: 128 };
const SUN_OFFSET = new Vector3(18, 30, -12);

/** Linear → sRGB lookup, render targets hold linear colour. */
const SRGB_LUT = new Uint8ClampedArray(256);
for (let i = 0; i < 256; i++) {
  const c = i / 255;
  SRGB_LUT[i] = Math.round((c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055) * 255);
}

const position = new Vector3();
const quaternion = new Quaternion();
const forward = new Vector3();
const target = new Vector3();
const desired = new Vector3();
const scratch = new Vector3();

interface Orbit {
  yaw: number;
  pitch: number;
  dragging: boolean;
}

/**
 * Drives the main camera (chase / driver / top-down), keeps the sun shadow centred on the car
 * and renders both door-mirror views into the HUD canvases.
 */
export function CameraRig({
  sun,
  mirrorInterval,
}: {
  sun: React.RefObject<DirectionalLight | null>;
  /** Frames between mirror refreshes (the two mirrors alternate). */
  mirrorInterval: number;
}) {
  const cameraMode = useSimStore((s) => s.cameraMode);
  const runId = useSimStore((s) => s.runId);
  const scenario = useSimStore((s) => s.scenario);
  const { gl, camera } = useThree();
  const orbit = useRef<Orbit>({ yaw: 0, pitch: 0, dragging: false });
  const snap = useRef(true);
  const frame = useRef(0);

  const mirrors = useMemo(() => {
    const make = () => {
      const cam = new PerspectiveCamera(52, MIRROR_SIZE.width / MIRROR_SIZE.height, 0.15, 160);
      return {
        camera: cam,
        target: new WebGLRenderTarget(MIRROR_SIZE.width, MIRROR_SIZE.height),
        pixels: new Uint8Array(MIRROR_SIZE.width * MIRROR_SIZE.height * 4),
        image: new ImageData(MIRROR_SIZE.width, MIRROR_SIZE.height),
        reading: false,
      };
    };
    return { left: make(), right: make() };
  }, []);

  useEffect(
    () => () => {
      mirrors.left.target.dispose();
      mirrors.right.target.dispose();
    },
    [mirrors]
  );

  // Snap (no easing) whenever the view or the run changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new run or scenario must also re-snap the camera
  useEffect(() => {
    snap.current = true;
    orbit.current.yaw = 0;
    orbit.current.pitch = 0;
    if (camera instanceof PerspectiveCamera) {
      camera.fov = cameraMode === 'driver' ? 66 : cameraMode === 'top' ? 42 : 55;
      camera.updateProjectionMatrix();
    }
  }, [cameraMode, runId, scenario, camera]);

  // Drag on the canvas to orbit the chase camera.
  useEffect(() => {
    const el = gl.domElement;
    let last: { x: number; y: number } | null = null;
    const down = (e: PointerEvent) => {
      last = { x: e.clientX, y: e.clientY };
      orbit.current.dragging = true;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!last) return;
      orbit.current.yaw -= (e.clientX - last.x) * 0.006;
      orbit.current.pitch = MathUtils.clamp(orbit.current.pitch + (e.clientY - last.y) * 0.004, -0.2, 0.9);
      last = { x: e.clientX, y: e.clientY };
    };
    const up = () => {
      last = null;
      orbit.current.dragging = false;
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, [gl]);

  useFrame(({ scene }, delta) => {
    const chassis = runtime.chassis;
    // One shadow pass per frame, shared by the mirror and main renders.
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
    if (chassis) {
      chassis.updateWorldMatrix(true, false);
      chassis.getWorldPosition(position);
      chassis.getWorldQuaternion(quaternion);
      forward.set(0, 0, 1).applyQuaternion(quaternion);
      const heading = Math.atan2(forward.x, forward.z);
      const ease = snap.current ? 1 : 1 - Math.exp(-delta * 5);

      if (cameraMode === 'driver') {
        camera.position.set(0.38, 0.6, 0.1).applyQuaternion(quaternion).add(position);
        target.set(0.38, 0.42, 6).applyQuaternion(quaternion).add(position);
        camera.up.set(0, 1, 0).applyQuaternion(quaternion);
        camera.lookAt(target);
      } else if (cameraMode === 'top') {
        desired.set(position.x, position.y + 34, position.z);
        camera.position.lerp(desired, ease);
        camera.up.set(0, 0, 1);
        camera.lookAt(camera.position.x, 0, camera.position.z);
      } else {
        const o = orbit.current;
        // The orbit drifts back behind the car once released and moving.
        if (!o.dragging && Math.abs(runtime.pose.speed) > 0.5) {
          o.yaw *= Math.exp(-delta * 1.5);
          o.pitch *= Math.exp(-delta * 1.5);
        }
        const yaw = heading + o.yaw;
        const pitch = 0.36 + o.pitch;
        const distance = 8.2;
        desired.set(
          position.x - Math.sin(yaw) * Math.cos(pitch) * distance,
          position.y + 0.6 + Math.sin(pitch) * distance,
          position.z - Math.cos(yaw) * Math.cos(pitch) * distance
        );
        camera.position.lerp(desired, ease);
        camera.up.set(0, 1, 0);
        target.copy(position).addScaledVector(forward, 1.5);
        target.y += 0.5;
        camera.lookAt(target);
      }
      snap.current = false;

      if (runtime.shake > 0) {
        const amount = runtime.shake * 0.09;
        camera.position.x += (Math.random() - 0.5) * amount;
        camera.position.y += (Math.random() - 0.5) * amount;
        camera.rotateZ((Math.random() - 0.5) * amount * 0.25);
      }

      if (sun.current) {
        sun.current.position.copy(position).add(SUN_OFFSET);
        sun.current.target.position.copy(position);
        sun.current.target.updateMatrixWorld();
      }

      // Mirrors take turns so only one extra view is rendered per refresh.
      frame.current += 1;
      const turn = frame.current / mirrorInterval;
      const side = turn % 2 === 0 ? 'left' : 'right';
      const canvas = Number.isInteger(turn) ? runtime.mirrorCanvas[side] : null;
      const context = canvas?.getContext('2d');
      const mirror = mirrors[side];
      if (context && !mirror.reading) {
        const sign = side === 'left' ? 1 : -1;
        const x = sign * (CAR.width / 2 + 0.16);
        mirror.camera.position.set(x, 0.36, 0.74).applyQuaternion(quaternion).add(position);
        scratch
          .set(x + sign * 0.55, -0.95, -3.6)
          .applyQuaternion(quaternion)
          .add(position);
        mirror.camera.up.set(0, 1, 0);
        mirror.camera.lookAt(scratch);
        gl.setRenderTarget(mirror.target);
        gl.render(scene, mirror.camera);
        gl.setRenderTarget(null);
        // Read the pixels back asynchronously: a blocking read stalls the frame until the GPU
        // has finished everything queued before it, which makes the car lurch on slow devices.
        mirror.reading = true;
        gl.readRenderTargetPixelsAsync(mirror.target, 0, 0, MIRROR_SIZE.width, MIRROR_SIZE.height, mirror.pixels)
          .then(() => {
            const out = mirror.image.data;
            const src = mirror.pixels;
            for (let i = 0; i < src.length; i += 4) {
              out[i] = SRGB_LUT[src[i]];
              out[i + 1] = SRGB_LUT[src[i + 1]];
              out[i + 2] = SRGB_LUT[src[i + 2]];
              out[i + 3] = 255;
            }
            // GL rows are bottom-up and a mirror flips left/right: the canvas is rotated 180° in CSS.
            context.putImageData(mirror.image, 0, 0);
          })
          .catch(() => {
            // The render target was disposed while the read was in flight.
          })
          .finally(() => {
            mirror.reading = false;
          });
      }
    }
    gl.render(scene, camera);
  }, 1);

  return null;
}

export const MIRROR_RESOLUTION = MIRROR_SIZE;
