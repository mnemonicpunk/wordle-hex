<script lang="ts">
  import { onMount } from 'svelte';
  import { game }     from './lib/game.svelte';
  import { stats }    from './lib/stats.svelte';
  import { settings } from './lib/settings.svelte';
  import { loadWordlist, getWordOfDay, isValidWord } from './lib/words';
  import { playKeyClick, playTileReveal, playWin, playLoss, playInvalid } from './lib/sounds';

  import Header        from './lib/components/Header.svelte';
  import Board         from './lib/components/Board.svelte';
  import Keyboard      from './lib/components/Keyboard.svelte';
  import Toast         from './lib/components/Toast.svelte';
  import Confetti      from './lib/components/Confetti.svelte';
  import HelpModal     from './lib/components/HelpModal.svelte';
  import StatsModal    from './lib/components/StatsModal.svelte';
  import SettingsModal from './lib/components/SettingsModal.svelte';

  // ── UI state ──────────────────────────────────────────────────────────────
  // wordlist holds the answer list returned from loadWordlist()
  let wordlist     = $state<string[]>([]);
  let loading      = $state(true);
  let loadError    = $state('');
  let showHelp     = $state(false);
  let showStats    = $state(false);
  let showSettings = $state(false);
  let showConfetti = $state(false);
  let toastMsgs    = $state<string[]>([]);

  // Block input while tiles are animating
  let revealing = $state(false);

  // Time for all 5 tiles to finish flipping: stagger(4×100ms) + duration(500ms) + buffer
  const REVEAL_MS = 4 * 100 + 520;

  // ── Toast queue ───────────────────────────────────────────────────────────
  function toast(msg: string, duration = 1600) {
    toastMsgs = [...toastMsgs, msg];
    setTimeout(() => {
      toastMsgs = toastMsgs.filter(m => m !== msg);
    }, duration);
  }

  // ── Guess handling ────────────────────────────────────────────────────────
  async function handleGuess() {
    const result = game.submitGuess(w => isValidWord(w));

    if (result === 'too_short') {
      toast('Zu wenig Buchstaben');
      game.triggerShake();
      return;
    }

    if (result === 'invalid') {
      toast('Nicht im Wörterbuch');
      game.triggerShake();
      if (settings.soundEnabled) playInvalid();
      return;
    }

    // Play reveal sounds staggered per tile
    if (settings.soundEnabled) {
      const row = game.revealingRow!;
      for (let c = 0; c < 5; c++) {
        const ev = game.evaluations[row][c];
        if (ev) playTileReveal(ev, c);
      }
    }

    revealing = true;

    setTimeout(() => {
      game.finishReveal();
      revealing = false;

      if (game.gameStatus === 'won') {
        const wonRow = game.currentRow - 1;
        game.triggerBounce(wonRow);
        showConfetti = true;
        setTimeout(() => { showConfetti = false; }, 3500);
        if (settings.soundEnabled) playWin();
        toast('Glückwunsch! 🎉', 2500);
        stats.recordWin(wonRow + 1, game.dayIndex);
        setTimeout(() => { showStats = true; }, 2200);
      } else if (game.gameStatus === 'lost') {
        if (settings.soundEnabled) playLoss();
        toast(game.targetWord, 3000);
        stats.recordLoss();
        setTimeout(() => { showStats = true; }, 2500);
      }
    }, REVEAL_MS);
  }

  // ── Key input router ──────────────────────────────────────────────────────
  function handleKey(key: string) {
    if (showHelp || showStats || showSettings) return;
    if (game.gameStatus !== 'playing') return;
    if (revealing) return;

    if (key === 'Enter') {
      handleGuess();
    } else if (key === 'Backspace' || key === 'Delete') {
      game.deleteLetter();
    } else if (/^[A-Za-z]$/.test(key)) {
      const added = game.addLetter(key);
      if (added && settings.soundEnabled) playKeyClick();
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    handleKey(e.key);
  }

  // ── Mount ─────────────────────────────────────────────────────────────────
  onMount(async () => {
    settings.applyTheme();

    try {
      wordlist = await loadWordlist();
      const { word, dayIndex } = getWordOfDay(wordlist);
      game.init(word, dayIndex);

      // If game already finished (restored from save), open stats after a beat
      if (game.gameStatus === 'won' || game.gameStatus === 'lost') {
        setTimeout(() => { showStats = true; }, 600);
      }

      // First-ever visit → open help
      if (!localStorage.getItem('wordle-visited')) {
        localStorage.setItem('wordle-visited', '1');
        setTimeout(() => { showHelp = true; }, 400);
      }
    } catch {
      loadError = 'Die Wortliste konnte nicht geladen werden.';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:window onkeydown={onKeydown} />

<div class="app">
  <Header
    onHelp={() => { showHelp = true; }}
    onStats={() => { showStats = true; }}
    onSettings={() => { showSettings = true; }}
  />

  <main>
    {#if loading}
      <div class="splash">Laden…</div>
    {:else if loadError}
      <div class="splash error">{loadError}</div>
    {:else}
      <Board />
    {/if}
  </main>

  <Keyboard onKey={handleKey} />
  <Toast messages={toastMsgs} />

  {#if showConfetti}<Confetti />{/if}
  {#if showHelp}<HelpModal onClose={() => { showHelp = false; }} />{/if}
  {#if showStats}<StatsModal onClose={() => { showStats = false; }} />{/if}
  {#if showSettings}<SettingsModal onClose={() => { showSettings = false; }} />{/if}
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    max-width: 500px;
    margin: 0 auto;
  }

  main {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .splash {
    margin: auto;
    font-size: 0.9rem;
    color: var(--text-muted, #818384);
    letter-spacing: 0.06em;
  }

  .splash.error { color: var(--present); }
</style>
