<div class="splash-container">
  <img src="{import.meta.env.BASE_URL}logo.png" alt="Wordle Hex" class="splash-logo" />
</div>

<style>
  .splash-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    z-index: 9999;
    animation: fade-out 0.6s ease-out forwards;
    animation-delay: 2.4s;
  }

  .splash-logo {
    max-height: 200px;
    max-width: 400px;
    width: 90vw;
    height: auto;
    user-select: none;
    pointer-events: none;
    animation: logo-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes logo-pop {
    0% {
      opacity: 0;
      transform: scale(0.7);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fade-out {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      pointer-events: none;
    }
  }
</style>
