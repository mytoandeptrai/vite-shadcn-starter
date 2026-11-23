import { CircleAlert, Info, OctagonX, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type NoticeKind, useSimStore } from '../../store/sim-store';

const STYLES: Record<NoticeKind, { icon: typeof Info; className: string }> = {
  penalty: { icon: CircleAlert, className: 'border-red-300 bg-red-600 text-white' },
  fail: { icon: OctagonX, className: 'border-red-300 bg-red-700 text-white' },
  warning: { icon: TriangleAlert, className: 'border-amber-200 bg-amber-400 text-slate-950' },
  info: { icon: Info, className: 'border-sky-200 bg-sky-600 text-white' },
};

/** Penalty / warning toasts, stacked in the upper middle of the screen. */
export function Notices() {
  const notices = useSimStore((s) => s.notices);
  return (
    <div
      aria-live='assertive'
      className='pointer-events-none absolute inset-x-0 top-[24%] z-30 flex flex-col items-center gap-1.5 px-3'
    >
      {notices.map((notice) => {
        const { icon: Icon, className } = STYLES[notice.kind];
        return (
          <div
            key={notice.id}
            data-testid={`notice-${notice.kind}`}
            className={cn(
              'fade-in slide-in-from-top-2 flex max-w-full animate-in items-center gap-2 rounded-xl border px-3 py-2 font-bold text-sm shadow-xl',
              className
            )}
          >
            <Icon className='size-5 shrink-0' />
            <span className='min-w-0'>
              {notice.text}
              {notice.tip && (
                <span data-testid='notice-tip' className='block font-medium text-[11px] text-white/90 leading-snug'>
                  Cách sửa: {notice.tip}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
