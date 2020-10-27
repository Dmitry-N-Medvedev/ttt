export class BoundaryViolationError extends ReferenceError {
  #cellid = null;

  constructor(cellid, ...params) {
    super(...params);

    this.#cellid = cellid;

    ReferenceError.captureStackTrace(this, BoundaryViolationError);
  }

  get cellid() {
    return this.#cellid;
  }
}