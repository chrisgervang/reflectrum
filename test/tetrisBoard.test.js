import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeTetrisBoard, generateTetrisStack } from '../src/providers/tetrisBoard.js';

const seededRandom = (initialSeed) => {
  let seed = initialSeed >>> 0;
  return () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
};

test('builds a dense, low-hole stack from complete tetromino placements', () => {
  const board = generateTetrisStack({ width: 19, height: 35, random: seededRandom(42) });
  const stats = analyzeTetrisBoard(board);
  const placements = new Map();
  board.flat().filter(Boolean).forEach((cell) => {
    placements.set(cell.placementId, (placements.get(cell.placementId) || 0) + 1);
  });

  assert.ok(stats.occupiedCells > 19 * 35 * .28);
  assert.ok(stats.maximumHeight < 35 * .65);
  assert.ok(stats.holes <= 2);
  assert.equal(stats.completedRows, 0);
  assert.ok([...placements.values()].every((count) => count === 4));
});

test('keeps the layout random while retaining the same quality constraints', () => {
  const first = generateTetrisStack({ width: 19, height: 35, random: seededRandom(7) });
  const second = generateTetrisStack({ width: 19, height: 35, random: seededRandom(8) });
  const signature = (board) => board.map((column) => column.map((cell) => cell?.type ?? '.').join('')).join('|');
  assert.notEqual(signature(first), signature(second));
  assert.ok(analyzeTetrisBoard(first).holes <= 2);
  assert.ok(analyzeTetrisBoard(second).holes <= 2);
});
