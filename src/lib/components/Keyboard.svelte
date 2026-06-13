<script lang="ts">
  import Key from './Key.svelte';
  import { game } from '../game.svelte';

  let {
    onKey,
  }: {
    onKey: (key: string) => void;
  } = $props();

  // QWERTZ layout (German)
  const rows = [
    ['Q','W','E','R','T','Z','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Enter','Y','X','C','V','B','N','M','Backspace'],
  ] as const;

  function displayKey(k: string): string {
    if (k === 'Backspace') return '⌫';
    if (k === 'Enter') return '↵';
    return k;
  }
</script>

<div class="keyboard" aria-label="Tastatur">
  {#each rows as row}
    <div class="row">
      {#each row as k}
        <Key
          key={displayKey(k)}
          state={game.letterStates[k]}
          wide={k === 'Enter' || k === 'Backspace'}
          onpress={() => onKey(k === 'Backspace' ? 'Backspace' : k === 'Enter' ? 'Enter' : k)}
        />
      {/each}
    </div>
  {/each}
</div>

<style>
  .keyboard {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
    flex-shrink: 0;
  }

  .row {
    display: flex;
    gap: 4px;
    justify-content: center;
  }

  @media (max-width: 600px) {
    .keyboard {
      gap: 4px;
      padding: 6px;
    }

    .row {
      gap: 3px;
    }
  }
</style>
