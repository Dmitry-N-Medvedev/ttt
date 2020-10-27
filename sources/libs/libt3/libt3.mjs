import {
  BoundaryViolationError,
} from './errors/BoundaryViolationError.mjs';
import {
  CellOccupiedError,
} from './errors/CellOccupiedError.mjs';
import {
  EvenSizeError,
} from './errors/EvenSizeError.mjs';

export class LibT3 {
  #config = {
    size: 3,
  };
  #cells = null;
  static X = 1;
  static O = -1;
  static F = 0;

  constructor(config) {
    if (LibT3.isEvenSize(config.size) === true) {
      throw new EvenSizeError({ size: config.size });
    }

    this.#config = {
      ...this.#config,
      ...config,
    };

    this.#cells = (new Array(Math.pow(this.#config.size, 2)).fill(LibT3.F));
  }

  static isEvenSize(size) {
    return (size % 2) === 0;
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
