/** Web Audio synthesised sound effects: engine drone, chip sensor beep, stall, pass/fail. */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let engine: { osc: OscillatorNode; sub: OscillatorNode; gain: GainNode; filter: BiquadFilterNode } | null = null;
let muted = false;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined' || typeof AudioContext === 'undefined') return null;
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.6;
    master.connect(ctx.destination);
  }
  return ctx;
}

/** Must be called from a user gesture so the browser allows audio playback. */
export function unlockAudio(): void {
  const audio = getContext();
  if (audio && audio.state === 'suspended') void audio.resume();
}

export function setMuted(value: boolean): void {
  muted = value;
  if (value) stopSpeech();
  if (master && ctx) master.gain.setTargetAtTime(value ? 0 : 0.6, ctx.currentTime, 0.02);
}

function tone(freq: number, duration: number, type: OscillatorType, volume: number, delay = 0, endFreq?: number): void {
  const audio = getContext();
  if (!audio || !master) return;
  const start = audio.currentTime + delay;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (endFreq !== undefined) osc.frequency.exponentialRampToValueAtTime(endFreq, start + duration);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.01);
  gain.gain.setValueAtTime(volume, start + duration - 0.03);
  gain.gain.linearRampToValueAtTime(0, start + duration);
  osc.connect(gain).connect(master);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/** "Tít": chip sensor alert. */
export function playBeep(): void {
  tone(1900, 0.16, 'square', 0.18);
}

export function playInfo(): void {
  tone(1200, 0.09, 'sine', 0.2);
  tone(1600, 0.12, 'sine', 0.2, 0.1);
}

/** Engine dying: falling rumble with a couple of shudders. */
export function playStall(): void {
  tone(95, 0.55, 'sawtooth', 0.35, 0, 22);
  tone(48, 0.12, 'square', 0.25, 0.1);
  tone(40, 0.12, 'square', 0.25, 0.28);
}

export function playStarter(): void {
  for (let i = 0; i < 4; i++) tone(170 + i * 12, 0.07, 'sawtooth', 0.16, i * 0.09);
}

export function playPass(): void {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, 'triangle', 0.25, i * 0.13));
}

export function playFail(): void {
  tone(220, 0.3, 'sawtooth', 0.25);
  tone(160, 0.5, 'sawtooth', 0.25, 0.3);
}

export function playGearClunk(): void {
  tone(140, 0.05, 'square', 0.12);
}

/** Turn-signal relay: "tick" on, "tock" off. */
export function playSignalTick(on: boolean): void {
  tone(on ? 1500 : 1100, 0.03, 'square', 0.1);
}

function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
}

/** Examiner voice: spoken in Vietnamese where the browser has speech synthesis, after a chime. */
export function speak(text: string): void {
  playInfo();
  if (muted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 1.05;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

/** Updates (and lazily creates) the continuous engine tone. */
export function updateEngineSound(rpm: number, throttle: number, running: boolean): void {
  if (!ctx || !master || ctx.state !== 'running') return;
  if (!engine) {
    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    sub.type = 'square';
    filter.type = 'lowpass';
    gain.gain.value = 0;
    osc.connect(filter);
    sub.connect(filter);
    filter.connect(gain).connect(master);
    osc.start();
    sub.start();
    engine = { osc, sub, gain, filter };
  }
  const t = ctx.currentTime;
  // Four-stroke, four-cylinder firing frequency.
  const firing = Math.max(8, (Math.abs(rpm) / 60) * 2);
  engine.osc.frequency.setTargetAtTime(firing, t, 0.03);
  engine.sub.frequency.setTargetAtTime(firing / 2, t, 0.03);
  engine.filter.frequency.setTargetAtTime(220 + rpm * 0.25 + throttle * 500, t, 0.05);
  engine.gain.gain.setTargetAtTime(running ? 0.05 + throttle * 0.07 : 0, t, 0.05);
}

export function stopEngineSound(): void {
  stopSpeech();
  if (engine && ctx) engine.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
}
