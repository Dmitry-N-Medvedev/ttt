export class LibBlockerStrategy {
  static get Name() {
    return this.name;
  }

  #isGameFieldEmpty(cells, emptySymbol) {
    return cells.some((value) => value !== emptySymbol) === false;
  }

  #chooseRandomCell(cells, emptySymbol) {
    let randomIndex = null;

    do {
      randomIndex = Math.floor(Math.random() * cells.length);
    } while (cells[randomIndex] !== emptySymbol);

    return randomIndex;
  }

  #resolveBlockingCellId(cells, vectors, emptySymbol, enemySymbol) {
    let vectorWeights = [];

    for (const vector of vectors) {
      const vectorWeight = vector.reduce((sum, cellIndex) => sum + cells[cellIndex], 0);

      vectorWeights.push([vectorWeight, vector]);
    }

    const uniqueWeights = Array.from(new Set(vectorWeights.map(([weight, _]) => weight))).sort();
    const maxWeightValue = uniqueWeights[uniqueWeights.length - 1];
    const heaviestVectors = vectorWeights.filter(([weight, _]) => weight === maxWeightValue).map(([_, vector]) => vector);
    const randomHeaviestVectorIndex = Math.floor(Math.random() * heaviestVectors.length);
    const heaviestVectorEmptyCellIndices = (heaviestVectors[randomHeaviestVectorIndex]).filter((cellIndex) => cells[cellIndex] === emptySymbol);
    const randomCellIndex = heaviestVectorEmptyCellIndices[Math.floor(Math.random() * heaviestVectorEmptyCellIndices.length)];

    return randomCellIndex;
  }

  process(cells = null, vectors = null, emptySymbol = null, enemySymbol = null) {
    if (cells === null) {
      throw new ReferenceError('cells are undefined');
    }

    if (vectors === null) {
      throw new ReferenceError('cells are undefined');
    }

    if (Array.isArray(cells) === false) {
      throw new TypeError('cells are not represented by an Array');
    }

    if (Array.isArray(vectors) === false) {
      throw new TypeError('vectors are not represented by an Array');
    }

    if (cells.length === 0) {
      throw new ReferenceError('cells are empty');
    }

    if (emptySymbol === enemySymbol) {
      throw new EvalError('emptySymbol must not be equal to enemySymbol');
    }

    if (this.#isGameFieldEmpty(cells, emptySymbol)) {
      return this.#chooseRandomCell(cells, emptySymbol);
    }

    return this.#resolveBlockingCellId(cells, vectors, emptySymbol, enemySymbol);
  }
}
