import { create } from 'zustand';
import { CLUTCH, PASS_SCORE, START_SCORE } from '../constants';
import type {
  CameraMode,
  ExamEvent,
  ExamResult,
  Gear,
  Penalty,
  RoadProgress,
  Scenario,
  SimPhase,
  Transmission,
  TurnSignal,
} from '../types';
import * as audio from '../utils/audio';
import { canStartEngine, createDrivetrainState, startEngine } from '../utils/drivetrain';
import { input, releaseHeldInput, resetInput } from '../utils/input-state';
import { runtime } from '../utils/runtime';

export interface Telemetry {
  speedKmh: number;
  rpm: number;
  clutchPct: number;
  throttlePct: number;
  brakePct: number;
  clockSeconds: number;
  clockCountdown: boolean;
  hint: string;
  /** What to do next with the pedals and gears. */
  coach: string;
  /** Road test only. */
  road: RoadProgress | null;
}

export type NoticeKind = 'penalty' | 'fail' | 'warning' | 'info';

export interface Notice {
  id: number;
  kind: NoticeKind;
  text: string;
}

interface SimState {
  phase: SimPhase;
  transmission: Transmission;
  scenario: Scenario;
  /** Bumped on every (re)start so the vehicle and exam are rebuilt. */
  runId: number;
  gear: Gear;
  handbrake: boolean;
  signal: TurnSignal;
  /** `performance.now()` of the last signal change: the blink phase shared by the HUD and the car. */
  signalAt: number;
  /** Last examiner command, shown as a subtitle. */
  subtitle: string;
  engineRunning: boolean;
  score: number;
  penalties: Penalty[];
  result: ExamResult | null;
  cameraMode: CameraMode;
  muted: boolean;
  /** The usage guide is open; the simulation is paused meanwhile. */
  guideOpen: boolean;
  /** Timestamp of the last stall, drives the HUD shake animation. */
  stallAt: number;
  telemetry: Telemetry;
  notices: Notice[];

  setTransmission: (transmission: Transmission) => void;
  setScenario: (scenario: Scenario) => void;
  start: () => void;
  openMenu: () => void;
  requestGear: (gear: Gear) => boolean;
  toggleHandbrake: () => void;
  /** Turns a signal on, or off again when it is already blinking. */
  toggleSignal: (side: 'left' | 'right') => void;
  requestEngineStart: () => void;
  cycleCamera: () => void;
  toggleMuted: () => void;
  setGuideOpen: (open: boolean) => void;
  setTelemetry: (telemetry: Telemetry) => void;
  applyEvents: (events: ExamEvent[], time: number) => void;
}

const NOTICE_DURATION = 3200;
const MAX_NOTICES = 3;
const CAMERA_ORDER: CameraMode[] = ['chase', 'driver', 'top'];

const emptyTelemetry: Telemetry = {
  speedKmh: 0,
  rpm: 0,
  clutchPct: 0,
  throttlePct: 0,
  brakePct: 0,
  clockSeconds: 0,
  clockCountdown: false,
  hint: '',
  coach: '',
  road: null,
};

let penaltyId = 0;
let noticeId = 0;

/** Shows a short-lived HUD message (penalty, warning, instruction). */
export function notify(kind: NoticeKind, text: string): void {
  noticeId += 1;
  const id = noticeId;
  useSimStore.setState((s) => ({ notices: [...s.notices, { id, kind, text }].slice(-MAX_NOTICES) }));
  setTimeout(() => {
    useSimStore.setState((s) => ({ notices: s.notices.filter((n) => n.id !== id) }));
  }, NOTICE_DURATION);
}

export const useSimStore = create<SimState>((set, get) => ({
  phase: 'menu',
  transmission: 'B2',
  scenario: 'hill',
  runId: 0,
  gear: 'N',
  handbrake: true,
  signal: 'off',
  signalAt: 0,
  subtitle: '',
  engineRunning: true,
  score: START_SCORE,
  penalties: [],
  result: null,
  cameraMode: 'chase',
  muted: false,
  guideOpen: false,
  stallAt: 0,
  telemetry: emptyTelemetry,
  notices: [],

  setTransmission: (transmission) => set({ transmission }),
  setScenario: (scenario) => set({ scenario }),

  start: () => {
    const { transmission, scenario, runId } = get();
    resetInput();
    runtime.drivetrain = createDrivetrainState();
    runtime.shake = 0;
    runtime.npcs = [];
    audio.unlockAudio();
    set({
      phase: 'driving',
      runId: runId + 1,
      gear: transmission === 'B1' ? 'P' : 'N',
      // The road test starts parked at the kerb, so the handbrake is on in an automatic too.
      handbrake: transmission === 'B2' || scenario === 'road',
      signal: 'off',
      subtitle: '',
      engineRunning: true,
      score: START_SCORE,
      penalties: [],
      result: null,
      guideOpen: false,
      telemetry: emptyTelemetry,
      notices: [],
    });
  },

  openMenu: () => {
    audio.stopEngineSound();
    set({ phase: 'menu', guideOpen: false, signal: 'off' });
  },

  requestGear: (gear) => {
    const { transmission, gear: current, engineRunning } = get();
    if (gear === current) return true;
    const speed = Math.abs(runtime.pose.speed);
    if (transmission === 'B2') {
      if (engineRunning && gear !== 'N' && input.clutch < CLUTCH.shiftPressed) {
        notify('warning', 'Đạp hết côn để vào số');
        return false;
      }
    } else {
      if (current === 'P' && input.brake < 0.2) {
        notify('warning', 'Đạp phanh để ra khỏi số P');
        return false;
      }
      if ((gear === 'P' || gear === 'R' || current === 'R') && gear !== 'N' && speed > 0.6) {
        notify('warning', 'Dừng hẳn xe trước khi chuyển số');
        return false;
      }
    }
    audio.playGearClunk();
    set({ gear });
    return true;
  },

  toggleHandbrake: () => set((s) => ({ handbrake: !s.handbrake })),

  toggleSignal: (side) => set((s) => ({ signal: s.signal === side ? 'off' : side, signalAt: performance.now() })),

  requestEngineStart: () => {
    const { transmission, gear, engineRunning, phase } = get();
    if (phase !== 'driving' || engineRunning) return;
    if (!canStartEngine(transmission, gear, input.clutch)) {
      notify('warning', transmission === 'B2' ? 'Đạp hết côn hoặc về số N để đề máy' : 'Về số P hoặc N để đề máy');
      return;
    }
    startEngine(runtime.drivetrain);
    audio.playStarter();
    set({ engineRunning: true });
  },

  cycleCamera: () =>
    set((s) => ({ cameraMode: CAMERA_ORDER[(CAMERA_ORDER.indexOf(s.cameraMode) + 1) % CAMERA_ORDER.length] })),

  toggleMuted: () => {
    const muted = !get().muted;
    audio.setMuted(muted);
    set({ muted });
  },

  setGuideOpen: (guideOpen) => {
    // Nothing may stay pressed while the simulation is paused behind the guide.
    if (guideOpen) releaseHeldInput();
    set({ guideOpen });
  },
  setTelemetry: (telemetry) => set({ telemetry }),

  applyEvents: (events, time) => {
    if (events.length === 0 || get().phase !== 'driving') return;
    let { score, subtitle } = get();
    const penalties = [...get().penalties];
    let result: ExamResult | null = null;

    for (const event of events) {
      if (result) break;
      switch (event.type) {
        case 'penalty':
          score -= event.points;
          penaltyId += 1;
          penalties.push({ id: penaltyId, points: event.points, reason: event.reason, time });
          notify('penalty', `−${event.points} điểm · ${event.reason}`);
          if (score < PASS_SCORE) result = { passed: false, reason: `Điểm dưới ${PASS_SCORE} — ${event.reason}` };
          break;
        case 'fail':
          notify('fail', `Truất quyền sát hạch · ${event.reason}`);
          result = { passed: false, reason: event.reason };
          break;
        case 'pass':
          result = { passed: true, reason: event.reason };
          break;
        case 'info':
          notify('info', event.message);
          audio.playInfo();
          break;
        case 'voice':
          subtitle = event.text;
          audio.speak(event.text);
          break;
        case 'beep':
          audio.playBeep();
          break;
      }
    }

    if (result) {
      if (result.passed) audio.playPass();
      else audio.playFail();
      audio.stopEngineSound();
      set({ score, penalties, subtitle, result, phase: 'finished', signal: 'off' });
    } else {
      set({ score, penalties, subtitle });
    }
  },
}));

/** Called by the physics loop when the engine stalls. */
export function notifyStall(): void {
  runtime.shake = 0.7;
  audio.playStall();
  notify('fail', 'Chết máy! Đạp hết côn rồi bấm Đề máy (Enter)');
  useSimStore.setState({ engineRunning: false, stallAt: Date.now() });
}
