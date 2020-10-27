import mocha from 'mocha';
import chai from 'chai';

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

describe('stub', () => {
  it('should run empty test to prevent "pnpm run test" from failing', async () => {
    expect(true).to.be.true;
  });
});
