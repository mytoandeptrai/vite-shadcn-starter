import { cn } from '@/lib/utils';
import { ChevronRight, CircleParking, TriangleAlert, Volume2 } from 'lucide-react';
import { ENGINE, PASS_SCORE, ROAD_STEPS, SCENARIO_LABELS } from '../../constants';
import { usePress } from '../../hooks/use-press';
import { useTouchDevice } from '../../hooks/use-touch-device';
import { useSimStore } from '../../store/sim-store';
import { withoutKeyHints } from '../../utils/coach';
import { SignalLamp } from './turn-signals';

/** Gap to the car in front below which the HUD warns, metres. */
const SAFE_GAP = 10;

const formatClock = (seconds: number) => {
  const total = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

function Readout({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col justify-center px-1.5 leading-none sm:px-2 md:px-3', className)}>
      <span className='whitespace-nowrap font-semibold text-[8px] text-white/50 uppercase tracking-wider md:text-[9px]'>
        {label}
      </span>
      <span className='mt-1 whitespace-nowrap font-black font-mono text-sm leading-none sm:text-base md:text-xl'>
        {children}
      </span>
    </div>
  );
}

/** One strip for everything the driver reads at a glance: exercise, clock, speed, revs, gear, score. */
export function StatusBar() {
  const scenario = useSimStore((s) => s.scenario);
  const transmission = useSimStore((s) => s.transmission);
  const score = useSimStore((s) => s.score);
  const gear = useSimStore((s) => s.gear);
  const engineRunning = useSimStore((s) => s.engineRunning);
  const telemetry = useSimStore((s) => s.telemetry);
  const scored = scenario !== 'free';
  const rpmRatio = Math.min(1, telemetry.rpm / ENGINE.redlineRpm);

  return (
    <div
      data-testid='hud-gauges'
      className='ds-status ds-panel flex min-w-0 items-stretch divide-x divide-white/10 overflow-hidden rounded-xl'
    >
      <div className='ds-status-title flex-col justify-center bg-amber-400 px-3 text-slate-950 leading-none'>
        <span className='whitespace-nowrap font-black text-xs uppercase tracking-wide'>
          {SCENARIO_LABELS[scenario].title}
        </span>
        <span className='mt-1 whitespace-nowrap font-semibold text-[10px] text-slate-950/70'>
          Hạng {transmission} · {transmission === 'B1' ? 'số tự động' : 'số sàn'}
        </span>
      </div>
      <Readout label={telemetry.clockCountdown ? 'Còn lại' : 'Thời gian'}>
        <span data-testid='hud-clock' className={cn(telemetry.clockCountdown && 'text-red-400')}>
          {formatClock(telemetry.clockSeconds)}
        </span>
      </Readout>
      <Readout label='Điểm'>
        <span
          data-testid='hud-score'
          className={cn(
            !scored && 'text-white/50',
            scored && (score >= PASS_SCORE ? 'text-emerald-300' : 'text-red-400')
          )}
        >
          {scored ? score : '—'}
        </span>
      </Readout>
      <Readout label='km/h'>
        <span data-testid='hud-speed'>{telemetry.speedKmh.toFixed(1)}</span>
      </Readout>
      <Readout label='RPM' className='relative'>
        <span
          data-testid='hud-rpm'
          className={cn(!engineRunning && 'text-red-400', engineRunning && telemetry.rpm < 600 && 'text-amber-300')}
        >
          {Math.round(telemetry.rpm / 10) * 10}
        </span>
        <span
          className={cn('absolute bottom-0 left-0 h-0.5', rpmRatio > 0.8 ? 'bg-red-500' : 'bg-emerald-400')}
          style={{ width: `${rpmRatio * 100}%` }}
        />
      </Readout>
      <Readout label='Số'>
        <span data-testid='hud-gear' className='text-amber-300'>
          {gear}
        </span>
      </Readout>
      {transmission === 'B2' && (
        <Readout label='Côn' className='ds-status-extra'>
          <span className='text-sky-300'>
            <span data-testid='hud-clutch'>{telemetry.clutchPct}</span>
            <span className='ml-0.5 font-medium text-[10px] text-white/55'>%</span>
          </span>
        </Readout>
      )}
    </div>
  );
}

/** Dashboard warning lamps: turn signals, handbrake and a stalled engine. */
export function Lamps() {
  const engineRunning = useSimStore((s) => s.engineRunning);
  const handbrake = useSimStore((s) => s.handbrake);
  return (
    <div className='ds-area-lamps flex items-center justify-center self-start'>
      <div className='ds-panel flex items-center gap-1 rounded-xl p-1'>
        <SignalLamp side='left' />
        <span
          title='Phanh tay'
          data-on={handbrake}
          className={cn(
            'flex size-7 items-center justify-center rounded-lg',
            handbrake ? 'bg-red-600 text-white' : 'text-white/25'
          )}
        >
          <CircleParking className='size-4' />
        </span>
        <span
          title='Động cơ'
          className={cn(
            'flex h-7 items-center justify-center rounded-lg px-1 font-black text-[9px]',
            engineRunning ? 'text-white/25' : 'ds-blink bg-red-600 text-white'
          )}
        >
          ENG
        </span>
        <SignalLamp side='right' />
      </div>
    </div>
  );
}

/** Appears after the first mistake; opens the list that explains each one. */
function MistakesChip() {
  const count = useSimStore((s) => s.penalties.length);
  const lost = useSimStore((s) => s.penalties.reduce((sum, p) => sum + p.points, 0));
  const setMistakesOpen = useSimStore((s) => s.setMistakesOpen);
  const press = usePress(() => setMistakesOpen(true));
  if (count === 0) return null;
  return (
    <button
      type='button'
      data-testid='mistakes-open'
      aria-label={`Xem ${count} lỗi đã mắc và cách sửa (L)`}
      {...press}
      className='pointer-events-auto flex min-h-9 items-center gap-1.5 rounded-full border border-red-300/70 bg-red-600/90 px-3 py-1 font-bold text-white text-xs shadow-lg hover:bg-red-500'
    >
      <TriangleAlert className='size-4 shrink-0' />
      <span>
        {count} lỗi · −{lost} điểm
      </span>
      <span className='font-semibold text-white/85'>· Xem cách sửa</span>
      <ChevronRight className='size-4 shrink-0' />
    </button>
  );
}

/** What the exam wants now, and which pedals and gears to use for it. */
export function Hints() {
  const hint = useSimStore((s) => s.telemetry.hint);
  const coach = useSimStore((s) => s.telemetry.coach);
  const road = useSimStore((s) => s.telemetry.road);
  const yard = useSimStore((s) => s.telemetry.yard);
  const subtitle = useSimStore((s) => s.subtitle);
  const touch = useTouchDevice();

  return (
    <div className='ds-area-hints pointer-events-none flex min-w-0 flex-col items-center gap-1 self-start justify-self-center'>
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
      {yard && (
        <div
          data-testid='yard-widget'
          data-step={yard.step}
          className='ds-panel w-full max-w-md rounded-2xl px-3 py-1.5 text-center text-[10px] leading-snug md:text-xs'
        >
          <p data-testid='yard-step' className='truncate font-bold text-sky-300'>
            Bài {yard.step}/{yard.total} · {yard.title}
          </p>
          <div
            role='progressbar'
            aria-label='Số chặng đã qua'
            aria-valuemin={0}
            aria-valuemax={yard.of}
            aria-valuenow={yard.done}
            className='mt-1 h-1.5 overflow-hidden rounded-full bg-white/15'
          >
            <div className='h-full rounded-full bg-sky-400' style={{ width: `${(yard.done / yard.of) * 100}%` }} />
          </div>
          <p data-testid='hud-hint' className='mt-1'>
            {hint}
          </p>
        </div>
      )}
      {hint && !road && !yard && (
        <p
          data-testid='hud-hint'
          className='ds-panel max-w-full rounded-full px-3 py-1 text-center text-[10px] leading-snug md:text-xs'
        >
          {hint}
        </p>
      )}
      <MistakesChip />
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
