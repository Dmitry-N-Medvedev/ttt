export class EvenSizeError extends ReferenceError {
  #size = null;

  constructor({ size }, ...params) {
    super(...params);

    this.#size = size;

    EvenSizeError.captureStackTrace(this, EvenSizeError);
  }

  get size() {
    return this.#size;
  }
}