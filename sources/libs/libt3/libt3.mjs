import {
  LibMatrix,
} from './LibMatrix.mjs';
import {
  LibArbiter,
} from './LibArbiter.mjs';

export class LibT3 {
  #config = {
    matrix: {
      size: null,
    },
  };
  #libMatrix = null;
  #libArbiter = null;
  #onMatrixSetEventHandler = null;

  constructor(config) {
    this.#config = {
      ...config,
    };

    // LibMatrix
    this.#libMatrix = new LibMatrix(this.#config.matrix);
    this.#libMatrix.on(LibMatrix.eventSet, this.#handleSetEvent);

    // LibArbiter
    this.#libArbiter = new LibArbiter();
  }

  #handleSetEvent({ index, value }) {
    console.debug(`#handleSetEvent(${index}, ${value})`);
  }

  get cells() {
    return this.#libMatrix.cells;
  }

  set onMatrixSet(value = null) {
    if (value !== null && this.#onMatrixSetEventHandler !== value) {
      this.#onMatrixSetEventHandler = value;
    }
  }

  move(index = null) {
    if (index === null) {
      throw new TypeError('index is undifined');
    }

    if (Number.isInteger(index) === false) {
      throw new TypeError('index is not an integer');
    }

    this.#libMatrix.set(index, null);
  }
}
