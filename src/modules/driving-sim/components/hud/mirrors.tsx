import { cn } from '@/lib/utils';
import { MIRROR_RESOLUTION } from '../scene/camera-rig';
import { runtime } from '../../utils/runtime';

/** Door-mirror picture-in-picture. The scene's camera rig paints the canvas. */
export function Mirror({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      data-testid={`mirror-${side}`}
      className={cn(
        'ds-mirror relative self-start overflow-hidden border-2 border-slate-900 bg-slate-800 shadow-xl',
        side === 'left'
          ? 'ds-area-mirror-l rounded-[0.5rem_1.5rem_1.25rem_0.75rem]'
          : 'ds-area-mirror-r rounded-[1.5rem_0.5rem_0.75rem_1.25rem]'
      )}
    >
      <canvas
        ref={(el) => {
          runtime.mirrorCanvas[side] = el;
        }}
        width={MIRROR_RESOLUTION.width}
        height={MIRROR_RESOLUTION.height}
        className='block aspect-[7/4] w-full rotate-180'
      />
      <span className='absolute bottom-0.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/55 px-1.5 text-[9px] text-white/85 leading-4'>
        {side === 'left' ? 'Gương trái' : 'Gương phải'}
      </span>
    </div>
  );
}
