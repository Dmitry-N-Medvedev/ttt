export class BoundaryViolationError extends ReferenceError {
  #cellid = null;
  #message = null;

  constructor({ cellid = -1, message = '' }, ...params) {
    super(...params);

    this.#cellid = cellid;
    this.#message = message

    ReferenceError.captureStackTrace(this, BoundaryViolationError);
  }

  get cellid() {
    return this.#cellid;
  }

  get message() {
    return this.#message;
  }
}