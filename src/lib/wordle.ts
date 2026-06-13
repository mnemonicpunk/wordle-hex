import type { LetterState } from './types';

/**
 * Evaluate a guess against the target word.
 * Two-pass algorithm: exact matches first, then presence check.
 * Correctly handles duplicate letters.
 */
export function evaluateGuess(guess: string, target: string): LetterState[] {
  const g = guess.toUpperCase().split('');
  const t = target.toUpperCase().split('');
  const result: LetterState[] = Array(5).fill('absent');

  // Pass 1: mark exact matches
  for (let i = 0; i < 5; i++) {
    if (g[i] === t[i]) {
      result[i] = 'correct';
      t[i] = '#'; // consume this target letter
      g[i] = '*'; // mark guess letter as processed
    }
  }

  // Pass 2: mark present (wrong position)
  for (let i = 0; i < 5; i++) {
    if (g[i] === '*') continue;
    const idx = t.indexOf(g[i]);
    if (idx !== -1) {
      result[i] = 'present';
      t[idx] = '#'; // consume to prevent double-counting
    }
  }

  return result;
}
