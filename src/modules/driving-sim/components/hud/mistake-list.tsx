import { Lightbulb, OctagonX } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Penalty, Transmission } from '../../types';
import { adviceFor } from '../../utils/mistakes';

interface Group {
  key: string;
  reason: string;
  where: string;
  points: number;
  count: number;
  fatal: boolean;
}

/** Same mistake in the same exercise is one row, with how often it happened. */
function group(penalties: Penalty[], fatal?: { reason: string; where?: string }): Group[] {
  const groups = new Map<string, Group>();
  // The disqualification comes first: it is what ended the run.
  if (fatal) {
    const where = fatal.where ?? '';
    groups.set(`!${fatal.reason}`, {
      key: `!${fatal.reason}`,
      reason: fatal.reason,
      where,
      points: 0,
      count: 1,
      fatal: true,
    });
  }
  for (const { reason, where = '', points } of penalties) {
    // Distances differ every time; the mistake is the same one.
    const key = `${where}|${reason.replace(/\s*\(cách [\d.,]+ m\)/, '')}`;
    const found = groups.get(key);
    if (found) {
      found.points += points;
      found.count += 1;
    } else {
      groups.set(key, { key, reason, where, points, count: 1, fatal: false });
    }
  }
  return [...groups.values()];
}

/** Each mistake of the run with why it was scored and how to avoid it next time. */
export function MistakeList({
  penalties,
  fatal,
  transmission,
  className,
}: {
  penalties: Penalty[];
  /** The disqualification that ended the run, if any. */
  fatal?: { reason: string; where?: string };
  transmission: Transmission;
  className?: string;
}) {
  const groups = group(penalties, fatal);
  if (groups.length === 0) {
    return (
      <p
        data-testid='mistakes-empty'
        className={cn('m-0 rounded-lg bg-emerald-500/10 px-3 py-2 text-emerald-200 text-sm', className)}
      >
        Chưa mắc lỗi nào. Cứ giữ như vậy!
      </p>
    );
  }
  return (
    <ul data-testid='mistake-list' className={cn('m-0 list-none space-y-2 p-0', className)}>
      {groups.map(({ key, reason, where, points, count, fatal: isFatal }) => {
        const advice = adviceFor(reason, transmission);
        return (
          <li
            key={key}
            data-testid='mistake'
            className={cn(
              'rounded-xl border px-3 py-2.5',
              isFatal ? 'border-red-400/50 bg-red-500/10' : 'border-white/10 bg-white/5'
            )}
          >
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0'>
                {where && <p className='m-0 text-[10px] text-white/50 uppercase tracking-wider'>{where}</p>}
                <p data-testid='mistake-reason' className='m-0 font-bold text-sm text-white leading-snug'>
                  {reason}
                  {count > 1 && <span className='ml-1.5 font-normal text-white/55'>× {count}</span>}
                </p>
              </div>
              {isFatal ? (
                <span className='flex shrink-0 items-center gap-1 rounded-md bg-red-500/25 px-1.5 py-0.5 font-bold text-[11px] text-red-200'>
                  <OctagonX className='size-3.5' />
                  Truất quyền
                </span>
              ) : (
                <span className='shrink-0 font-bold font-mono text-red-300 text-sm'>−{points}</span>
              )}
            </div>
            <p className='m-0 mt-1.5 text-white/70 text-xs leading-relaxed'>
              <span className='font-semibold text-white/85'>Vì sao: </span>
              {advice.why}
            </p>
            <p data-testid='mistake-fix' className='m-0 mt-1 flex gap-1.5 text-amber-100 text-xs leading-relaxed'>
              <Lightbulb className='mt-0.5 size-3.5 shrink-0 text-amber-300' />
              <span>
                <span className='font-semibold text-amber-200'>Cách sửa: </span>
                {advice.fix}
              </span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}
