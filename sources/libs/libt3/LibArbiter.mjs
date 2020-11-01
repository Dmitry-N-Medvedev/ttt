const EVENT_TURN = 'turn';
const EVENT_DRAW = 'draw';
const EVENT_WINNER = 'winner';
const KNOWN_EVENTS = Object.freeze([EVENT_TURN, EVENT_DRAW, EVENT_WINNER]);
const REQUIRED_NUMBER_OF_PLAYERS = 2;
const PLAYER_TYPE_HUMAN = 'human';
const PLAYER_TYPE_MACHINE = 'machine';
const PLAYER_TYPES = Object.freeze([PLAYER_TYPE_HUMAN, PLAYER_TYPE_MACHINE]);
const TURN_SEQUENCE = Object.freeze([PLAYER_TYPE_HUMAN, PLAYER_TYPE_MACHINE]);

export class LibArbiter {
  #eventRoutingTable = new Map(
    LibArbiter.eventNames.map((eventName) => [eventName, []]),
  );
  #players = null;
  #isRoundStarted = false;

  constructor() {
    this.#players = {
      [PLAYER_TYPE_HUMAN]: null,
      [PLAYER_TYPE_MACHINE]: null,
    };
  }

  static get eventNames() {
    return KNOWN_EVENTS;
  }

  static get playerTypes() {
    return PLAYER_TYPES;
  }

  get players() {
    return this.#players;
  }

  get isRoundStarted() {
    return this.#isRoundStarted;
  }

  stopRound() {
    if (this.#isRoundStarted === true) {
      this.#isRoundStarted = false;
    }
  }

  #resolveTurnHandlerOf(player = null, onTurnHandlers = null) {
    if (player === null || onTurnHandlers === null) {
      return null;
    }

    const playerFunctions = Object.getOwnPropertyNames(player)
      .filter((propertyName) => typeof player[propertyName] === 'function')
      .map((functionName) => player[functionName]);

    return playerFunctions.filter((playerFunction) => onTurnHandlers.includes(playerFunction))[0] ?? null;
  }

  #startRound() {
    this.#isRoundStarted = true;
    let currentPlayerIndex = 0;
    
    while (this.#isRoundStarted === true) {
      const player = this.#players[TURN_SEQUENCE[currentPlayerIndex]];
      const playerTurnhandler = this.#resolveTurnHandlerOf(player, this.#eventRoutingTable.get(EVENT_TURN)) ?? null;

      if (playerTurnhandler !== null) {
        playerTurnhandler();
      }

      currentPlayerIndex += 1;

      if (currentPlayerIndex > (TURN_SEQUENCE.length - 1)) {
        currentPlayerIndex = 0;
      }
    }
  }

  #checkShouldStart() {
    if (Object.values(this.#players).length !== REQUIRED_NUMBER_OF_PLAYERS) {
      return;
    }

    const registeredPlayersForTurnEvent = (this.#eventRoutingTable.get(EVENT_TURN) ?? []);

    if (registeredPlayersForTurnEvent.length !== REQUIRED_NUMBER_OF_PLAYERS) {
      return;
    }

    Object.values(this.#players).forEach((player) => {
      if (registeredPlayersForTurnEvent.includes(player) === false) {
        return;
      }
    });

    this.#startRound();
  }

  registerPlayer(player = null, type = null) {
    if (player === null) {
      throw new ReferenceError('player is undefined');
    }

    if (type === null) {
      throw new ReferenceError('player type is undefined');
    }

    if (PLAYER_TYPES.includes(type) === false) {
      throw new TypeError(`player type is unknown. Correct player types are: ${[...PLAYER_TYPES].join(', ')}`);
    }

    if (this.#players[type] !== null) {
      throw new EvalError(`a with "${type}" type has already been registered`);
    }

    this.#players[type] = player;

    if (Object.values(this.#players).some((player) => player !== null) === false) {
      this.#checkShouldStart();
    }
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

    if (LibArbiter.eventNames.includes(eventName) === false) {
      throw new EvalError(`unknown event name: ${eventName}. Appropriate events names: [${LibArbiter.eventNames}]`);
    }

    if (typeof callback !== 'function') {
      throw new EvalError('callback is not a function');
    }

    const handlersArray = this.#eventRoutingTable.get(eventName);

    // TODO: handlersArray must be Set to avoid this check
    if (handlersArray.some((existingCallback) => existingCallback === callback) === false) {
      this.#eventRoutingTable.set(eventName, [...handlersArray, callback]);
    }

    if (eventName === EVENT_TURN && this.#eventRoutingTable.get(eventName).length === REQUIRED_NUMBER_OF_PLAYERS) {
      this.#checkShouldStart();

      return;
    }
  }
}
