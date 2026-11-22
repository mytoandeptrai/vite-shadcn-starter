import { cn } from '@/lib/utils';
import { usePress } from '../../hooks/use-press';
import { useSimStore } from '../../store/sim-store';
import type { Gear } from '../../types';

function GearKnob({ gear, className }: { gear: Gear; className?: string }) {
  const current = useSimStore((s) => s.gear);
  const requestGear = useSimStore((s) => s.requestGear);
  const press = usePress(() => requestGear(gear));
  return (
    <button
      type='button'
      data-testid={`gear-${gear}`}
      aria-pressed={current === gear}
      aria-label={`Số ${gear}`}
      {...press}
      className={cn(
        'ds-gear-knob relative z-10 flex items-center justify-center font-black font-mono text-base text-white/70 transition-colors',
        'hover:text-white active:scale-95',
        className,
        current === gear && 'border-amber-300 bg-amber-400 text-slate-950 shadow-lg hover:text-slate-950'
      )}
    >
      {gear}
    </button>
  );
}

/** H-pattern gate for the manual gearbox. */
function HPattern() {
  const knob = 'rounded-full border-2 border-slate-500 bg-slate-800';
  return (
    <div className='ds-gear-h relative grid grid-cols-3 grid-rows-3 place-items-center'>
      <svg viewBox='0 0 180 160' className='absolute inset-0 size-full' aria-hidden='true'>
        <path
          d='M30 26 V134 M90 26 V134 M150 26 V134 M30 80 H150'
          fill='none'
          stroke='#64748b'
          strokeWidth='7'
          strokeLinecap='round'
        />
      </svg>
      <GearKnob gear='1' className={knob} />
      <GearKnob gear='3' className={knob} />
      <GearKnob gear='5' className={knob} />
      <span />
      <GearKnob gear='N' className={cn(knob, 'ds-gear-neutral')} />
      <span />
      <GearKnob gear='2' className={knob} />
      <GearKnob gear='4' className={knob} />
      <GearKnob gear='R' className={knob} />
    </div>
  );
}

function PrndGate() {
  return (
    <div className='ds-gear-prnd'>
      <GearKnob gear='P' className='rounded-xl' />
      <GearKnob gear='R' className='rounded-xl' />
      <GearKnob gear='N' className='rounded-xl' />
      <GearKnob gear='D' className='rounded-xl' />
    </div>
  );
}

/** Gear selector, always on screen: H gate for B2, P-R-N-D for B1. One tap picks a gear. */
export function GearSelector() {
  const transmission = useSimStore((s) => s.transmission);
  return (
    <div
      role='group'
      aria-label={transmission === 'B2' ? 'Cần số sàn' : 'Cần số tự động'}
      data-testid='gear-selector'
      className='ds-gear ds-panel rounded-2xl'
    >
      {transmission === 'B2' ? <HPattern /> : <PrndGate />}
    </div>
  );
}
