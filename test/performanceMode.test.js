import test from 'node:test';
import assert from 'node:assert/strict';
import { resolvePerformanceMode } from '../src/helpers/performanceMode.js';

test('selects low performance mode from the kiosk query parameter', () => {
  assert.equal(resolvePerformanceMode({ search: '?performance=low' }), 'low');
  assert.equal(resolvePerformanceMode({ search: '' }), 'normal');
});

test('deployment config overrides the query parameter', () => {
  assert.equal(resolvePerformanceMode({
    config: { performanceMode: 'normal' },
    search: '?performance=low',
  }), 'normal');
});
