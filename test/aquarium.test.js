import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceAquariumWorld, createAquariumWorld } from '../src/providers/aquarium.js';

test('creates a deterministic, Pi-sized aquarium scene', () => {
  const first = createAquariumWorld({ seed: 42 });
  const second = createAquariumWorld({ seed: 42 });
  assert.equal(first.fish.length, 14);
  assert.equal(first.bubbles.length, 34);
  assert.deepEqual(first.fish[0], second.fish[0]);
});

test('advances and wraps fish and bubbles within the scene', () => {
  const world = createAquariumWorld({ fishCount: 1, bubbleCount: 1 });
  world.fish[0].x = 1.14;
  world.fish[0].direction = 1;
  world.bubbles[0].y = -0.03;
  advanceAquariumWorld(world, 0.05);
  assert.equal(world.fish[0].x, -0.13);
  assert.equal(world.bubbles[0].y, 1.02);
});
