import { cn } from '@/lib/utils';
import { PASS_SCORE, SCENARIO_LABELS } from '../../constants';
import { useTouchDevice } from '../../hooks/use-touch-device';
import { useSimStore } from '../../store/sim-store';
import { withoutKeyHints } from '../../utils/coach';

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
  const touch = useTouchDevice();

  return (
    <div className='ds-area-hints pointer-events-none flex min-w-0 flex-col items-center gap-1 self-start'>
      {hint && (
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
