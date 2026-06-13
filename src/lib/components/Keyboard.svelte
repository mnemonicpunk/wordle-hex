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

  function isSpecialKey(k: string): boolean {
    return k === 'Backspace' || k === 'Enter';
  }

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
        {#if k === 'Enter'}
          <Key
            key={displayKey(k)}
            state={game.letterStates[k]}
            wide={true}
            onpress={() => onKey(k)}
          >
            {#snippet children()}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-wand">
                <!-- Wand shaft -->
                <line x1="4" y1="20" x2="18" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <!-- Star burst at tip -->
                <circle cx="18" cy="6" r="1.5" fill="currentColor" />
                <circle cx="21" cy="6" r="0.8" fill="currentColor" />
                <circle cx="18" cy="3" r="0.8" fill="currentColor" />
                <circle cx="18" cy="9" r="0.8" fill="currentColor" />
                <circle cx="14.5" cy="6" r="0.8" fill="currentColor" />
                <circle cx="22" cy="3" r="0.6" fill="currentColor" />
                <circle cx="22" cy="9" r="0.6" fill="currentColor" />
              </svg>
            {/snippet}
          </Key>
        {:else if k === 'Backspace'}
          <Key
            key={displayKey(k)}
            state={game.letterStates[k]}
            wide={true}
            onpress={() => onKey(k)}
          />
        {:else}
          <Key
            key={displayKey(k)}
            state={game.letterStates[k]}
            onpress={() => onKey(k)}
          />
        {/if}
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

  .icon-wand {
    width: 1.2em;
    height: 1.2em;
    display: block;
  }

  @media (max-width: 600px) {
    .keyboard {
      gap: 4px;
      padding: 6px;
    }

    .row {
      gap: 3px;
    }

    .icon-wand {
      width: 1em;
      height: 1em;
    }
  }
</style>
