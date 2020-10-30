import mocha from 'mocha';
import chai from 'chai';
import {
  LibMatrix,
} from '../LibMatrix.mjs';
import {
  XOF,
} from '../constants/XOF.mjs';

const {
  describe,
  it,
} = mocha;
const {
  expect,
} = chai;

describe('LibMatrix', () => {
  it('should resolve vectors', async () => {
    const matrixSize = 3;
    const expectedVectors = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const libMatrixConfig = {
      size: matrixSize,
      emptyCellValue: XOF.F,
    };
    const libMatrix = new LibMatrix(libMatrixConfig);

    return expect(libMatrix.vectors).to.have.deep.ordered.members(expectedVectors);
  });

  it('should read data from event stream', async () => {
    const libMatrixConfig = {
      size: 3,
      emptyCellValue: XOF.F,
    };
    const libMatrix = new LibMatrix(libMatrixConfig);
    const expectedIndex = 0;
    const expectedValue = XOF.X;

    const receiveDataFromMatrix = () => {
      return new Promise((resolve, reject) => {
        libMatrix.ondata = (index, value) => {
          expect(index).to.equal(expectedIndex);
          expect(value).to.equal(expectedValue);
  
          return resolve();
        };

        libMatrix.set(expectedIndex, expectedValue);
      });
    };

    expect(libMatrix).to.exist;

    return receiveDataFromMatrix();
  });
});
