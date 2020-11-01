<script>
  import {
    onMount,
    onDestroy,
  } from 'svelte';
  import {
    LibT3,
  } from '@dmitry-n-medvedev/libt3/libt3.mjs';
  import {
    LibMatrix,
  } from '@dmitry-n-medvedev/libt3/LibMatrix.mjs';
  import {
    XOF,
  } from '@dmitry-n-medvedev/libt3/constants/XOF.mjs';
  import {
    BlockerStrategy,
  } from '@dmitry-n-medvedev/libt3/strategies/BlockerStrategy.mjs';
  import {
    GameStates,
  } from '@dmitry-n-medvedev/libt3/constants/GameStates.mjs';
  import Cell from '../components/Cell.svelte';
  
  const FIELD_SIZE = 3;
  let cells = [];
  let libMatrix = null;
  let libT3Config = null;
  let libT3 = null;
  let moveResult = null;
  let gState = null;

  const handleMatrixData = (/* index, value */) => {
    cells = libMatrix.cells.map((value, index) => ({ id: index, value }));
  };

  const handleResetButtonClick = () => {
    libMatrix.reset();
  };

  $: if (moveResult !== null) {
    const {
      gameState,
    } = moveResult;

    switch(gameState) {
      case GameStates.IN_PROGRESS: {
        gState = 'IN PROGRESS';

        const {
          symbolIndex,
        } = moveResult;

        libMatrix.set(symbolIndex, XOF.O);

        break;
      }
      case GameStates.DRAW: {
        gState = 'DRAW';

        break;
      }
      case GameStates.WE_HAVE_A_WINNER: {
        gState = 'WE HAVE A WINNER';

        console.debug('GameStates.WE_HAVE_A_WINNER', moveResult);

        break;
      }
      case GameStates.INVALID: {
        gState = 'INVALID';

        console.debug('GameStates.INVALID', moveResult);

        break;
      }
    }
  }

  $: if (libMatrix !== null) {
    libMatrix.ondata = handleMatrixData;
    cells = libMatrix.cells.map((value, index) => ({ id: index, value }));
  }

  const handleUserMove = ({ detail: { index } }) => {
    libMatrix.set(index, XOF.X);

    moveResult = libT3.move();
  };

  onMount(() => {
    libMatrix = new LibMatrix({
      size: FIELD_SIZE,
      emptyCellValue: XOF.F,
    });
    libT3Config = Object.freeze({
      name: 'machine',
      size: FIELD_SIZE,
      strategy: new BlockerStrategy(),
      symbols: {
        human: XOF.X,
        machine: XOF.O,
        empty: XOF.F,
      },
      matrix: libMatrix,
    });
    libT3 = new LibT3(libT3Config);
  });

  onDestroy(() => {
    if (libMatrix) {
      libMatrix = null;
    }

    if (libT3Config) {
      libT3Config = null;
    }

    if (libT3) {
      libT3 = null;
    }
  });
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

  #game-state,
  #reset-section {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 4rem;
  }

  #game-state {
    margin-bottom: 2rem;
  }

  #reset-section {
    margin-top: 2rem;
  }

  #reset-section > button {
    pointer-events: all;
    cursor: pointer;
    width: 12rem;
    height: 6rem;
  }
</style>

<svelte:head>
	<title>t3</title>
</svelte:head>

<article id="game-field-container">
  <section id="game-state">{gState ?? ''}</section>
  <section id="game-field">
    {#each cells as cell(cell.id)}
        <Cell id={cell.id} class='cell' on:user:move={handleUserMove} value={cell.value} />
      {:else}
        no cells defined
    {/each}
  </section>
  <section id="reset-section">
    <button on:click|preventDefault|stopPropagation={handleResetButtonClick}>reset</button>
  </section>
</article>