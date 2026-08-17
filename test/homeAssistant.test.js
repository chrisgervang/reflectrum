import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fetchHomeEntities,
  fetchHomeHistory,
  groupHomeEntities,
} from '../src/providers/homeAssistant.js';

test('groups home entities without requiring deployment-specific IDs', () => {
  const groups = groupHomeEntities([
    { entityId: 'lock.front_door', name: 'Front Door' },
    { entityId: 'light.kitchen', name: 'Kitchen' },
    { entityId: 'sensor.outdoor_temperature', name: 'Outdoor Temperature' },
    { entityId: 'sensor.unifi_wan_download', name: 'WAN Download' },
  ]);
  assert.equal(groups.locks.length, 1);
  assert.equal(groups.lights.length, 1);
  assert.equal(groups.sensors.length, 1);
  assert.equal(groups.network.length, 1);
});

test('loads current state and bounded history through read-only endpoints', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    return { ok: true, json: async () => (url.includes('history') ? { series: [] } : { entities: [] }) };
  };
  try {
    assert.deepEqual(await fetchHomeEntities(), { entities: [] });
    assert.deepEqual(await fetchHomeHistory(['sensor.temperature']), { series: [] });
    assert.match(calls[1], /entities=sensor\.temperature/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
