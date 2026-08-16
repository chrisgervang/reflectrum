const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const weatherCode = (code, isDay = true) => {
  if (code === 0) return { summary: 'Clear', icon: isDay ? 'clear-day' : 'clear-night' };
  if (code === 1 || code === 2) return { summary: 'Partly cloudy', icon: isDay ? 'partly-cloudy-day' : 'partly-cloudy-night' };
  if (code === 3) return { summary: 'Cloudy', icon: 'cloudy' };
  if (code === 45 || code === 48) return { summary: 'Foggy', icon: 'fog' };
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { summary: 'Rain', icon: 'rain' };
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return { summary: 'Snow', icon: 'snow' };
  if (code >= 95) return { summary: 'Thunderstorms', icon: 'rain' };
  return { summary: 'Conditions unavailable', icon: 'cloudy' };
};

const temperature = (value) => Number.isFinite(value) ? `${Math.round(value)}º` : '—';
const percentage = (value) => Number.isFinite(value) ? `${Math.round(value)}%` : '—';
const numberWithUnit = (value, unit, digits = 0) => Number.isFinite(value)
  ? `${value.toFixed(digits)} ${unit}`
  : '—';

const timeLabel = (value) => new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).format(new Date(value));
const dayLabel = (value) => new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(new Date(`${value}T12:00`));

export const buildWeatherUrl = ({ lat, long }) => {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(long),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,is_day',
    hourly: 'temperature_2m,precipitation_probability,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch',
    timezone: 'auto',
    forecast_days: '2',
  });

  return `${FORECAST_URL}?${params}`;
};

export const normalizeWeather = (payload, location) => {
  if (!payload?.current || !payload?.hourly || !payload?.daily) {
    throw new Error('Weather provider returned an incomplete forecast.');
  }

  const currentCondition = weatherCode(payload.current.weather_code, payload.current.is_day === 1);
  const firstFutureHour = Math.max(0, payload.hourly.time.findIndex((time) => time >= payload.current.time));
  const hours = payload.hourly.time.slice(firstFutureHour, firstFutureHour + 5).map((time, offset) => {
    const index = firstFutureHour + offset;
    return {
      time: offset === 0 ? 'Now' : timeLabel(time),
      temperature: temperature(payload.hourly.temperature_2m[index]),
      precipitationChance: percentage(payload.hourly.precipitation_probability[index]),
      ...weatherCode(payload.hourly.weather_code[index]),
    };
  });

  return {
    location: location.name,
    updatedAt: payload.current.time,
    current: {
      ...currentCondition,
      temperature: temperature(payload.current.temperature_2m),
      feelsLike: temperature(payload.current.apparent_temperature),
      humidity: percentage(payload.current.relative_humidity_2m),
      wind: numberWithUnit(payload.current.wind_speed_10m, 'mph'),
      precipitation: numberWithUnit(payload.current.precipitation, 'in', 2),
    },
    today: {
      day: dayLabel(payload.daily.time[0]),
      high: temperature(payload.daily.temperature_2m_max[0]),
      low: temperature(payload.daily.temperature_2m_min[0]),
      sunrise: timeLabel(payload.daily.sunrise[0]),
      sunset: timeLabel(payload.daily.sunset[0]),
      precipitationChance: percentage(payload.daily.precipitation_probability_max[0]),
    },
    hours,
  };
};

export const fetchWeather = async (location, { signal } = {}) => {
  const response = await fetch(buildWeatherUrl(location), { signal });
  if (!response.ok) {
    throw new Error(`Weather provider returned HTTP ${response.status}.`);
  }
  return normalizeWeather(await response.json(), location);
};
