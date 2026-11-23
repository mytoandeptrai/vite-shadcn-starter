import { ChevronRight, CircleAlert, Info, OctagonX, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePress } from '../../hooks/use-press';
import { type Notice, type NoticeKind, useSimStore } from '../../store/sim-store';

const STYLES: Record<NoticeKind, { icon: typeof Info; className: string }> = {
  penalty: { icon: CircleAlert, className: 'border-red-300 bg-red-600 text-white' },
  fail: { icon: OctagonX, className: 'border-red-300 bg-red-700 text-white' },
  warning: { icon: TriangleAlert, className: 'border-amber-200 bg-amber-400 text-slate-950' },
  info: { icon: Info, className: 'border-sky-200 bg-sky-600 text-white' },
};

const TOAST =
  'fade-in slide-in-from-top-2 flex max-w-full animate-in items-center gap-2 rounded-xl border px-3 py-2 text-left font-bold text-sm shadow-xl';

function Body({ notice }: { notice: Notice }) {
  const Icon = STYLES[notice.kind].icon;
  return (
    <>
      <Icon className='size-5 shrink-0' />
      <span className='min-w-0'>
        {notice.text}
        {notice.tip && (
          <span data-testid='notice-tip' className='block font-medium text-[11px] text-white/90 leading-snug'>
            Cách sửa: {notice.tip}
          </span>
        )}
      </span>
    </>
  );
}

/** A penalty toast opens the mistakes list, like the chip under it. */
function PenaltyToast({ notice }: { notice: Notice }) {
  const setMistakesOpen = useSimStore((s) => s.setMistakesOpen);
  const press = usePress(() => setMistakesOpen(true));
  return (
    <button
      type='button'
      tabIndex={-1}
      data-testid='notice-penalty'
      {...press}
      className={cn(TOAST, STYLES.penalty.className, 'pointer-events-auto')}
    >
      <Body notice={notice} />
      <ChevronRight className='size-4 shrink-0' />
    </button>
  );
}

/**
 * Penalty / warning toasts. They sit in the hints column, above the mistakes chip, so they never
 * cover it; how many lines a small screen keeps while one shows is decided in driving-sim.css.
 */
export function Notices() {
  const notices = useSimStore((s) => s.notices);
  return (
    <div aria-live='assertive' className='ds-notices flex w-full flex-col items-center gap-1.5'>
      {notices.map((notice) =>
        notice.kind === 'penalty' ? (
          <PenaltyToast key={notice.id} notice={notice} />
        ) : (
          <div
            key={notice.id}
            data-testid={`notice-${notice.kind}`}
            className={cn(TOAST, STYLES[notice.kind].className)}
          >
            <Body notice={notice} />
          </div>
        )
      )}
    </div>
  );
}
