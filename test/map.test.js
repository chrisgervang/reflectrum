import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTileGrid, projectToTile } from '../src/providers/map.js';

test('projects known coordinates into Web Mercator tiles', () => {
  assert.deepEqual(projectToTile({ lat: 0, long: 0 }, 1), { x: 1, y: 1 });
  const sanFrancisco = projectToTile({ lat: 37.7749, long: -122.4194 }, 12);
  assert.ok(sanFrancisco.x > 654 && sanFrancisco.x < 656);
  assert.ok(sanFrancisco.y > 1582 && sanFrancisco.y < 1584);
});

test('builds a viewport-covering CARTO dark tile grid', () => {
  const tiles = buildTileGrid({ lat: 37.7749, long: -122.4194 }, {
    zoom: 12, width: 768, height: 1366,
  });
  assert.ok(tiles.length >= 30);
  assert.ok(tiles.every(({ url }) => /^https:\/\/[a-d]\.basemaps\.cartocdn\.com\/dark_all\/12\/\d+\/\d+@2x\.png$/.test(url)));
  assert.ok(Math.min(...tiles.map(({ left }) => left)) < 0);
  assert.ok(Math.max(...tiles.map(({ left }) => left)) + 256 > 768);
  assert.ok(Math.min(...tiles.map(({ top }) => top)) < 0);
  assert.ok(Math.max(...tiles.map(({ top }) => top)) + 256 > 1366);
});
