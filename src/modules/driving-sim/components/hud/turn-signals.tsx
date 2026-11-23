import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { usePress } from '../../hooks/use-press';
import { useSignalBlink } from '../../hooks/use-signal-blink';
import { isPaused, useSimStore } from '../../store/sim-store';
import { playSignalTick } from '../../utils/audio';

type Side = 'left' | 'right';

function Arrow({ side, className }: { side: Side; className?: string }) {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' className={cn(className, side === 'right' && '-scale-x-100')}>
      <path d='M11 4 2 12l9 8v-5h11V9H11z' fill='currentColor' />
    </svg>
  );
}

function SignalButton({ side, active, lit }: { side: Side; active: boolean; lit: boolean }) {
  const toggleSignal = useSimStore((s) => s.toggleSignal);
  const press = usePress(() => toggleSignal(side));
  const label = `Xi-nhan ${side === 'left' ? 'trái (,)' : 'phải (.)'}`;
  return (
    <button
      type='button'
      data-testid={`signal-${side}`}
      aria-pressed={active}
      aria-label={label}
      title={label}
      {...press}
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:border-white/40',
        active && 'border-emerald-400/80 bg-emerald-400/10'
      )}
    >
      <Arrow side={side} className={cn('size-6', active && lit ? 'text-emerald-400' : 'text-white/55')} />
    </button>
  );
}

/** Turn-signal stalk: a toggle button either side of `children`, with the relay tick while one is on. */
export function SignalButtons({ children }: { children: React.ReactNode }) {
  const { signal, lit } = useSignalBlink();
  const paused = useSimStore(isPaused);

  useEffect(() => {
    if (signal !== 'off' && !paused) playSignalTick(lit);
  }, [signal, lit, paused]);

  return (
    <div className='flex items-center gap-1'>
      <SignalButton side='left' active={signal === 'left'} lit={lit} />
      {children}
      <SignalButton side='right' active={signal === 'right'} lit={lit} />
    </div>
  );
}

/** Green dashboard arrow that blinks while its signal is on. */
export function SignalLamp({ side }: { side: Side }) {
  const { signal, lit } = useSignalBlink();
  const on = signal === side && lit;
  return (
    <span
      data-testid={`signal-lamp-${side}`}
      data-on={signal === side}
      className={cn(
        'flex size-7 items-center justify-center rounded-lg',
        on ? 'bg-emerald-400/15 text-emerald-400' : 'text-white/25'
      )}
    >
      <Arrow side={side} className={cn('size-4', on && 'drop-shadow-[0_0_6px_rgb(52_211_153)]')} />
    </span>
  );
}
