import test from 'node:test';
import assert from 'node:assert/strict';
import {
  navigationDirection,
  pageTransitionMiddleware,
} from '../src/helpers/pageTransitions.js';

const state = {
  history: ['MAIN_MENU', 'WEATHER'],
  standby: false,
};

test('marks forward navigation as a push transition', () => {
  assert.equal(navigationDirection({ type: 'OPEN_ITEM', page: 'WEATHER' }, state), 'push');
  assert.equal(navigationDirection({ type: 'OPEN_MAIN_MENU' }, state), 'push');
});

test('marks back navigation as pop only when history can pop', () => {
  assert.equal(navigationDirection({ type: 'BACK' }, state), 'pop');
  assert.equal(navigationDirection({ type: 'BACK' }, { ...state, history: ['MAIN_MENU'] }), null);
});

test('does not transition unrelated or standby actions', () => {
  assert.equal(navigationDirection({ type: 'SCROLL_DOWN' }, state), null);
  assert.equal(navigationDirection({ type: 'OPEN_ITEM', page: 'WEATHER' }, { ...state, standby: true }), null);
});

test('dispatches normally when the View Transitions API is unavailable', () => {
  const action = { type: 'OPEN_ITEM', page: 'WEATHER' };
  const dispatch = pageTransitionMiddleware({ getState: () => state })((received) => {
    assert.equal(received, action);
    return 'dispatched';
  });

  assert.equal(dispatch(action), 'dispatched');
});

test('sets and clears the push direction around a view transition', async () => {
  const originalDocument = globalThis.document;
  const action = { type: 'OPEN_ITEM', page: 'WEATHER' };
  const dataset = {};

  globalThis.document = {
    documentElement: { dataset },
    startViewTransition(update) {
      update();
      return {
        finished: Promise.resolve(),
        skipTransition() {},
      };
    },
  };

  try {
    const dispatch = pageTransitionMiddleware({ getState: () => state })(() => 'transitioned');
    assert.equal(dispatch(action), 'transitioned');
    assert.equal(dataset.pageTransitionDirection, 'push');
    await Promise.resolve();
    assert.equal(dataset.pageTransitionDirection, undefined);
  } finally {
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  }
});
