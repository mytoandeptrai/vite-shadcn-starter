import { useEffect, useRef } from 'react';

/** Runs `callback` on every animation frame while the component is mounted. */
export function useAnimationFrame(callback: () => void): void {
  const latest = useRef(callback);
  latest.current = callback;

  useEffect(() => {
    let id = 0;
    const loop = () => {
      latest.current();
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);
}
