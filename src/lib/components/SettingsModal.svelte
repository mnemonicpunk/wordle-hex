<script lang="ts">
  import Modal from './Modal.svelte';
  import { settings } from '../settings.svelte';

  let { onClose }: { onClose: () => void } = $props();

  const themes = [
    { value: 'light'         as const, label: 'Hell' },
    { value: 'dark'          as const, label: 'Dunkel' },
    { value: 'high-contrast' as const, label: 'Hoher Kontrast' },
  ];
</script>

<Modal title="Einstellungen" {onClose}>
  <div class="settings">

    <section>
      <h3>Design</h3>
      <div class="theme-pills">
        {#each themes as t}
          <button
            class="pill"
            class:active={settings.theme === t.value}
            onclick={() => settings.setTheme(t.value)}
          >
            {t.label}
          </button>
        {/each}
      </div>
    </section>

    <section>
      <div class="toggle-row">
        <div>
          <span class="option-label">Töne</span>
          <span class="option-hint">Tastatur- und Kachelgeräusche</span>
        </div>
        <button
          class="toggle"
          class:on={settings.soundEnabled}
          role="switch"
          aria-checked={settings.soundEnabled}
          aria-label="Töne umschalten"
          onclick={() => settings.toggleSound()}
        >
          <span class="knob"></span>
        </button>
      </div>
    </section>

  </div>
</Modal>

<style>
  .settings {
    display: flex;
    flex-direction: column;
    gap: 28px;
    color: var(--text);
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  h3 {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted, #818384);
  }

  /* ── Theme pills ── */
  .theme-pills {
    display: flex;
    gap: 8px;
  }

  .pill {
    flex: 1;
    padding: 10px 6px;
    border: 2px solid var(--border);
    border-radius: 6px;
    background: var(--bg-secondary, var(--bg));
    color: var(--text);
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    text-align: center;
  }

  .pill.active {
    border-color: var(--correct);
    background: var(--correct);
    color: #ffffff;
  }

  /* ── Toggle row ── */
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .option-label {
    display: block;
    font-size: 0.95rem;
    font-weight: 600;
  }

  .option-hint {
    display: block;
    font-size: 0.78rem;
    color: var(--text-muted, #818384);
    margin-top: 2px;
  }

  /* ── Toggle switch ── */
  .toggle {
    flex-shrink: 0;
    width: 52px;
    height: 28px;
    border-radius: 14px;
    background: var(--absent);
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
  }

  .toggle.on {
    background: var(--correct);
  }

  .knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #ffffff;
    transition: transform 0.2s;
    pointer-events: none;
  }

  .toggle.on .knob {
    transform: translateX(24px);
  }
</style>
