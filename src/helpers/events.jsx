import { EventEmitter } from 'fbemitter';

export const MirrorEvents = new EventEmitter();

const pressState = {
  primary: false,
  secondary: false,
};

const upKeys = new Set(['ArrowUp', 'PageUp']);
const downKeys = new Set(['ArrowDown', 'PageDown']);
const primaryKeys = new Set(['ArrowRight', 'Enter', ' ']);
const secondaryKeys = new Set(['ArrowLeft', 'Escape', 'Backspace']);

const beginButtonPress = (name, eventName, event) => {
  event.preventDefault();
  if (pressState[name] === false) {
    pressState[name] = 'click';
  } else if (event.repeat && pressState[name] === 'click') {
    pressState[name] = 'hold';
    MirrorEvents.emit(eventName);
  }
};

const finishButtonPress = (name, eventName, event) => {
  event.preventDefault();
  if (pressState[name] === 'click') {
    MirrorEvents.emit(eventName);
  }
  pressState[name] = false;
};

document.addEventListener('keydown', (event) => {
  if (upKeys.has(event.key)) {
    event.preventDefault();
    if (!event.repeat) MirrorEvents.emit('UP_CLICK');
  } else if (downKeys.has(event.key)) {
    event.preventDefault();
    if (!event.repeat) MirrorEvents.emit('DOWN_CLICK');
  } else if (primaryKeys.has(event.key)) {
    beginButtonPress('primary', 'PRIMARY_HOLD', event);
  } else if (secondaryKeys.has(event.key)) {
    beginButtonPress('secondary', 'SECONDARY_HOLD', event);
  }
});

document.addEventListener('keyup', (event) => {
  if (primaryKeys.has(event.key)) {
    finishButtonPress('primary', 'PRIMARY_CLICK', event);
  } else if (secondaryKeys.has(event.key)) {
    finishButtonPress('secondary', 'SECONDARY_CLICK', event);
  }
});

document.addEventListener('wheel', (event) => {
  if (Math.abs(event.deltaY) < 1) return;
  event.preventDefault();
  MirrorEvents.emit(event.deltaY < 0 ? 'UP_CLICK' : 'DOWN_CLICK');
}, { passive: false });

document.addEventListener('mouseup', (event) => {
  if (event.button === 0 || event.button === 4) {
    MirrorEvents.emit('PRIMARY_CLICK');
  } else if (event.button === 2 || event.button === 3) {
    MirrorEvents.emit('SECONDARY_CLICK');
  }
});

document.addEventListener('contextmenu', (event) => event.preventDefault());
