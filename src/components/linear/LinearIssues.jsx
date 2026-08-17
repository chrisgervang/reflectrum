import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { MirrorEvents } from '../../helpers/events.jsx';
import { completeAssignedIssue, fetchAssignedIssues } from '../../providers/linear.js';
import './LinearIssues.css';

const visibleWindow = (issues, selected) => {
  const start = Math.max(0, Math.min(selected - 2, issues.length - 6));
  return issues.slice(start, start + 6).map((issue, index) => ({ issue, absoluteIndex: start + index }));
};

function LinearIssues({ onBack, onMainMenu }) {
  const [issues, setIssues] = useState([]);
  const [selected, setSelected] = useState(0);
  const [confirming, setConfirming] = useState(null);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Loading your assigned issues…');
  const [stale, setStale] = useState(false);
  const [mutationError, setMutationError] = useState('');

  const load = useCallback(async (signal) => {
    setStatus('loading');
    try {
      const result = await fetchAssignedIssues({ signal });
      setIssues(result.issues || []);
      setStale(result.stale === true);
      setSelected(0);
      setStatus('ready');
    } catch (error) {
      if (error.name === 'AbortError') return;
      setMessage(error.message);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  useEffect(() => {
    const listeners = [
      MirrorEvents.addListener('UP_CLICK', () => {
        if (!confirming) setSelected((current) => Math.max(0, current - 1));
      }),
      MirrorEvents.addListener('DOWN_CLICK', () => {
        if (!confirming) setSelected((current) => Math.min(issues.length - 1, current + 1));
      }),
      MirrorEvents.addListener('PRIMARY_CLICK', async () => {
        if (status === 'error') {
          load();
          return;
        }
        const issue = issues[selected];
        if (!issue || status === 'saving') return;
        if (!confirming) {
          setMutationError('');
          setConfirming(issue.id);
          return;
        }
        setStatus('saving');
        try {
          await completeAssignedIssue(confirming);
          const remaining = issues.filter((item) => item.id !== confirming);
          setIssues(remaining);
          setSelected((current) => Math.max(0, Math.min(current, remaining.length - 1)));
          setConfirming(null);
          setStatus('ready');
        } catch (error) {
          setMutationError(error.message);
          setConfirming(null);
          setStatus('ready');
        }
      }),
      MirrorEvents.addListener('SECONDARY_CLICK', () => {
        if (confirming) setConfirming(null);
        else onBack();
      }),
      MirrorEvents.addListener('SECONDARY_HOLD', onMainMenu),
    ];
    return () => listeners.forEach((listener) => listener.remove());
  }, [confirming, issues, load, onBack, onMainMenu, selected, status]);

  const selectedIssue = issues.find((issue) => issue.id === confirming);

  return (
    <main className="linear-page">
      <header className="linear-page__header">
        <h1>My Linear</h1>
        <span className="linear-page__count">{issues.length} open</span>
      </header>

      {stale && <div className="linear-page__notice">Offline — showing the last saved task list.</div>}
      {mutationError && <div className="linear-page__notice is-error">{mutationError}</div>}

      {status === 'loading' && <div className="linear-page__message">Loading your assigned issues…</div>}
      {status === 'error' && <div className="linear-page__message">{message}<br />Select to retry.</div>}
      {status !== 'loading' && status !== 'error' && issues.length === 0
        && <div className="linear-page__message">Nothing assigned. A rare and beautiful sight.</div>}

      <section className="linear-page__list">
        {status !== 'loading' && visibleWindow(issues, selected).map(({ issue, absoluteIndex }) => (
          <article
            className={`linear-issue${absoluteIndex === selected ? ' is-selected' : ''}`}
            style={{ '--state-color': issue.state?.color }}
            key={issue.id}
          >
            <div className="linear-issue__meta">
              <span className="linear-issue__identifier">{issue.identifier}</span>
              <span>{issue.state?.name}</span>
              {issue.project?.name && <span>{issue.project.name}</span>}
            </div>
            <div className="linear-issue__title">{issue.title}</div>
            <div className="linear-issue__details">
              <span>{['No priority', 'Urgent', 'High', 'Medium', 'Low'][issue.priority || 0]}</span>
              {issue.dueDate && <span>Due {issue.dueDate}</span>}
            </div>
          </article>
        ))}
      </section>

      {selectedIssue && (
        <div className="linear-confirm">
          <div className="linear-confirm__card">
            <div className="linear-confirm__eyebrow">Complete {selectedIssue.identifier}?</div>
            <div className="linear-confirm__title">{selectedIssue.title}</div>
            <div className="linear-confirm__hint">
              Press select again to complete.<br />Press back to cancel.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const mapDispatchToProps = (dispatch) => ({
  onBack: () => dispatch({ type: 'BACK' }),
  onMainMenu: () => dispatch({ type: 'OPEN_MAIN_MENU' }),
});

export default connect(null, mapDispatchToProps)(LinearIssues);
