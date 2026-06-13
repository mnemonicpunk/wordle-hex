import type { StatsData } from './types';

const KEY = 'wordle-stats';

function load(): StatsData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as StatsData;
  } catch { /* ignore */ }
  return {
    gamesPlayed: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    lastWonIndex: -1,
  };
}

class StatsStore {
  gamesPlayed = $state(0);
  wins = $state(0);
  currentStreak = $state(0);
  maxStreak = $state(0);
  guessDistribution = $state([0, 0, 0, 0, 0, 0]);
  lastWonIndex = $state(-1);

  constructor() {
    const s = load();
    this.gamesPlayed = s.gamesPlayed;
    this.wins = s.wins;
    this.currentStreak = s.currentStreak;
    this.maxStreak = s.maxStreak;
    this.guessDistribution = s.guessDistribution;
    this.lastWonIndex = s.lastWonIndex;
  }

  get winPercent(): number {
    return this.gamesPlayed === 0 ? 0 : Math.round((this.wins / this.gamesPlayed) * 100);
  }

  recordWin(guessCount: number, dayIndex: number) {
    this.gamesPlayed++;
    this.wins++;

    const dist = [...this.guessDistribution];
    dist[guessCount - 1] = (dist[guessCount - 1] ?? 0) + 1;
    this.guessDistribution = dist;

    // Streak: consecutive days
    if (this.lastWonIndex === dayIndex - 1) {
      this.currentStreak++;
    } else if (this.lastWonIndex === dayIndex) {
      // Already recorded today (e.g. restored from save) — no change
    } else {
      this.currentStreak = 1;
    }
    this.lastWonIndex = dayIndex;
    if (this.currentStreak > this.maxStreak) this.maxStreak = this.currentStreak;
    this.#persist();
  }

  recordLoss() {
    this.gamesPlayed++;
    this.currentStreak = 0;
    this.#persist();
  }

  #persist() {
    localStorage.setItem(KEY, JSON.stringify({
      gamesPlayed: this.gamesPlayed,
      wins: this.wins,
      currentStreak: this.currentStreak,
      maxStreak: this.maxStreak,
      guessDistribution: this.guessDistribution,
      lastWonIndex: this.lastWonIndex,
    }));
  }
}

export const stats = new StatsStore();
