import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { adviceFor, hasAdvice } from './mistakes';

/** Every reason an exam can give for a penalty or a disqualification, read from the sources. */
function reasons(): string[] {
  const found = new Set<string>();
  for (const file of ['exam.ts', 'road-exam.ts', 'yard-exam.ts']) {
    // Placeholders first: some hold quotes of their own.
    const source = readFileSync(resolve(__dirname, file), 'utf8').replace(/\$\{[^}]*\}/g, '1');
    const quoted =
      /(?:reason: |reason = speedOk\s*\? |penalty\(frame, \d+, )(['`])((?:(?!\1).)*)\1(?:\s*: (['`])((?:(?!\3).)*)\3)?/g;
    for (const match of source.matchAll(quoted)) {
      for (const text of [match[2], match[4]]) if (text && !text.startsWith('Hoàn thành')) found.add(text);
    }
  }
  return [...found];
}

describe('adviceFor', () => {
  it('finds the reasons in the exam sources', () => {
    const all = reasons();
    expect(all.length).toBeGreaterThan(45);
    expect(all).toContain('Không đạt trên 1 km/h trong 100 m');
    expect(all).toContain('Vượt đèn đỏ');
    expect(all).toContain('Xe tụt dốc quá 50 cm');
    expect(all).toContain('Không tăng lên số 1 trong 100 m');
  });

  it('explains every penalty and disqualification the exams can give', () => {
    const missing = reasons().filter((reason) => !hasAdvice(reason));
    expect(missing).toEqual([]);
  });

  it('always says both why and how to fix it', () => {
    for (const reason of [...reasons(), 'Lỗi chưa có trong bảng']) {
      const advice = adviceFor(reason, 'B2');
      expect(advice.why.length).toBeGreaterThan(10);
      expect(advice.fix.length).toBeGreaterThan(10);
    }
  });

  it('gives an automatic advice it can follow', () => {
    for (const reason of [
      'Xe chết máy',
      'Xe tụt dốc quá 50 cm',
      'Không dừng xe ở vạch dừng quy định',
      'Không về số N khi dừng xe',
    ]) {
      expect(adviceFor(reason, 'B2').fix).toMatch(/côn/);
      expect(adviceFor(reason, 'B1').fix).not.toMatch(/côn|số 1/);
    }
  });

  it('never tells an automatic driver to use a clutch', () => {
    const clutch = reasons().filter((reason) => {
      const advice = adviceFor(reason, 'B1');
      // Gear-change penalties only exist on a manual.
      return !/tăng (từ|lên) số|giảm (từ|về) số/i.test(reason) && /côn/.test(advice.why + advice.fix);
    });
    expect(clutch).toEqual([]);
  });

  it('matches the specific rule, not a broader one before it', () => {
    expect(adviceFor('Không dừng xe ở vạch dừng quy định', 'B2').why).toMatch(/không dừng hẳn/);
    expect(adviceFor('Dừng xe quá vạch dừng', 'B2').why).toMatch(/vượt qua vạch/);
    expect(adviceFor('Không tắt xi nhan trái sau vạch xuất phát 5 m', 'B2').fix).toMatch(/tắt xi nhan/);
    expect(adviceFor('Quá 30 giây không qua vạch xuất phát', 'B2').why).toMatch(/20 giây/);
    expect(adviceFor('Không giảm từ số 2 về số 1 tới biển 24 đỏ', 'B2').why).toMatch(/số thấp/);
    expect(adviceFor('Không giảm tốc độ dưới 24 km/h tới biển 24 đỏ', 'B2').why).toMatch(/còn nhanh/);
    expect(adviceFor('Quá 2 phút chưa qua hết bài', 'B2').why).toMatch(/2 phút/);
    expect(adviceFor('Quá 20 giây từ khi đèn xanh chưa qua ngã tư', 'B2').why).toMatch(/Đèn đã xanh/);
  });
});
