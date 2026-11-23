import { CLUTCH } from '../constants';
import type { Gear, Transmission } from '../types';

export interface CoachInput {
  transmission: Transmission;
  gear: Gear;
  engineRunning: boolean;
  handbrake: boolean;
  /** Pedal depths, 0–1. Clutch 1 = on the floor. */
  clutch: number;
  throttle: number;
  brake: number;
  speedKmh: number;
  rpm: number;
  /** The car points up a slope. */
  uphill: boolean;
}

const STILL_KMH = 1;
const PRESSED = 0.2;
/** Clutch pedal depth range that still counts as "around the bite point". */
const BITE_MIN = 1 - CLUTCH.biteEnd - 0.1;
const LAUNCH_RPM = 1400;

function manualTip(s: CoachInput): string {
  if (!s.engineRunning) return 'Máy đã tắt: đạp hết côn (giữ C) rồi bấm Đề máy (Enter)';
  const still = s.speedKmh < STILL_KMH;
  if (s.gear === 'N') {
    return still
      ? 'Đạp hết côn (giữ C) rồi vào số 1 (phím 1) để tiến, số R để lùi'
      : 'Đang ở số N: đạp hết côn (giữ C) rồi vào số';
  }
  const clutchDown = s.clutch >= CLUTCH.shiftPressed;
  const atBite = !clutchDown && s.clutch >= BITE_MIN;

  if (still) {
    if (clutchDown && s.handbrake) {
      return s.rpm < LAUNCH_RPM
        ? 'Giữ ga (W) cho vòng tua lên ~2000, vẫn đạp hết côn'
        : 'Đủ ga: đưa côn về ĐIỂM BÁM (đổi C sang X), rồi nhả phanh tay (Space)';
    }
    if (clutchDown && s.uphill) {
      return s.brake > PRESSED
        ? 'Đang trên dốc: kéo phanh tay (Space) rồi mới nhả phanh chân (S)'
        : 'Xe sẽ tụt dốc: giữ phanh (S) hoặc kéo phanh tay (Space)';
    }
    if (clutchDown && s.brake > PRESSED) return 'Nhả phanh (S), đưa côn về ĐIỂM BÁM (đổi C sang X) và thêm ga (W)';
    if (clutchDown) return 'Đưa côn về ĐIỂM BÁM (đổi C sang X) và thêm chút ga (W) cho xe lăn bánh';
    if (atBite && s.handbrake) {
      return s.rpm < LAUNCH_RPM
        ? 'Côn đang ở điểm bám: thêm ga (W) cho vòng tua lên ~1500'
        : 'Đủ ga rồi: nhả phanh tay (Space), vẫn giữ côn ở điểm bám';
    }
    if (atBite) return 'Giữ côn ở điểm bám và thêm ga (W) cho tới khi xe lăn bánh';
    return 'Đạp côn (C) ngay kẻo chết máy';
  }

  if (s.handbrake) return 'Nhả phanh tay (Space) khi xe đang chạy';
  if (atBite) return 'Xe đã lăn bánh: nhả hết côn (thả X), giữ ga đều';
  if (!clutchDown && s.rpm < 1000) return 'Vòng tua thấp: đạp côn (C) hoặc thêm ga (W) để khỏi chết máy';
  if (s.rpm > 4500 && s.gear !== '5' && s.gear !== 'R') return 'Vòng tua cao: đạp hết côn (C) rồi lên số';
  return 'Muốn dừng: đạp hết côn (C) trước rồi mới phanh (S)';
}

function automaticTip(s: CoachInput): string {
  if (!s.engineRunning) return 'Máy đã tắt: về số P hoặc N rồi bấm Đề máy (Enter)';
  if (s.gear === 'P' || s.gear === 'N') {
    return s.brake > PRESSED
      ? 'Vào số D (phím F) để tiến hoặc R để lùi'
      : 'Giữ phanh (S) rồi vào số D (phím F) để tiến, R để lùi';
  }
  if (s.handbrake) return 'Nhả phanh tay (Space)';
  if (s.speedKmh < STILL_KMH) {
    if (s.uphill && s.gear === 'D') {
      return s.brake > PRESSED
        ? 'Đang trên dốc: nhả phanh (S) rồi nhấn ga (W) ngay để xe không tụt'
        : 'Nhấn ga (W) để lên dốc';
    }
    return s.brake > PRESSED
      ? 'Nhả phanh (S) từ từ: xe tự bò. Cần nhanh hơn thì nhấn nhẹ ga (W)'
      : 'Nhấn nhẹ ga (W) để xe đi';
  }
  return 'Rà phanh (S) để giữ tốc độ chậm; dừng hẳn rồi mới đổi D ↔ R';
}

/** One-line instruction for the next pedal/gear action, based on what the car is doing now. */
export function coachTip(state: CoachInput): string {
  return state.transmission === 'B2' ? manualTip(state) : automaticTip(state);
}

/** Drops the keyboard hints in parentheses, for devices without a keyboard. */
export function withoutKeyHints(text: string): string {
  return text.replace(/\s*\([^)]*\)/g, '');
}
