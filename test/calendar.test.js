import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCalendar } from '../src/providers/calendar.js';

const source = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Reflectrum Test//EN
BEGIN:VEVENT
UID:weekly@example.test
DTSTART:20260816T160000Z
DTEND:20260816T170000Z
RRULE:FREQ=DAILY;COUNT=3
SUMMARY:Mirror check
LOCATION:Workshop
END:VEVENT
BEGIN:VEVENT
UID:all-day@example.test
DTSTART;VALUE=DATE:20260817
DTEND;VALUE=DATE:20260818
SUMMARY:All-day reminder
END:VEVENT
END:VCALENDAR`;

test('parses and expands calendar events inside the requested range', () => {
  const events = parseCalendar(source, {
    rangeStart: new Date('2026-08-16T00:00:00Z'),
    rangeEnd: new Date('2026-08-19T00:00:00Z'),
  });

  assert.equal(events.length, 4);
  assert.equal(events[0].summary, 'Mirror check');
  assert.equal(events[0].location, 'Workshop');
  assert.equal(events.filter((event) => event.summary === 'Mirror check').length, 3);
  assert.equal(events.find((event) => event.summary === 'All-day reminder').allDay, true);
});

test('excludes events outside the requested range', () => {
  const events = parseCalendar(source, {
    rangeStart: new Date('2026-08-20T00:00:00Z'),
    rangeEnd: new Date('2026-08-21T00:00:00Z'),
  });
  assert.deepEqual(events, []);
});
