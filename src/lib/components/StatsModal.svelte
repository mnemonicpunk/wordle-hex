<script lang="ts">
  import Modal from './Modal.svelte';
  import { stats } from '../stats.svelte';
  import { game } from '../game.svelte';

  let { onClose }: { onClose: () => void } = $props();

  function buildShareText(): string {
    const evalMap: Record<string, string> = {
      correct: '🟩',
      present: '🟨',
      absent:  '⬛',
    };

    const rows: string[] = [];
    for (let r = 0; r < game.currentRow; r++) {
      const row = game.evaluations[r]
        .map(e => evalMap[e ?? 'absent'])
        .join('');
      rows.push(row);
    }

    const result = game.gameStatus === 'won' ? `${game.currentRow}/6` : 'X/6';
    return `Wortspiel #${game.dayIndex + 1} ${result}\n\n${rows.join('\n')}`;
  }

  let shareLabel = $state('Teilen');

  async function share() {
    const text = buildShareText();
    try {
      await navigator.clipboard.writeText(text);
      shareLabel = 'Kopiert! ✓';
      setTimeout(() => { shareLabel = 'Teilen'; }, 2000);
    } catch {
      // Clipboard access denied — show text in alert as fallback
      alert(text);
    }
  }

  const maxDist = $derived(Math.max(...stats.guessDistribution, 1));
</script>

<Modal title="Statistik" {onClose}>
  <div class="stats">
    <!-- Summary row -->
    <div class="summary">
      <div class="stat">
        <span class="value">{stats.gamesPlayed}</span>
        <span class="label">Gespielt</span>
      </div>
      <div class="stat">
        <span class="value">{stats.winPercent}</span>
        <span class="label">% Siege</span>
      </div>
      <div class="stat">
        <span class="value">{stats.currentStreak}</span>
        <span class="label">Serie</span>
      </div>
      <div class="stat">
        <span class="value">{stats.maxStreak}</span>
        <span class="label">Max Serie</span>
      </div>
    </div>

    <!-- Guess distribution -->
    <h3>Rateverteilung</h3>
    <div class="distribution">
      {#each stats.guessDistribution as count, i}
        {@const isWinRow = game.gameStatus === 'won' && game.currentRow - 1 === i}
        <div class="dist-row">
          <span class="dist-num">{i + 1}</span>
          <div class="dist-bar-wrap">
            <div
              class="dist-bar"
              class:highlight={isWinRow}
              style="width: {Math.max(7, Math.round((count / maxDist) * 100))}%"
            >
              {count}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Share button (only when game is complete) -->
    {#if game.gameStatus !== 'playing'}
      <button class="share-btn" onclick={share}>
        {shareLabel}
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
        </svg>
      </button>
    {/if}
  </div>
</Modal>

<style>
  .stats {
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: var(--text);
  }

  .summary {
    display: flex;
    justify-content: space-around;
    text-align: center;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .value {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
  }

  .label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-muted, #818384);
  }

  h3 {
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-align: center;
    color: var(--text-muted, #818384);
  }

  .distribution {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .dist-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
  }

  .dist-num {
    width: 14px;
    text-align: right;
    font-weight: 700;
  }

  .dist-bar-wrap {
    flex: 1;
  }

  .dist-bar {
    min-width: 28px;
    padding: 2px 8px;
    background: var(--absent);
    color: var(--eval-text);
    font-size: 0.8rem;
    font-weight: 700;
    text-align: right;
    border-radius: 2px;
    transition: width 0.4s ease;
  }

  .dist-bar.highlight {
    background: var(--correct);
  }

  .share-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    align-self: center;
    padding: 14px 28px;
    background: var(--correct);
    color: #ffffff;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
  }

  .share-btn:hover  { opacity: 0.88; }
  .share-btn:active { transform: scale(0.97); }
</style>
