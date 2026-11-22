import { useSyncExternalStore } from 'react';

const QUERY = '(pointer: coarse)';

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

/** True when the main input is a finger, so keyboard hints would only be noise. */
export function useTouchDevice(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
