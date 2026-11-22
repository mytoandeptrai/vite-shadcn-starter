import { useEffect } from 'react';
import { useSimStore } from '../store/sim-store';
import type { Gear } from '../types';
import { input } from '../utils/input-state';

type HeldKey = keyof typeof input.keys;

const HELD: Record<string, HeldKey> = {
  KeyW: 'throttle',
  ArrowUp: 'throttle',
  KeyS: 'brake',
  ArrowDown: 'brake',
  KeyC: 'clutch',
  KeyX: 'halfClutch',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
};

const MANUAL_GEARS: Record<string, Gear> = {
  Digit1: '1',
  Digit2: '2',
  Digit3: '3',
  Digit4: '4',
  Digit5: '5',
  KeyR: 'R',
  KeyN: 'N',
};

/** `D` steers right, so Drive is on `F` (forward) for the automatic. */
const AUTO_GEARS: Record<string, Gear> = { KeyP: 'P', KeyR: 'R', KeyN: 'N', KeyF: 'D' };

function toggleLatch(side: -1 | 1): void {
  input.steerLatch = input.steerLatch === side ? 0 : side;
}

/** Desktop keyboard bindings, active while driving. */
export function useKeyboardControls(): void {
  useEffect(() => {
    const release = () => {
      for (const key of Object.keys(input.keys) as HeldKey[]) input.keys[key] = false;
    };
    const HELP = new Set(['KeyH', 'F1']);

    const onKeyDown = (e: KeyboardEvent) => {
      const store = useSimStore.getState();
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (store.guideOpen) {
        // The guide owns the keyboard: only its own close keys do anything.
        if (e.code === 'Escape' || HELP.has(e.code)) {
          e.preventDefault();
          store.setGuideOpen(false);
        }
        return;
      }
      if (HELP.has(e.code) && store.phase !== 'finished') {
        e.preventDefault();
        if (!e.repeat) store.setGuideOpen(true);
        return;
      }
      if (store.phase !== 'driving') return;

      const held = HELD[e.code];
      if (held) {
        e.preventDefault();
        input.keys[held] = true;
        return;
      }
      if (e.repeat) return;

      const gear = (store.transmission === 'B2' ? MANUAL_GEARS : AUTO_GEARS)[e.code];
      if (gear) {
        store.requestGear(gear);
        return;
      }
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          store.toggleHandbrake();
          break;
        case 'Enter':
          e.preventDefault();
          store.requestEngineStart();
          break;
        case 'KeyQ':
          toggleLatch(-1);
          break;
        case 'KeyE':
          toggleLatch(1);
          break;
        case 'KeyV':
          store.cycleCamera();
          break;
        case 'KeyM':
          store.toggleMuted();
          break;
        case 'KeyG':
          store.setShifterOpen(!store.shifterOpen);
          break;
        case 'Escape':
          store.openMenu();
          break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const held = HELD[e.code];
      if (held) input.keys[held] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', release);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', release);
      release();
    };
  }, []);
}
