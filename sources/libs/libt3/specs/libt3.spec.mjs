import mocha from 'mocha';
import chai from 'chai';
import {
  LibT3,
} from '../libt3.mjs';
import {
  BoundaryViolationError,
} from '../errors/BoundaryViolationError.mjs';
import {
  CellOccupiedError,
} from '../errors/CellOccupiedError.mjs';
import {
  EvenSizeError,
} from '../errors/EvenSizeError.mjs';

const {
  describe,
  it,
  beforeEach,
  afterEach,
} = mocha;
const {
  expect,
} = chai;

mocha.Runner.prototype.uncaught = (error) => {
  // eslint-disable-next-line no-console
  console.error(error);
};

describe('libt3', () => {
  const LibT3Config = Object.freeze({
    size: 3,
  });
  let libT3Config = null;
  let libt3 = null;

  beforeEach(() => {
    libT3Config = {
      ...LibT3Config,
    };

    libt3 = new LibT3(libT3Config);
  });

  afterEach(() => {
    libt3 = null;
    libT3Config = null;
  });

  it('should create/destroy libt3', async () => {
    expect(libt3).to.exist;
  });

  it('should succeed to make a move within the boundaries of the field', async () => {
    const upperBoundary = (Math.pow(LibT3Config.size, 2) - 1);

    libt3.move(0);
    libt3.move(upperBoundary);
  });

  it('should fail to make a move without the boundaries of the field', async () => {
    const invalidCellIds = [-1, Math.pow(LibT3Config.size, 2)];
    const expectedCellIds = [];

    for (const cellid of invalidCellIds) {
      try {
        libt3.move(cellid);
      } catch (boundaryViolationError) {
        expect(boundaryViolationError).to.be.instanceof(BoundaryViolationError);
        expect(boundaryViolationError.cellid).to.equal(cellid);

        expectedCellIds.push(cellid);
      }
    }

    return expect(expectedCellIds).to.have.ordered.members(invalidCellIds);
  });

  it('should fail to make a move to an occuppied cell', async () => {
    const toTheSameCell = 0;

    libt3.move(toTheSameCell);

    try {
      libt3.move(toTheSameCell);
    } catch (cellOccupiedError) {
      expect(cellOccupiedError).to.be.instanceof(CellOccupiedError);
      expect(cellOccupiedError.cellid).to.equal(cellid);
    }
  });

  it('should fail to instantiate game field with even size', async () => {
    const evenSize = 4;
    const LibT3ConfigEvenSize = Object.freeze({
      size: evenSize,
    });
    let libt3EvenSize = null;
    let expectedError = null;

    try {
      libt3EvenSize = new LibT3(LibT3ConfigEvenSize);
    } catch (evenSizeError) {
      expectedError = evenSizeError;
    } finally {
      expect(expectedError).to.be.instanceof(EvenSizeError);
      expect(expectedError.size).to.equal(evenSize);
    }
  });

  it('should tell if a number is even or odd', async () => {
    const evenNumber = 2;
    const oddNumber = 3;

    expect(LibT3.isEven(evenNumber)).to.be.true;
    expect(LibT3.isEven(oddNumber)).to.be.false;
  });

  it('should calculate diagonal indices of a field', async () => {
    const erroneousSizeForAField = 4;
    const verificationData = [
      {
        size: 3,
        expectedIndices: {
          backward: [0, 4, 8],
          forward: [2, 4, 6],
        },
      },
      {
        size: erroneousSizeForAField,
      },
      {
        size: 5,
        expectedIndices: {
          backward: [0, 6, 12, 18, 24],
          forward: [4, 8, 12, 16, 20],
        },
      },
    ];
    let errors = [];

    try {
      for (const verificationDatum of verificationData) {
        const calculatedIndices = LibT3.calculateDiagonalIndices(verificationDatum.size);
    
        expect(calculatedIndices).to.deep.equal(verificationDatum.expectedIndices);
      }
    } catch (error) {
      errors.push(error);
    } finally {
      expect(errors).to.have.lengthOf(1);

      for (const error of errors) {
        expect(error).to.be.instanceof(EvenSizeError);
        expect(error.size).to.equal(erroneousSizeForAField);
      }
    }
  });
});
