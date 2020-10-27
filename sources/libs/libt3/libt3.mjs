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
  #diagonalIndices = null;

  static X = 1;
  static O = -1;
  static F = 0;

  constructor(config) {
    this.#diagonalIndices = LibT3.calculateDiagonalIndices(config.size);
    this.#config = {
      ...this.#config,
      ...config,
    };

    this.#cells = (new Array(Math.pow(this.#config.size, 2)).fill(LibT3.F));
  }

  static isEven(size) {
    return (size % 2) === 0;
  }

  static calculateDiagonalIndices(size) {
    if (LibT3.isEven(size) === true) {
      throw new EvenSizeError({
        size,
      });
    }

    const calculateBackwardIndices = (size) => {
      const upperBound = Math.pow(size, 2);
      const result = [];
      let index = 0;

      do {
        result.push(index);

        index += (size + 1);
      } while (index < upperBound);

      return result;
    };

    const calculateForwardIndices = (size) => {
      const upperBound = Math.pow(size, 2) - 1;
      const result = [];
      let index = size - 1;

      do {
        result.push(index);

        index += (size - 1);
      } while (index < upperBound);

      return result;
    };

    return ({
      backward: calculateBackwardIndices(size),
      forward: calculateForwardIndices(size),
    });
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
