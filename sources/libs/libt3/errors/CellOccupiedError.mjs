export class CellOccupiedError extends ReferenceError {
  #index = null;

  constructor({ index }, ...params) {
    super(...params);

    this.#index = index;

    CellOccupiedError.captureStackTrace(this, CellOccupiedError);
  }

  get index() {
    return this.#index;
  }
}