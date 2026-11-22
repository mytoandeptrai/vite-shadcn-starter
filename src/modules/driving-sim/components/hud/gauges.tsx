import { cn } from '@/lib/utils';
import { ENGINE } from '../../constants';
import { useSimStore } from '../../store/sim-store';
import { SignalLamp } from './turn-signals';

function Readout({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex min-w-0 flex-col items-center justify-center px-2 md:px-4', className)}>
      <span className='text-[9px] text-white/55 uppercase tracking-wider md:text-[10px]'>{label}</span>
      {children}
    </div>
  );
}

/** Instrument cluster: speed, RPM, gear and clutch travel. */
export function Gauges() {
  const telemetry = useSimStore((s) => s.telemetry);
  const gear = useSimStore((s) => s.gear);
  const transmission = useSimStore((s) => s.transmission);
  const engineRunning = useSimStore((s) => s.engineRunning);
  const handbrake = useSimStore((s) => s.handbrake);
  const rpmRatio = Math.min(1, telemetry.rpm / ENGINE.redlineRpm);

  return (
    <div className='ds-area-gauges flex min-w-0 justify-center self-end'>
      <div
        data-testid='hud-gauges'
        className='ds-panel flex items-stretch divide-x divide-white/10 rounded-2xl py-1.5 md:py-2.5'
      >
        <SignalLamp side='left' />
        <Readout label='Tốc độ'>
          <span className='font-black font-mono text-xl leading-none md:text-3xl'>
            <span data-testid='hud-speed'>{telemetry.speedKmh.toFixed(1)}</span>
            <span className='ml-1 font-medium text-[10px] text-white/55'>km/h</span>
          </span>
        </Readout>
        <Readout label='Vòng tua' className='w-24 md:w-36'>
          <span
            data-testid='hud-rpm'
            className={cn(
              'font-black font-mono text-xl leading-none md:text-3xl',
              !engineRunning && 'text-red-400',
              engineRunning && telemetry.rpm < 600 && 'text-amber-300'
            )}
          >
            {Math.round(telemetry.rpm / 10) * 10}
          </span>
          <div className='mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/15'>
            <div
              className={cn('h-full rounded-full', rpmRatio > 0.8 ? 'bg-red-500' : 'bg-emerald-400')}
              style={{ width: `${rpmRatio * 100}%` }}
            />
          </div>
        </Readout>
        <Readout label='Số'>
          <span
            data-testid='hud-gear'
            className='font-black font-mono text-2xl text-amber-300 leading-none md:text-4xl'
          >
            {gear}
          </span>
        </Readout>
        {transmission === 'B2' && (
          <Readout label='Côn' className='ds-gauge-extra'>
            <span className='font-black font-mono text-sky-300 text-xl leading-none md:text-3xl'>
              <span data-testid='hud-clutch'>{telemetry.clutchPct}</span>
              <span className='ml-0.5 font-medium text-[10px] text-white/55'>%</span>
            </span>
          </Readout>
        )}
        <Readout label='Đèn báo' className='ds-gauge-extra'>
          <div className='flex gap-1.5 pt-0.5'>
            <span
              title='Phanh tay'
              className={cn(
                'flex size-6 items-center justify-center rounded-full border font-black text-[11px] md:size-7',
                handbrake ? 'border-red-400 bg-red-600 text-white' : 'border-white/15 text-white/25'
              )}
            >
              P
            </span>
            <span
              title='Động cơ'
              className={cn(
                'flex size-6 items-center justify-center rounded-full border font-black text-[9px] md:size-7',
                engineRunning ? 'border-white/15 text-white/25' : 'ds-blink border-red-400 bg-red-600 text-white'
              )}
            >
              ENG
            </span>
          </div>
        </Readout>
        <SignalLamp side='right' />
      </div>
    </div>
  );
}
