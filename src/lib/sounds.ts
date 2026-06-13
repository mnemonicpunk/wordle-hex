import type { LetterState } from './types';

let audioCtx: AudioContext | null = null;

function ctx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  // Resume if browser suspended it (requires user gesture)
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(
  frequency: number,
  duration: number,
  gain = 0.12,
  type: OscillatorType = 'sine',
  startDelay = 0,
) {
  const c = ctx();
  const t = c.currentTime + startDelay;

  const osc = c.createOscillator();
  const amp = c.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, t);

  amp.gain.setValueAtTime(0, t);
  amp.gain.linearRampToValueAtTime(gain, t + 0.008);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  osc.connect(amp);
  amp.connect(c.destination);
  osc.start(t);
  osc.stop(t + duration + 0.01);
}

export function playKeyClick() {
  tone(700, 0.04, 0.07, 'sine');
}

export function playTileReveal(state: LetterState, tileIndex = 0) {
  const delay = tileIndex * 0.1;
  if (state === 'correct')  tone(880, 0.18, 0.12, 'sine', delay + 0.28);
  else if (state === 'present') tone(660, 0.16, 0.10, 'sine', delay + 0.28);
  else                          tone(370, 0.14, 0.07, 'sine', delay + 0.28);
}

export function playWin() {
  // Ascending pentatonic arpeggio
  [523, 659, 784, 1047, 1319].forEach((f, i) => {
    tone(f, 0.3, 0.11, 'sine', i * 0.1 + 0.9);
  });
}

export function playLoss() {
  tone(330, 0.18, 0.09, 'sawtooth', 0.9);
  tone(220, 0.5,  0.07, 'sine',     1.1);
}

export function playInvalid() {
  tone(200, 0.07, 0.06, 'square');
}
