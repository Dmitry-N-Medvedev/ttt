import {
  EvenSizeError,
} from './errors/EvenSizeError.mjs';
import {
  CellOccupiedError,
} from './errors/CellOccupiedError.mjs';

const DEFAULT_CELL_VALUE = null;
const EVENT_SET = 'set';
const EVENT_CLEAR = 'clear';
const KNOWN_EVENTS = Object.freeze([EVENT_SET, EVENT_CLEAR]);

export class LibMatrix {
  #config = {
    size: null,
  };
  #cells = null;
  #eventRoutingTable = new Map(
    LibMatrix.eventNames.map((eventName) => [eventName, []]),
  );

  constructor(config = null) {
    if (config === null) {
      throw new ReferenceError('config is undefined');
    }

    if (Number.isInteger(config.size) === false) {
      throw new EvalError(`${config.size} is not integer`);
    }

    if (config.size % 2 === 0) {
      throw new EvenSizeError({ size: config.size });
    }

    this.#config = {
      ...config,
    };

    this.#cells = (new Array(Math.pow(this.#config.size, 2))).fill(DEFAULT_CELL_VALUE);

    this.#eventRoutingTable = new Map();
  }

  static get eventNames() {
    return KNOWN_EVENTS;
  }

  get cells() {
    return this.#cells;
  }

  on(eventName = null, callback = null) {
    if (eventName === null) {
      throw new ReferenceError('eventName is undefined');
    }

    if (typeof eventName !== 'string') {
      throw new EvalError('eventName is not a string');
    }

    if (eventName.length === 0) {
      throw new EvalError('eventName is an empty string');
    }

    if (LibMatrix.eventNames.includes(eventName) === false) {
      throw new EvalError(`unknown event name: ${eventName}. Appropriate events names: [${LibMatrix.eventNames}]`);
    }

    if (typeof callback !== 'function') {
      throw new EvalError('callback is not a function');
    }

    if (this.#eventRoutingTable.has(eventName)) {
      const handlersArray = this.#eventRoutingTable.get(eventName);

      if (handlersArray.some((existingCallback) => existingCallback === callback) === false) {
        handlersArray.push(callback);
      }
    } else {
      this.#eventRoutingTable.set(eventName, [callback]);
    }
  }

  set(index, value) {
    if (this.#cells[index] !== DEFAULT_CELL_VALUE) {
      throw new CellOccupiedError({ index });
    }

    this.#cells[index] = value;

    const eventData = Object.freeze({
      index,
      value,
    });

    (this.#eventRoutingTable.get(EVENT_SET) ?? []).forEach((callback) => {
      callback(eventData);
    });
  }

  clear() {
    this.#cells.length = 0;

    (this.#eventRoutingTable.get(EVENT_CLEAR) ?? []).forEach((callback) => {
      callback();
    });
  }
}