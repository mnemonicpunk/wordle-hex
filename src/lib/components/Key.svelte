<script lang="ts">
  import type { LetterState } from '../types';

  let {
    key,
    state = undefined as LetterState | undefined,
    wide = false,
    onpress,
  }: {
    key: string;
    state?: LetterState;
    wide?: boolean;
    onpress: (key: string) => void;
  } = $props();
</script>

<button
  class="key"
  class:correct={state === 'correct'}
  class:present={state === 'present'}
  class:absent={state === 'absent'}
  class:wide
  aria-label={key}
  onclick={() => onpress(key)}
>
  {key}
</button>

<style>
  .key {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: var(--key-min-width, 43px);
    height: var(--key-height, 58px);
    padding: 0 6px;
    border-radius: 4px;
    background: var(--key-bg);
    color: var(--key-text);
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    cursor: pointer;
    user-select: none;
    transition: background 0.1s, color 0.1s, opacity 0.1s;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  .key.wide {
    min-width: var(--key-wide-min, 65px);
    font-size: 0.72rem;
    letter-spacing: 0;
  }

  .key.correct { background: var(--key-correct); color: var(--key-eval-text); }
  .key.present { background: var(--key-present); color: var(--key-eval-text); }
  .key.absent  { background: var(--key-absent);  color: var(--key-eval-text); }

  .key:active { opacity: 0.75; transform: scale(0.96); }
</style>
