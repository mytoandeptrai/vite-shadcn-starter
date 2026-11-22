import { useEffect, useState } from 'react';
import { useSimStore } from '../store/sim-store';
import type { TurnSignal } from '../types';

/** Half period of the turn-signal relay, ms. */
export const SIGNAL_HALF_PERIOD = 400;

/** Whether the lamps are lit at `now`, for a signal switched on at `since`. */
export const signalLit = (since: number, now: number) => Math.floor((now - since) / SIGNAL_HALF_PERIOD) % 2 === 0;

/** The active turn signal and whether its lamp is in the lit half of the blink. */
export function useSignalBlink(): { signal: TurnSignal; lit: boolean } {
  const signal = useSimStore((s) => s.signal);
  const signalAt = useSimStore((s) => s.signalAt);
  const [lit, setLit] = useState(true);

  useEffect(() => {
    setLit(true);
    if (signal === 'off') return;
    const id = setInterval(() => setLit(signalLit(signalAt, performance.now())), SIGNAL_HALF_PERIOD / 4);
    return () => clearInterval(id);
  }, [signal, signalAt]);

  return { signal, lit: signal !== 'off' && lit };
}
