import {
  LibNoOpStrategy,
} from './LibNoOpStrategy.mjs';
import {
  LibBlockerStrategy,
} from './LibBlockerStrategy.mjs';

export class LibStrategyFactory {
  #strategies = null;
  #strategyNames = null;
  #activeStrategy = null;

  constructor() {
    this.#strategies = new Map([
      [LibNoOpStrategy.name, LibNoOpStrategy],
      [LibBlockerStrategy.name, LibBlockerStrategy],
    ]);

    this.#strategyNames = Object.freeze([...this.#strategies.entries()].map(([name]) => name));
    this.#activeStrategy = Object.freeze(new (this.#strategies.get(LibNoOpStrategy.name)));
  }

  get strategyNames() {
    return this.#strategyNames;
  }

  get activeStrategy() {
    return this.#activeStrategy;
  }

  activate(strategyName) {
    this.#activeStrategy = Object.freeze(new(this.#strategies.get(strategyName)));
  }
}
