import { useMedia } from './use-media';

/** True when the main input is a finger, so keyboard hints would only be noise. */
export function useTouchDevice(): boolean {
  return useMedia('(pointer: coarse)');
}
