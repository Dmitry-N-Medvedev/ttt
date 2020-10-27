import mocha from 'mocha';
import chai from 'chai';
import {
  LibT3,
} from '../libt3.mjs';

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

describe('libt3', () => {
  it('should create/destroy libt3', async () => {
    const libt3 = new LibT3();

    expect(libt3).to.exist;
  });
});
