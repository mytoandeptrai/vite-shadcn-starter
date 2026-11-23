import { BookOpen, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useSimStore } from '../../store/sim-store';

type TopicId = 'basics' | 'manual' | 'automatic' | 'hill' | 'parking' | 'road';

interface Section {
  title: string;
  /** Ordered steps, done one after another. */
  steps?: string[];
  /** Unordered remarks. */
  notes?: string[];
}

const CONTROLS: [string, string, string][] = [
  ['Ga', 'W / ↑', 'Giữ để tăng ga, thả ra là về 0'],
  ['Phanh', 'S / ↓', 'Giữ để phanh'],
  ['Côn (B2)', 'C', 'Giữ C = đạp hết côn. Trên điện thoại: bấm “Đạp hết” / “Nhả côn” hoặc kéo thanh trượt Côn'],
  ['Điểm bám côn (B2)', 'X', 'Giữ X = côn tự dừng ở vùng ĐIỂM BÁM (màu vàng). Trên điện thoại: bấm “Điểm bám”'],
  ['Vào số', '1–5 · R · N', 'B2 phải đạp hết côn trước. B1: P · R · N · F (F = số D)'],
  ['Phanh tay', 'Space', 'Bấm một lần để kéo, bấm lần nữa để nhả'],
  ['Xi-nhan trái / phải', ', / .', 'Bấm để bật, bấm lại để tắt. Trên màn hình: hai nút “Xi-nhan” phía trên vô lăng'],
  ['Đề máy', 'Enter', 'Nổ máy lại sau khi chết máy'],
  ['Vô lăng', 'A D / ← →', 'Hoặc kéo vô lăng trên màn hình; thả ra tự trả lái'],
  ['Hết lái trái / phải', 'Q / E', 'Đánh hết lái và giữ nguyên; bấm lại để trả thẳng'],
  ['Góc nhìn · Tiếng · Chọn bài', 'V · M · Esc', 'Đuôi xe / ghế lái / trên cao'],
];

const TOPICS: { id: TopicId; label: string; intro: string; sections: Section[] }[] = [
  {
    id: 'basics',
    label: 'Cơ bản',
    intro:
      'Xe không tự chạy khi chỉ nhấn ga: phải vào số, nhả phanh tay và (với số sàn) nhả côn đúng cách. Làm theo dòng “Thao tác” màu vàng ở đầu màn hình, nó luôn chỉ bước kế tiếp.',
    sections: [
      {
        title: 'Đọc màn hình',
        notes: [
          'Dòng trắng trên cùng: yêu cầu của bài thi. Dòng vàng “Thao tác”: việc cần làm ngay với côn, ga, phanh, số.',
          'Thanh trên cùng bên trái: thời gian, điểm, tốc độ, vòng tua, số đang cài, % côn (100% = đạp hết).',
          'Cần số luôn hiện cạnh vô lăng: bấm thẳng vào số muốn cài, số đang cài có màu vàng.',
          'Hai gương và bản đồ nhỏ: canh bánh sau với vạch khi lùi chuồng.',
          'Mở lại hướng dẫn này bất cứ lúc nào bằng nút “?” hoặc phím H. Xe tạm dừng khi đang đọc.',
        ],
      },
      {
        title: 'Trên điện thoại',
        notes: [
          'Xoay ngang màn hình để dễ lái: vô lăng ở tay trái, bàn đạp ở tay phải.',
          'Dùng hai ngón cùng lúc: tay phải giữ phanh hoặc ga, tay trái chọn số và bấm phanh tay ngay cạnh vô lăng.',
          'Số sàn: ba nút “Đạp hết”, “Điểm bám”, “Nhả côn” đưa côn tới đúng vị trí và giữ ở đó, không cần giữ ngón tay.',
        ],
      },
    ],
  },
  {
    id: 'manual',
    label: 'B2 · Số sàn',
    intro: 'Quy tắc chung: muốn vào số hay dừng xe thì đạp hết côn trước; muốn xe đi thì nhả côn từ từ qua điểm bám.',
    sections: [
      {
        title: 'Khởi hành trên đường bằng',
        steps: [
          'Giữ C (đạp hết côn), bấm 1 để vào số 1.',
          'Bấm Space để nhả phanh tay.',
          'Chuyển sang giữ X: côn tự về vùng ĐIỂM BÁM (khoảng 50–60%).',
          'Giữ thêm W cho vòng tua lên khoảng 1500, xe bắt đầu lăn bánh.',
          'Khi xe đã chạy, thả X để côn nhả hết, giữ ga đều.',
        ],
      },
      {
        title: 'Dừng xe',
        steps: ['Thả ga.', 'Giữ C (đạp hết côn) trước.', 'Giữ S để phanh đến khi dừng hẳn, bấm N về số 0 nếu đỗ lâu.'],
      },
      {
        title: 'Vì sao chết máy và cách nổ lại',
        notes: [
          'Chết máy khi nhả côn quá nhanh lúc vòng tua thấp, hoặc phanh dừng xe mà không đạp côn.',
          'Nổ lại: giữ C (hoặc về N) rồi bấm Enter / nút “Đề máy”. Trong bài thi mỗi lần chết máy bị trừ 5 điểm.',
        ],
      },
    ],
  },
  {
    id: 'automatic',
    label: 'B1 · Tự động',
    intro: 'Chỉ có phanh và ga. Xe tự bò chậm khi ở số D hoặc R và không đạp phanh.',
    sections: [
      {
        title: 'Khởi hành',
        steps: [
          'Giữ S (đạp phanh).',
          'Bấm F để vào số D (tiến) hoặc R để lùi. Không đạp phanh thì không ra được số P.',
          'Nhả phanh từ từ: xe tự bò. Cần nhanh hơn thì nhấn nhẹ W.',
        ],
      },
      {
        title: 'Đi chậm và đổi chiều',
        notes: [
          'Trong sa hình không cần ga: chỉ nhả và rà phanh để chỉnh tốc độ.',
          'Phải dừng hẳn (giữ S) rồi mới đổi giữa D và R.',
        ],
      },
    ],
  },
  {
    id: 'hill',
    label: 'Đề-pa dốc',
    intro:
      'Dừng trên dốc với cản trước cách vạch trắng không quá 50 cm, rồi khởi hành lại trong 30 giây mà không tụt quá 50 cm.',
    sections: [
      {
        title: 'Số sàn (B2)',
        steps: [
          'Khởi hành số 1 như trên đường bằng, chạy chậm lên dốc.',
          'Nhìn dòng “còn … m”. Còn khoảng 1 m: thả ga, giữ C (đạp hết côn).',
          'Giữ S để dừng hẳn khi còn dưới 0,5 m. Dừng sớm hơn bị trừ 5 điểm, vượt qua vạch bị truất quyền.',
          'Bấm Space kéo phanh tay, rồi thả S. Vẫn giữ C.',
          'Giữ W cho vòng tua lên khoảng 2000.',
          'Đổi C sang X để côn về điểm bám: vòng tua tụt nhẹ, xe rung là côn đã bám.',
          'Bấm Space nhả phanh tay. Xe đi lên thì thả X, giữ ga đến hết dốc.',
        ],
      },
      {
        title: 'Số tự động (B1)',
        steps: [
          'Vào D, chạy chậm lên dốc bằng ga nhẹ.',
          'Giữ S dừng trước vạch dưới 50 cm.',
          'Nhả S rồi nhấn W ngay để xe không tụt, chạy qua đỉnh dốc.',
        ],
      },
      {
        title: 'Lỗi bị chấm',
        notes: [
          'Tụt dốc quá 50 cm, quá 30 giây chưa qua vạch, hoặc không dừng ở vạch: truất quyền.',
          'Chết máy hoặc dừng cách vạch quá 50 cm: trừ 5 điểm mỗi lỗi.',
        ],
      },
    ],
  },
  {
    id: 'parking',
    label: 'Ghép dọc',
    intro:
      'Làn vào là đường cụt, chuồng nằm bên trái làn. Đi thật chậm suốt bài: B2 dùng số 1 / số R và rà côn ở điểm bám, B1 chỉ nhả phanh cho xe bò.',
    sections: [
      {
        title: 'Các bước',
        steps: [
          'Tiến qua vạch bắt đầu (màu xanh), đi sát mép phải làn để có chỗ quay đầu xe.',
          'Tiến qua cửa chuồng, dừng khi đuôi xe đã qua mép xa của cửa chuồng chừng 1,8 m.',
          'Vào số lùi R, bấm “Hết lái trái” (Q), lùi thật chậm. Nhìn gương trái và bản đồ nhỏ để canh bánh sau với vạch.',
          'Khi thân xe song song với chuồng: bấm lại “Hết lái trái” để trả lái thẳng, lùi thẳng vào.',
          'Dừng khi cả xe nằm gọn trong chuồng, chờ tiếng “tít” báo đã ghép xong.',
          'Vào số 1 (B2) hoặc D (B1), tiến ra, đánh lái phải để quay về phía cửa vào và chạy qua lại vạch xanh để kết thúc.',
        ],
      },
      {
        title: 'Lỗi bị chấm',
        notes: [
          'Bánh xe đè vạch cảm biến (màu vàng): trừ 5 điểm mỗi lần, đè lâu bị trừ tiếp mỗi 5 giây.',
          'Quá 2 phút hoặc ra khỏi hình khi chưa ghép được xe: trừ 5 điểm.',
        ],
      },
    ],
  },
  {
    id: 'road',
    label: 'Đường trường',
    intro:
      'Lái 2 km trên đường hai làn, đi làn bên phải, không quá 40 km/h. Sát hạch viên đọc lệnh, khung trên màn hình ghi bài đang thi và quãng đường còn lại. Có xe chạy phía trước: giữ khoảng cách.',
    sections: [
      {
        title: '1. Xuất phát',
        steps: [
          'Bấm , (dấu phẩy) hoặc nút “Xi-nhan” bên trái để bật xi-nhan trái.',
          'B2: giữ C, vào số 1, nhả phanh tay (Space), đưa côn về điểm bám (X) và thêm ga (W). B1: giữ S, vào D (F), nhả phanh tay, nhả phanh.',
          'Xe vừa lăn bánh thì tắt xi-nhan trái ngay, trong 5 m đầu.',
        ],
      },
      {
        title: '2. Tăng số tăng tốc (biển ở mét 200)',
        steps: [
          'Trong 100 m sau biển, B2 phải lên tới số 3 và chạy trên 24 km/h. B1 chỉ cần trên 24 km/h.',
          'Lên số: thả ga, giữ C, bấm số kế tiếp (2 rồi 3), thả C, ga lại. Lên số 2 ở khoảng 15 km/h, số 3 ở khoảng 25 km/h.',
        ],
      },
      {
        title: '3. Giảm số giảm tốc (biển ở mét 700)',
        steps: [
          'Thả ga, rà phanh (S) cho xe xuống dưới 20 km/h trước biển kiểm tra ở mét 800.',
          'B2: giữ C, về số 2 (hoặc 1), thả C từ từ.',
        ],
      },
      {
        title: '4. Chướng ngại vật (khoảng mét 1100)',
        notes: [
          'Xe phía trước phanh gấp, đèn phanh sáng đỏ. Thả ga, B2 đạp côn rồi phanh, dừng sau xe đó và chờ nó đi tiếp.',
          'Chạm vào xe khác là bị truất quyền, nên luôn giữ khoảng cách vài thân xe.',
        ],
      },
      {
        title: '5. Kết thúc (biển ở mét 1800)',
        steps: [
          'Bấm . (dấu chấm) hoặc nút “Xi-nhan” bên phải để bật xi-nhan phải.',
          'Giảm tốc, đánh lái nhẹ sang phải cho xe vào phần lề, bên phải vạch liền.',
          'Dừng hẳn trước biển “Dừng xe” ở mét 2000.',
          'Về số N (B1: P hoặc N) và kéo phanh tay (Space). Có 5 giây sau khi dừng.',
        ],
      },
      {
        title: 'Lỗi bị chấm',
        notes: [
          'Trừ 5 điểm mỗi lỗi: quên hoặc không tắt xi-nhan trái, không đạt bài tăng tốc, không đạt bài giảm tốc, chạy quá 40 km/h, chết máy, quên xi-nhan phải, không tấp vào lề, không về N, không kéo phanh tay.',
          'Truất quyền: va chạm với xe khác, lao ra khỏi mặt đường, hoặc chạy quá biển “Dừng xe”.',
        ],
      },
    ],
  },
];

/** Step-by-step usage guide. Opens from the menu, the toolbar “?” button or the H key. */
export function GuideModal() {
  const open = useSimStore((s) => s.guideOpen);
  const setOpen = useSimStore((s) => s.setGuideOpen);
  const phase = useSimStore((s) => s.phase);
  const scenario = useSimStore((s) => s.scenario);
  const transmission = useSimStore((s) => s.transmission);
  const [topicId, setTopicId] = useState<TopicId>('basics');

  // Open on the page that matches what the learner is doing right now.
  useEffect(() => {
    if (!open) return;
    if (phase !== 'driving') setTopicId('basics');
    else if (scenario === 'free') setTopicId(transmission === 'B2' ? 'manual' : 'automatic');
    else setTopicId(scenario);
  }, [open, phase, scenario, transmission]);

  if (!open) return null;
  const topic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[0];

  return (
    <div className='absolute inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 p-3 sm:items-center sm:p-6'>
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='ds-guide-title'
        data-testid='guide-modal'
        className='flex max-h-full w-full max-w-3xl flex-col rounded-2xl border border-white/15 bg-slate-900/95 shadow-2xl'
      >
        <div className='flex items-center gap-3 border-white/10 border-b p-4 sm:px-6'>
          <BookOpen className='size-6 shrink-0 text-amber-300' />
          <div className='min-w-0 flex-1'>
            <h2 id='ds-guide-title' className='font-black text-base leading-tight sm:text-xl'>
              Hướng dẫn sử dụng
            </h2>
            {phase === 'driving' && <p className='text-[11px] text-white/55 sm:text-xs'>Xe đang tạm dừng</p>}
          </div>
          <button
            type='button'
            data-testid='guide-close'
            aria-label='Đóng hướng dẫn'
            onClick={() => setOpen(false)}
            className='flex size-9 items-center justify-center rounded-xl border border-white/15 hover:border-white/40'
          >
            <X className='size-5' />
          </button>
        </div>

        <div role='tablist' className='flex gap-1.5 overflow-x-auto border-white/10 border-b px-4 py-2 sm:px-6'>
          {TOPICS.map((t) => (
            <button
              key={t.id}
              type='button'
              role='tab'
              data-testid={`guide-tab-${t.id}`}
              aria-selected={t.id === topic.id}
              onClick={() => setTopicId(t.id)}
              className={cn(
                'shrink-0 rounded-lg px-3 py-1.5 font-semibold text-white/65 text-xs hover:text-white sm:text-sm',
                t.id === topic.id && 'bg-amber-400 text-slate-950 hover:text-slate-950'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div role='tabpanel' data-testid='guide-panel' className='min-h-0 flex-1 overflow-y-auto p-4 sm:px-6'>
          <p className='text-sm text-white/80 leading-relaxed'>{topic.intro}</p>

          {topic.id === 'basics' && (
            <table className='mt-3 w-full border-collapse text-left text-xs sm:text-sm'>
              <thead>
                <tr className='text-[10px] text-white/50 uppercase tracking-wider'>
                  <th className='py-1 pr-2 font-semibold'>Điều khiển</th>
                  <th className='py-1 pr-2 font-semibold'>Phím</th>
                  <th className='py-1 font-semibold'>Cách dùng</th>
                </tr>
              </thead>
              <tbody>
                {CONTROLS.map(([name, keys, usage]) => (
                  <tr key={name} className='border-white/10 border-t align-top'>
                    <td className='py-1.5 pr-2 font-semibold'>{name}</td>
                    <td className='whitespace-nowrap py-1.5 pr-2 font-bold font-mono text-amber-200'>{keys}</td>
                    <td className='py-1.5 text-white/70'>{usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {topic.sections.map((section) => (
            <section key={section.title} className='mt-4'>
              <h3 className='mb-1.5 font-bold text-amber-200 text-sm'>{section.title}</h3>
              {section.steps && (
                <ol className='list-decimal space-y-1 pl-5 text-sm text-white/85 leading-relaxed marker:font-bold marker:text-amber-300'>
                  {section.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              )}
              {section.notes && (
                <ul className='list-disc space-y-1 pl-5 text-sm text-white/70 leading-relaxed'>
                  {section.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
