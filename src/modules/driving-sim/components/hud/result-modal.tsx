import confetti from 'canvas-confetti';
import { CircleCheck, CircleX } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PASS_SCORE, SCENARIO_LABELS } from '../../constants';
import { useSimStore } from '../../store/sim-store';

/** Pass / fail summary shown when the exam ends. */
export function ResultModal() {
  const result = useSimStore((s) => s.result);
  const score = useSimStore((s) => s.score);
  const penalties = useSimStore((s) => s.penalties);
  const scenario = useSimStore((s) => s.scenario);
  const start = useSimStore((s) => s.start);
  const openMenu = useSimStore((s) => s.openMenu);
  const passed = result?.passed ?? false;

  useEffect(() => {
    if (!passed) return;
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, disableForReducedMotion: true });
    return () => {
      confetti.reset();
    };
  }, [passed]);

  if (!result) return null;
  const Icon = passed ? CircleCheck : CircleX;

  return (
    <div className='absolute inset-0 z-40 flex items-center justify-center bg-slate-950/60 p-4'>
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='ds-result-title'
        data-testid='result-modal'
        className='w-full max-w-md rounded-2xl border border-white/15 bg-slate-900/95 p-5 shadow-2xl'
      >
        <div className='flex items-center gap-3'>
          <Icon className={cn('size-12 shrink-0', passed ? 'text-emerald-400' : 'text-red-400')} />
          <div className='min-w-0 flex-1'>
            <p data-testid='result-scenario' className='m-0 text-[10px] text-white/55 uppercase tracking-wider'>
              {SCENARIO_LABELS[scenario].title}
            </p>
            <h2
              id='ds-result-title'
              data-testid='result-title'
              className={cn(
                'm-0 border-0 p-0 font-black text-2xl leading-tight',
                passed ? 'text-emerald-300' : 'text-red-300'
              )}
            >
              {passed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
            </h2>
            <p className='m-0 mt-1 text-sm text-white/70 leading-snug'>{result.reason}</p>
          </div>
          <div className='shrink-0 text-right'>
            <p className='text-[10px] text-white/55 uppercase tracking-wider'>Điểm</p>
            <p className='font-black font-mono text-3xl'>{score}</p>
            <p className='text-[10px] text-white/55'>Đạt từ {PASS_SCORE}</p>
          </div>
        </div>

        {penalties.length > 0 && (
          <ul className='mt-4 max-h-40 space-y-1 overflow-y-auto text-sm'>
            {penalties.map((penalty) => (
              <li key={penalty.id} className='flex justify-between gap-3 rounded-md bg-white/5 px-2.5 py-1.5'>
                <span className='text-white/80'>{penalty.reason}</span>
                <span className='font-bold font-mono text-red-300'>−{penalty.points}</span>
              </li>
            ))}
          </ul>
        )}

        <div className='mt-5 grid grid-cols-2 gap-2'>
          <Button
            variant='outline'
            data-testid='result-menu'
            onClick={openMenu}
            className='border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white'
          >
            Chọn bài khác
          </Button>
          <Button
            data-testid='result-retry'
            onClick={start}
            className='bg-amber-400 font-bold text-slate-950 hover:bg-amber-300'
          >
            Thi lại
          </Button>
        </div>
      </div>
    </div>
  );
}
