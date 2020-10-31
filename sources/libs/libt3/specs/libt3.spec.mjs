import mocha from 'mocha';
import chai from 'chai';
import {
  LibT3,
} from '../LibT3.mjs';

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

describe(LibT3.name, () => {
  it.only('should do it', async() => {
    const libT3Config = Object.freeze({
      matrix: {
        size: 3,
      },
    });
    const libT3 = new LibT3(libT3Config);

    expect(libT3).to.exist;
    expect(libT3.matrix).to.exist;
    expect(libT3.matrix.cells.length).to.equal(Math.pow(libT3Config.matrix.size, 2));
  });
});
