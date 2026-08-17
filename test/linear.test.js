import test from 'node:test';
import assert from 'node:assert/strict';
import { completeAssignedIssue, fetchAssignedIssues } from '../src/providers/linear.js';

test('loads assigned issues and completes only a specified issue', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => (options.method === 'POST' ? { issue: { id: 'issue-1' } } : { issues: [] }),
    };
  };
  try {
    assert.deepEqual(await fetchAssignedIssues(), { issues: [] });
    assert.deepEqual(await completeAssignedIssue('issue-1'), { issue: { id: 'issue-1' } });
    assert.equal(calls[1].url, '/api/linear/issues/complete');
    assert.deepEqual(JSON.parse(calls[1].options.body), { id: 'issue-1' });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('refuses a completion request without an issue ID', async () => {
  await assert.rejects(() => completeAssignedIssue(''), /required/);
});
