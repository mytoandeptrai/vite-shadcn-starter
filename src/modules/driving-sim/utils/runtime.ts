import type { Object3D } from 'three';
import type { Lights, NpcCar, Vec2, YardProgress } from '../types';
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
  /** Other cars on the road (road test), updated every physics step. */
  npcs: [] as NpcCar[],
  /** Crossroads traffic lights of the yard, updated every physics step. */
  lights: { ns: 'green', ew: 'red' } as Lights,
  /** Full yard exam: the exercise being driven, for the minimap. */
  yard: null as YardProgress | null,
  /** Seconds of camera shake remaining (engine stall). */
  shake: 0,
  /** Visual chassis group, followed by the cameras. */
  chassis: null as Object3D | null,
  mirrorCanvas: { left: null as HTMLCanvasElement | null, right: null as HTMLCanvasElement | null },
};
