<script lang="ts">
  import { tradesStore } from './store/trades.store';

  let name = 'Svelte';
  console.debug($tradesStore);
</script>

<main>
  <h1>Hello {name}!</h1>
  <ul>
    {#each $tradesStore as tradeItem}
      <li>
        <span>{tradeItem.name}</span>
        <span>{tradeItem.group}</span>
        <span>{tradeItem.openTransaction}</span>
        <span>{tradeItem.closeTransaction}</span>
        <span>{tradeItem.currency}</span>
      </li>
    {/each}
  </ul>
</main>

<style>
  main {
    text-align: center;
    padding: 2rem;
    font-family: sans-serif;
  }
</style>
