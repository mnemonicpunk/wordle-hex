let answerCache: string[] | null = null;
let validSet: Set<string> | null = null;

// June 8, 2026 00:00 UTC = puzzle index 0
// Using UTC ensures all users worldwide get the same word each day
const START_DATE = new Date(Date.UTC(2026, 5, 8)).getTime();

async function fetchWordFile(path: string): Promise<string[]> {
  const url = `${import.meta.env.BASE_URL}${path}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${path}: ${response.status}`);
  return response.text().then(text =>
    text
      .split('\n')
      .map(w => w.trim().toUpperCase())
      .filter(w => w.length === 5 && /^[A-Z]+$/.test(w))
  );
}

/**
 * Loads the answer word list (wordlist.txt) and the broader valid-guesses list
 * (guesses.txt). Returns the answer list; the merged valid-word Set is cached
 * internally for use by isValidWord().
 */
export async function loadWordlist(): Promise<string[]> {
  if (answerCache) return answerCache;

  // Fetch both files in parallel; guesses.txt failing is non-fatal
  const [answers, guesses] = await Promise.all([
    fetchWordFile('wordlist.txt'),
    fetchWordFile('guesses.txt').catch(() => [] as string[]),
  ]);

  if (answers.length === 0) throw new Error('Word list is empty');

  answerCache = answers;
  // Union of both lists — answers are always valid guesses too
  validSet = new Set([...answers, ...guesses]);
  return answerCache;
}

export function getWordOfDay(wordlist: string[]): { word: string; dayIndex: number } {
  const now = new Date();
  // Use UTC midnight so all users worldwide get the same word each day.
  // This ensures a user in New York, Tokyo, London, Sydney, etc. all get the
  // same word for the same UTC date, regardless of their local timezone offset.
  const utcMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).getTime();
  const dayIndex = Math.max(0, Math.floor((utcMidnight - START_DATE) / 86_400_000));
  const safeIndex = dayIndex % wordlist.length;
  return { word: wordlist[safeIndex], dayIndex };
}

export function isValidWord(word: string): boolean {
  if (!validSet) return false;
  return validSet.has(word.toUpperCase());
}
