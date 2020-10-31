import mocha from 'mocha';
import chai from 'chai';
import {
  LibMatrix,
} from '../LibMatrix.mjs';
import {
  EvenSizeError,
} from '../errors/EvenSizeError.mjs';
import {
  CellOccupiedError,
} from '../errors/CellOccupiedError.mjs';


const {
  describe,
  it,
} = mocha;
const {
  expect,
} = chai;

describe('LibMatrix', () => {
  it('should fail to instantiate LibMatrix with even size', async() => {
    const libMatrixConfig = Object.freeze({
      size: 4,
    });
    let error = null;

    try {
      new LibMatrix(libMatrixConfig);
    } catch(evenSizeError) {
      error = evenSizeError;
    } finally {
      expect(error).to.be.an.instanceof(EvenSizeError);
    }
  });

  it('should fail to instantiate LibMatrix with zero size', async () => {
    const libMatrixConfig = Object.freeze({
      size: 0,
    });
    let error = null;

    try {
      new LibMatrix(libMatrixConfig);
    } catch (evenSizeError) {
      error = evenSizeError;
    } finally {
      expect(error).to.be.an.instanceof(EvenSizeError);
    }
  });

  it('should fail to instantiate LibMatrix with non-integer size', async () => {
    const libMatrixConfig = Object.freeze({
      size: 'a',
    });
    let error = null;

    try {
      new LibMatrix(libMatrixConfig);
    } catch (referenceError) {
      error = referenceError;
    } finally {
      expect(error).to.be.an.instanceof(EvalError);
    }
  });

  it('should fail to instantiate LibMatrix with undefined config', async () => {
    const libMatrixConfig = undefined;
    let error = null;

    try {
      new LibMatrix(libMatrixConfig);
    } catch (referenceError) {
      error = referenceError;
    } finally {
      expect(error).to.be.an.instanceof(ReferenceError);
    }
  });

  it('should fail to double set the same cell', async () => {
    const libMatrixConfig = Object.freeze({
      size: 3,
    });
    const libMatrix = new LibMatrix(libMatrixConfig);
    const sameCellIndex = 0;
    let error = null;

    try {
      libMatrix.set(sameCellIndex, 0);
      libMatrix.set(sameCellIndex, 0);
    } catch (cellOccupiedError) {
      error = cellOccupiedError;
    } finally {
      expect(error).to.be.an.instanceof(CellOccupiedError);
      expect(error.index).to.equal(sameCellIndex);
    }
  });

  it('should fail to register event handler w/ incorrect event name', async () => {
    const libMatrixConfig = Object.freeze({
      size: 3,
    });
    const libMatrix = new LibMatrix(libMatrixConfig);
    const undefinedEventNames = [ null, undefined ];
    const mistypedEventNames = [ '', 0, {} ];
    const unknownEventName = 'unknownEventName';

    for (let undefinedEventName of undefinedEventNames) {
      let error = null;

      try {
        libMatrix.on(undefinedEventName, () => {});
      } catch (referenceError) {
        error = referenceError;
      } finally {
        expect(error).to.be.instanceof(ReferenceError);
      }
    }

    for (let mistypedEventName of mistypedEventNames) {
      let error = null;

      try {
        libMatrix.on(mistypedEventName, () => {});
      } catch (evalError) {
        error = evalError;
      } finally {
        expect(error).to.be.instanceof(EvalError);
      }
    }

    let unknownEventNameError = null;

    try {
      libMatrix.on(unknownEventName, () => {});
    } catch (evalError) {
      unknownEventNameError = evalError;
    } finally {
      expect(unknownEventNameError).to.be.instanceof(EvalError);
    }
  });

  it('should fail to register non-function event handler', async () => {
    const libMatrixConfig = Object.freeze({
      size: 3,
    });
    const libMatrix = new LibMatrix(libMatrixConfig);
    const incorrectEventHandlers = [ null, undefined, 'handler', {}, 0 ];

    for (let incorrectEventHandler of incorrectEventHandlers) {
      let error = null;

      try {
        libMatrix.on('set', incorrectEventHandler);
      } catch (evalError) {
        error = evalError;
      } finally {
        expect(error).to.be.instanceof(EvalError);
      }
    }
  });

  it('should verify the number of cells in matrix', async () => {
    const libMatrixConfig = Object.freeze({
      size: 3,
    });
    const libMatrix = new LibMatrix(libMatrixConfig);

    expect(libMatrix.cells.length).to.equal(Math.pow(libMatrixConfig.size, 2));
  });

  it('should listen to the "set" event on LibMatrix', async () => {
    const libMatrixConfig = Object.freeze({
      size: 3,
    });
    const libMatrix = new LibMatrix(libMatrixConfig);
    const cellIndex = 0;
    const cellValue = 0;

    const run = () => new Promise((resolve, reject) => {
      try {
        libMatrix.on('set', ({ index, value }) => {
          expect(index).to.equal(cellIndex);
          expect(value).to.equal(cellValue);

          return resolve();
        });
  
        libMatrix.set(cellIndex, cellValue);
      } catch (error) {
        return reject(error);
      }
    });

    return run();
  });

  it('should listen to the "clear" event on LibMatrix', async () => {
    const libMatrixConfig = Object.freeze({
      size: 3,
    });
    const libMatrix = new LibMatrix(libMatrixConfig);
    const cellIndex = 0;
    const cellValue = 0;

    const run = () => new Promise((resolve, reject) => {
      try {
        libMatrix.on('clear', () => {
          expect(libMatrix.cells.length).to.equal(0);

          return resolve();
        });

        libMatrix.clear();
      } catch (error) {
        return reject(error);
      }
    });

    return run();
  });

  it('should calculate vectors', async () => {
    const libMatrixConfig = Object.freeze({
      size: 5,
    });
    const libMatrix = new LibMatrix(libMatrixConfig);
    const expectedVectors = Object.freeze([
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
      [0, 5, 10, 15, 20],
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
      [0, 6, 12, 18, 24],
      [4, 8, 12, 16, 20]
    ]);

    expect(libMatrix.vectors).to.have.deep.members(expectedVectors);

    let error = null;

    try {
      libMatrix.vectors.push([ null, null, null, null, null ]);
    } catch (typeError) {
      error = typeError;
    } finally {
      expect(error).to.be.instanceof(TypeError);
      expect(error.message).to.match(/object is not extensible$/);
    }
  });
});
