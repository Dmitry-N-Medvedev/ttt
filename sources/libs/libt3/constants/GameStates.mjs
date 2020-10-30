export const GameStates = Object.freeze({
  INVALID: Math.pow(2, 0),      // 1
  IN_PROGRESS: Math.pow(2, 1),  // 2
  DRAW: Math.pow(2, 2),         // 4
  WE_HAVE_A_WINNER: Math.pow(2, 3),          // 8
});
