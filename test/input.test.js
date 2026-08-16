import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveKeyAction,
  resolveMouseAction,
  resolveWheelAction,
} from '../src/helpers/inputMapping.js';

test('maps standard navigation and Logitech-friendly media/browser keys', () => {
  assert.equal(resolveKeyAction({ key: 'ArrowUp', code: 'ArrowUp' }), 'UP_CLICK');
  assert.equal(resolveKeyAction({ key: 'MediaTrackNext', code: '' }), 'DOWN_CLICK');
  assert.equal(resolveKeyAction({ key: 'BrowserForward', code: '' }), 'PRIMARY_CLICK');
  assert.equal(resolveKeyAction({ key: 'BrowserBack', code: '' }), 'SECONDARY_CLICK');
});

test('allows deployment-local mappings by key or code', () => {
  const custom = { F13: 'UP_CLICK', NumpadAdd: 'PRIMARY_CLICK' };
  assert.equal(resolveKeyAction({ key: 'F13', code: 'F13' }, custom), 'UP_CLICK');
  assert.equal(resolveKeyAction({ key: 'Unidentified', code: 'NumpadAdd' }, custom), 'PRIMARY_CLICK');
  assert.equal(resolveKeyAction({ key: 'F20', code: 'F20' }, custom), null);
});

test('maps mouse and dial controls', () => {
  assert.equal(resolveMouseAction(1), 'PRIMARY_CLICK');
  assert.equal(resolveMouseAction(3), 'SECONDARY_CLICK');
  assert.equal(resolveMouseAction(7), null);
  assert.equal(resolveWheelAction({ deltaY: -100 }), 'UP_CLICK');
  assert.equal(resolveWheelAction({ deltaY: 100 }), 'DOWN_CLICK');
  assert.equal(resolveWheelAction({ deltaX: -100, deltaY: 0 }), 'UP_CLICK');
  assert.equal(resolveWheelAction({ deltaX: 100, deltaY: 0 }), 'DOWN_CLICK');
  assert.equal(resolveWheelAction({ deltaX: 0.5 }, { threshold: 1 }), null);
  assert.equal(resolveWheelAction({ deltaX: 100 }, { invert: true }), 'UP_CLICK');
});
