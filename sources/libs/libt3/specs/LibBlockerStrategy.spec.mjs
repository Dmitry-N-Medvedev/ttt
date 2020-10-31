import mocha from 'mocha';
import chai from 'chai';
import {
  LibBlockerStrategy,
} from '../strategies/LibBlockerStrategy.mjs';
import {
  LibMatrix,
} from '../LibMatrix.mjs';


const {
  describe,
  it,
} = mocha;
const {
  expect,
} = chai;

describe(LibBlockerStrategy.name, () => {
  it('should fail on incorrectly defined cells', async () => {
    const undefinedCellsArray = Object.freeze([
      null,
      undefined,
    ]);
    const emptyCellsArray = Object.freeze([]);
    const mistypedCellArrays = Object.freeze([
      'some string',
      0,
      {},
    ]);
    const emptySymbol = 0;
    const enemySymbol = 1;
    const libBlockerStrategy = new LibBlockerStrategy();

    for (const undefinedCells of undefinedCellsArray) {
      let error = null;

      try {
        libBlockerStrategy.process(undefinedCells, [], emptySymbol, enemySymbol);
      } catch (referenceError) {
        error = referenceError;
      } finally {
        expect(error).to.be.instanceof(ReferenceError);
      }
    }

    let emptyCellsArrayError = null;

    try {
      libBlockerStrategy.process(emptyCellsArray, [], emptySymbol, enemySymbol);
    } catch (referenceError) {
      emptyCellsArrayError = referenceError;
    } finally {
      expect(emptyCellsArrayError).to.be.instanceof(ReferenceError);
    }

    for (const mistypedCellArray of mistypedCellArrays) {
      let error = null;

      try {
        libBlockerStrategy.process(mistypedCellArray, [], emptySymbol, enemySymbol);
      } catch (typeError) {
        error = typeError;
      } finally {
        expect(error).to.be.instanceof(TypeError);
      }
    }
  });

  it('should select a random cell for an empty game field', async () => {
    const libMatrixConfig = Object.freeze({
      size: 3,
    });
    const emptySymbol = 0;
    const enemySymbol = 1;
    const libMatrix = new LibMatrix(libMatrixConfig);
    const libBlockerStrategy = new LibBlockerStrategy();
    const resolvedIndices = [];

    for (let i = 0; i < libMatrix.cells.length / 2; i += 1) {
      resolvedIndices.push(libBlockerStrategy.process(libMatrix.cells, libMatrix.vectors, emptySymbol, enemySymbol));
    }

    expect(Array.from(new Set(resolvedIndices))).to.not.equal(resolvedIndices);
  });

  it('should fail when emptySymbol === enemySymbol', async () => {
    const libMatrixConfig = Object.freeze({
      size: 3,
    });
    const emptySymbol = 0;
    const enemySymbol = emptySymbol;
    const libMatrix = new LibMatrix(libMatrixConfig);
    const libBlockerStrategy = new LibBlockerStrategy();

    let error = null;

    try {
      libBlockerStrategy.process(libMatrix.cells, libMatrix.vectors, emptySymbol, enemySymbol);
    } catch (evalError) {
      error = evalError;
    } finally {
      expect(error).to.be.instanceof(EvalError);
    }
  });

  it('should resolve a cell index which will block a vector', async () => {
    const libMatrixConfig = Object.freeze({
      size: 3,
    });
    const enemySymbol = 1;
    const emptySymbol = 0;
    const cellIndex = 0;
    const libMatrix = new LibMatrix(libMatrixConfig);
    const libBlockerStrategy = new LibBlockerStrategy();

    libMatrix.set(cellIndex, enemySymbol);

    const resolvedCellIndex = libBlockerStrategy.process(libMatrix.cells, libMatrix.vectors, emptySymbol, enemySymbol);

    expect(libMatrix.cells[resolvedCellIndex]).to.equal(emptySymbol);
  });
});