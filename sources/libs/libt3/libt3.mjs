import {
  BoundaryViolationError,
} from './errors/BoundaryViolationError.mjs';

export class LibT3 {
  #config = null;
  #cells = null;

  constructor(config) {
    this.#config = {
      ...config,
    };

    this.#cells = new Array(Math.pow(this.#config.size, 2));
  }

  #isCellIdWithinBoundaries(cellid) {
    return cellid >= 0 && cellid < this.#cells.length;
  }

  move(cellid) {
    if (this.#isCellIdWithinBoundaries(cellid) === false) {
      throw new BoundaryViolationError({
        cellid,
        message: `not within the boundaries of the field`,
      });
    }
  }
}
