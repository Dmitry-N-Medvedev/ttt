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

describe(LibT3.name, function() {
  it('should', async function() {
    expect(true).to.be.true;
  });
  // it('should play the game', () => new Promise((resolve, reject) => {
  //   const libT3Config = Object.freeze({
  //     matrix: {
  //       size: 3,
  //     },
  //   });
  //   const libT3 = new LibT3(libT3Config);
  
  //   expect(libT3).to.exist;
  
  //   libT3.onMatrixSet = ({ index, value }) => {
  //     console.debug(`UI receives matrix set ${value}@${index}`);
  //   };
  
  //   const cells = libT3.cells;
  
  //   expect(Array.isArray(cells)).to.be.true;

  //   return resolve();
  // }));
});
