import {
  ArrowRight,
  BookOpen,
  type Car,
  Keyboard,
  ListChecks,
  Map as MapIcon,
  Mountain,
  Route,
  SquareParking,
} from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';
import { PASS_SCORE, ROAD, ROAD_STEPS, SCENARIO_LABELS, START_SCORE } from '../../constants';
import { useSimStore } from '../../store/sim-store';
import type { Scenario, Transmission } from '../../types';
import { DonateButton } from './donate';

const MODES: { id: Transmission; label: string; summary: string }[] = [
  { id: 'B1', label: 'B1 · Số tự động', summary: 'Cần số P · R · N · D. Chỉ có phanh và ga, xe tự bò khi nhả phanh.' },
  {
    id: 'B2',
    label: 'B2 · Số sàn',
    summary: 'Số 1–5 · R · N. Có côn và phanh tay; điểm bám côn 40–50%, nhả vội là chết máy.',
  },
];

const SCENARIOS: { id: YardScenario; icon: typeof Car; rules: string[] }[] = [
  {
    id: 'exam',
    icon: ListChecks,
    rules: [
      'Đủ 11 bài theo thứ tự trong 18 phút',
      'Quá 24 km/h: −1 điểm mỗi 3 giây',
      'Leo vỉa hoặc sai thứ tự bài: truất quyền',
    ],
  },
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

/** Two or three choices side by side; the picked one is filled. */
function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  testId,
}: {
  label: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  testId: (id: T) => string;
}) {
  return (
    <fieldset
      aria-label={label}
      className='m-0 grid min-w-0 auto-cols-fr grid-flow-col gap-1 rounded-xl border-0 bg-black/35 p-1'
    >
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type='button'
            data-testid={testId(option.id)}
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              'rounded-lg px-2 py-2.5 font-bold text-sm text-white/65 leading-tight transition-colors hover:text-white',
              selected && 'bg-amber-400 text-slate-950 shadow hover:text-slate-950'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </fieldset>
  );
}

function ExerciseCard({
  id,
  icon: Icon,
  selected,
  onSelect,
}: {
  id: YardScenario;
  icon: typeof Car;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type='button'
      data-testid={`scenario-${id}`}
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'ds-menu-card flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors hover:border-white/40 md:flex-col md:items-start md:gap-2',
        selected && 'border-amber-400 bg-amber-400/15 hover:border-amber-400'
      )}
    >
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-300',
          selected && 'bg-amber-400 text-slate-950'
        )}
      >
        <Icon className='size-5' />
      </span>
      <span className='flex min-w-0 flex-col gap-0.5'>
        <span className='font-bold text-sm leading-tight'>{SCENARIO_LABELS[id].title}</span>
        <span className='text-[11px] text-white/65 leading-snug'>{SCENARIO_LABELS[id].subtitle}</span>
      </span>
    </button>
  );
}

function RoadCard() {
  return (
    <div
      data-testid='scenario-road'
      className='ds-menu-card flex flex-col gap-1.5 rounded-2xl border border-amber-400 bg-amber-400/15 p-3 text-left'
    >
      <span className='flex items-center gap-2 font-bold text-sm'>
        <Route className='size-5 shrink-0 text-amber-300' />
        {SCENARIO_LABELS.road.title}
      </span>
      <span className='text-[11px] text-white/80 leading-snug sm:text-xs'>
        {SCENARIO_LABELS.road.subtitle} · giới hạn {ROAD.speedLimitKmh} km/h · có xe chạy phía trước
      </span>
      <ol className='list-decimal pl-4 text-[11px] text-white/70 leading-snug sm:text-xs'>
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

/** Start screen over the live scene: licence class and test on the left, exercise and start on the right. */
export function ScenarioModal() {
  const transmission = useSimStore((s) => s.transmission);
  const scenario = useSimStore((s) => s.scenario);
  const setTransmission = useSimStore((s) => s.setTransmission);
  const setScenario = useSimStore((s) => s.setScenario);
  const start = useSimStore((s) => s.start);
  const setGuideOpen = useSimStore((s) => s.setGuideOpen);
  // The yard exercise to return to when switching back from the road test.
  const [yardScenario, setYardScenario] = useState<YardScenario>(scenario === 'road' ? 'hill' : scenario);
  const [keysOpen, setKeysOpen] = useState(false);
  const road = scenario === 'road';
  const mode = MODES.find((m) => m.id === transmission) ?? MODES[0];
  const rules = road ? [] : (SCENARIOS.find((s) => s.id === scenario)?.rules ?? []);

  const selectYard = (id: YardScenario) => {
    setYardScenario(id);
    setScenario(id);
  };

  return (
    <div className='ds-menu absolute inset-0 z-40 overflow-y-auto'>
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='ds-menu-title'
        data-testid='scenario-modal'
        className='ds-menu-grid mx-auto grid min-h-full w-full max-w-5xl content-center gap-4 p-4 sm:p-6 md:grid-cols-2 md:gap-8'
      >
        <div className='flex flex-col gap-3 md:justify-center'>
          <div className='flex items-center justify-between gap-3'>
            <Logo onDark className='h-7 sm:h-8' />
            <DonateButton />
          </div>
          <div>
            <p className='font-semibold text-white/60 text-xs sm:text-sm'>Mô phỏng sát hạch lái xe 3D</p>
            <h1
              id='ds-menu-title'
              className='ds-menu-title font-black text-3xl leading-[1.05] tracking-tight sm:text-5xl'
            >
              Luyện thi <span className='text-amber-400'>{road ? 'đường trường' : 'sa hình'}</span> <br />
              {transmission === 'B1' ? 'số tự động' : 'số sàn'}
            </h1>
            <p className='mt-1.5 text-white/60 text-xs sm:text-sm'>
              Hạng B1 / B2 · bắt đầu {START_SCORE} điểm · đạt từ {PASS_SCORE} điểm
            </p>
          </div>

          <div className='ds-menu-card flex flex-col gap-3 rounded-2xl border p-3'>
            <div className='flex flex-col gap-1.5'>
              <h2 className='font-bold text-sm'>Hạng xe</h2>
              <Segmented
                label='Hạng xe'
                options={MODES}
                value={transmission}
                onChange={setTransmission}
                testId={(id) => `mode-${id}`}
              />
              <p className='text-[11px] text-white/60 leading-snug sm:text-xs'>{mode.summary}</p>
            </div>
            <div className='flex flex-col gap-1.5 border-white/10 border-t pt-3'>
              <h2 className='font-bold text-sm'>Phần thi</h2>
              <Segmented
                label='Phần thi'
                options={EXAM_MODES}
                value={road ? 'road' : 'yard'}
                onChange={(id) => setScenario(id === 'road' ? 'road' : yardScenario)}
                testId={(id) => `exam-mode-${id}`}
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-3 md:justify-center'>
          <button
            type='button'
            data-testid='start-button'
            onClick={start}
            className='order-last flex items-center gap-3 rounded-2xl bg-amber-400 p-4 text-left text-slate-950 shadow-xl transition-colors hover:bg-amber-300 md:order-none md:p-5'
          >
            <span className='flex min-w-0 flex-1 flex-col'>
              <span className='font-black text-xl leading-tight sm:text-2xl'>Bắt đầu lái</span>
              <span className='truncate font-semibold text-slate-950/70 text-xs sm:text-sm'>
                {SCENARIO_LABELS[scenario].title} · Hạng {transmission}
              </span>
            </span>
            <ArrowRight className='size-7 shrink-0' />
          </button>

          {road ? (
            <RoadCard />
          ) : (
            <>
              <div className='grid gap-2 md:grid-cols-2'>
                {SCENARIOS.map((item) => (
                  <ExerciseCard
                    key={item.id}
                    id={item.id}
                    icon={item.icon}
                    selected={scenario === item.id}
                    onSelect={() => selectYard(item.id)}
                  />
                ))}
              </div>
              <ul className='ds-menu-card flex flex-wrap gap-x-4 gap-y-0.5 rounded-2xl border px-3 py-2 text-[11px] text-white/70 leading-snug sm:text-xs'>
                {rules.map((rule) => (
                  <li key={rule}>· {rule}</li>
                ))}
              </ul>
            </>
          )}

          <div className='ds-menu-card flex flex-col rounded-2xl border'>
            <div className='flex items-stretch divide-x divide-white/10'>
              <button
                type='button'
                data-testid='guide-button'
                onClick={() => setGuideOpen(true)}
                className='flex flex-1 items-center justify-center gap-2 px-3 py-3 font-bold text-sm text-white/85 hover:text-white'
              >
                <BookOpen className='size-4' />
                Hướng dẫn sử dụng
              </button>
              <button
                type='button'
                data-testid='keys-button'
                aria-expanded={keysOpen}
                onClick={() => setKeysOpen(!keysOpen)}
                className='hidden flex-1 items-center justify-center gap-2 px-3 py-3 font-bold text-sm text-white/85 hover:text-white md:flex'
              >
                <Keyboard className='size-4' />
                Phím điều khiển
              </button>
            </div>
            {keysOpen && (
              <dl
                data-testid='keys-panel'
                className='hidden grid-cols-2 gap-x-3 gap-y-1 border-white/10 border-t p-3 text-xs md:grid'
              >
                {SHORTCUTS.map(([keys, action]) => (
                  <div key={keys} className='flex items-center justify-between gap-2 rounded-md bg-white/5 px-2 py-1'>
                    <dt className='whitespace-nowrap font-bold font-mono text-amber-200'>{keys}</dt>
                    <dd className='text-right text-white/65'>{action}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
