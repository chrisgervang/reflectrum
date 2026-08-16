import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeLocation } from '../src/providers/location.js';
import { buildWeatherUrl, normalizeWeather } from '../src/providers/weather.js';

test('normalizes configured coordinates without exposing them in source', () => {
  assert.deepEqual(
    normalizeLocation({ latitude: '35.1', longitude: '-118.9', label: 'Home' }),
    { lat: 35.1, long: -118.9, name: 'Home' },
  );
  assert.equal(normalizeLocation({ lat: 120, long: 10 }), null);
});

test('builds a keyless Open-Meteo request', () => {
  const url = new URL(buildWeatherUrl({ lat: 35.1, long: -118.9 }));
  assert.equal(url.hostname, 'api.open-meteo.com');
  assert.equal(url.searchParams.get('temperature_unit'), 'fahrenheit');
  assert.equal(url.searchParams.has('apikey'), false);
});

test('normalizes current, hourly, and daily weather', () => {
  const result = normalizeWeather({
    current: {
      time: '2026-08-16T12:00',
      temperature_2m: 81.4,
      relative_humidity_2m: 35,
      apparent_temperature: 80.6,
      precipitation: 0,
      weather_code: 1,
      wind_speed_10m: 8.2,
      is_day: 1,
    },
    hourly: {
      time: ['2026-08-16T11:00', '2026-08-16T12:00', '2026-08-16T13:00'],
      temperature_2m: [79, 81, 83],
      precipitation_probability: [0, 5, 10],
      weather_code: [0, 1, 2],
    },
    daily: {
      time: ['2026-08-16'],
      weather_code: [1],
      temperature_2m_max: [90],
      temperature_2m_min: [65],
      sunrise: ['2026-08-16T06:15'],
      sunset: ['2026-08-16T19:40'],
      precipitation_probability_max: [10],
    },
  }, { lat: 35.1, long: -118.9, name: 'Home' });

  assert.equal(result.location, 'Home');
  assert.equal(result.current.summary, 'Partly cloudy');
  assert.equal(result.current.temperature, '81º');
  assert.equal(result.hours[0].time, 'Now');
  assert.equal(result.hours[0].temperature, '81º');
  assert.equal(result.today.high, '90º');
});
