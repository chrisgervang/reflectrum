import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { MirrorEvents } from '../../helpers/events.jsx';
import { requestSystemPower } from '../../providers/systemPower.js';
import './Settings.css';

const actions = [
  {
    action: 'reboot',
    title: 'Restart Raspberry Pi',
    detail: 'Restart the mirror, ADS-B feeder, and Reflectrum.',
    accent: '#ff9f0a',
  },
  {
    action: 'shutdown',
    title: 'Shut Down Raspberry Pi',
    detail: 'Safely stop the Pi before disconnecting power.',
    accent: '#ff453a',
  },
];

function Settings({ onBack, onMainMenu }) {
  const [selected, setSelected] = useState(0);
  const [confirming, setConfirming] = useState(null);
  const [status, setStatus] = useState('ready');
  const [error, setError] = useState('');

  useEffect(() => {
    const listeners = [
      MirrorEvents.addListener('UP_CLICK', () => {
        if (!confirming && status === 'ready') setSelected((current) => Math.max(0, current - 1));
      }),
      MirrorEvents.addListener('DOWN_CLICK', () => {
        if (!confirming && status === 'ready') setSelected((current) => Math.min(actions.length - 1, current + 1));
      }),
      MirrorEvents.addListener('PRIMARY_CLICK', async () => {
        if (status !== 'ready') return;
        const selectedAction = actions[selected];
        if (!confirming) {
          setError('');
          setConfirming(selectedAction.action);
          return;
        }
        setStatus('sending');
        try {
          await requestSystemPower(confirming);
          setStatus('accepted');
        } catch (requestError) {
          setError(requestError.message);
          setConfirming(null);
          setStatus('ready');
        }
      }),
      MirrorEvents.addListener('SECONDARY_CLICK', () => {
        if (confirming && status === 'ready') setConfirming(null);
        else if (status === 'ready') onBack();
      }),
      MirrorEvents.addListener('SECONDARY_HOLD', () => {
        if (status === 'ready') onMainMenu();
      }),
    ];
    return () => listeners.forEach((listener) => listener.remove());
  }, [confirming, onBack, onMainMenu, selected, status]);

  const confirmingAction = actions.find((item) => item.action === confirming);

  return (
    <main className="settings-page">
      <header className="settings-page__header">
        <div>
          <div className="settings-page__eyebrow">Reflectrum</div>
          <h1>Settings</h1>
        </div>
        <div className="settings-page__device">Raspberry Pi</div>
      </header>

      {error && <div className="settings-page__error">{error}</div>}

      <section className="settings-page__actions">
        {actions.map((item, index) => (
          <article
            className={`settings-action${selected === index ? ' is-selected' : ''}`}
            style={{ '--settings-accent': item.accent }}
            key={item.action}
          >
            <div className="settings-action__indicator" />
            <div>
              <h2>{item.title}</h2>
              <p>{item.detail}</p>
            </div>
          </article>
        ))}
      </section>

      <footer className="settings-page__hint">Select an action · Back to return</footer>

      {confirmingAction && (
        <div className="settings-confirm">
          <div className="settings-confirm__card" style={{ '--settings-accent': confirmingAction.accent }}>
            <div className="settings-confirm__eyebrow">Confirm system action</div>
            <h2>{status === 'accepted' ? 'Command accepted' : confirmingAction.title}</h2>
            <p>
              {status === 'ready' && 'Press select again to continue. Press back to cancel.'}
              {status === 'sending' && 'Sending the command to the Raspberry Pi…'}
              {status === 'accepted' && (confirming === 'reboot'
                ? 'Reflectrum will return after the Pi restarts.'
                : 'Wait for the display to turn off before disconnecting power.')}
            </p>
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

export default connect(null, mapDispatchToProps)(Settings);
