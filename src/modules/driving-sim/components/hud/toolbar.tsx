import { CircleHelp, RotateCcw, Video, Volume2, VolumeX, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePress } from '../../hooks/use-press';
import { useSimStore } from '../../store/sim-store';
import type { CameraMode } from '../../types';

const CAMERA_LABELS: Record<CameraMode, string> = { chase: 'Đuôi xe', driver: 'Ghế lái', top: 'Trên cao' };

function Tool({
  label,
  onClick,
  children,
  testId,
  className,
}: {
  className?: string;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  testId: string;
}) {
  const press = usePress(onClick);
  return (
    <button
      type='button'
      data-testid={testId}
      aria-label={label}
      title={label}
      {...press}
      className={cn(
        'ds-tool ds-panel flex items-center justify-center gap-1.5 rounded-xl font-semibold text-xs hover:border-white/40',
        className
      )}
    >
      {children}
    </button>
  );
}

export function Toolbar() {
  const cameraMode = useSimStore((s) => s.cameraMode);
  const muted = useSimStore((s) => s.muted);
  const cycleCamera = useSimStore((s) => s.cycleCamera);
  const toggleMuted = useSimStore((s) => s.toggleMuted);
  const start = useSimStore((s) => s.start);
  const openMenu = useSimStore((s) => s.openMenu);
  const setGuideOpen = useSimStore((s) => s.setGuideOpen);

  return (
    <div className='ds-tools'>
      <Tool label={`Đổi góc nhìn (V): ${CAMERA_LABELS[cameraMode]}`} onClick={cycleCamera} testId='camera-toggle'>
        <Video className='size-4' />
        <span className='ds-tool-label'>{CAMERA_LABELS[cameraMode]}</span>
      </Tool>
      <Tool label='Hướng dẫn sử dụng (H)' onClick={() => setGuideOpen(true)} testId='guide-open'>
        <CircleHelp className='size-4' />
        <span className='ds-tool-label'>Hướng dẫn</span>
      </Tool>
      <Tool
        label={muted ? 'Bật tiếng (M)' : 'Tắt tiếng (M)'}
        onClick={toggleMuted}
        testId='mute-toggle'
        className='ds-tool-extra'
      >
        {muted ? <VolumeX className='size-4' /> : <Volume2 className='size-4' />}
      </Tool>
      <Tool label='Làm lại' onClick={start} testId='restart'>
        <RotateCcw className='size-4' />
      </Tool>
      <Tool label='Thoát ra chọn bài (Esc)' onClick={openMenu} testId='open-menu'>
        <X className='size-4' />
      </Tool>
    </div>
  );
}
