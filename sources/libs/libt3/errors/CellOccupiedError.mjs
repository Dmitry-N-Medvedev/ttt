export class CellOccupiedError extends ReferenceError {
  #cellid = null;

  constructor({ cellid }, ...params) {
    super(...params);

    this.#cellid = cellid;

    ReferenceError.captureStackTrace(this, CellOccupiedError);
  }

  get cellid() {
    return this.#cellid;
  }
}