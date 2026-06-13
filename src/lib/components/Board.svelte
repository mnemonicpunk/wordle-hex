<script lang="ts">
  import Tile from './Tile.svelte';
  import { game } from '../game.svelte';

  const ROWS = 6;
  const COLS = 5;
</script>

<div class="board" aria-label="Spielfeld">
  {#each { length: ROWS } as _, r}
    <div
      class="row"
      class:shaking={game.shakingRow === r}
    >
      {#each { length: COLS } as _, c}
        <Tile
          letter={game.board[r][c]}
          evaluation={game.evaluations[r][c]}
          tileIndex={c}
          animate={game.revealingRow === r}
          bounce={game.bouncingRow === r}
        />
      {/each}
    </div>
  {/each}
</div>

<style>
  .board {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    flex: 1;
    padding: 16px 12px;
  }

  .row {
    display: flex;
    gap: 5px;
  }

  .row.shaking {
    animation: row-shake 600ms ease;
  }

  @media (max-width: 600px) {
    .board {
      padding: 12px 8px;
      gap: 4px;
    }

    .row {
      gap: 4px;
    }
  }

  @media (max-width: 380px) {
    .board {
      padding: 10px 6px;
      gap: 3px;
    }

    .row {
      gap: 3px;
    }
  }
</style>
