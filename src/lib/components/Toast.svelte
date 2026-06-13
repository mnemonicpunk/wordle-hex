<script lang="ts">
  let {
    messages = [] as string[],
  }: {
    messages?: string[];
  } = $props();
</script>

<div class="toast-stack" aria-live="assertive" aria-atomic="true">
  {#each messages as msg (msg)}
    <div class="toast">{msg}</div>
  {/each}
</div>

<style>
  .toast-stack {
    position: fixed;
    top: 72px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 1000;
    pointer-events: none;
  }

  .toast {
    background: var(--toast-bg);
    color: var(--toast-text);
    padding: 12px 18px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    animation: slide-down 0.2s ease both;
    white-space: nowrap;
  }
</style>
