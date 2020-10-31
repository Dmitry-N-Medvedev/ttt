import {
  LibMatrix,
} from './LibMatrix.mjs';

export class LibT3 {
  #config = {
    matrix: {
      size: null,
    },
  };
  #libMatrix = null;

  constructor(config) {
    this.#config = {
      ...config,
    };

    this.#libMatrix = new LibMatrix(this.#config.matrix);
  }

  get matrix() {
    return this.#libMatrix;
  }
}
