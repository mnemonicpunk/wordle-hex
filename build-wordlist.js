#!/usr/bin/env node
/**
 * build-wordlist.js — Process wordlist_in.txt if present
 *
 * If public/wordlist_in.txt exists:
 *   - Validate: ASCII only, 5 letters, uppercase
 *   - Deduplicate
 *   - Randomize order
 *   - Write to public/wordlist.txt
 *
 * Otherwise, wordlist.txt is left unchanged.
 */

import fs from 'fs';
import path from 'path';

const INPUT_FILE = 'public/wordlist_in.txt';
const OUTPUT_FILE = 'public/wordlist.txt';

if (!fs.existsSync(INPUT_FILE)) {
  console.log(`[wordlist] ${INPUT_FILE} not found, skipping processing.`);
  process.exit(0);
}

try {
  // Read input
  const content = fs.readFileSync(INPUT_FILE, 'utf8');
  const lines = content.split('\n');

  // Validate, uppercase, deduplicate
  const words = new Set();
  const invalid = [];

  for (const line of lines) {
    const word = line.trim().toUpperCase();

    // Skip empty lines
    if (!word) continue;

    // Validate: exactly 5 letters, ASCII only
    if (!/^[A-Z]{5}$/.test(word)) {
      invalid.push(line.trim());
      continue;
    }

    words.add(word);
  }

  const wordList = Array.from(words);

  // Shuffle using Fisher-Yates
  for (let i = wordList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordList[i], wordList[j]] = [wordList[j], wordList[i]];
  }

  // Write output
  fs.writeFileSync(OUTPUT_FILE, wordList.join('\n') + '\n', 'utf8');

  console.log(
    `[wordlist] Processed ${lines.length} lines ➔ ${wordList.length} valid words ` +
    `(${invalid.length} skipped) → ${OUTPUT_FILE}`
  );

  if (invalid.length > 0 && invalid.length <= 10) {
    console.log(`[wordlist] Skipped: ${invalid.join(', ')}`);
  } else if (invalid.length > 10) {
    console.log(`[wordlist] Skipped ${invalid.length} invalid words (first 5): ${invalid.slice(0, 5).join(', ')}`);
  }
} catch (err) {
  console.error(`[wordlist] Error processing ${INPUT_FILE}:`, err.message);
  process.exit(1);
}
