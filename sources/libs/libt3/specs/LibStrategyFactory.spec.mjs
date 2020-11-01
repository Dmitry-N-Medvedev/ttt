import mocha from 'mocha';
import chai from 'chai';

import {
  LibStrategyFactory,
} from '../strategies/LibStrategyFactory.mjs';
import {
  LibNoOpStrategy,
} from '../strategies/LibNoOpStrategy.mjs';
import {
  LibBlockerStrategy,
} from '../strategies/LibBlockerStrategy.mjs';

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

describe(LibStrategyFactory.name, () => {
  it('should get a list of available strategy names', async () => {
    const libStrategyFactory = new LibStrategyFactory();

    expect(libStrategyFactory.strategyNames).to.include.members([LibNoOpStrategy.name]);
  });

  it(`should ensure the default strategy is the ${LibNoOpStrategy.name}`, async () => {
    const libStrategyFactory = new LibStrategyFactory();

    expect(libStrategyFactory.activeStrategy).to.be.instanceof(LibNoOpStrategy);
  });

  it(`should activate ${LibBlockerStrategy.name} instead of the default ${LibNoOpStrategy.name}`, async () => {
    const libStrategyFactory = new LibStrategyFactory();

    expect(libStrategyFactory.activeStrategy).to.be.instanceof(LibNoOpStrategy);

    libStrategyFactory.activate(LibBlockerStrategy.name);

    expect(libStrategyFactory.activeStrategy).to.be.instanceof(LibBlockerStrategy);
  });
});
