import mocha from 'mocha';
import chai from 'chai';
import {
  LibT3,
} from '../libt3.mjs';
import {
  LibMatrix,
} from '../LibMatrix.mjs';
import {
  BoundaryViolationError,
} from '../errors/BoundaryViolationError.mjs';
import {
  CellOccupiedError,
} from '../errors/CellOccupiedError.mjs';
import {
  EvenSizeError,
} from '../errors/EvenSizeError.mjs';
import {
  BlockerStrategy,
} from '../strategies/BlockerStrategy.mjs';
import {
  XOF,
} from '../constants/XOF.mjs';
import {
  GameStates,
} from '../constants/GameStates.mjs';

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
    strategy: null,
  });
  let libT3Config = null;
  let libt3 = null;

  beforeEach(() => {
    // libT3Config = {
    //   ...LibT3Config,
    // };

    // libt3 = new LibT3(libT3Config);
  });

  afterEach(() => {
    // libt3 = null;
    // libT3Config = null;
  });

  // it('should create/destroy libt3', async () => {
  //   expect(libt3).to.exist;
  // });

  // it('should succeed to make a move within the boundaries of the field', async () => {
  //   const upperBoundary = (Math.pow(LibT3Config.size, 2) - 1);

  //   libt3.move(0);
  //   libt3.move(upperBoundary);
  // });

  // it('should fail to make a move without the boundaries of the field', async () => {
  //   const invalidCellIds = [-1, Math.pow(LibT3Config.size, 2)];
  //   const expectedCellIds = [];

  //   for (const cellid of invalidCellIds) {
  //     try {
  //       libt3.move(cellid);
  //     } catch (boundaryViolationError) {
  //       expect(boundaryViolationError).to.be.instanceof(BoundaryViolationError);
  //       expect(boundaryViolationError.cellid).to.equal(cellid);

  //       expectedCellIds.push(cellid);
  //     }
  //   }

  //   return expect(expectedCellIds).to.have.ordered.members(invalidCellIds);
  // });

  // it('should fail to make a move to an occuppied cell', async () => {
  //   const toTheSameCell = 0;

  //   libt3.move(toTheSameCell);

  //   try {
  //     libt3.move(toTheSameCell);
  //   } catch (cellOccupiedError) {
  //     expect(cellOccupiedError).to.be.instanceof(CellOccupiedError);
  //     expect(cellOccupiedError.cellid).to.equal(cellid);
  //   }
  // });

  // it('should fail to instantiate game field with even size', async () => {
  //   const evenSize = 4;
  //   const LibT3ConfigEvenSize = Object.freeze({
  //     size: evenSize,
  //   });
  //   let libt3EvenSize = null;
  //   let expectedError = null;

  //   try {
  //     libt3EvenSize = new LibT3(LibT3ConfigEvenSize);
  //   } catch (evenSizeError) {
  //     expectedError = evenSizeError;
  //   } finally {
  //     expect(expectedError).to.be.instanceof(EvenSizeError);
  //     expect(expectedError.size).to.equal(evenSize);
  //   }
  // });

  // it('should tell if a number is even or odd', async () => {
  //   const evenNumber = 2;
  //   const oddNumber = 3;

  //   expect(LibT3.isEven(evenNumber)).to.be.true;
  //   expect(LibT3.isEven(oddNumber)).to.be.false;
  // });

  // it('should calculate diagonal indices of a field', async () => {
  //   const erroneousSizeForAField = 4;
  //   const verificationData = [
  //     {
  //       size: 3,
  //       expectedIndices: {
  //         backward: [0, 4, 8],
  //         forward: [2, 4, 6],
  //       },
  //     },
  //     {
  //       size: erroneousSizeForAField,
  //     },
  //     {
  //       size: 5,
  //       expectedIndices: {
  //         backward: [0, 6, 12, 18, 24],
  //         forward: [4, 8, 12, 16, 20],
  //       },
  //     },
  //   ];
  //   let errors = [];

  //   try {
  //     for (const verificationDatum of verificationData) {
  //       const calculatedIndices = LibT3.calculateDiagonalIndices(verificationDatum.size);
    
  //       expect(calculatedIndices).to.deep.equal(verificationDatum.expectedIndices);
  //     }
  //   } catch (error) {
  //     errors.push(error);
  //   } finally {
  //     expect(errors).to.have.lengthOf(1);

  //     for (const error of errors) {
  //       expect(error).to.be.instanceof(EvenSizeError);
  //       expect(error.size).to.equal(erroneousSizeForAField);
  //     }
  //   }
  // });

  // it('should getColumnIndicesByCell', async () => {
  //   const verificationData = [
  //     {
  //       cellid: 0,
  //       expectedIndices: [0, 3, 6],
  //     },
  //     {
  //       cellid: 4,
  //       expectedIndices: [1, 4, 7],
  //     },
  //     {
  //       cellid: 8,
  //       expectedIndices: [2, 5, 8],
  //     },
  //   ];

  //   for (const verificationDatum of verificationData) {
  //     libt3.move(verificationDatum.cellid);

  //     const resolvedColumnIndices = LibT3.getColumnIndicesByCell(LibT3Config.size, verificationDatum.cellid);

  //     expect(resolvedColumnIndices).to.have.ordered.members(verificationDatum.expectedIndices);
  //   }
  // });

  // it('should geRowIndicesByCell', async () => {
  //   const verificationData = [{
  //       cellid: 0,
  //       expectedIndices: [0, 1, 2],
  //     },
  //     {
  //       cellid: 4,
  //       expectedIndices: [3, 4, 5],
  //     },
  //     {
  //       cellid: 8,
  //       expectedIndices: [6, 7, 8],
  //     },
  //   ];

  //   for (const verificationDatum of verificationData) {
  //     libt3.move(verificationDatum.cellid);

  //     const resolvedRowIndices = LibT3.geRowIndicesByCell(LibT3Config.size, verificationDatum.cellid);

  //     expect(resolvedRowIndices).to.have.ordered.members(verificationDatum.expectedIndices);
  //   }
  // });

  it('should use BlockerStrategy', async () => {
    const gameFieldSize = 3;
    const libMatrix = new LibMatrix({
      size: gameFieldSize,
      emptyCellValue: XOF.F,
    });
    const configA = Object.freeze({
      name: 'player A',
      size: gameFieldSize,
      strategy: new BlockerStrategy(),
      symbols: {
        human: XOF.X,
        machine: XOF.O,
        empty: XOF.F,
      },
      matrix: libMatrix,
    });
    const configB = Object.freeze({
      name: 'player B',
      size: gameFieldSize,
      strategy: new BlockerStrategy(),
      symbols: {
        human: XOF.O,
        machine: XOF.X,
        empty: XOF.F,
      },
      matrix: libMatrix,
    });
    const players = [
      new LibT3(configA),
      new LibT3(configB),
    ];
    let moveResult = null;

    function* genPlayerId(arrayOfPlayers) {
      let playerIndex = 0;

      while (true) {
        yield arrayOfPlayers[playerIndex];

        playerIndex += 1;

        if (playerIndex >= arrayOfPlayers.length) {
          playerIndex = 0;
        }
      }
    }

    const resolvePlayer = genPlayerId(players);

    const resolvePlayerByWonSymbol = (wonSymbol) => players.filter((player) => player.ownSymbol === wonSymbol)[0];

    const execTest = () => new Promise((resolve, reject) => {
      const printMatrix = () => {
        console.log('\n');

        for (let rowFirstIndex = 0; rowFirstIndex < libMatrix.cells.length; rowFirstIndex += gameFieldSize) {
          const row = libMatrix.cells
            .slice(rowFirstIndex, rowFirstIndex + gameFieldSize)
            .map((value) => {
              switch(value) {
                case XOF.X: {
                  return '×';
                }
                case XOF.O: {
                  return '⨀';
                }
                default: {
                  return '·';
                }
              }
            })
            .join(' ');

          console.log(row);
        }
        console.log();
      };

      libMatrix.ondata = (index, value) => {
        printMatrix();
      };

      do {
        const player = (resolvePlayer.next()).value;
  
        moveResult = player.move();
      } while (moveResult.gameState === GameStates.IN_PROGRESS);

      switch (moveResult.gameState) {
        case GameStates.WE_HAVE_A_WINNER: {
          const winnerName = (resolvePlayerByWonSymbol(moveResult.wonSymbol)).name;

          return resolve();
        }
        case GameStates.DRAW: {
          return resolve();
        }
        default: {
          return reject('game failed with', moveResult);
        }
      }
    });

    return execTest();
  }).timeout(0);
});
