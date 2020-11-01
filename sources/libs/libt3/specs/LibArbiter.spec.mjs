import mocha from 'mocha';
import chai from 'chai';
import {
  LibArbiter,
} from '../LibArbiter.mjs';

const {
  describe,
  it,
} = mocha;
const {
  expect,
} = chai;

mocha.Runner.prototype.uncaught = (error) => {
  // eslint-disable-next-line no-console
  console.error(error);
};

describe(LibArbiter.name, () => {
  it(`should register players of both ${[...LibArbiter.playerTypes].join(' and ')} types`, async () => {
    const players = {};

    for (const playerType of LibArbiter.playerTypes) {
      players[playerType] = Object.assign(Object.create(null), { type: playerType });
    }

    const libArbiter = new LibArbiter();

    Object.entries(players).forEach(([type, player]) => {
      libArbiter.registerPlayer(player, type);
    });

    expect(Object.values(libArbiter.players).length).to.equal(Object.values(players).length);

    Object.entries(libArbiter.players).forEach(([type, player]) => {
      expect(libArbiter.players[type]).to.equal(players[type]);
    });
  });

  it(`should verify turns come in strict sequence: first for ${[...LibArbiter.playerTypes].join(' and then for ')}`, () => new Promise((resolve, reject) => {
    const players = {};
    const libArbiter = new LibArbiter();
    const run = () => new Promise((runResolve, runReject) => {
      const firedTurnHandlers = [];

      const registerTurnHandlerFired = (playerType) => {
        firedTurnHandlers.push(playerType);

        if (firedTurnHandlers.length === Object.keys(players).length) {
          libArbiter.stopRound();

          expect(firedTurnHandlers).to.have.ordered.members(LibArbiter.playerTypes);

          return runResolve();
        }
      };

      for (const playerType of LibArbiter.playerTypes) {
        players[playerType] = {
          onTurnHandler: () => {
            registerTurnHandlerFired(playerType);
          },
        };
      }

      Object.entries(players).forEach(([type, player]) => {
        libArbiter.registerPlayer(player, type);
        libArbiter.on('turn', player.onTurnHandler);
      });
    });

    run()
    .then(resolve)
    .catch(reject);
  }));
});