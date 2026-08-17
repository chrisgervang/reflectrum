const BASE_PIECES = [
  { name: 'O', cells: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  { name: 'I', cells: [[0, 0], [1, 0], [2, 0], [3, 0]] },
  { name: 'Z', cells: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  { name: 'T', cells: [[0, 0], [1, 0], [2, 0], [1, 1]] },
  { name: 'S', cells: [[1, 0], [2, 0], [0, 1], [1, 1]] },
  { name: 'J', cells: [[0, 0], [0, 1], [1, 1], [2, 1]] },
  { name: 'L', cells: [[2, 0], [0, 1], [1, 1], [2, 1]] },
];

const normalize = (cells) => {
  const minimumX = Math.min(...cells.map(([x]) => x));
  const minimumY = Math.min(...cells.map(([, y]) => y));
  return cells
    .map(([x, y]) => [x - minimumX, y - minimumY])
    .sort(([ax, ay], [bx, by]) => ay - by || ax - bx);
};

const rotationsFor = (cells) => {
  const rotations = [];
  const seen = new Set();
  let rotated = normalize(cells);
  for (let turn = 0; turn < 4; turn += 1) {
    const key = rotated.map((cell) => cell.join(',')).join(';');
    if (!seen.has(key)) {
      seen.add(key);
      rotations.push(rotated);
    }
    rotated = normalize(rotated.map(([x, y]) => [-y, x]));
  }
  return rotations;
};

export const TETROMINOES = BASE_PIECES.map((piece) => ({
  ...piece,
  rotations: rotationsFor(piece.cells),
}));

const emptyBoard = (width, height) => Array.from(
  { length: width },
  () => Array(height).fill(null),
);

const canPlace = (board, shape, offsetX, offsetY) => shape.every(([x, y]) => {
  const boardX = offsetX + x;
  const boardY = offsetY + y;
  return boardX >= 0
    && boardX < board.length
    && boardY < board[0].length
    && (boardY < 0 || board[boardX][boardY] === null);
});

const dropY = (board, shape, offsetX) => {
  let y = -4;
  while (canPlace(board, shape, offsetX, y + 1)) y += 1;
  return shape.every(([, cellY]) => y + cellY >= 0) ? y : null;
};

const place = (board, shape, offsetX, offsetY, cell) => {
  const placed = board.map((column) => column.slice());
  shape.forEach(([x, y]) => { placed[offsetX + x][offsetY + y] = cell; });
  return placed;
};

export const analyzeTetrisBoard = (board) => {
  const width = board.length;
  const height = board[0].length;
  const heights = board.map((column) => {
    const firstBlock = column.findIndex(Boolean);
    return firstBlock === -1 ? 0 : height - firstBlock;
  });
  const holes = board.reduce((total, column) => {
    let blockSeen = false;
    return total + column.reduce((columnHoles, cell) => {
      if (cell) blockSeen = true;
      return columnHoles + (blockSeen && !cell ? 1 : 0);
    }, 0);
  }, 0);
  const completedRows = Array.from({ length: height }, (_, y) => (
    board.every((column) => Boolean(column[y]))
  )).filter(Boolean).length;
  const bumpiness = heights.slice(1).reduce(
    (total, columnHeight, index) => total + Math.abs(columnHeight - heights[index]),
    0,
  );
  return {
    holes,
    completedRows,
    bumpiness,
    maximumHeight: Math.max(...heights),
    aggregateHeight: heights.reduce((total, value) => total + value, 0),
    occupiedCells: board.reduce(
      (total, column) => total + column.filter(Boolean).length,
      0,
    ),
  };
};

const placementScore = (stats, random) => (
  stats.holes * 100000
    + stats.completedRows * 20000
    + stats.bumpiness * 38
    + stats.maximumHeight * 12
    + stats.aggregateHeight
    + random() * 16
);

const shuffledBag = (random) => {
  const bag = TETROMINOES.map((_, index) => index);
  for (let index = bag.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [bag[index], bag[swapIndex]] = [bag[swapIndex], bag[index]];
  }
  return bag;
};

export const generateTetrisStack = ({ width, height, random = Math.random }) => {
  let board = emptyBoard(width, height);
  let bag = [];
  let placementId = 0;
  const targetPieces = Math.floor(width * height * (0.31 + random() * 0.08) / 4);

  while (placementId < targetPieces) {
    if (bag.length === 0) bag = shuffledBag(random);
    const candidates = [];
    // The order inside each seven-piece bag is flexible. Considering all pieces
    // still in the bag lets the generator avoid a forced hole without changing
    // the authentic distribution of tetromino types.
    bag.forEach((type, bagIndex) => {
      TETROMINOES[type].rotations.forEach((shape) => {
        const shapeWidth = Math.max(...shape.map(([x]) => x)) + 1;
        for (let x = 0; x <= width - shapeWidth; x += 1) {
          const y = dropY(board, shape, x);
          if (y === null) continue;
          const candidate = place(board, shape, x, y, { type, placementId });
          const stats = analyzeTetrisBoard(candidate);
          candidates.push({
            bagIndex,
            board: candidate,
            stats,
            score: placementScore(stats, random),
          });
        }
      });
    });
    if (candidates.length === 0) break;
    const minimumHoles = Math.min(...candidates.map(({ stats }) => stats.holes));
    const lowHoleCandidates = candidates.filter(({ stats }) => stats.holes === minimumHoles);
    const minimumCompletedRows = Math.min(...lowHoleCandidates.map(({ stats }) => stats.completedRows));
    const finalists = lowHoleCandidates
      .filter(({ stats }) => stats.completedRows === minimumCompletedRows)
      .sort((left, right) => left.score - right.score);
    const poolSize = Math.min(4, finalists.length);
    const choice = Math.floor((random() ** 2) * poolSize);
    const selected = finalists[choice];
    board = selected.board;
    bag.splice(selected.bagIndex, 1);
    placementId += 1;
  }
  return board;
};
