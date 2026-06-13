import type { SettingsData } from './types';

const KEY = 'wordle-settings';

function load(): SettingsData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as SettingsData;
  } catch { /* ignore */ }
  return { theme: 'dark', soundEnabled: true };
}

class SettingsStore {
  theme = $state<'light' | 'dark' | 'high-contrast'>('dark');
  soundEnabled = $state(true);

  constructor() {
    const saved = load();
    this.theme = saved.theme;
    this.soundEnabled = saved.soundEnabled;
  }

  setTheme(t: 'light' | 'dark' | 'high-contrast') {
    this.theme = t;
    this.#persist();
    this.applyTheme();
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.#persist();
  }

  /** Call once on app mount to apply the persisted theme to <html>. */
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  #persist() {
    localStorage.setItem(KEY, JSON.stringify({
      theme: this.theme,
      soundEnabled: this.soundEnabled,
    }));
  }
}

export const settings = new SettingsStore();
