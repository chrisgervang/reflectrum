import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { MirrorEvents } from '../../helpers/events.jsx';
import {
  fetchHomeEntities,
  fetchHomeHistory,
  groupHomeEntities,
} from '../../providers/homeAssistant.js';
import './HomeDashboard.css';

const sections = ['overview', 'locks', 'lights', 'sensors', 'network'];

const stateIsAlert = (entity) => {
  const domain = entity.entityId?.split('.')[0];
  if (domain === 'lock') return entity.state !== 'locked';
  if (domain === 'binary_sensor') return entity.state === 'on';
  return ['unavailable', 'unknown', 'problem'].includes(entity.state);
};

const Sparkline = ({ points }) => {
  if (!points || points.length < 2) return null;
  const values = points.map((point) => point.value);
  const minimum = Math.min(...values);
  const range = Math.max(0.0001, Math.max(...values) - minimum);
  const coordinates = points.map((point, index) => {
    const x = (index / (points.length - 1)) * 100;
    const y = 36 - ((point.value - minimum) / range) * 32;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg className="home-card__sparkline" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={coordinates} />
    </svg>
  );
};

function HomeDashboard({ onBack, onMainMenu }) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [entities, setEntities] = useState([]);
  const [history, setHistory] = useState({});
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Connecting to Home Assistant…');
  const [stale, setStale] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [historyError, setHistoryError] = useState('');
  const requestRef = useRef(null);

  const load = useCallback(async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setStatus('loading');
    setHistoryError('');
    try {
      const result = await fetchHomeEntities({ signal: controller.signal });
      const nextEntities = result.entities || [];
      setEntities(nextEntities);
      setStale(result.stale === true);
      setUpdatedAt(new Date());
      setStatus('ready');

      const configured = globalThis.REFLECTRUM_CONFIG?.homeAssistant?.historyEntities || [];
      const numeric = nextEntities
        .filter((entity) => Number.isFinite(Number(entity.state)))
        .map((entity) => entity.entityId);
      const historyEntities = [...new Set([...configured, ...numeric])].slice(0, 8);
      try {
        const historyResult = await fetchHomeHistory(historyEntities, { signal: controller.signal });
        setHistory(Object.fromEntries(historyResult.series.map((series) => [series.entityId, series.points])));
      } catch (error) {
        if (error.name !== 'AbortError') setHistoryError('Current state is live, but history is unavailable.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setMessage(error.message);
        setStatus('error');
      }
    }
  }, []);

  useEffect(() => {
    load();
    return () => requestRef.current?.abort();
  }, [load]);

  useEffect(() => {
    const listeners = [
      MirrorEvents.addListener('UP_CLICK', () => setSectionIndex((current) => Math.max(0, current - 1))),
      MirrorEvents.addListener('DOWN_CLICK', () => setSectionIndex((current) => Math.min(sections.length - 1, current + 1))),
      MirrorEvents.addListener('PRIMARY_CLICK', load),
      MirrorEvents.addListener('SECONDARY_CLICK', onBack),
      MirrorEvents.addListener('SECONDARY_HOLD', onMainMenu),
    ];
    return () => listeners.forEach((listener) => listener.remove());
  }, [load, onBack, onMainMenu]);

  const grouped = useMemo(() => groupHomeEntities(entities), [entities]);
  const activeSection = sections[sectionIndex];
  const visibleEntities = activeSection === 'overview' ? [] : grouped[activeSection].slice(0, 12);

  return (
    <main className="home-dashboard">
      <div className="home-dashboard__topline">
        <h1>Home</h1>
        <span className="home-dashboard__updated">
          {updatedAt ? `Updated ${updatedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : ''}
        </span>
      </div>
      <div className="home-dashboard__tabs">
        {sections.map((section, index) => (
          <div className={`home-dashboard__tab${index === sectionIndex ? ' is-active' : ''}`} key={section}>
            {section}
          </div>
        ))}
      </div>

      {stale && <div className="home-dashboard__notice">Offline — showing the latest saved state.</div>}
      {historyError && <div className="home-dashboard__notice">{historyError}</div>}
      {status === 'loading' && <div className="home-dashboard__empty">Connecting to Home Assistant…</div>}
      {status === 'error' && <div className="home-dashboard__empty">{message}<br />Select to retry.</div>}

      {status === 'ready' && activeSection === 'overview' && (
        <section className="home-dashboard__grid">
          {Object.entries(grouped).map(([name, values]) => (
            <article className="home-summary" key={name}>
              <div className="home-summary__number">
                {name === 'locks'
                  ? values.filter((entity) => stateIsAlert(entity)).length
                  : values.length}
              </div>
              <div className="home-summary__label">
                {name === 'locks' ? 'locks needing attention' : name}
              </div>
            </article>
          ))}
        </section>
      )}

      {status === 'ready' && activeSection !== 'overview' && visibleEntities.length === 0
        && <div className="home-dashboard__empty">No {activeSection} entities discovered yet.</div>}
      {status === 'ready' && activeSection !== 'overview' && (
        <section className="home-dashboard__grid">
          {visibleEntities.map((entity) => (
            <article className="home-card" key={entity.entityId}>
              <div className="home-card__name">{entity.name}</div>
              <div className={`home-card__state${stateIsAlert(entity) ? ' is-alert' : ''}`}>
                {entity.state}{entity.unit ? ` ${entity.unit}` : ''}
              </div>
              <Sparkline points={history[entity.entityId]} />
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

const mapDispatchToProps = (dispatch) => ({
  onBack: () => dispatch({ type: 'BACK' }),
  onMainMenu: () => dispatch({ type: 'OPEN_MAIN_MENU' }),
});

export default connect(null, mapDispatchToProps)(HomeDashboard);
