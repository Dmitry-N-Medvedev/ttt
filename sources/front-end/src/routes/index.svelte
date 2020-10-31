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
  
  const gameFieldSize = 3;
  const libMatrix = new LibMatrix({
    size: gameFieldSize,
    emptyCellValue: XOF.F,
  });
  const playerConfig = Object.freeze({
    name: 'Machine',
    size: gameFieldSize,
    strategy: new BlockerStrategy(),
    symbols: {
      human: XOF.X,
      machine: XOF.O,
      empty: XOF.F,
    },
    matrix: libMatrix,
  });
  const player = new LibT3(playerConfig);

  let cells = null;
  let defaultValue = null;

  $: if (gameFieldSize) {
    cells = new Array(Math.pow(gameFieldSize, 2)).fill({}).map((_, id) => ({ id, value: defaultValue, winner: false }));
  }

  const highlightWinningVector = (vector) => {
    cells = cells.map((cell) => {
      if (vector.includes(cell.id)) {
        cell.winner = true;
      }

      return cell;
    });

    console.debug('highlightWinningVector', vector, cells);
  };

  const handleUserMove = ({ detail: { index } }) => {
    libMatrix.set(index, XOF.X);

    const moveResult = player.move();

    console.debug('handleUserMove', moveResult);

    if (moveResult.gameState === GameStates.WE_HAVE_A_WINNER) {
      const { wonSymbol } = moveResult;
      highlightWinningVector(moveResult.vector);

      console.debug('WE_HAVE_A_WINNER', moveResult.vector, 'wonSymbol:', wonSymbol);
    }
  };

  const drawCell = (index, value) => {
    console.debug(`drawCell: index == ${index}, value == ${value}`);

    cells = cells.map((cell) => {
      if (cell.id === index) {
        return {
          ...cell,
          ...{
            value,
          },
        }
      }

      return cell;
    });
  };

  onMount(() => {
    libMatrix.ondata = (index, value) => {
      drawCell(index, value);
    };
  });

  onDestroy(() => {
    if (libMatrix) {
      libMatrix.ondata = undefined;
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
</style>

<svelte:head>
	<title>t3</title>
</svelte:head>

<article id="game-field-container">
  <section id="game-field">
    {#each cells as cell(cell.id)}
        <Cell id={cell.id} class='cell' on:user:move={handleUserMove} value={cell.value} winner={cell.winner} />
      {:else}
        no cells defined
    {/each}
  </section>
</article>