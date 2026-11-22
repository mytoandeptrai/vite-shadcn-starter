import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { CAR } from '../../constants';
import { useAnimationFrame } from '../../hooks/use-animation-frame';
import { usePress } from '../../hooks/use-press';
import { input } from '../../utils/input-state';
import { clamp } from '../../utils/math';
import { SignalButtons } from './turn-signals';

const pointerAngle = (e: React.PointerEvent<HTMLElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  return Math.atan2(e.clientY - (rect.top + rect.height / 2), e.clientX - (rect.left + rect.width / 2));
};

function QuickTurn({ side, label, innerRef }: { side: -1 | 1; label: string; innerRef: React.Ref<HTMLButtonElement> }) {
  const Icon = side === -1 ? ChevronsLeft : ChevronsRight;
  const press = usePress(() => {
    input.steerLatch = input.steerLatch === side ? 0 : side;
  });
  return (
    <button
      ref={innerRef}
      type='button'
      data-testid={side === -1 ? 'quick-left' : 'quick-right'}
      {...press}
      className={cn(
        'ds-panel flex h-9 flex-1 items-center justify-center gap-1 rounded-lg px-1.5 font-semibold text-[11px] leading-none',
        'transition-colors active:bg-amber-400/30 data-[active=true]:border-amber-300 data-[active=true]:bg-amber-400 data-[active=true]:text-slate-950',
        side === 1 && 'flex-row-reverse'
      )}
    >
      <Icon className='size-4 shrink-0' />
      {label}
    </button>
  );
}

/** Virtual steering wheel: drag to turn (±540°), springs back to centre when released. */
export function SteeringWheel() {
  const wheelRef = useRef<SVGSVGElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const leftRef = useRef<HTMLButtonElement>(null);
  const rightRef = useRef<HTMLButtonElement>(null);
  const lastAngle = useRef(0);

  useAnimationFrame(() => {
    if (wheelRef.current) wheelRef.current.style.transform = `rotate(${input.steerDeg.toFixed(1)}deg)`;
    if (readoutRef.current) {
      const deg = Math.round(input.steerDeg);
      readoutRef.current.textContent = `${deg > 0 ? '+' : ''}${deg}°`;
    }
    leftRef.current?.setAttribute('data-active', String(input.steerLatch === -1));
    rightRef.current?.setAttribute('data-active', String(input.steerLatch === 1));
  });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    lastAngle.current = pointerAngle(e);
    input.wheelDragging = true;
    input.steerLatch = null;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!input.wheelDragging) return;
    const angle = pointerAngle(e);
    let delta = angle - lastAngle.current;
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;
    lastAngle.current = angle;
    input.steerDeg = clamp(input.steerDeg + (delta * 180) / Math.PI, -CAR.maxSteerWheelDeg, CAR.maxSteerWheelDeg);
  };

  const onPointerUp = () => {
    input.wheelDragging = false;
  };

  return (
    <div className='ds-area-wheel ds-wheel flex flex-col gap-1.5 self-end'>
      <SignalButtons />
      <div
        data-testid='steering-wheel'
        role='slider'
        aria-label='Vô lăng'
        aria-valuemin={-CAR.maxSteerWheelDeg}
        aria-valuemax={CAR.maxSteerWheelDeg}
        aria-valuenow={0}
        tabIndex={-1}
        className='relative aspect-square w-full cursor-grab touch-none rounded-full active:cursor-grabbing'
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <svg ref={wheelRef} viewBox='0 0 200 200' className='size-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]'>
          <title>Vô lăng</title>
          <circle cx='100' cy='100' r='86' fill='rgba(8,13,24,0.35)' stroke='#0b1220' strokeWidth='22' />
          <circle cx='100' cy='100' r='86' fill='none' stroke='#334155' strokeWidth='16' />
          <path
            d='M100 100 L22 84 M100 100 L178 84 M100 100 L100 182'
            stroke='#1e293b'
            strokeWidth='20'
            strokeLinecap='round'
          />
          <path
            d='M100 100 L22 84 M100 100 L178 84 M100 100 L100 182'
            stroke='#475569'
            strokeWidth='12'
            strokeLinecap='round'
          />
          <circle cx='100' cy='100' r='30' fill='#1e293b' stroke='#64748b' strokeWidth='3' />
          <rect x='94' y='6' width='12' height='18' rx='3' fill='#fbbf24' />
        </svg>
        <span
          ref={readoutRef}
          data-testid='steer-angle'
          className='pointer-events-none absolute inset-0 flex items-center justify-center font-bold font-mono text-[11px] text-amber-300 md:text-sm'
        >
          0°
        </span>
      </div>
      <div className='flex gap-1.5'>
        <QuickTurn side={-1} label='Hết lái trái' innerRef={leftRef} />
        <QuickTurn side={1} label='Hết lái phải' innerRef={rightRef} />
      </div>
    </div>
  );
}
