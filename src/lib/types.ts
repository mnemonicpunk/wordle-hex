export type LetterState = 'correct' | 'present' | 'absent';
export type GameStatus = 'playing' | 'won' | 'lost';

export interface StatsData {
  gamesPlayed: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[]; // index 0 = guessed in 1, index 5 = guessed in 6
  lastWonIndex: number;         // dayIndex of last won puzzle
}

export interface SettingsData {
  theme: 'light' | 'dark' | 'high-contrast';
  soundEnabled: boolean;
}
