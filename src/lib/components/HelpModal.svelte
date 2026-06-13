<script lang="ts">
  import Modal from './Modal.svelte';

  let { onClose }: { onClose: () => void } = $props();

  const examples = [
    { word: 'WELLE', highlight: 0, state: 'correct', hint: '„W" ist im Wort und an der richtigen Stelle.' },
    { word: 'BODEN', highlight: 1, state: 'present', hint: '„O" ist im Wort, aber an der falschen Stelle.' },
    { word: 'FLUSS', highlight: 4, state: 'absent',  hint: '„S" ist nicht im Wort.' },
  ] as const;

  const COLORS: Record<string, string> = {
    correct: 'var(--correct)',
    present: 'var(--present)',
    absent:  'var(--absent)',
  };
</script>

<Modal title="Wie man spielt" {onClose}>
  <div class="help">
    <p>Errate das <strong>WORTSPIEL</strong> in 6 Versuchen.</p>

    <ul>
      <li>Jeder Versuch muss ein gültiges 5-Buchstaben-Wort sein.</li>
      <li>Die Farbe der Kacheln ändert sich nach jedem Versuch.</li>
    </ul>

    <hr />

    {#each examples as ex}
      <div class="example">
        <div class="tiles">
          {#each ex.word.split('') as letter, i}
            <div
              class="tile"
              style={i === ex.highlight ? `background:${COLORS[ex.state]};border-color:${COLORS[ex.state]};color:var(--eval-text)` : ''}
            >
              {letter}
            </div>
          {/each}
        </div>
        <p>{ex.hint}</p>
      </div>
    {/each}

    <hr />

    <p class="tagline">Täglich gibt es ein neues Wort!</p>
  </div>
</Modal>

<style>
  .help {
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--text);
  }

  p { margin: 0; }

  ul {
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  hr {
    border: none;
    border-top: 1px solid var(--border);
  }

  .example {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .tiles {
    display: flex;
    gap: 4px;
  }

  .tile {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 2px solid var(--tile-empty-border);
    font-size: 1.2rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--tile-text);
  }

  strong {
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  .tagline {
    font-weight: 700;
    text-align: center;
    letter-spacing: 0.04em;
  }
</style>
