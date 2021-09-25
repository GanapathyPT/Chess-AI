// TODO:
// Make use of parcel or webpack to build files
// remove usage of chess.js with files

/*********************************************
 ************ GAME LOGIC VARIABLES ***********
 *********************************************/
const BLACK = "b";
const WHITE = "w";
let isBlackTurn = true;

/*********************************************
 ***************** DOM VARIABLES *************
 *********************************************/
const resetContainer = document.getElementById("resetContainer");
const resetBtn = document.getElementById("resetBtn");
const boardDiv = document.getElementById("board");
const winnerText = document.getElementById("winnerText");

/*********************************************
 ************ VALIDATION LOGIC ***************
 *********************************************/

const incOrDecString = (str, n) => String.fromCharCode(str.charCodeAt(0) + n);
const condition = (i, j) => i <= "h" && i >= "a" && j <= 8 && j >= 1;
const getOppositeColor = (piece) => (piece.includes("b") ? WHITE : BLACK);
const checkOppositeAndAdd = (pos, oppositeColor, moves, oldPositions) =>
  oldPositions[pos]?.includes(oppositeColor) ? moves.push(pos) : null;
const validGameMoves = [];
["a", "b", "c", "d", "e", "f", "g", "h"].forEach((letter) => {
  Array(8)
    .fill(0)
    .forEach((_, i) => {
      validGameMoves.push(letter + (i + 1));
    });
});
const validateMoves = (moves) =>
  moves.filter((move) => validGameMoves.includes(move));

function getPawnMoves(piece, pos, oldPositions) {
  const moves = [];
  // black pawn
  if (piece === "bP") {
    // upper position
    const up = pos[0] + (+pos[1] - 1);
    // left side of upper position
    const left = incOrDecString(up[0], 1) + (+pos[1] - 1);
    // right side of upper position
    const right = incOrDecString(up[0], -1) + (+pos[1] - 1);
    // adding up only if it is empty
    if (!oldPositions[up]) moves.push(up);
    // adding left and right if it is not empty and contains opposite color piece
    checkOppositeAndAdd(left, "w", moves, oldPositions);
    checkOppositeAndAdd(right, "w", moves, oldPositions);
  } else {
    const down = pos[0] + (+pos[1] + 1);
    const left = incOrDecString(down[0], -1) + (+pos[1] + 1);
    const right = incOrDecString(down[0], +1) + (+pos[1] + 1);
    if (!oldPositions[down]) moves.push(down);
    checkOppositeAndAdd(left, "b", moves, oldPositions);
    checkOppositeAndAdd(right, "b", moves, oldPositions);
  }
  return moves;
}

function getRookMoves(piece, pos, oldPositions) {
  const moves = [];
  const oppositeColor = getOppositeColor(piece);

  // top
  let i = +pos[1] - 1;
  while (!oldPositions[pos[0] + i] && i > 0) moves.push(pos[0] + i--);
  // if the stopped position exists and contains the opposite player piece add it
  checkOppositeAndAdd(pos[0] + i, oppositeColor, moves, oldPositions);

  // bottom
  i = +pos[1] + 1;
  while (!oldPositions[pos[0] + i] && i < 9) moves.push(pos[0] + i++);
  checkOppositeAndAdd(pos[0] + i, oppositeColor, moves, oldPositions);

  // left
  i = incOrDecString(pos[0], +1);
  while (!oldPositions[i + pos[1]] && i <= "h") {
    moves.push(i + pos[1]);
    i = incOrDecString(i, +1);
  }
  checkOppositeAndAdd(i + pos[1], oppositeColor, moves, oldPositions);

  // right
  i = incOrDecString(pos[0], -1);
  while (!oldPositions[i + pos[1]] && i >= "a") {
    moves.push(i + pos[1]);
    i = incOrDecString(i, -1);
  }
  checkOppositeAndAdd(i + pos[1], oppositeColor, moves, oldPositions);

  return moves;
}

function getKnightMoves(piece, pos, oldPositions) {
  const moves = [];
  const oppositeColor = getOppositeColor(piece);
  const tempMoves = [];

  // top left and right
  const top = pos[0] + (+pos[1] - 2);
  tempMoves.push(incOrDecString(top[0], -1) + top[1]);
  tempMoves.push(incOrDecString(top[0], +1) + top[1]);

  // bottom left and right
  const bottom = pos[0] + (+pos[1] + 2);
  tempMoves.push(incOrDecString(bottom[0], -1) + bottom[1]);
  tempMoves.push(incOrDecString(bottom[0], +1) + bottom[1]);

  // left top and bottom
  const left = incOrDecString(pos[0], +2) + pos[1];
  tempMoves.push(left[0] + (+left[1] - 1));
  tempMoves.push(left[0] + (+left[1] + 1));

  // right top and bottom
  const right = incOrDecString(pos[0], -2) + pos[1];
  tempMoves.push(right[0] + (+right[1] - 1));
  tempMoves.push(right[0] + (+right[1] + 1));

  tempMoves.forEach((tMove) => {
    // validating move
    if (!oldPositions[tMove]) moves.push(tMove);
    else checkOppositeAndAdd(tMove, oppositeColor, moves, oldPositions);
  });

  return moves;
}

function getBishopMoves(piece, pos, oldPositions) {
  const moves = [];
  const oppositeColor = getOppositeColor(piece);

  // top left +, -
  let i = incOrDecString(pos[0], 1);
  let j = +pos[1] - 1;
  while (!oldPositions[i + j] && condition(i, j)) {
    moves.push(i + j);
    i = incOrDecString(i, 1);
    j--;
  }
  checkOppositeAndAdd(i + j, oppositeColor, moves, oldPositions);

  // top right -, -
  i = incOrDecString(pos[0], -1);
  j = +pos[1] - 1;
  while (!oldPositions[i + j] && condition(i, j)) {
    moves.push(i + j);
    i = incOrDecString(i, -1);
    j--;
  }
  checkOppositeAndAdd(i + j, oppositeColor, moves, oldPositions);

  // bottom left +, +
  i = incOrDecString(pos[0], 1);
  j = +pos[1] + 1;
  while (!oldPositions[i + j] && condition(i, j)) {
    moves.push(i + j);
    i = incOrDecString(i, 1);
    j++;
  }
  checkOppositeAndAdd(i + j, oppositeColor, moves, oldPositions);

  // bottom right -, +
  i = incOrDecString(pos[0], -1);
  j = +pos[1] + 1;
  while (!oldPositions[i + j] && condition(i, j)) {
    moves.push(i + j);
    i = incOrDecString(i, -1);
    j++;
  }
  checkOppositeAndAdd(i + j, oppositeColor, moves, oldPositions);

  return moves;
}

function getKingMoves(piece, pos, oldPositions) {
  const moves = [];
  const oppositeColor = getOppositeColor(piece);

  const kingValidate = (position) => {
    if (!oldPositions[position]) moves.push(position);
    else checkOppositeAndAdd(position, oppositeColor, moves, oldPositions);
  };

  // top left +, -
  let position = incOrDecString(pos[0], 1) + (+pos[1] - 1);
  kingValidate(position);

  // top 0, -
  position = incOrDecString(pos[0], 0) + (+pos[1] - 1);
  kingValidate(position);

  // top right -, -
  position = incOrDecString(pos[0], -1) + (+pos[1] - 1);
  kingValidate(position);

  // left +, 0
  position = incOrDecString(pos[0], 1) + pos[1];
  kingValidate(position);

  // right -, 0
  position = incOrDecString(pos[0], -1) + pos[1];
  kingValidate(position);

  // bottom left +, +
  position = incOrDecString(pos[0], 1) + (+pos[1] + 1);
  kingValidate(position);

  // bottom 0, +
  position = incOrDecString(pos[0], 0) + (+pos[1] + 1);
  kingValidate(position);

  // bottom right -, +
  position = incOrDecString(pos[0], -1) + (+pos[1] + 1);
  kingValidate(position);

  return moves;
}

function getValidMoves(piece, pos, oldPositions) {
  const moves = [];
  switch (piece) {
    // pawn
    case "bP":
    case "wP":
      moves.push(...getPawnMoves(piece, pos, oldPositions));
      break;

    // Rook
    case "bR":
    case "wR":
      moves.push(...getRookMoves(piece, pos, oldPositions));
      break;

    // knight
    case "bN":
    case "wN":
      moves.push(...getKnightMoves(piece, pos, oldPositions));
      break;

    // bishop
    case "bB":
    case "wB":
      moves.push(...getBishopMoves(piece, pos, oldPositions));
      break;

    // queen
    case "bQ":
    case "wQ":
      moves.push(...getRookMoves(piece, pos, oldPositions));
      moves.push(...getBishopMoves(piece, pos, oldPositions));
      break;

    // king
    case "bK":
    case "wK":
      moves.push(...getKingMoves(piece, pos, oldPositions));
      break;

    default:
      return [];
  }

  const validatedMoves = validateMoves(moves);
  return validatedMoves;
}

function isValidMove(from, to, piece, oldPositions) {
  const validMoves = getValidMoves(piece, from, oldPositions);
  // console.log(validMoves);
  return validMoves.includes(to);
}

function checkForWinner(allPositions) {
  const blackPositions = getAllPiecesPositions(allPositions, BLACK);
  const whitePositions = getAllPiecesPositions(allPositions, WHITE);

  if (!blackPositions.some((pos) => allPositions[pos] === "bK")) return WHITE;
  if (!whitePositions.some((pos) => allPositions[pos] === "wK")) return BLACK;
  return null;
}

/*********************************************
 ************ DOM Manipulation ***************
 *********************************************/

function checkWinnerAndDisplay(positions) {
  const winner = checkForWinner(positions);
  if (winner === null) return;

  boardDiv.classList.add("hidden");
  winnerText.innerText = winner === WHITE ? "AI WON" : "YOU WON";
  resetContainer.classList.remove("hidden");
}

resetBtn.addEventListener("click", () => {
  board.start();

  boardDiv.classList.remove("hidden");
  resetContainer.classList.add("hidden");
});

/*********************************************
 ************ ChessBoard Related *************
 *********************************************/

function onDrop(
  source,
  target,
  piece,
  afterDropPositions,
  beforeDroppedPositions,
  orientation
) {
  // no move happened if source and target are same
  if (source === target) return;
  // console.log(
  //   source,
  //   target,
  //   piece,
  //   afterDropPositions,
  //   beforeDroppedPositions,
  //   orientation
  // );

  const currentMovePlayer = piece.includes("b") ? BLACK : WHITE;

  // checking for valid player playing the current move
  if (currentMovePlayer === BLACK && !isBlackTurn) return "snapback";
  if (currentMovePlayer === WHITE && isBlackTurn) return "snapback";

  // validating the move
  if (isValidMove(source, target, piece, beforeDroppedPositions)) {
    checkWinnerAndDisplay(afterDropPositions);

    isBlackTurn = !isBlackTurn;
    setTimeout(() => {
      const bestMove = solve(afterDropPositions);
      board.move(bestMove);
      checkWinnerAndDisplay(board.position());

      isBlackTurn = !isBlackTurn;
    }, 100);
    return;
  }

  return "snapback";
}

// config for the chessboard
const config = {
  position: "start",
  draggable: true,
  orientation: "black",
  onDrop,
};
const board = Chessboard("board", config);

// resize board on window resize
window.addEventListener("resize", board.resize);

/*********************************************
 **************** AI LOGIC *******************
 *********************************************/

const SCORES = {
  // pawn
  bP: -10,
  wP: 10,
  // knight
  bN: -30,
  wN: 30,
  // rook
  bR: -30,
  wR: 30,
  // bishop
  bB: -50,
  wB: 50,
  // queen
  bQ: -90,
  wQ: 90,
  // king
  bK: -900,
  wK: 900,
};

function getScore(allPositions) {
  let score = 0;

  const blackPiecesPos = getAllPiecesPositions(allPositions, BLACK);
  const whitePiecesPos = getAllPiecesPositions(allPositions, WHITE);

  blackPiecesPos.concat(whitePiecesPos).forEach((pos) => {
    const piece = allPositions[pos];
    score += SCORES[piece];
  });

  return score;
}

function getAllPiecesPositions(allPositions, player) {
  const playerPos = [];
  Object.keys(allPositions).forEach((pos) => {
    if (allPositions[pos].includes(player)) playerPos.push(pos);
  });
  return playerPos;
}

function solve(allPositions) {
  let positions = JSON.parse(JSON.stringify(allPositions));

  let bestMove;
  let bestScore = -Infinity;
  const playerPositions = getAllPiecesPositions(positions, WHITE);
  // console.log("positions", positions);
  // console.log("all player positions", playerPositions);

  for (let pos of playerPositions) {
    const piece = positions[pos];
    const validMoves = getValidMoves(piece, pos, positions);
    // console.group(piece, pos, "=>", validMoves);

    for (let move of validMoves) {
      positions[move] = piece;
      delete positions[pos];

      const score = minimax(positions, false, 3);
      // console.log(piece, pos, score, move);

      positions = JSON.parse(JSON.stringify(allPositions));

      if (score >= bestScore) {
        bestScore = score;
        bestMove = `${pos}-${move}`;
      }
    }

    // console.groupEnd();
  }

  console.log(bestMove);
  return bestMove;
}

function minimax(allPositions, maxPlayer, depth) {
  if (depth === 0 || checkForWinner(allPositions) !== null) {
    const score = getScore(allPositions);
    return score;
  }

  if (maxPlayer) {
    // AI is maximizing player
    let bestScore = -Infinity;
    let positions = JSON.parse(JSON.stringify(allPositions));
    const playerPositions = getAllPiecesPositions(positions, WHITE);

    for (let pos of playerPositions) {
      const piece = positions[pos];
      const validMoves = getValidMoves(piece, pos, positions);
      let currentBest = -Infinity;

      for (let move of validMoves) {
        positions[move] = piece;
        delete positions[pos];

        const score = minimax(positions, !maxPlayer, depth - 1);

        positions = JSON.parse(JSON.stringify(allPositions));
        // allPositions[pos] = piece;
        // delete allPositions[move];

        currentBest = Math.max(score, currentBest);
      }
      bestScore = Math.max(currentBest, bestScore);
    }
    return bestScore;
  } else {
    // User is minimizing player
    let bestScore = Infinity;
    let positions = JSON.parse(JSON.stringify(allPositions));
    const playerPositions = getAllPiecesPositions(allPositions, BLACK);

    for (let pos of playerPositions) {
      const piece = allPositions[pos];
      const validMoves = getValidMoves(piece, pos, positions);
      let currentBest = Infinity;

      for (let move of validMoves) {
        positions[move] = piece;
        delete positions[pos];

        const score = minimax(positions, !maxPlayer, depth - 1);

        positions = JSON.parse(JSON.stringify(allPositions));
        // allPositions[pos] = piece;
        // delete allPositions[move];

        currentBest = Math.min(score, currentBest);
      }
      bestScore = Math.min(bestScore, currentBest);
    }
    return bestScore;
  }
}
