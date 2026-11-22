import { lazy, Suspense, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { siteConfig } from '@/constant';
import { GuideModal } from '../../components/hud/guide-modal';
import { Minimap } from '../../components/hud/minimap';
import { Mirror } from '../../components/hud/mirrors';
import { Notices } from '../../components/hud/notices';
import { Handbrake, Pedals } from '../../components/hud/pedals';
import { ResultModal } from '../../components/hud/result-modal';
import { ScenarioModal } from '../../components/hud/scenario-modal';
import { GearSelector } from '../../components/hud/shifter';
import { Hints, Lamps, StatusBar } from '../../components/hud/status-bar';
import { SteeringWheel } from '../../components/hud/steering-wheel';
import { Toolbar } from '../../components/hud/toolbar';
import { useKeyboardControls } from '../../hooks/use-keyboard-controls';
import { useMedia } from '../../hooks/use-media';
import { useSimStore } from '../../store/sim-store';
import { stopEngineSound } from '../../utils/audio';
import '../../driving-sim.css';

/** Same breakpoint as the wide layout in driving-sim.css. */
const WIDE_SCREEN = '(min-width: 900px) and (min-height: 501px)';

const SimScene = lazy(() => import('../../components/scene/sim-scene'));

function Overlay() {
  const stallAt = useSimStore((s) => s.stallAt);
  const transmission = useSimStore((s) => s.transmission);
  const ref = useRef<HTMLDivElement>(null);
  // Wide screens have room for the lamps in the top bar; phones show them between the mirrors.
  const wide = useMedia(WIDE_SCREEN);

  // Shake the whole HUD when the engine stalls.
  useEffect(() => {
    const el = ref.current;
    if (!el || stallAt === 0) return;
    el.classList.remove('ds-shake');
    // Force a reflow so the animation restarts on consecutive stalls.
    void el.offsetWidth;
    el.classList.add('ds-shake');
  }, [stallAt]);

  return (
    <div ref={ref} className='ds-overlay' data-testid='hud' data-transmission={transmission}>
      <div className='ds-area-top ds-top'>
        <StatusBar />
        {wide && <Lamps />}
        <Toolbar />
      </div>
      {!wide && <Lamps />}
      <Mirror side='left' />
      <Hints />
      <Mirror side='right' />
      <Minimap />
      <div className='ds-area-bottom ds-bottom'>
        <div className='ds-controls'>
          <GearSelector />
          <SteeringWheel />
          <Handbrake />
        </div>
        <Pedals />
      </div>
    </div>
  );
}

export default function DrivingSimContainer() {
  const phase = useSimStore((s) => s.phase);
  useKeyboardControls();

  useEffect(
    () => () => {
      stopEngineSound();
      useSimStore.setState({ phase: 'menu', guideOpen: false });
    },
    []
  );

  return (
    <div className='ds-root' data-phase={phase}>
      <Helmet>
        <title>{siteConfig.title}</title>
      </Helmet>
      <div className='absolute inset-0'>
        <Suspense
          fallback={
            <div className='flex size-full items-center justify-center text-sm text-white/70'>
              Đang tải mô phỏng 3D…
            </div>
          }
        >
          <SimScene />
        </Suspense>
      </div>
      {phase !== 'menu' && <Overlay />}
      {phase !== 'menu' && <Notices />}
      {phase === 'menu' && <ScenarioModal />}
      {phase === 'finished' && <ResultModal />}
      <GuideModal />
    </div>
  );
}
