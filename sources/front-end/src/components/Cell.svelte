<script>
  import {
    createEventDispatcher,
  } from 'svelte';

  const dispatch = createEventDispatcher();

  let cell = null;

  const handleClick = () => {
    dispatch('user:move', {
      index: parseInt(cell.id, 10),
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

  div:not(:empty) {
    background-color: transparent;
    pointer-events: none;
    cursor: none;
  }

  div:empty:hover {
    background-color: var(--game-field-cell-background-color-hover);
  }
</style>

<div on:click|preventDefault|stopPropagation={handleClick} bind:this={cell} {...$$props}>
  <slot></slot>
</div>