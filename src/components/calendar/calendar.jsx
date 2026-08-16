import React from 'react';
import './calendar.css';
import { connect } from 'react-redux';
import { MirrorEvents } from '../../helpers/events';
import { fetchCalendar } from '../../providers/calendar';

const dateLabel = (date) => new Intl.DateTimeFormat(undefined, {
  weekday: 'long', month: 'short', day: 'numeric',
}).format(date);

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric', minute: '2-digit', hour12: true,
});

const timeParts = (date) => {
  const parts = timeFormatter.formatToParts(date);
  return {
    time: parts
      .filter(({ type }) => type !== 'dayPeriod')
      .map(({ value }) => value)
      .join('')
      .trim(),
    period: parts.find(({ type }) => type === 'dayPeriod').value,
  };
};

const timeRangeLabel = (start, end) => {
  const startTime = timeParts(start);
  const endTime = timeParts(end);
  return startTime.period === endTime.period
    ? `${startTime.time}–${endTime.time} ${endTime.period}`
    : `${startTime.time} ${startTime.period}–${endTime.time} ${endTime.period}`;
};

const Event = ({ event }) => (
  <li className="calendar-event">
    <div className="calendar-event-time">
      {event.allDay ? 'All day' : timeRangeLabel(event.start, event.end)}
    </div>
    <div className="calendar-event-body">
      <strong>{event.summary}</strong>
      {event.location && <span>{event.location}</span>}
    </div>
  </li>
);

class Calendar extends React.Component {
  state = { status: 'loading', events: [], error: '' };

  componentDidMount() {
    this.handlers = [
      MirrorEvents.addListener('SECONDARY_HOLD', this.props.secondaryHold),
      MirrorEvents.addListener('SECONDARY_CLICK', this.props.secondaryClick),
    ];
    this.abortController = new AbortController();
    this.loadEvents();
  }

  componentWillUnmount() {
    this.handlers.forEach((handler) => handler.remove());
    this.abortController.abort();
  }

  async loadEvents() {
    try {
      const events = await fetchCalendar({ signal: this.abortController.signal });
      this.setState({ status: 'ready', events, error: '' });
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.setState({ status: 'error', error: error.message });
      }
    }
  }

  render() {
    const { status, events, error } = this.state;
    return (
      <main className="calendar-page">
        <header>
          <p>Upcoming</p>
          <h1>Calendar</h1>
        </header>
        {status === 'loading' && <p className="calendar-status">Loading events…</p>}
        {status === 'error' && <p className="calendar-status">{error}</p>}
        {status === 'ready' && events.length === 0 && (
          <p className="calendar-status">No events in the next seven days.</p>
        )}
        {status === 'ready' && events.length > 0 && (
          <ol className="calendar-events">
            {events.map((event, index) => (
              <React.Fragment key={event.id}>
                {(index === 0 || dateLabel(events[index - 1].start) !== dateLabel(event.start)) && (
                  <li className="calendar-day">{dateLabel(event.start)}</li>
                )}
                <Event event={event} />
              </React.Fragment>
            ))}
          </ol>
        )}
      </main>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  secondaryHold: () => dispatch({ type: 'OPEN_MAIN_MENU' }),
  secondaryClick: () => dispatch({ type: 'BACK' }),
});

export default connect(null, mapDispatchToProps)(Calendar);
