import type { LetterState } from './types';

let audioCtx: AudioContext | null = null;

function ctx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

/**
 * Single oscillator tone with smooth ADSR envelope.
 */
function tone(
  frequency: number,
  duration: number,
  gain = 0.10,
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
  amp.gain.linearRampToValueAtTime(gain, t + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(amp);
  amp.connect(c.destination);
  osc.start(t);
  osc.stop(t + duration + 0.015);
}

/**
 * Two slightly-detuned oscillators for a shimmering crystal/chorus effect.
 */
function crystal(frequency: number, duration: number, gain = 0.09, startDelay = 0) {
  tone(frequency,         duration, gain,        'sine', startDelay);
  tone(frequency * 1.003, duration, gain * 0.40, 'sine', startDelay); // +5 cents
}

// ── Public sound API ─────────────────────────────────────────────────────────

/** Soft water-droplet key click. */
export function playKeyClick() {
  tone(480, 0.045, 0.055, 'sine');
}

/**
 * Tile reveal tones — sounds play *after* the flip midpoint (delay + 0.28s).
 * correct → crystal bell (two detuned oscillators)
 * present → mystic violet hum
 * absent  → quiet ocean depth
 */
export function playTileReveal(state: LetterState, tileIndex = 0) {
  const d = tileIndex * 0.1 + 0.28;
  if (state === 'correct') {
    crystal(1047, 0.30, 0.09, d); // C6 crystal bell
  } else if (state === 'present') {
    crystal(659,  0.22, 0.08, d); // E5 violet shimmer
  } else {
    tone(220, 0.20, 0.05, 'sine', d); // A3 deep ocean
  }
}

/**
 * Ascending A-minor pentatonic arpeggio — mystical, oceanic.
 * Plays after the reveal animation completes (~0.9 s offset).
 */
export function playWin() {
  // A4  C5   D5   E5   A5  — A minor pentatonic
  const notes = [440, 523, 587, 659, 880];
  notes.forEach((f, i) => {
    crystal(f, 0.50, 0.10, 0.9 + i * 0.13);
  });
}

/** Gentle descending ocean recede. */
export function playLoss() {
  tone(494, 0.28, 0.07, 'sine', 0.9); // B4
  tone(440, 0.28, 0.07, 'sine', 1.15); // A4
  tone(370, 0.45, 0.06, 'sine', 1.40); // F#4
}

/** Very soft nudge — a brief ocean ripple. */
export function playInvalid() {
  tone(440, 0.05, 0.04, 'sine');
}
