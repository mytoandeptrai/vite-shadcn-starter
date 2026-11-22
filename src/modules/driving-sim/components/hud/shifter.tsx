import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePress } from '../../hooks/use-press';
import { useSimStore } from '../../store/sim-store';
import type { Gear } from '../../types';

export function ShifterButton() {
  const gear = useSimStore((s) => s.gear);
  const open = useSimStore((s) => s.shifterOpen);
  const setOpen = useSimStore((s) => s.setShifterOpen);
  const press = usePress(() => setOpen(!open));
  return (
    <button
      type='button'
      data-testid='shifter-button'
      aria-expanded={open}
      {...press}
      className={cn(
        'ds-panel flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-2.5',
        open && 'border-amber-300'
      )}
    >
      <span className='font-semibold text-xs leading-none'>Cần số</span>
      <span className='flex size-7 items-center justify-center rounded-md bg-amber-400 font-black font-mono text-base text-slate-950'>
        {gear}
      </span>
    </button>
  );
}

function GearKnob({ gear, className }: { gear: Gear; className?: string }) {
  const current = useSimStore((s) => s.gear);
  const requestGear = useSimStore((s) => s.requestGear);
  const setOpen = useSimStore((s) => s.setShifterOpen);
  const press = usePress(() => {
    if (requestGear(gear)) setOpen(false);
  });
  return (
    <button
      type='button'
      data-testid={`gear-${gear}`}
      aria-pressed={current === gear}
      {...press}
      className={cn(
        'relative z-10 flex size-12 items-center justify-center rounded-full border-2 border-slate-500 bg-slate-800 font-black font-mono text-lg shadow-lg transition-colors',
        'hover:border-amber-300 active:scale-95',
        current === gear && 'border-amber-300 bg-amber-400 text-slate-950',
        className
      )}
    >
      {gear}
    </button>
  );
}

/** H-pattern gate for the manual gearbox. */
function HPattern() {
  return (
    <div className='relative grid grid-cols-3 grid-rows-3 place-items-center gap-x-6 gap-y-2 px-2'>
      <svg viewBox='0 0 180 160' className='absolute inset-0 size-full' aria-hidden='true'>
        <path
          d='M32 26 V134 M90 26 V134 M148 26 V134 M32 80 H148'
          fill='none'
          stroke='#64748b'
          strokeWidth='7'
          strokeLinecap='round'
        />
      </svg>
      <GearKnob gear='1' />
      <GearKnob gear='3' />
      <GearKnob gear='5' />
      <span />
      <GearKnob gear='N' className='size-10 text-base' />
      <span />
      <GearKnob gear='2' />
      <GearKnob gear='4' />
      <GearKnob gear='R' />
    </div>
  );
}

function PrndGate() {
  return (
    <div className='relative flex flex-col items-center gap-2 px-6'>
      <div className='absolute inset-y-4 left-1/2 w-2 -translate-x-1/2 rounded-full bg-slate-600' />
      <GearKnob gear='P' />
      <GearKnob gear='R' />
      <GearKnob gear='N' />
      <GearKnob gear='D' />
    </div>
  );
}

/** Popup gear selector: H-shifter for B2, PRND gate for B1. */
export function ShifterPopup() {
  const open = useSimStore((s) => s.shifterOpen);
  const transmission = useSimStore((s) => s.transmission);
  const setOpen = useSimStore((s) => s.setShifterOpen);
  const close = usePress(() => setOpen(false));
  if (!open) return null;

  return (
    <div data-testid='shifter-popup' className='ds-panel ds-shifter-popup z-30 flex flex-col gap-3 rounded-2xl p-3'>
      <div className='flex items-center justify-between gap-6'>
        <div className='leading-tight'>
          <p className='font-bold text-sm'>{transmission === 'B2' ? 'Cần số sàn' : 'Cần số tự động'}</p>
          <p className='text-[11px] text-white/60'>
            {transmission === 'B2' ? 'Đạp hết côn rồi chọn số' : 'Giữ phanh rồi chọn số để ra khỏi P'}
          </p>
        </div>
        <button
          type='button'
          aria-label='Đóng'
          {...close}
          className='flex size-7 items-center justify-center rounded-md bg-white/10 hover:bg-white/20'
        >
          <X className='size-4' />
        </button>
      </div>
      {transmission === 'B2' ? <HPattern /> : <PrndGate />}
    </div>
  );
}
