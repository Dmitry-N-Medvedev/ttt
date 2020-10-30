<script>
  import {
    createEventDispatcher,
  } from 'svelte';

  const dispatch = createEventDispatcher();

  let cell = null;

  const handleClick = () => {
    dispatch('user:move', {
      id: parseInt(cell.id, 10),
    });
  };
</script>

<style>
  div {
    display: flex;
    justify-content: center;
    align-items: center;

    pointer-events: all;
    cursor: pointer;
    background-color: var(--game-field-cell-background-color);
    border-radius: 0.125vw;
  }

  div:hover {
    background-color: var(--game-field-cell-background-color-hover);
  }
</style>

<div on:click|preventDefault|stopPropagation={handleClick} bind:this={cell} {...$$props}>
  <slot></slot>
</div>