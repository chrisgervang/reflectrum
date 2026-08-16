import React, { useEffect, useState } from 'react';
import { MirrorEvents } from '../helpers/events';
import './InputDiagnostics.css';

const formatEvent = (event) => {
  const raw = event.source === 'keyboard'
    ? `${event.key || 'Unidentified'} (${event.code || 'no code'})`
    : event.source === 'wheel'
      ? `deltaY ${Math.round(event.deltaY)}`
      : `button ${event.button}`;
  const result = event.action || 'unmapped';
  return `${event.source}/${event.type}: ${raw} → ${result}${event.throttled ? ' (throttled)' : ''}`;
};

export default function InputDiagnostics() {
  const enabled = new URLSearchParams(window.location.search).get('input-debug') === '1'
    || window.REFLECTRUM_CONFIG?.inputDiagnostics === true;
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!enabled) return undefined;
    const listener = MirrorEvents.addListener('INPUT_DIAGNOSTIC', (event) => {
      setEvents((current) => [event, ...current].slice(0, 8));
    });
    return () => listener.remove();
  }, [enabled]);

  if (!enabled) return null;
  return (
    <aside className="input-diagnostics" aria-live="polite">
      <strong>Input diagnostics</strong>
      <span>Move or press every Dialpad control.</span>
      {events.length === 0
        ? <code>No browser input received yet.</code>
        : events.map((event, index) => <code key={`${event.timestamp}-${index}`}>{formatEvent(event)}</code>)}
    </aside>
  );
}
