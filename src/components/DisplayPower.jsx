import React, { useEffect, useRef, useState } from 'react';
import { MirrorEvents, setNavigationInputBlocked } from '../helpers/events.jsx';
import { getDisplayPower, setDisplayPower } from '../providers/displayPower.js';
import './DisplayPower.css';

const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));
const DISPLAY_PHASE_KEY = 'reflectrum.displayPower.phase';

const initialPhase = () => (
  ['off', 'waking'].includes(sessionStorage.getItem(DISPLAY_PHASE_KEY)) ? 'off' : 'checking'
);

export default function DisplayPower() {
  const [phase, setPhase] = useState(initialPhase);
  const phaseRef = useRef(initialPhase());
  const busyRef = useRef(false);

  const changePhase = (nextPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  };

  useEffect(() => {
    const controller = new AbortController();
    if (phaseRef.current === 'off') setNavigationInputBlocked(true);
    getDisplayPower({ signal: controller.signal })
      .then(({ power }) => {
        if (power === 'off') {
          sessionStorage.setItem(DISPLAY_PHASE_KEY, 'off');
          setNavigationInputBlocked(true);
          changePhase('off');
        } else if (sessionStorage.getItem(DISPLAY_PHASE_KEY) === 'waking') {
          setNavigationInputBlocked(true);
          changePhase('waking');
          wait(200).then(() => {
            sessionStorage.removeItem(DISPLAY_PHASE_KEY);
            setNavigationInputBlocked(false);
            changePhase('on');
          });
        } else if (sessionStorage.getItem(DISPLAY_PHASE_KEY) !== 'off') {
          sessionStorage.removeItem(DISPLAY_PHASE_KEY);
          changePhase('on');
        }
      })
      .catch(() => {
        // Vite development does not provide the Pi-only endpoint.
        if (phaseRef.current === 'checking') changePhase('on');
      });

    const listener = MirrorEvents.addListener('DISPLAY_TOGGLE', async () => {
      if (busyRef.current) return;
      busyRef.current = true;

      if (phaseRef.current === 'on') {
        sessionStorage.setItem(DISPLAY_PHASE_KEY, 'off');
        setNavigationInputBlocked(true);
        changePhase('dimming');
        await wait(240);
        try {
          await setDisplayPower('off');
          changePhase('off');
        } catch (error) {
          console.warn('Unable to power off the display:', error.message);
          // Stay black and let the dedicated toggle recover; revealing the UI
          // after an uncertain hardware command can cause a bright flash.
          changePhase('off');
        }
      } else {
        sessionStorage.setItem(DISPLAY_PHASE_KEY, 'waking');
        try {
          await setDisplayPower('on');
          await wait(120);
        } catch (error) {
          console.warn('Unable to power on the display:', error.message);
        } finally {
          changePhase('waking');
          await wait(200);
          sessionStorage.removeItem(DISPLAY_PHASE_KEY);
          setNavigationInputBlocked(false);
          changePhase('on');
        }
      }

      busyRef.current = false;
    });

    return () => {
      controller.abort();
      listener.remove();
      setNavigationInputBlocked(false);
    };
  }, []);

  return <div className={`display-power-curtain is-${phase}`} aria-hidden="true" />;
}
