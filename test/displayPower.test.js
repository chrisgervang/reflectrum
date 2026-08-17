import test from 'node:test';
import assert from 'node:assert/strict';
import { getDisplayPower, setDisplayPower } from '../src/providers/displayPower.js';

test('reads and updates display power through the narrow loopback API', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url, options });
    return { ok: true, json: async () => ({ power: options.method === 'POST' ? 'off' : 'on' }) };
  };
  try {
    assert.deepEqual(await getDisplayPower(), { power: 'on' });
    assert.deepEqual(await setDisplayPower('off'), { power: 'off' });
    assert.equal(calls[0].url, '/api/display');
    assert.equal(JSON.parse(calls[1].options.body).power, 'off');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('rejects display states outside on and off', async () => {
  await assert.rejects(() => setDisplayPower('toggle'), /Invalid display power state/);
});
