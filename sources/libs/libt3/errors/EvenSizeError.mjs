export class EvenSizeError extends ReferenceError {
  #size = null;

  constructor({ size }, ...params) {
    super(...params);

    this.#size = size;

    ReferenceError.captureStackTrace(this, EvenSizeError);
  }

  get size() {
    return this.#size;
  }
}