import ICAL from 'ical.js';

const overlaps = (start, end, rangeStart, rangeEnd) => end >= rangeStart && start <= rangeEnd;

const eventRecord = (event, startDate, endDate) => ({
  id: `${event.uid}-${startDate.toUnixTime()}`,
  summary: event.summary || 'Untitled event',
  location: event.location || '',
  start: startDate.toJSDate(),
  end: endDate.toJSDate(),
  allDay: startDate.isDate,
});

export const parseCalendar = (source, {
  rangeStart = new Date(),
  rangeEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  occurrenceLimit = 10000,
} = {}) => {
  const calendar = new ICAL.Component(ICAL.parse(source));
  const components = calendar.getAllSubcomponents('vevent');
  const events = [];

  for (const component of components) {
    if (component.hasProperty('recurrence-id')) continue;
    const event = new ICAL.Event(component);

    if (!event.isRecurring()) {
      const start = event.startDate.toJSDate();
      const end = event.endDate.toJSDate();
      if (overlaps(start, end, rangeStart, rangeEnd)) {
        events.push(eventRecord(event, event.startDate, event.endDate));
      }
      continue;
    }

    const iterator = event.iterator();
    for (let count = 0; count < occurrenceLimit; count += 1) {
      const occurrence = iterator.next();
      if (!occurrence) break;
      const details = event.getOccurrenceDetails(occurrence);
      const start = details.startDate.toJSDate();
      const end = details.endDate.toJSDate();
      if (start > rangeEnd) break;
      if (overlaps(start, end, rangeStart, rangeEnd)) {
        events.push(eventRecord(details.item, details.startDate, details.endDate));
      }
    }
  }

  return events.sort((left, right) => left.start - right.start);
};

export const fetchCalendar = async ({ signal, days = 7 } = {}) => {
  const response = await fetch('/api/calendar', { signal, cache: 'no-store' });
  if (!response.ok) {
    const message = response.status === 503
      ? 'Calendar feed is not configured on this mirror.'
      : 'Calendar feed is temporarily unavailable.';
    throw new Error(message);
  }

  const rangeStart = new Date();
  rangeStart.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(rangeStart);
  rangeEnd.setDate(rangeEnd.getDate() + days);
  return parseCalendar(await response.text(), { rangeStart, rangeEnd });
};
