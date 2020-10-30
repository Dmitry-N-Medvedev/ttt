import {
  GameStates,
} from '../constants/GameStates.mjs';
import {
  XOF,
} from '../constants/XOF.mjs';

export class BlockerStrategy {
  // #resolveDangerousVector(vectors) {
  //   return (vectors.sort(
  //       (vectorA, vectorB) => (vectorA.indices.length / vectorA.weights.weight) - (vectorB.indices.length / vectorB.weights.weight)
  //     )[0]);
  // }

  // #resolveIndicesFreeForInsertion(cells, indices) {
  //   return indices.filter((value) => cells[value] === XOF.F);
  // }

  // #choseIndexForInsertion(indices) {
  //   return indices[Math.trunc(Math.random() * indices.length)];
  // }

  // process(context) {
  //   const result = {
  //     index: null,
  //     gameState: GameStates.IN_PROGRESS,
  //   };

  //   const dangerousVector = this.#resolveDangerousVector(context.vectors);
  //   const indicesFreeForInsertion = this.#resolveIndicesFreeForInsertion(context.cells, dangerousVector.indices);
  //   const indexForInsertion = this.#choseIndexForInsertion(indicesFreeForInsertion);

  //   // console.log(`${this.constructor.name}.process`, JSON.stringify(context, null, 2));
  //   // console.log('dangerousVector:', dangerousVector);
  //   // console.log('indicesFreeForInsertion:', indicesFreeForInsertion);
  //   // console.log('indexForInsertion:', indexForInsertion);

  //   result.index = indexForInsertion;

  //   return Object.freeze(result);
  // }

  #calculateVectorWeight(vector = null, cells = null) {
    const r = vector.reduce((acc, indexValue) => {
      return acc + cells[indexValue];
    }, 0) / vector.length;

    return r;
  }

  #resolveCandidateCellIndex(vector = null, cells = null, emptySymbol = null) {
    return (vector === null || cells === null) ? -1 : (vector.filter((cellIndex) => cells[cellIndex] === emptySymbol))[0];
  }

  #resolveCandidateVectorIndex(vectors = null) {
    const V = vectors.slice();

    const heaviestVectors = Array
      .from(
        new Set(V.map((vector) => vector.weight))
      )
      .sort((a, b) => Math.abs(a) - Math.abs(b))
      .reverse()
      .map((weight) => V.find((vector) => vector.weight === weight));

    const heaviestVectorIndex = (heaviestVectors[0] ?? { index: -1 }).index;

    return (V.find((vector) => vector.index === heaviestVectorIndex) ?? { index: -1 }).index;
  }

  #resolveWonVector(cells = null, vectors = null, opponentSymbol = null, ownSymbol = null, emptySymbol = null) {
    const V = vectors.slice();
    const size = Math.sqrt(cells.length);
    const result = vectors
      .map((vector) => ({
        vector,
        weight: this.#calculateVectorWeight(vector, cells),
      }))
      .filter(({ vector, weight }) => [
        opponentSymbol,
        ownSymbol,
      ].includes(weight));

    return Object.freeze(result);
  }

  process({ cells = null, vectors = null, opponentSymbol = null, ownSymbol = null, emptySymbol = null }) {
    const result = {
      symbolIndex: null,
      gameState: GameStates.INVALID,
    };

    const wonVectors = this.#resolveWonVector(cells, vectors, opponentSymbol, ownSymbol, emptySymbol);

    if (wonVectors.length > 0) {
      return Object.freeze({
        vector: (wonVectors[0]).vector,
        gameState: GameStates.WE_HAVE_A_WINNER,
        wonSymbol: (wonVectors[0]).weight,
      });
    }

    if (cells.some((cell) => cell === emptySymbol) === false) {
      return Object.freeze({
        gameState: GameStates.DRAW,
      });
    }

    const vectorWeightsInfoSorted = vectors
      .map((vector, index) => ({
        index,
        weight: this.#calculateVectorWeight(vector, cells),
      }))
      .sort((a, b) => (a.weight - b.weight));

    result.symbolIndex = this.#resolveCandidateCellIndex(
      vectors[this.#resolveCandidateVectorIndex(vectorWeightsInfoSorted)],
      cells,
      emptySymbol,
    );
    result.gameState = GameStates.IN_PROGRESS;

    return Object.freeze(result);
  }
}
