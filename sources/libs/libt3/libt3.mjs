import {
  BoundaryViolationError,
} from './errors/BoundaryViolationError.mjs';
import {
  CellOccupiedError,
} from './errors/CellOccupiedError.mjs';
import {
  EvenSizeError,
} from './errors/EvenSizeError.mjs';
import {
  GameStates,
} from './constants/GameStates.mjs';
import {
  XOF,
} from './constants/XOF.mjs';

export class LibT3 {
  #config = {
    name: null,
    size: null,
    strategy: null,
    symbols: {
      human: null,
      machine: null,
      empty: null,
    },
    matrix: null,
  };
  #vectorIndices = null;

  constructor(config) {
    this.#config = config;
  }

  get name() {
    return this.#config.name;
  }

  get matrix() {
    return this.#config.matrix;
  }

  get ownSymbol() {
    return this.#config.symbols.machine;
  }

  move() {
    const result = {
      symbolIndex: null,
      gameState: GameStates.INVALID,
    };

    const processResult = this.#config.strategy.process({
      cells: this.#config.matrix.cells,
      vectors: this.#config.matrix.vectors,
      opponentSymbol: this.#config.symbols.human,
      ownSymbol: this.#config.symbols.machine,
      emptySymbol: this.#config.symbols.empty,
    });

    switch (processResult.gameState) {
      case GameStates.INVALID: {
        console.error('gameState: INVALID');

        break;
      }
      case GameStates.IN_PROGRESS: {
        this.#config.matrix.set(processResult.symbolIndex, this.#config.symbols.machine);

        break;
      }
      case GameStates.DRAW: {
        console.debug('GameStates.DRAW');

        break;
      }
      case GameStates.WE_HAVE_A_WINNER: {
        break;
      }
    }

    const r = Object.freeze({
      ...result,
      ...processResult,
    });

    return r;
  }
}
