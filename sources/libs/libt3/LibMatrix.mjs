export class LibMatrix {
  #cells = null;
  #config = {
    size: 3,
    emptyCellValue: null,
  };
  #onDataCallback = null;
  #vectors = null;

  constructor(config) {
    this.#config = config;
    this.#cells = (new Array(Math.pow(this.#config.size, 2)).fill(this.#config.emptyCellValue));
    this.#vectors = LibMatrix.resolveVectors(this.#cells);
  }

  static resolveVectors(cells) {
    const size = Math.sqrt(cells.length);
    const result = [];

    const resolveRowVectors = (array, width, accumulator) => {
      for (let rowFirstIndex = 0; rowFirstIndex < array.length; rowFirstIndex += width) {
        const rowIndices = [];
  
        for (let rowIndex = rowFirstIndex; rowIndex < rowFirstIndex + width; rowIndex += 1) {
          rowIndices.push(rowIndex);
        }
  
        accumulator.push(rowIndices);
      }
    };

    const resolveColumnVectors = (array, width, accumulator) => {
      for (let columnFirstIndex = 0; columnFirstIndex < width; columnFirstIndex += 1) {
        const columnIndices = [];

        for (let columnIndex = columnFirstIndex; columnIndex < array.length; columnIndex += size) {
          columnIndices.push(columnIndex);
        }

        accumulator.push(columnIndices);
      }
    };

    const resolveDiagonalVectors = (array, width, accumulator) => {
      const resolveDiagonalBackwardsVector = (a, w, acc) => {
        const step = w + 1;
        const vector = [];

        for (let index = 0; index < a.length; index += step) {
          vector.push(index);
        }

        acc.push(vector);
      };

      const resolveDiagonalForwardsVector = (a, w, acc) => {
        const step = w - 1;
        const vector = [];

        for (let index = w - 1; index < a.length - 1; index += step) {
          vector.push(index);
        }

        acc.push(vector);
      };

      resolveDiagonalBackwardsVector(array, width, accumulator);
      resolveDiagonalForwardsVector(array, width, accumulator);
    }

    resolveRowVectors(cells, size, result);
    resolveColumnVectors(cells, size, result);
    resolveDiagonalVectors(cells, size, result);

    return Object.freeze(result);
  }

  set ondata(callback) {
    this.#onDataCallback = callback;
  }

  get cells() {
    return this.#cells;
  }

  get vectors() {
    return this.#vectors;
  }

  set(index, value) {
    this.#cells[index] = value;

    if (this.#onDataCallback && typeof this.#onDataCallback === 'function') {
      this.#onDataCallback(index, value);
    }
  }

  reset() {
    this.#cells = (new Array(Math.pow(this.#config.size, 2)).fill(this.#config.emptyCellValue));

    if (this.#onDataCallback && typeof this.#onDataCallback === 'function') {
      this.#onDataCallback(null, null);
    }
  }
}