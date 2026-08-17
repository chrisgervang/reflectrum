import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceRace, applyBoost, applySteering, createRaceState } from '../src/providers/racing.js';

test('steering impulses move the car and decay smoothly', () => {
  const steered = applySteering(createRaceState(), 1);
  const advanced = advanceRace(steered, 0.05);
  assert.ok(advanced.carX > 0);
  assert.ok(advanced.steering > 0 && advanced.steering < steered.steering);
  assert.ok(advanced.distance > 0);
});

test('leaving the road slows the car and boost remains bounded', () => {
  const offRoad = advanceRace({ ...createRaceState(), carX: 1, speed: 1 }, 0.05);
  assert.equal(offRoad.offRoad, true);
  assert.ok(offRoad.speed < 1);
  assert.equal(applyBoost({ ...offRoad, speed: .96 }).speed, 1);
});
