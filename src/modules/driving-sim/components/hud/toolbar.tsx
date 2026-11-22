import { CircleHelp, LayoutGrid, RotateCcw, Video, Volume2, VolumeX } from 'lucide-react';
import { useSimStore } from '../../store/sim-store';
import type { CameraMode } from '../../types';

const CAMERA_LABELS: Record<CameraMode, string> = { chase: 'Đuôi xe', driver: 'Ghế lái', top: 'Trên cao' };

function Tool({
  label,
  onClick,
  children,
  testId,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  testId: string;
}) {
  return (
    <button
      type='button'
      data-testid={testId}
      aria-label={label}
      title={label}
      onClick={onClick}
      className='ds-panel flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-xl px-2 font-semibold text-xs hover:border-white/40'
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
    <div className='ds-area-tools flex flex-col items-end gap-1.5 self-start justify-self-end'>
      <Tool label='Đổi góc nhìn (V)' onClick={cycleCamera} testId='camera-toggle'>
        <Video className='size-4' />
        <span>{CAMERA_LABELS[cameraMode]}</span>
      </Tool>
      <Tool label='Hướng dẫn sử dụng (H)' onClick={() => setGuideOpen(true)} testId='guide-open'>
        <CircleHelp className='size-4' />
        <span>Hướng dẫn</span>
      </Tool>
      <div className='flex gap-1.5'>
        <Tool label={muted ? 'Bật tiếng (M)' : 'Tắt tiếng (M)'} onClick={toggleMuted} testId='mute-toggle'>
          {muted ? <VolumeX className='size-4' /> : <Volume2 className='size-4' />}
        </Tool>
        <Tool label='Làm lại' onClick={start} testId='restart'>
          <RotateCcw className='size-4' />
        </Tool>
        <Tool label='Chọn bài (Esc)' onClick={openMenu} testId='open-menu'>
          <LayoutGrid className='size-4' />
        </Tool>
      </div>
    </div>
  );
}
