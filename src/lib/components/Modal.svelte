<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let {
    title,
    onClose,
    children,
  }: {
    title: string;
    onClose: () => void;
    children: import('svelte').Snippet;
  } = $props();

  let dialog: HTMLDialogElement;

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }

  onMount(() => {
    dialog?.showModal();
    document.addEventListener('keydown', handleKey);
  });

  onDestroy(() => {
    document.removeEventListener('keydown', handleKey);
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialog}
  onclick={(e) => { if (e.target === dialog) onClose(); }}
>
  <div class="panel" role="document">
    <div class="header">
      <h2>{title}</h2>
      <button class="close" aria-label="Schließen" onclick={onClose}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </div>
    <div class="content">
      {@render children()}
    </div>
  </div>
</dialog>

<style>
  dialog {
    padding: 0;
    border: none;
    background: transparent;
    max-width: 100vw;
    max-height: 100dvh;
    width: 100%;
    height: 100%;
  }

  dialog::backdrop {
    background: var(--overlay);
    animation: fade-in 0.18s ease;
  }

  .panel {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    background: var(--modal-bg);
    max-width: 500px;
    margin: 0 auto;
    animation: modal-in 0.2s ease;
    overflow-y: auto;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 18px 48px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  h2 {
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text);
  }

  .close {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 4px;
    color: var(--text);
    transition: opacity 0.15s;
  }

  .close:hover { opacity: 0.7; }

  .content {
    padding: 24px 20px;
    flex: 1;
  }
</style>
