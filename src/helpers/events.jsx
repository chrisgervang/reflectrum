import { EventEmitter } from 'fbemitter';
import {
  resolveKeyAction,
  resolveMouseAction,
  resolveWheelAction,
} from './inputMapping.js';
import { resolvePerformanceMode } from './performanceMode.js';

export const MirrorEvents = new EventEmitter();

const inputConfig = globalThis.REFLECTRUM_CONFIG?.input || {};
const customKeyMap = inputConfig.keyMap || {};
const wheelConfig = {
  threshold: inputConfig.wheelThreshold ?? 1,
  invert: inputConfig.invertWheel ?? false,
};
const wheelCooldownMs = inputConfig.wheelCooldownMs
  ?? (resolvePerformanceMode() === 'low' ? 110 : 90);
const pressState = { primary: false, secondary: false };
let lastWheelActionAt = 0;
let navigationInputBlocked = false;

export const setNavigationInputBlocked = (blocked) => {
  navigationInputBlocked = Boolean(blocked);
};

const emitAction = (action) => {
  if (action === 'DISPLAY_TOGGLE' || !navigationInputBlocked) {
    MirrorEvents.emit(action);
  }
};

const diagnostic = (details) => MirrorEvents.emit('INPUT_DIAGNOSTIC', {
  timestamp: new Date().toISOString(),
  ...details,
});

const pressName = (action) => {
  if (action === 'PRIMARY_CLICK') return 'primary';
  if (action === 'SECONDARY_CLICK') return 'secondary';
  return null;
};

const beginButtonPress = (name, event) => {
  event.preventDefault();
  if (pressState[name] === false) {
    pressState[name] = 'click';
  } else if (event.repeat && pressState[name] === 'click') {
    pressState[name] = 'hold';
    emitAction(name === 'primary' ? 'PRIMARY_HOLD' : 'SECONDARY_HOLD');
  }
};

const finishButtonPress = (name, event) => {
  event.preventDefault();
  if (pressState[name] === 'click') {
    emitAction(name === 'primary' ? 'PRIMARY_CLICK' : 'SECONDARY_CLICK');
  }
  pressState[name] = false;
};

const registerInputListeners = () => {
  document.addEventListener('keydown', (event) => {
    const action = resolveKeyAction(event, customKeyMap);
    diagnostic({ source: 'keyboard', type: 'keydown', key: event.key, code: event.code, repeat: event.repeat, action });
    if (!action) return;

    const name = pressName(action);
    if (name) {
      beginButtonPress(name, event);
    } else {
      event.preventDefault();
      if (!event.repeat) emitAction(action);
    }
  });

  document.addEventListener('keyup', (event) => {
    const action = resolveKeyAction(event, customKeyMap);
    diagnostic({ source: 'keyboard', type: 'keyup', key: event.key, code: event.code, repeat: false, action });
    const name = pressName(action);
    if (name) finishButtonPress(name, event);
  });

  document.addEventListener('wheel', (event) => {
    const action = resolveWheelAction(event, wheelConfig);
    const now = Date.now();
    const throttled = Boolean(action && now - lastWheelActionAt < wheelCooldownMs);
    diagnostic({ source: 'wheel', type: 'wheel', deltaX: event.deltaX, deltaY: event.deltaY, action, throttled });
    if (!action) return;

    event.preventDefault();
    if (!throttled) {
      lastWheelActionAt = now;
      emitAction(action);
    }
  }, { passive: false });

  document.addEventListener('mousedown', (event) => {
    if (resolveMouseAction(event.button)) event.preventDefault();
  });

  document.addEventListener('mouseup', (event) => {
    const action = resolveMouseAction(event.button);
    diagnostic({ source: 'mouse', type: 'mouseup', button: event.button, action });
    if (action) emitAction(action);
  });

  document.addEventListener('contextmenu', (event) => event.preventDefault());
};

if (typeof document !== 'undefined') registerInputListeners();
