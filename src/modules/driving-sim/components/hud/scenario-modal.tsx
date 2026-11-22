import { BookOpen, type Car, Cog, Gauge, Map as MapIcon, Mountain, Route, SquareParking } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';
import { PASS_SCORE, ROAD, ROAD_STEPS, SCENARIO_LABELS, START_SCORE } from '../../constants';
import { useSimStore } from '../../store/sim-store';
import type { Scenario, Transmission } from '../../types';
import { DonateButton } from './donate';

const MODES: { id: Transmission; title: string; icon: typeof Car; shifter: string; points: string[] }[] = [
  {
    id: 'B1',
    title: 'B1 · Số tự động',
    icon: Gauge,
    shifter: 'P · R · N · D',
    points: ['Chỉ có phanh và ga', 'Xe tự bò khi nhả phanh ở D / R'],
  },
  {
    id: 'B2',
    title: 'B2 · Số sàn',
    icon: Cog,
    shifter: '1 · 2 · 3 · 4 · 5 · R · N',
    points: ['Côn, phanh, ga và phanh tay', 'Điểm bám côn 40–50%, nhả vội là chết máy'],
  },
];

const SCENARIOS: { id: YardScenario; icon: typeof Car; rules: string[] }[] = [
  { id: 'free', icon: MapIcon, rules: ['Làm quen vô lăng, côn, số'] },
  {
    id: 'hill',
    icon: Mountain,
    rules: ['Tụt dốc > 50 cm: truất quyền', 'Chết máy: −5 điểm', 'Quá 30 giây: truất quyền'],
  },
  { id: 'parking', icon: SquareParking, rules: ['Đè vạch chip: −5 điểm mỗi lần', 'Quá 2 phút: −5 điểm'] },
];

type YardScenario = Exclude<Scenario, 'road'>;

const EXAM_MODES = [
  { id: 'yard', label: 'Thi Sa Hình' },
  { id: 'road', label: 'Thi Đường Trường' },
] as const;

const ROAD_RULES = [
  'Xuất phát: bật xi-nhan trái, tắt trong 5 m đầu',
  `Tăng số tăng tốc: trong 100 m lên số ${ROAD.speedUp.gear} (B2), trên ${ROAD.speedUp.minKmh} km/h`,
  `Giảm số giảm tốc: dưới ${ROAD.slowDown.maxKmh} km/h trước biển`,
  'Chướng ngại vật: xe phía trước phanh gấp',
  'Kết thúc: xi-nhan phải, tấp lề, về N, kéo phanh tay',
];

const SHORTCUTS: [string, string][] = [
  ['W / S', 'Ga / Phanh'],
  ['A D · ← →', 'Đánh lái'],
  ['Q / E', 'Hết lái trái / phải'],
  ['C · X', 'Đạp côn · giữ điểm bám'],
  ['1–5 · R · N', 'Vào số (B2)'],
  ['P · R · N · F', 'Số P R N D (B1)'],
  ['Space', 'Phanh tay'],
  [', / .', 'Xi-nhan trái / phải'],
  ['Enter', 'Đề máy'],
  ['V · M · Esc', 'Camera · Tiếng · Menu'],
  ['H', 'Hướng dẫn sử dụng'],
];

function OptionCard({
  selected,
  onSelect,
  testId,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  testId: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type='button'
      data-testid={testId}
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'flex flex-col gap-1.5 rounded-xl border-2 border-white/10 bg-white/5 p-3 text-left transition-colors hover:border-white/30',
        selected && 'border-amber-400 bg-amber-400/10 hover:border-amber-400'
      )}
    >
      {children}
    </button>
  );
}

function RoadCard() {
  return (
    <div
      data-testid='scenario-road'
      className='flex flex-col gap-1.5 rounded-xl border-2 border-amber-400 bg-amber-400/10 p-3 text-left'
    >
      <span className='flex items-center gap-2 font-bold text-sm sm:text-base'>
        <Route className='size-5 shrink-0 text-amber-300' />
        {SCENARIO_LABELS.road.title}
      </span>
      <span className='text-[11px] text-white/80 leading-snug sm:text-xs'>
        {SCENARIO_LABELS.road.subtitle} · giới hạn {ROAD.speedLimitKmh} km/h · có xe chạy phía trước
      </span>
      <ol className='grid list-decimal gap-x-6 pl-4 text-[11px] text-white/65 leading-snug sm:grid-cols-2 sm:text-xs'>
        {ROAD_RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ol>
      <span className='text-[11px] text-white/55 leading-snug'>
        {ROAD_STEPS.length} bài · mỗi lỗi −5 điểm · quá {ROAD.speedLimitKmh} km/h hoặc chết máy −5 điểm · va chạm xe
        khác hoặc lề đường: truất quyền
      </span>
    </div>
  );
}

/** Practice mode selector: yard or road test, licence class (B1/B2) and exercise. */
export function ScenarioModal() {
  const transmission = useSimStore((s) => s.transmission);
  const scenario = useSimStore((s) => s.scenario);
  const setTransmission = useSimStore((s) => s.setTransmission);
  const setScenario = useSimStore((s) => s.setScenario);
  const start = useSimStore((s) => s.start);
  const setGuideOpen = useSimStore((s) => s.setGuideOpen);
  // The yard exercise to return to when switching back from the road test.
  const [yardScenario, setYardScenario] = useState<YardScenario>(scenario === 'road' ? 'hill' : scenario);
  const road = scenario === 'road';

  const selectYard = (id: YardScenario) => {
    setYardScenario(id);
    setScenario(id);
  };

  return (
    <div className='absolute inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/55 p-3 sm:p-6'>
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='ds-menu-title'
        data-testid='scenario-modal'
        className='w-full max-w-3xl rounded-2xl border border-white/15 bg-slate-900/95 p-4 shadow-2xl sm:my-auto sm:p-6'
      >
        <div className='flex items-center justify-between gap-3'>
          <Logo onDark className='h-7 sm:h-8' />
          <DonateButton />
        </div>
        <h1 id='ds-menu-title' className='mt-3 font-black text-lg leading-tight sm:text-2xl'>
          Mô phỏng sát hạch lái xe 3D
        </h1>
        <p className='text-white/60 text-xs sm:text-sm'>
          Sa hình và đường trường B1 / B2 · Bắt đầu {START_SCORE} điểm, đạt từ {PASS_SCORE} điểm
        </p>

        <div role='tablist' aria-label='Phần thi' className='mt-3 grid grid-cols-2 gap-1 rounded-xl bg-white/5 p-1'>
          {EXAM_MODES.map((mode) => {
            const selected = (mode.id === 'road') === road;
            return (
              <button
                key={mode.id}
                type='button'
                role='tab'
                data-testid={`exam-mode-${mode.id}`}
                aria-selected={selected}
                onClick={() => setScenario(mode.id === 'road' ? 'road' : yardScenario)}
                className={cn(
                  'rounded-lg px-3 py-2 font-bold text-sm text-white/65 transition-colors hover:text-white sm:text-base',
                  selected && 'bg-amber-400 text-slate-950 hover:text-slate-950'
                )}
              >
                {mode.label}
              </button>
            );
          })}
        </div>

        <h2 className='mt-4 mb-2 font-bold text-white/70 text-xs uppercase tracking-wider'>1. Hạng xe</h2>
        <div className='grid grid-cols-2 gap-2 sm:gap-3'>
          {MODES.map((mode) => (
            <OptionCard
              key={mode.id}
              testId={`mode-${mode.id}`}
              selected={transmission === mode.id}
              onSelect={() => setTransmission(mode.id)}
            >
              <span className='flex items-center gap-2 font-bold text-sm sm:text-base'>
                <mode.icon className='size-5 shrink-0 text-amber-300' />
                {mode.title}
              </span>
              <span className='font-mono text-[11px] text-amber-200 sm:text-xs'>{mode.shifter}</span>
              <ul className='list-disc pl-4 text-[11px] text-white/65 leading-snug sm:text-xs'>
                {mode.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </OptionCard>
          ))}
        </div>

        <h2 className='mt-4 mb-2 font-bold text-white/70 text-xs uppercase tracking-wider'>2. Bài tập</h2>
        {road ? (
          <RoadCard />
        ) : (
          <div className='grid gap-2 sm:grid-cols-3 sm:gap-3'>
            {SCENARIOS.map((item) => (
              <OptionCard
                key={item.id}
                testId={`scenario-${item.id}`}
                selected={scenario === item.id}
                onSelect={() => selectYard(item.id)}
              >
                <span className='flex items-center gap-2 font-bold text-sm sm:text-base'>
                  <item.icon className='size-5 shrink-0 text-amber-300' />
                  {SCENARIO_LABELS[item.id].title}
                </span>
                <span className='text-[11px] text-white/80 leading-snug sm:text-xs'>
                  {SCENARIO_LABELS[item.id].subtitle}
                </span>
                <ul className='list-disc pl-4 text-[11px] text-white/55 leading-snug'>
                  {item.rules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </OptionCard>
            ))}
          </div>
        )}

        <div className='mt-4 hidden md:block'>
          <h2 className='mb-2 font-bold text-white/70 text-xs uppercase tracking-wider'>Phím tắt</h2>
          <dl className='grid grid-cols-3 gap-x-4 gap-y-1 text-xs'>
            {SHORTCUTS.map(([keys, action]) => (
              <div key={keys} className='flex items-center justify-between gap-2 rounded-md bg-white/5 px-2 py-1'>
                <dt className='font-bold font-mono text-amber-200'>{keys}</dt>
                <dd className='text-right text-white/65'>{action}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className='mt-5 flex flex-col gap-2 sm:flex-row'>
          <Button
            data-testid='guide-button'
            size='lg'
            variant='outline'
            onClick={() => setGuideOpen(true)}
            className='border-white/25 bg-transparent font-bold text-base text-white hover:bg-white/10 hover:text-white sm:w-56'
          >
            <BookOpen className='size-5' />
            Hướng dẫn sử dụng
          </Button>
          <Button
            data-testid='start-button'
            size='lg'
            onClick={start}
            className='flex-1 bg-amber-400 font-bold text-base text-slate-950 hover:bg-amber-300'
          >
            Bắt đầu lái
          </Button>
        </div>
      </div>
    </div>
  );
}
