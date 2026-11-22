import { cn } from '@/lib/utils';
import { Volume2 } from 'lucide-react';
import { PASS_SCORE, ROAD_STEPS, SCENARIO_LABELS } from '../../constants';
import { useTouchDevice } from '../../hooks/use-touch-device';
import { useSimStore } from '../../store/sim-store';
import { withoutKeyHints } from '../../utils/coach';

/** Gap to the car in front below which the HUD warns, metres. */
const SAFE_GAP = 10;

const formatClock = (seconds: number) => {
  const total = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

/** Scenario title, exam clock and live score. */
export function StatusBar() {
  const scenario = useSimStore((s) => s.scenario);
  const transmission = useSimStore((s) => s.transmission);
  const score = useSimStore((s) => s.score);
  const telemetry = useSimStore((s) => s.telemetry);
  const scored = scenario !== 'free';

  return (
    <div className='ds-area-status flex min-w-0 justify-center self-start'>
      <div className='ds-panel flex max-w-full items-center divide-x divide-white/10 rounded-2xl py-1.5'>
        <div className='ds-status-title hidden min-w-0 flex-col px-3 leading-tight sm:flex'>
          <span className='truncate font-bold text-sm'>{SCENARIO_LABELS[scenario].title}</span>
          <span className='text-[10px] text-white/55'>
            Hạng {transmission} · {transmission === 'B1' ? 'Số tự động' : 'Số sàn'}
          </span>
        </div>
        <div className='flex flex-col items-center px-2.5 leading-tight md:px-3'>
          <span className='text-[9px] text-white/55 uppercase tracking-wider'>
            {telemetry.clockCountdown ? 'Còn lại' : 'Thời gian'}
          </span>
          <span
            data-testid='hud-clock'
            className={cn('font-bold font-mono text-base md:text-lg', telemetry.clockCountdown && 'text-red-400')}
          >
            {formatClock(telemetry.clockSeconds)}
          </span>
        </div>
        <div className='flex flex-col items-center px-2.5 leading-tight md:px-3'>
          <span className='text-[9px] text-white/55 uppercase tracking-wider'>Điểm</span>
          <span
            data-testid='hud-score'
            className={cn(
              'font-black font-mono text-base md:text-lg',
              !scored && 'text-white/50',
              scored && (score >= PASS_SCORE ? 'text-emerald-300' : 'text-red-400')
            )}
          >
            {scored ? score : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}

/** What the exam wants now, and which pedals and gears to use for it. */
export function Hints() {
  const hint = useSimStore((s) => s.telemetry.hint);
  const coach = useSimStore((s) => s.telemetry.coach);
  const road = useSimStore((s) => s.telemetry.road);
  const subtitle = useSimStore((s) => s.subtitle);
  const touch = useTouchDevice();

  return (
    <div className='ds-area-hints pointer-events-none flex min-w-0 flex-col items-center gap-1 self-start'>
      {road && (
        <div
          data-testid='road-widget'
          data-step={road.step}
          data-distance={road.distance.toFixed(1)}
          data-offset={road.offset.toFixed(2)}
          data-gap={road.gap === null ? '' : road.gap.toFixed(1)}
          className='ds-panel w-full max-w-md rounded-2xl px-3 py-1.5 text-[10px] leading-snug md:text-xs'
        >
          <div className='flex items-baseline justify-between gap-2'>
            <span data-testid='road-step' className='truncate font-bold text-sky-300'>
              Bài {road.step + 1}/{ROAD_STEPS.length} · {ROAD_STEPS[road.step]}
            </span>
            <span className='shrink-0 font-mono text-white/70'>
              {road.gap !== null && (
                <span data-testid='road-gap' className={cn(road.gap < SAFE_GAP && 'font-bold text-red-400')}>
                  Xe trước {road.gap.toFixed(0)} m ·{' '}
                </span>
              )}
              <span data-testid='road-distance'>
                {Math.floor(road.distance)} / {road.total} m
              </span>
            </span>
          </div>
          <div
            role='progressbar'
            aria-label='Quãng đường đã đi'
            aria-valuemin={0}
            aria-valuemax={road.total}
            aria-valuenow={Math.floor(road.distance)}
            className='mt-1 h-1.5 overflow-hidden rounded-full bg-white/15'
          >
            <div
              className='h-full rounded-full bg-sky-400'
              style={{ width: `${(road.distance / road.total) * 100}%` }}
            />
          </div>
          <p data-testid='hud-hint' className='mt-1 text-center'>
            {hint}
          </p>
          {subtitle && (
            <p
              data-testid='road-subtitle'
              className='flex items-center justify-center gap-1 text-center text-white/70 italic'
            >
              <Volume2 className='size-3 shrink-0' />
              Sát hạch viên: “{subtitle}”
            </p>
          )}
        </div>
      )}
      {hint && !road && (
        <p
          data-testid='hud-hint'
          className='ds-panel max-w-full rounded-full px-3 py-1 text-center text-[10px] leading-snug md:text-xs'
        >
          {hint}
        </p>
      )}
      {coach && (
        <p
          data-testid='hud-coach'
          className='ds-panel max-w-full rounded-2xl border-amber-300/50 px-3 py-1 text-center text-[10px] text-amber-100 leading-snug md:text-xs'
        >
          <span className='font-bold text-amber-300'>Thao tác: </span>
          {touch ? withoutKeyHints(coach) : coach}
        </p>
      )}
    </div>
  );
}
