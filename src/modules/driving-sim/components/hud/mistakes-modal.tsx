import { TriangleAlert, X } from 'lucide-react';
import { useSimStore } from '../../store/sim-store';
import { MistakeList } from './mistake-list';

const focusOnMount = (el: HTMLButtonElement | null) => el?.focus();

/** The mistakes of the run so far, each with why it was scored and how to fix it. Pauses the car. */
export function MistakesModal() {
  const open = useSimStore((s) => s.mistakesOpen);
  const setOpen = useSimStore((s) => s.setMistakesOpen);
  const penalties = useSimStore((s) => s.penalties);
  const transmission = useSimStore((s) => s.transmission);
  if (!open) return null;
  const lost = penalties.reduce((sum, p) => sum + p.points, 0);

  return (
    <div className='absolute inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 p-3 sm:items-center sm:p-6'>
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='ds-mistakes-title'
        data-testid='mistakes-modal'
        className='flex max-h-full w-full max-w-lg flex-col rounded-2xl border border-white/15 bg-slate-900/95 shadow-2xl'
      >
        <div className='flex items-center gap-3 border-white/10 border-b p-4'>
          <TriangleAlert className='size-6 shrink-0 text-red-300' />
          <div className='min-w-0 flex-1'>
            <h2 id='ds-mistakes-title' className='m-0 border-0 p-0 font-black text-base leading-tight sm:text-lg'>
              Lỗi đã mắc và cách sửa
            </h2>
            <p className='m-0 text-[11px] text-white/55 sm:text-xs'>Đã trừ {lost} điểm · Xe đang tạm dừng</p>
          </div>
          <button
            type='button'
            data-testid='mistakes-close'
            aria-label='Đóng danh sách lỗi'
            onClick={() => setOpen(false)}
            className='flex size-11 items-center justify-center rounded-xl border border-white/15 hover:border-white/40'
          >
            <X className='size-5' />
          </button>
        </div>
        <MistakeList penalties={penalties} transmission={transmission} className='min-h-0 flex-1 overflow-y-auto p-4' />
        <div className='border-white/10 border-t p-3'>
          <button
            type='button'
            data-testid='mistakes-resume'
            ref={focusOnMount}
            onClick={() => setOpen(false)}
            className='h-11 w-full rounded-xl bg-amber-400 font-bold text-slate-950 text-sm hover:bg-amber-300'
          >
            Lái tiếp
          </button>
        </div>
      </div>
    </div>
  );
}
