import { CircleParking, Power } from 'lucide-react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { CLUTCH } from '../../constants';
import { useAnimationFrame } from '../../hooks/use-animation-frame';
import { usePress } from '../../hooks/use-press';
import { useSimStore } from '../../store/sim-store';
import { BITE_CLUTCH_DEPTH, input, moveClutchTo, setClutch } from '../../utils/input-state';
import { clamp } from '../../utils/math';
import { ShifterButton } from './shifter';

const relativeY = (e: React.PointerEvent<HTMLElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  return clamp((e.clientY - rect.top) / rect.height, 0, 1);
};

interface PedalProps {
  kind: 'throttle' | 'brake';
  label: string;
  hotkey: string;
  fillClass: string;
}

/** Touch pedal: press higher up for more travel. The fill shows the actual pedal depth. */
function Pedal({ kind, label, hotkey, fillClass }: PedalProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useAnimationFrame(() => {
    const depth = input[kind];
    if (fillRef.current) fillRef.current.style.height = `${(depth * 100).toFixed(1)}%`;
    if (valueRef.current) valueRef.current.textContent = `${Math.round(depth * 100)}%`;
  });

  const press = (e: React.PointerEvent<HTMLButtonElement>) => {
    input.pedal[kind] = clamp(1.12 - relativeY(e), 0.2, 1);
  };
  const release = () => {
    input.pedal[kind] = null;
  };

  return (
    <button
      type='button'
      data-testid={`pedal-${kind}`}
      aria-label={label}
      className='ds-panel relative flex h-full min-w-14 flex-1 touch-none flex-col items-center justify-between overflow-hidden rounded-xl py-1.5 md:min-w-[4.5rem]'
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        press(e);
      }}
      onPointerMove={(e) => {
        if (input.pedal[kind] !== null) press(e);
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div ref={fillRef} className={cn('absolute inset-x-0 bottom-0 h-0', fillClass)} />
      <span ref={valueRef} className='relative font-bold font-mono text-xs'>
        0%
      </span>
      <span className='relative flex flex-col items-center leading-tight'>
        <span className='font-bold text-sm'>{label}</span>
        <span className='hidden text-[10px] text-white/60 md:block'>{hotkey}</span>
      </span>
    </button>
  );
}

/** Vertical clutch slider. Stays where it is put, so the bite point can be held on a hill. */
function ClutchSlider() {
  const fillRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const dragging = useRef(false);

  useAnimationFrame(() => {
    const pct = `${(input.clutch * 100).toFixed(1)}%`;
    if (fillRef.current) fillRef.current.style.height = pct;
    if (thumbRef.current) thumbRef.current.style.bottom = pct;
    if (valueRef.current) valueRef.current.textContent = `${Math.round(input.clutch * 100)}%`;
  });

  const move = (e: React.PointerEvent<HTMLDivElement>) => setClutch(1 - relativeY(e));
  const stop = () => {
    dragging.current = false;
  };
  // Pedal depth at which the clutch starts / finishes biting.
  const biteBottom = (1 - CLUTCH.biteEnd) * 100;
  const biteHeight = (CLUTCH.biteEnd - CLUTCH.biteStart) * 100;

  return (
    <div className='flex h-full shrink-0 flex-col items-center gap-1'>
      <div
        data-testid='clutch-slider'
        role='slider'
        aria-label='Côn'
        aria-orientation='vertical'
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        tabIndex={-1}
        className='ds-panel relative min-h-0 w-12 flex-1 cursor-ns-resize touch-none overflow-hidden rounded-xl md:w-14'
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          dragging.current = true;
          move(e);
        }}
        onPointerMove={(e) => {
          if (dragging.current) move(e);
        }}
        onPointerUp={stop}
        onPointerCancel={stop}
      >
        <div ref={fillRef} className='absolute inset-x-0 bottom-0 h-0 bg-sky-500/55' />
        <div
          className='absolute inset-x-0 flex items-center justify-center border-amber-300 border-y bg-amber-400/45'
          style={{ bottom: `${biteBottom}%`, height: `${biteHeight}%` }}
        >
          <span className='whitespace-nowrap font-bold text-[8px] text-amber-50 leading-none md:text-[9px]'>
            ĐIỂM BÁM
          </span>
        </div>
        <span className='absolute inset-x-0 top-1 text-center text-[8px] text-white/70 leading-none'>ĐẠP HẾT</span>
        <span className='absolute inset-x-0 bottom-1 text-center text-[8px] text-white/70 leading-none'>NHẢ HẾT</span>
        <div
          ref={thumbRef}
          className='absolute inset-x-0.5 bottom-0 h-1.5 translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
        />
      </div>
      <span className='font-bold text-xs leading-none'>
        Côn{' '}
        <span ref={valueRef} className='font-mono text-sky-300'>
          0%
        </span>
      </span>
    </div>
  );
}

function Handbrake() {
  const handbrake = useSimStore((s) => s.handbrake);
  const toggle = useSimStore((s) => s.toggleHandbrake);
  const press = usePress(toggle);
  return (
    <button
      type='button'
      data-testid='handbrake'
      aria-pressed={handbrake}
      {...press}
      className={cn(
        'ds-handbrake ds-panel flex h-11 shrink-0 items-center justify-center gap-1 rounded-xl px-2 font-semibold text-xs transition-colors',
        handbrake && 'border-red-400 bg-red-600/85'
      )}
    >
      <CircleParking className='size-4 shrink-0' />
      <span className='leading-none'>Phanh tay</span>
    </button>
  );
}

function EngineStart() {
  const running = useSimStore((s) => s.engineRunning);
  const start = useSimStore((s) => s.requestEngineStart);
  const press = usePress(start);
  return (
    <button
      type='button'
      data-testid='engine-start'
      {...press}
      className={cn(
        'ds-panel flex h-11 items-center justify-center gap-1 rounded-xl px-2.5 font-semibold text-xs',
        running ? 'text-emerald-300' : 'ds-blink border-red-400 bg-red-600/85'
      )}
    >
      <Power className='size-4 shrink-0' />
      <span className='leading-none'>{running ? 'Máy nổ' : 'Đề máy'}</span>
    </button>
  );
}

const CLUTCH_PRESETS = [
  { id: 'floor', label: 'Đạp hết', depth: 1 },
  { id: 'bite', label: 'Điểm bám', depth: BITE_CLUTCH_DEPTH },
  { id: 'up', label: 'Nhả côn', depth: 0 },
] as const;

function ClutchPreset({ id, label, depth }: (typeof CLUTCH_PRESETS)[number]) {
  const ref = useRef<HTMLButtonElement>(null);
  const press = usePress(() => moveClutchTo(depth));

  useAnimationFrame(() => {
    ref.current?.setAttribute('data-active', String(Math.abs(input.clutch - depth) < 0.04));
  });

  return (
    <button
      ref={ref}
      type='button'
      data-testid={`clutch-${id}`}
      {...press}
      className={cn(
        'ds-panel flex min-h-9 flex-1 items-center justify-center rounded-lg px-1 font-semibold text-[11px] leading-none',
        'transition-colors active:bg-sky-400/30 data-[active=true]:border-sky-300 data-[active=true]:bg-sky-500/70',
        id === 'bite' && 'border-amber-300/60 text-amber-100'
      )}
    >
      {label}
    </button>
  );
}

/** One-tap clutch positions: a 10% bite zone is too small to hit by dragging with a thumb. */
function ClutchPresets() {
  return (
    <div className='ds-clutch-presets' role='group' aria-label='Vị trí côn'>
      {CLUTCH_PRESETS.map((preset) => (
        <ClutchPreset key={preset.id} {...preset} />
      ))}
    </div>
  );
}

export function Pedals() {
  const transmission = useSimStore((s) => s.transmission);
  return (
    <div className='ds-area-pedals ds-pedals self-end'>
      <div className='ds-pedal-buttons'>
        <ShifterButton />
        <EngineStart />
        <Handbrake />
      </div>
      {transmission === 'B2' && <ClutchPresets />}
      <div className='ds-pedal-row'>
        {transmission === 'B2' && <ClutchSlider />}
        <Pedal kind='brake' label='Phanh' hotkey='S' fillClass='bg-red-500/60' />
        <Pedal kind='throttle' label='Ga' hotkey='W' fillClass='bg-emerald-500/60' />
      </div>
    </div>
  );
}
