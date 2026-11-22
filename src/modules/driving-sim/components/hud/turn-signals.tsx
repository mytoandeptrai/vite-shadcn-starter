import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { usePress } from '../../hooks/use-press';
import { useSignalBlink } from '../../hooks/use-signal-blink';
import { useSimStore } from '../../store/sim-store';
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
        'ds-panel flex h-9 flex-1 items-center justify-center rounded-xl hover:border-white/40',
        active && 'border-emerald-400/80!'
      )}
    >
      <Arrow side={side} className={cn('size-5', active && lit ? 'text-emerald-400' : 'text-white/40')} />
    </button>
  );
}

/** Turn-signal stalk: two toggle buttons above the wheel, with the relay tick while one is on. */
export function SignalButtons() {
  const { signal, lit } = useSignalBlink();
  const paused = useSimStore((s) => s.phase !== 'driving' || s.guideOpen);

  useEffect(() => {
    if (signal !== 'off' && !paused) playSignalTick(lit);
  }, [signal, lit, paused]);

  return (
    <div className='flex items-center gap-1.5'>
      <SignalButton side='left' active={signal === 'left'} lit={lit} />
      <span className='font-semibold text-[10px] text-white/70 leading-none [text-shadow:0_1px_2px_rgb(0_0_0/0.8)] md:text-xs'>
        Xi-nhan
      </span>
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
      className={cn('flex items-center px-1.5 md:px-2.5', on ? 'text-emerald-400' : 'text-white/15')}
    >
      <Arrow side={side} className={cn('size-5 md:size-7', on && 'drop-shadow-[0_0_6px_rgb(52_211_153)]')} />
    </span>
  );
}
