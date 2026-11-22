import type { Object3D } from 'three';
import type { Vec2 } from '../types';
import { createDrivetrainState } from './drivetrain';

/** Mutable simulation state read by the HUD, cameras and minimap every frame. */
export const runtime = {
  drivetrain: createDrivetrainState(),
  pose: {
    x: 0,
    z: 0,
    /** Heading around +Y, 0 = facing +Z. */
    heading: 0,
    /** Signed forward speed, m/s. */
    speed: 0,
    wheels: [] as Vec2[],
  },
  /** Seconds of camera shake remaining (engine stall). */
  shake: 0,
  /** Visual chassis group, followed by the cameras. */
  chassis: null as Object3D | null,
  mirrorCanvas: { left: null as HTMLCanvasElement | null, right: null as HTMLCanvasElement | null },
};
