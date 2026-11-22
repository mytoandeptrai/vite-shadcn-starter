import { useRef } from 'react';

/** A click that arrives this soon after a second-finger press is the same tap. */
const DUPLICATE_CLICK_MS = 500;

/**
 * Button activation that keeps working while another finger is already on the screen.
 * Browsers only synthesise `click` for single-finger taps, so a button tapped while a pedal is
 * held would never fire. Second-finger presses are handled on pointer down instead.
 */
export function usePress(action: () => void) {
  const pressedAt = useRef(Number.NEGATIVE_INFINITY);
  return {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType !== 'touch' || e.isPrimary) return;
      pressedAt.current = e.timeStamp;
      action();
    },
    onClick: (e: React.MouseEvent) => {
      if (e.timeStamp - pressedAt.current < DUPLICATE_CLICK_MS) return;
      action();
    },
  };
}
