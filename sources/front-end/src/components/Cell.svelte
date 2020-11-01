<script>
  import {
    createEventDispatcher,
  } from 'svelte';
  import X from './icons/X.svelte';
  import O from './icons/O.svelte';

  const dispatch = createEventDispatcher();

  export let value = null;
  export let winner = false;

  const icons = [
    {
      value: 1,
      component: X,
    },
    {
      value: -1,
      component: O,
    },
  ];
  let cell = null;

  const handleClick = () => {
    dispatch('user:move', {
      index: parseInt(cell.id, 10),
    });
  };

  const resolveComponentByValue = (value) => {
    return icons.find((icon) => icon.value === value)?.component ?? null;
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

  :global(div > *) {
    width: 50%;
    height: 50%;
    pointer-events: none;
  }

  div:not(:empty) {
    background-color: transparent;
    /* pointer-events: none; */
    /* cursor: none; */
  }

  div:empty:hover {
    background-color: var(--game-field-cell-background-color-hover);
  }

  /* .winner {
    background-color: coral;
  } */

  :global(.winner > svg) {
    fill: var(--game-cell-winner-fill-color);
  }
</style>

<div on:click|preventDefault|stopPropagation={handleClick} bind:this={cell} {...$$props} class:winner>
  <svelte:component this={resolveComponentByValue(value)} />
</div>