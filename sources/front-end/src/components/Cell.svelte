<script>
  import {
    createEventDispatcher,
  } from 'svelte';
  import X from './icons/X.svelte';
  import O from './icons/O.svelte';

  const dispatch = createEventDispatcher();

  export let value = null;
  let cell = null;
  const icons = [
    { value: 0, component: null },
    { value: 1, component: X },
    { value: -1, component: O },
  ];

  let icon = icons[0];

  $: if (value !== null) {
    icon = (icons.filter((item) => item.value === value)[0]).component;
  }

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
    pointer-events: none;
    cursor: none;
  }

  :global(div > svg) {
    width: 65%;
  }

  div:hover {
    background-color: var(--game-field-cell-background-color-hover);
  }
</style>

<div on:click|preventDefault|stopPropagation={handleClick} bind:this={cell} {...$$props}>
  <svelte:component this={icon} />
</div>