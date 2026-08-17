import { flushSync } from 'react-dom';

let activeTransition = null;

export const navigationDirection = (action, state) => {
  if (state.standby) return null;
  if (action.type === 'BACK') return state.history.length > 1 ? 'pop' : null;
  if (action.type === 'OPEN_ITEM' && action.page) return 'push';
  if (action.type === 'OPEN_MAIN_MENU') return 'push';
  return null;
};

export const pageTransitionsAvailable = ({
  document: currentDocument = globalThis.document,
  location: currentLocation = globalThis.location,
  config = globalThis.REFLECTRUM_CONFIG,
  matchMedia = globalThis.matchMedia,
} = {}) => {
  if (config?.pageTransitions === false) return false;
  if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  return typeof currentDocument?.startViewTransition === 'function';
};

export const pageTransitionMiddleware = ({ getState }) => (next) => (action) => {
  const direction = navigationDirection(action, getState());
  if (!direction || !pageTransitionsAvailable()) {
    return next(action);
  }

  activeTransition?.skipTransition();
  document.documentElement.dataset.pageTransitionDirection = direction;

  let result = action;
  let didDispatch = false;
  try {
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        result = next(action);
        didDispatch = true;
      });
    });
    activeTransition = transition;
    const finishTransition = () => {
      if (activeTransition === transition) {
        activeTransition = null;
        delete document.documentElement.dataset.pageTransitionDirection;
      }
    };
    transition.finished.then(finishTransition, finishTransition);
  } catch (error) {
    delete document.documentElement.dataset.pageTransitionDirection;
    console.warn('Page transition failed:', error.message);
    return didDispatch ? result : next(action);
  }

  return result;
};
