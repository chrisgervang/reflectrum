import test from 'node:test';
import assert from 'node:assert/strict';
import { requestSystemPower } from '../src/providers/systemPower.js';

test('requests only allowlisted Pi power actions', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url, options });
    return { ok: true, json: async () => ({ accepted: true, action: 'reboot' }) };
  };
  try {
    assert.deepEqual(await requestSystemPower('reboot'), { accepted: true, action: 'reboot' });
    assert.equal(calls[0].url, '/api/system/power');
    assert.equal(calls[0].options.method, 'POST');
    assert.equal(calls[0].options.keepalive, true);
    assert.deepEqual(JSON.parse(calls[0].options.body), { action: 'reboot' });
    await assert.rejects(() => requestSystemPower('sleep'), /Invalid system power action/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
