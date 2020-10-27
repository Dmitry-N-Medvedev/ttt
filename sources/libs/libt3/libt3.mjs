import {
  BoundaryViolationError,
} from './errors/BoundaryViolationError.mjs';
import {
  CellOccupiedError,
} from './errors/CellOccupiedError.mjs';

export class LibT3 {
  #config = {
    size: 3,
  };
  #cells = null;
  static X = 1;
  static O = -1;
  static F = 0;

  constructor(config) {
    this.#config = {
      ...this.#config,
      ...config,
    };

    this.#cells = (new Array(Math.pow(this.#config.size, 2)).fill(LibT3.F));
  }

  #isCellIdWithinBoundaries(cellid) {
    return cellid >= 0 && cellid < this.#cells.length;
  }

  #isCellFree(cellid) {
    return this.#cells[cellid] === LibT3.F;
  }

  move(cellid) {
    if (this.#isCellIdWithinBoundaries(cellid) === false) {
      throw new BoundaryViolationError({ cellid });
    }

    if (this.#isCellFree(cellid) === false) {
      throw new CellOccupiedError({ cellid });
    }
  }
}
