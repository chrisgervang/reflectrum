export const DEFAULT_KEY_MAP = Object.freeze({
  ArrowUp: 'UP_CLICK',
  PageUp: 'UP_CLICK',
  MediaTrackPrevious: 'UP_CLICK',
  ArrowDown: 'DOWN_CLICK',
  PageDown: 'DOWN_CLICK',
  MediaTrackNext: 'DOWN_CLICK',
  ArrowRight: 'PRIMARY_CLICK',
  Enter: 'PRIMARY_CLICK',
  ' ': 'PRIMARY_CLICK',
  BrowserForward: 'PRIMARY_CLICK',
  MediaPlayPause: 'PRIMARY_CLICK',
  ArrowLeft: 'SECONDARY_CLICK',
  Escape: 'SECONDARY_CLICK',
  Backspace: 'SECONDARY_CLICK',
  BrowserBack: 'SECONDARY_CLICK',
});

export const resolveKeyAction = (event, customMap = {}) => {
  const keyMap = { ...DEFAULT_KEY_MAP, ...customMap };
  return keyMap[event.key] || keyMap[event.code] || null;
};

export const resolveMouseAction = (button) => {
  if ([0, 1, 4].includes(button)) return 'PRIMARY_CLICK';
  if ([2, 3].includes(button)) return 'SECONDARY_CLICK';
  return null;
};

export const resolveWheelAction = (deltaY, { threshold = 1, invert = false } = {}) => {
  if (Math.abs(deltaY) < threshold) return null;
  const direction = invert ? -deltaY : deltaY;
  return direction < 0 ? 'UP_CLICK' : 'DOWN_CLICK';
};
