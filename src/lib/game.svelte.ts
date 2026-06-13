import type { LetterState, GameStatus } from './types';
import { evaluateGuess } from './wordle';

const ROWS = 6;
const COLS = 5;
const STORAGE_PREFIX = 'wordle-game-';

interface SavedGame {
  board: string[][];
  evaluations: (LetterState | null)[][];
  currentRow: number;
  currentCol: number;
  gameStatus: GameStatus;
}

function emptyBoard(): string[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(''));
}

function emptyEvals(): (LetterState | null)[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

class GameStore {
  board = $state<string[][]>(emptyBoard());
  evaluations = $state<(LetterState | null)[][]>(emptyEvals());
  currentRow = $state(0);
  currentCol = $state(0);
  gameStatus = $state<GameStatus>('playing');
  targetWord = $state('');
  dayIndex = $state(0);

  // Animation triggers
  shakingRow = $state<number | null>(null);
  revealingRow = $state<number | null>(null);
  bouncingRow = $state<number | null>(null);

  /** Best state seen per letter across all submitted guesses — drives keyboard colors. */
  get letterStates(): Record<string, LetterState> {
    const map: Record<string, LetterState> = {};
    const priority: Record<LetterState, number> = { correct: 3, present: 2, absent: 1 };
    for (let r = 0; r < this.currentRow; r++) {
      for (let c = 0; c < COLS; c++) {
        const letter = this.board[r][c];
        const ev = this.evaluations[r][c];
        if (!letter || !ev) continue;
        if (!map[letter] || priority[ev] > priority[map[letter]]) {
          map[letter] = ev;
        }
      }
    }
    return map;
  }

  init(word: string, index: number) {
    this.targetWord = word.toUpperCase();
    this.dayIndex = index;

    const saved = this.#loadSave(index);
    if (saved) {
      this.board = saved.board;
      this.evaluations = saved.evaluations;
      this.currentRow = saved.currentRow;
      this.currentCol = saved.currentCol;
      this.gameStatus = saved.gameStatus;
    } else {
      this.board = emptyBoard();
      this.evaluations = emptyEvals();
      this.currentRow = 0;
      this.currentCol = 0;
      this.gameStatus = 'playing';
    }
  }

  addLetter(letter: string): boolean {
    if (this.gameStatus !== 'playing') return false;
    if (this.currentCol >= COLS) return false;

    const board = this.board.map(r => [...r]);
    board[this.currentRow][this.currentCol] = letter.toUpperCase();
    this.board = board;
    this.currentCol++;
    return true;
  }

  deleteLetter(): boolean {
    if (this.gameStatus !== 'playing') return false;
    if (this.currentCol <= 0) return false;

    const board = this.board.map(r => [...r]);
    board[this.currentRow][this.currentCol - 1] = '';
    this.board = board;
    this.currentCol--;
    return true;
  }

  /**
   * Returns:
   *  'too_short' — fewer than 5 letters typed
   *  'invalid'   — word not in wordlist
   *  'ok'        — valid guess processed (check gameStatus for won/lost)
   */
  submitGuess(isValid: (word: string) => boolean): 'ok' | 'too_short' | 'invalid' {
    if (this.gameStatus !== 'playing') return 'ok';
    if (this.currentCol < COLS) return 'too_short';

    const guess = this.board[this.currentRow].join('');
    if (!isValid(guess)) return 'invalid';

    const evaluation = evaluateGuess(guess, this.targetWord);
    const row = this.currentRow;

    // Apply evaluation to the board
    const evals = this.evaluations.map(r => [...r]);
    evals[row] = evaluation;
    this.evaluations = evals;

    // Signal which row is being revealed (animation starts in tiles)
    this.revealingRow = row;

    const won = evaluation.every(e => e === 'correct');
    this.currentRow = row + 1;
    this.currentCol = 0;

    if (won) {
      this.gameStatus = 'won';
    } else if (this.currentRow >= ROWS) {
      this.gameStatus = 'lost';
    }

    this.#persistSave();
    return 'ok';
  }

  triggerShake() {
    this.shakingRow = this.currentRow;
    setTimeout(() => { this.shakingRow = null; }, 650);
  }

  /** Called by App after the reveal animation completes. */
  finishReveal() {
    this.revealingRow = null;
  }

  /** Called by App after reveal to start the bounce on the winning row. */
  triggerBounce(row: number) {
    this.bouncingRow = row;
    setTimeout(() => { this.bouncingRow = null; }, 2500);
  }

  #loadSave(dayIndex: number): SavedGame | null {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + dayIndex);
      return raw ? (JSON.parse(raw) as SavedGame) : null;
    } catch {
      return null;
    }
  }

  #persistSave() {
    const data: SavedGame = {
      board: this.board,
      evaluations: this.evaluations,
      currentRow: this.currentRow,
      currentCol: this.currentCol,
      gameStatus: this.gameStatus,
    };
    localStorage.setItem(STORAGE_PREFIX + this.dayIndex, JSON.stringify(data));
  }
}

export const game = new GameStore();
