import { describe, expect, it } from 'vitest';
import { type CoachInput, coachTip, withoutKeyHints } from './coach';

const base: CoachInput = {
  transmission: 'B2',
  gear: 'N',
  engineRunning: true,
  handbrake: true,
  clutch: 0,
  throttle: 0,
  brake: 0,
  speedKmh: 0,
  rpm: 800,
  uphill: false,
};
const tip = (patch: Partial<CoachInput>) => coachTip({ ...base, ...patch });

describe('coachTip (B2 manual)', () => {
  it('walks through a hill start in order', () => {
    expect(tip({})).toContain('vào số 1');
    expect(tip({ gear: '1', clutch: 1 })).toContain('Giữ ga');
    expect(tip({ gear: '1', clutch: 1, rpm: 2000 })).toContain('ĐIỂM BÁM');
    expect(tip({ gear: '1', clutch: 0.53, rpm: 900 })).toContain('thêm ga');
    expect(tip({ gear: '1', clutch: 0.53, rpm: 1800 })).toContain('nhả phanh tay');
    expect(tip({ gear: '1', clutch: 0.53, rpm: 1800, handbrake: false, speedKmh: 4 })).toContain('nhả hết côn');
  });

  it('holds the car with the handbrake before a hill start', () => {
    const stopped = { gear: '1', clutch: 1, handbrake: false, uphill: true } as const;
    expect(tip({ ...stopped, brake: 1 })).toContain('kéo phanh tay');
    expect(tip({ ...stopped })).toContain('tụt dốc');
    expect(tip({ ...stopped, brake: 1, uphill: false })).toContain('Nhả phanh');
  });

  it('tells how to restart after a stall', () => {
    expect(tip({ gear: '1', engineRunning: false })).toContain('Đề máy');
  });

  it('warns before the engine stalls', () => {
    expect(tip({ gear: '1', clutch: 0.1, handbrake: false })).toContain('chết máy');
    expect(tip({ gear: '2', clutch: 0, handbrake: false, speedKmh: 6, rpm: 700 })).toContain('chết máy');
  });

  it('reminds to clutch before braking while cruising', () => {
    expect(tip({ gear: '1', handbrake: false, speedKmh: 12, rpm: 2200 })).toContain('đạp hết côn');
  });
});

describe('coachTip (B1 automatic)', () => {
  const auto = (patch: Partial<CoachInput>) => tip({ transmission: 'B1', gear: 'P', handbrake: false, ...patch });

  it('asks for the brake before leaving P', () => {
    expect(auto({})).toContain('Giữ phanh');
    expect(auto({ brake: 1 })).toContain('Vào số D');
  });

  it('explains creep in D and R', () => {
    expect(auto({ gear: 'D', brake: 1 })).toContain('xe tự bò');
    expect(auto({ gear: 'R', speedKmh: 3 })).toContain('Rà phanh');
  });

  it('asks for throttle right after the brake on a slope', () => {
    expect(auto({ gear: 'D', brake: 1, uphill: true })).toContain('nhấn ga');
  });
});

describe('withoutKeyHints', () => {
  it('removes keyboard hints and keeps the action', () => {
    expect(withoutKeyHints('Đủ ga: đưa côn về ĐIỂM BÁM (đổi C sang X), rồi nhả phanh tay (Space)')).toBe(
      'Đủ ga: đưa côn về ĐIỂM BÁM, rồi nhả phanh tay'
    );
  });
});
