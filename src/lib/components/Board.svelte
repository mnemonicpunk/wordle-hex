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
    padding: 16px 0;
  }

  .row {
    display: flex;
    gap: 5px;
  }

  .row.shaking {
    animation: row-shake 600ms ease;
  }
</style>
