import { ROAD_STEPS } from '../constants';
import type { RoadProgress, Transmission, YardProgress } from '../types';

/** Why a mistake was scored and what to do differently next time. */
export interface Advice {
  why: string;
  fix: string;
}

type Entry = [RegExp, Advice | ((transmission: Transmission) => Advice)];

const LINE: Advice = {
  why: 'Có bánh xe chạm vạch giới hạn của hình. Cứ mỗi 5 giây bánh còn nằm trên vạch lại bị trừ thêm 5 điểm.',
  fix: 'Đi thật chậm, nhìn gương hai bên để căn bánh sau. Lỡ chạm vạch thì đánh lái đưa bánh ra ngay, đừng đứng yên trên vạch.',
};

const ENTRIES: Entry[] = [
  [
    /chết máy/i,
    (t) =>
      t === 'B2'
        ? {
            why: 'Xe đang vào số mà nhả côn quá nhanh, hoặc phanh dừng xe mà chưa đạp côn nên vòng tua tụt dưới 400.',
            fix: 'Trước khi dừng hẳn luôn đạp hết côn (C). Khi đi lại: nhả côn chậm tới điểm bám 40–50% (giữ X), chờ xe nhúc nhích rồi mới nhả hết. Đề lại máy: về N hoặc đạp hết côn rồi bấm Enter.',
          }
        : {
            why: 'Động cơ bị tắt khi xe đang chạy.',
            fix: 'Về số P hoặc N rồi bấm Enter để đề lại máy.',
          },
  ],
  [
    /tụt dốc/i,
    (t) => ({
      why: 'Xe trôi lùi quá 50 cm khi khởi hành trên dốc: phanh đã nhả mà lực kéo chưa đủ giữ xe.',
      fix:
        t === 'B2'
          ? 'Dừng ở vạch thì kéo phanh tay (Space). Đạp côn, vào số 1, nhả côn tới điểm bám (giữ X), đệm ga (W) lên khoảng 2.000 vòng rồi mới hạ phanh tay và nhả côn từ từ.'
          : 'Dừng ở vạch thì kéo phanh tay (Space). Để số D, đạp ga (W) cho xe ghì lên rồi mới hạ phanh tay.',
    }),
  ],
  [
    /không khởi hành qua vạch dừng/i,
    {
      why: 'Từ lúc dừng ở vạch trên dốc, xe phải đi tiếp qua vạch trong 30 giây.',
      fix: 'Dừng xong thì làm ngay: phanh tay, số 1 (hoặc D), ga, hạ phanh tay. Tập cho quen tay ở bài Đề-pa Dốc trước khi thi liên hoàn.',
    },
  ],
  [
    /ra ngoài làn dốc/i,
    {
      why: 'Xe đi ra khỏi làn dốc trước khi hết bài.',
      fix: 'Giữ thẳng lái từ chân dốc tới khi xuống hết dốc bên kia; chỉ chỉnh lái nhẹ, không quay vô lăng quá nửa vòng.',
    },
  ],
  [
    /chưa đến vạch dừng/i,
    {
      why: 'Lần dừng đầu tiên trước vạch được chấm, và cản trước còn cách vạch hơn 50 cm.',
      fix: 'Đừng dừng sớm rồi nhích thêm. Bò thật chậm tới khi vạch khuất dưới mũi xe mới phanh; chuyển camera "Trên cao" (V) để thấy rõ khoảng cách.',
    },
  ],
  [
    /quá vạch dừng/i,
    {
      why: 'Cản trước đã vượt qua vạch dừng khi xe dừng lại.',
      fix: 'Giảm xuống tốc độ đi bộ từ cách vạch khoảng 5 m, rà phanh (S) sớm và dừng khi vạch vừa tới mũi xe.',
    },
  ],
  [
    /không dừng xe ở vạch dừng/i,
    (t) => ({
      why: 'Xe đi qua vạch mà không dừng hẳn (tốc độ chưa về 0).',
      fix: `Ở vạch dừng phải dừng hẳn rồi mới đi tiếp. ${t === 'B2' ? 'Đạp côn (C) và phanh (S)' : 'Đạp phanh (S)'} cho xe đứng yên một nhịp trước vạch.`,
    }),
  ],
  [/đè vạch/i, LINE],
  [
    /vỉa hè|va vào lề/i,
    {
      why: 'Có bánh xe rời khỏi mặt đường (leo vỉa, ra bãi cỏ). Lỗi này bị truất quyền sát hạch ngay.',
      fix: 'Bánh sau luôn cắt vào trong so với bánh trước. Vào cua thì đi sát mép ngoài, chờ đầu xe qua góc mới đánh hết lái (Q/E), và giữ dưới 10 km/h.',
    },
  ],
  [
    /chưa ghép được xe/i,
    {
      why: 'Xe ra khỏi bài khi chưa nằm trọn trong ô đỗ. Bài chỉ được tính khi cả xe ở trong ô, dừng hẳn và có tiếng "tít".',
      fix: 'Lùi tới khi nghe "tít" rồi mới đi ra. Các mốc đánh lái từng bước nằm trong Hướng dẫn (H), mục Ghép dọc và Thi 11 bài.',
    },
  ],
  [
    /quá 2 phút/i,
    {
      why: 'Mỗi bài trong hình chỉ có 2 phút tính từ lúc xe vào bài.',
      fix: 'Không dừng lâu để căn chỉnh. Luyện riêng bài này ở chế độ từng bài cho thuộc mốc đánh lái rồi quay lại thi.',
    },
  ],
  [
    /xi.?nhan trái khi xuất phát/i,
    {
      why: 'Xe lăn bánh ở vạch xuất phát khi chưa bật xi nhan trái.',
      fix: 'Trước khi nhả phanh: bật xi nhan trái (phím , hoặc nút ◀ phía trên vô lăng), thấy đèn nháy rồi mới đi.',
    },
  ],
  [
    /tắt xi.?nhan trái/i,
    {
      why: 'Xi nhan trái vẫn bật khi xe đã đi quá 5 m sau khi xuất phát.',
      fix: 'Xe vừa lăn bánh qua vạch thì bấm lại phím , (hoặc nút ◀) để tắt xi nhan.',
    },
  ],
  [
    /xi.?nhan phải khi (qua vạch kết thúc|dừng xe)/i,
    {
      why: 'Kết thúc bài phải bật xi nhan phải trước khi qua vạch / tấp vào lề.',
      fix: 'Thấy biển hoặc vạch kết thúc thì bật xi nhan phải (phím . hoặc nút ▶) và giữ tới khi xong bài.',
    },
  ],
  [
    /xi.?nhan .* khi rẽ/i,
    {
      why: 'Rẽ ở ngã tư mà không bật xi nhan cùng phía.',
      fix: 'Bật xi nhan trước khi tới vạch dừng: phím , để rẽ trái, phím . để rẽ phải. Dòng nhắc trên HUD ghi rõ lần này đi thẳng hay rẽ.',
    },
  ],
  [
    /vạch xuất phát/i,
    (t) => ({
      why: 'Đồng hồ chạy ngay khi vào bài: xe phải qua vạch xuất phát trong 20 giây (quá 30 giây bị truất quyền).',
      fix: `Vào bài là làm ngay, không chờ: bật xi nhan trái, ${t === 'B2' ? 'đạp côn (C) vào số 1, hạ phanh tay (Space), nhả côn tới điểm bám rồi đệm ga' : 'đạp phanh (S) vào số D rồi nhả phanh'} cho xe qua vạch.`,
    }),
  ],
  [
    /vượt đèn đỏ/i,
    {
      why: 'Xe qua vạch dừng ở ngã tư khi đèn hướng mình đang đỏ hoặc vàng.',
      fix: 'Nhìn cột đèn bên phải hướng đi. Đèn đỏ hoặc vàng: dừng trước vạch trong khoảng 50 cm, chờ xanh rồi mới đi.',
    },
  ],
  [
    /từ khi đèn xanh/i,
    (t) => ({
      why: 'Đèn đã xanh mà quá 20 giây xe chưa qua ngã tư (quá 30 giây bị truất quyền).',
      fix: `Trong lúc chờ đèn đỏ, ${t === 'B2' ? 'đạp côn giữ sẵn số 1' : 'giữ sẵn số D và đạp phanh'}. Đèn vừa xanh là đi ngay.`,
    }),
  ],
  [
    /vệt bánh xe/i,
    {
      why: 'Hai bánh bên phải phải lăn giữa hai vạch vàng của vệt bánh xe; lần này bánh đi ra ngoài vệt.',
      fix: 'Vào bài thì căn cho xe sát về bên phải: nhìn gương phải, giữ vạch vàng ngoài cách thân xe khoảng một gang tay rồi đi thẳng hết vệt.',
    },
  ],
  [
    /trình tự/i,
    {
      why: 'Xe đi vào bài sau khi chưa xong bài trước (bỏ bài hoặc rẽ nhầm đường).',
      fix: 'Đi theo đường xanh trên bản đồ nhỏ tới chấm vàng, và đọc dòng "Bài x/11" trên HUD trước mỗi ngã rẽ.',
    },
  ],
  [
    /chạy quá|vượt quá tốc độ/i,
    {
      why: 'Xe chạy quá tốc độ cho phép (24 km/h trong sân, 40 km/h trên đường trường).',
      fix: 'Nhả bớt ga, liếc đồng hồ km/h trước mỗi đoạn thẳng. Trong sân chỉ có bài 9 mới cần vượt 24 km/h.',
    },
  ],
  [
    /vòng\/phút/i,
    (t) => ({
      why: 'Vòng tua động cơ vượt 4.000 vòng/phút.',
      fix:
        t === 'B2'
          ? 'Nhả bớt ga (W). Đạp côn thì bỏ ga, và lên số cao hơn khi tua quá 3.000.'
          : 'Nhả bớt ga (W). Đang ở P hoặc N thì đừng đạp ga; vào D rồi mới tăng ga từ từ.',
    }),
  ],
  [
    /tổng thời gian/i,
    {
      why: 'Cả 11 bài phải xong trong 18 phút; quá giờ thì cứ 3 giây bị trừ 1 điểm.',
      fix: 'Ngoài các hình, đi đều 15–20 km/h thay vì bò. Đừng dừng lâu ở vạch khi không cần.',
    },
  ],
  [
    /đạt (tốc độ )?trên/i,
    {
      why: 'Tới biển tăng tốc mà xe chưa vượt tốc độ yêu cầu.',
      fix: 'Qua biển "Bắt đầu tăng tốc" thì đạp ga dứt khoát ngay, lên số sớm, và nhìn đồng hồ đã vượt mức trước khi tới biển.',
    },
  ],
  [
    /tăng (từ số 1 )?lên số/i,
    {
      why: 'Tới biển mà cần số chưa ở đúng số yêu cầu.',
      fix: 'Vừa tăng tốc vừa lên số: đạp côn (C), bấm phím số, nhả côn. Bài 9 trong sân cần đúng số 2 ở biển 24 xanh (không phải số 3).',
    },
  ],
  [
    /giảm tốc độ/i,
    {
      why: 'Tới biển giảm tốc mà xe vẫn còn nhanh hơn mức cho phép.',
      fix: 'Qua biển tăng tốc là nhả ga và rà phanh (S) ngay, để tốc độ xuống dưới mức yêu cầu trước khi tới biển giảm tốc.',
    },
  ],
  [
    /giảm (từ số 2 )?về số/i,
    {
      why: 'Tới biển giảm tốc mà cần số chưa về số thấp.',
      fix: 'Sau khi phanh giảm tốc: đạp côn (C), bấm phím 1 (hoặc 2 ở đường trường), nhả côn trước khi tới biển.',
    },
  ],
  [
    /sai làn/i,
    {
      why: 'Xe đi qua biển 24 ở làn ngược chiều thay vì làn ngoài của bài.',
      fix: 'Suốt bài 9 giữ xe ở làn ngoài (bên phải vạch tim đường), không lấn sang làn trong.',
    },
  ],
  [
    /biển dừng cuối bài/i,
    {
      why: 'Xe chạy qua biển kết thúc mà chưa dừng lại.',
      fix: 'Nghe lệnh "Kết thúc": xi nhan phải, giảm tốc, tấp vào lề phải và dừng hẳn trước biển.',
    },
  ],
  [
    /phanh tay khi dừng/i,
    {
      why: 'Xe đã dừng ở cuối bài nhưng chưa kéo phanh tay.',
      fix: 'Dừng hẳn rồi làm đủ ba việc: về số N, kéo phanh tay (Space), sau đó mới nhả phanh chân.',
    },
  ],
  [
    /số N khi dừng/i,
    (t) => ({
      why: `Xe đã dừng ở cuối bài nhưng cần số chưa về ${t === 'B2' ? 'N' : 'N hoặc P'}.`,
      fix:
        t === 'B2'
          ? 'Dừng hẳn, đạp côn rồi bấm N trước khi kéo phanh tay.'
          : 'Dừng hẳn, giữ phanh (S) rồi bấm N hoặc P trước khi kéo phanh tay.',
    }),
  ],
  [
    /tấp xe vào lề/i,
    {
      why: 'Xe dừng giữa làn thay vì sát lề phải.',
      fix: 'Sau khi bật xi nhan phải, đánh lái nhẹ sang phải cho bánh phải sát vạch lề rồi trả lái thẳng trước khi dừng.',
    },
  ],
  [
    /va chạm với xe khác/i,
    {
      why: 'Xe chạm vào xe đi phía trước.',
      fix: 'Giữ khoảng cách ít nhất 2–3 thân xe. Thấy đèn phanh xe trước sáng thì nhả ga và rà phanh ngay.',
    },
  ],
];

const FALLBACK: Advice = {
  why: 'Thao tác chưa đúng quy định của bài thi.',
  fix: 'Mở Hướng dẫn (H) để xem lại các bước của bài này.',
};

/** Explains a penalty or disqualification reason; never empty. */
export function adviceFor(reason: string, transmission: Transmission): Advice {
  for (const [pattern, advice] of ENTRIES) {
    if (pattern.test(reason)) return typeof advice === 'function' ? advice(transmission) : advice;
  }
  return FALLBACK;
}

export function hasAdvice(reason: string): boolean {
  return ENTRIES.some(([pattern]) => pattern.test(reason));
}

/** Names the exercise an exam is in, for runs that chain several; empty for a single exercise. */
export function exerciseName(exam: { progress?(): RoadProgress; yard?(): YardProgress }): string {
  const yard = exam.yard?.();
  if (yard) return `Bài ${yard.step} · ${yard.title}`;
  const road = exam.progress?.();
  return road ? `Bài ${road.step + 1} · ${ROAD_STEPS[road.step]}` : '';
}
