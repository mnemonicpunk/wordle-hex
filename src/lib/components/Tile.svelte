<script lang="ts">
  import { untrack } from 'svelte';
  import type { LetterState } from '../types';

  let {
    letter = '',
    evaluation = null as LetterState | null,
    tileIndex = 0,
    animate = false,
    bounce = false,
  }: {
    letter?: string;
    evaluation?: LetterState | null;
    tileIndex?: number;
    animate?: boolean;
    bounce?: boolean;
  } = $props();

  // Show evaluation color immediately for already-revealed tiles (restored from save).
  // For tiles being animated right now, we start hidden and reveal at the flip midpoint.
  // untrack: we intentionally read the initial prop values only, not reactively.
  let showEvalColor = $state(untrack(() => evaluation !== null && !animate));
  let isFlipping = $state(false);

  // Track previous letter to trigger pop only on fresh input (non-reactive on purpose)
  let _prevLetter = untrack(() => letter);
  let isPopping = $state(false);

  // ── Flip animation when a row is revealed ────────────────────────────────
  $effect(() => {
    if (animate && evaluation !== null) {
      const delay = tileIndex * 100;
      isFlipping = true;
      const t1 = setTimeout(() => { showEvalColor = true;  }, delay + 250);
      const t2 = setTimeout(() => { isFlipping = false; }, delay + 510);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  });

  // ── Pop animation on fresh letter input ──────────────────────────────────
  $effect(() => {
    const curr = letter; // reactive read
    if (curr && !_prevLetter && evaluation === null) {
      isPopping = true;
      const t = setTimeout(() => { isPopping = false; }, 110);
      _prevLetter = curr;
      return () => clearTimeout(t);
    }
    _prevLetter = curr;
  });
</script>

<div class="tile-wrap" style="--delay:{tileIndex * 100}ms; --bdly:{tileIndex * 80}ms;">
  <div
    class="tile"
    class:filled={letter && !showEvalColor}
    class:revealed={showEvalColor}
    class:correct={showEvalColor && evaluation === 'correct'}
    class:present={showEvalColor && evaluation === 'present'}
    class:absent={showEvalColor && evaluation === 'absent'}
    class:flipping={isFlipping}
    class:popping={isPopping}
    class:bouncing={bounce}
    aria-label={letter || 'leer'}
  >
    {letter}
  </div>
</div>

<style>
  .tile-wrap {
    perspective: 250px;
  }

  .tile {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 62px;
    height: 62px;
    border: 2px solid var(--tile-empty-border);
    background: transparent;
    color: var(--tile-text);
    font-size: 2rem;
    font-weight: 700;
    text-transform: uppercase;
    user-select: none;
    transition: border-color 0.05s;
    backface-visibility: hidden;
  }

  .tile.filled {
    border-color: var(--tile-filled-border);
  }

  .tile.revealed {
    border-color: transparent;
    color: var(--eval-text);
  }

  .tile.correct { background: var(--correct); box-shadow: 0 0 14px var(--glow-correct); }
  .tile.present { background: var(--present); box-shadow: 0 0 10px var(--glow-present); }
  .tile.absent  { background: var(--absent);  }

  /* Gentle mystic glow pulse on winning tiles once they've settled */
  .tile.revealed.correct:not(.flipping):not(.bouncing) {
    animation: glow-pulse 3s ease-in-out infinite;
  }

  /* Flip animation — stagger via CSS custom property */
  .tile.flipping {
    animation: tile-flip 500ms ease var(--delay) both;
  }

  /* Pop when letter is typed */
  .tile.popping {
    animation: tile-pop 100ms ease-out;
  }

  /* Bounce on win — stagger via CSS custom property */
  .tile.bouncing {
    animation: tile-bounce 800ms cubic-bezier(0.34, 1.56, 0.64, 1) var(--bdly) 2;
  }
</style>
