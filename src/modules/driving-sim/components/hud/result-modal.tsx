import confetti from 'canvas-confetti';
import { CircleCheck, CircleX } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PASS_SCORE, SCENARIO_LABELS } from '../../constants';
import { useSimStore } from '../../store/sim-store';
import { MistakeList } from './mistake-list';

/** Pass / fail summary shown when the exam ends. */
export function ResultModal() {
  const result = useSimStore((s) => s.result);
  const score = useSimStore((s) => s.score);
  const penalties = useSimStore((s) => s.penalties);
  const scenario = useSimStore((s) => s.scenario);
  const start = useSimStore((s) => s.start);
  const openMenu = useSimStore((s) => s.openMenu);
  const transmission = useSimStore((s) => s.transmission);
  const passed = result?.passed ?? false;
  const fatal = result?.fatal ? { reason: result.reason, where: result.where } : undefined;

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
        className='flex max-h-full w-full max-w-lg flex-col rounded-2xl border border-white/15 bg-slate-900/95 p-4 shadow-2xl sm:p-5'
      >
        <div className='flex shrink-0 items-center gap-3'>
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

        {(penalties.length > 0 || fatal) && (
          <section aria-labelledby='ds-result-mistakes' className='mt-4 flex min-h-0 flex-col'>
            <h3
              id='ds-result-mistakes'
              className='m-0 mb-1.5 font-bold text-[11px] text-white/60 uppercase tracking-wider'
            >
              Lỗi đã mắc và cách sửa
            </h3>
            <MistakeList
              penalties={penalties}
              fatal={fatal}
              transmission={transmission}
              className='min-h-0 flex-1 overflow-y-auto pr-1'
            />
          </section>
        )}

        <div className='mt-4 grid shrink-0 grid-cols-2 gap-2'>
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
