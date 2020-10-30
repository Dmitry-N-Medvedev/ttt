<script>
  import Cell from '../components/Cell.svelte';
  export let size = 3;

  let cells = null;
  let defaultValue = 0;

  $: if (size) {
    cells = new Array(Math.pow(size, 2)).fill({}).map((_, id) => ({ id, value: defaultValue }));
  }

  const handleUserMove = ({ detail }) => {
    console.debug('handleUserMove', detail);
  };
</script>

<style>
  #game-field-container {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    align-items: center;
    justify-content: center;

    height: 100%;
    width: 100%;
  }
  
  #game-field {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-gap: 0.125vw;
  
    background-color: var(--game-field-background-color);
  
    width: 25vw;
    height: 25vw;
  }
</style>

<svelte:head>
	<title>t3</title>
</svelte:head>

<article id="game-field-container">
  <section id="game-field">
    {#each cells as cell(cell.id)}
        <Cell id={cell.id} class='cell' on:user:move={handleUserMove}>{cell.value}</Cell>
      {:else}
        no cells defined
    {/each}
  </section>
</article>