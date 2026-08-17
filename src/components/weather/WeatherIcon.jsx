import React from 'react';
import './WeatherIcon.css';

const Cloud = () => (
  <path d="M27 68h47a16 16 0 0 0 1-32 25 25 0 0 0-47 8 12 12 0 0 0-1 24Z" />
);

const Sun = () => (
  <>
    <circle cx="50" cy="50" r="17" />
    <path d="M50 10v12M50 78v12M10 50h12M78 50h12M22 22l9 9M69 69l9 9M78 22l-9 9M31 69l-9 9" />
  </>
);

const Moon = () => <path d="M68 69A30 30 0 1 1 55 21a25 25 0 0 0 13 48Z" />;

const Rain = ({ light = false }) => (
  <>
    <Cloud />
    <path d={light ? 'M36 78l-4 8M54 78l-4 8M72 78l-4 8' : 'M34 77l-6 13M54 77l-6 13M74 77l-6 13'} />
  </>
);

const Snow = () => (
  <>
    <Cloud />
    <path d="M34 78v12M28 81l12 6M40 81l-12 6M62 78v12M56 81l12 6M68 81l-12 6" />
  </>
);

export const WeatherIcon = ({ icon, label, className = '' }) => {
  let art;
  switch (icon) {
    case 'clear-day': art = <Sun />; break;
    case 'clear-night': art = <Moon />; break;
    case 'partly-cloudy-day': art = <><g transform="translate(-18 -18) scale(.72)"><Sun /></g><Cloud /></>; break;
    case 'partly-cloudy-night': art = <><g transform="translate(-15 -17) scale(.72)"><Moon /></g><Cloud /></>; break;
    case 'fog': art = <><Cloud /><path d="M19 77h62M25 87h50" /></>; break;
    case 'drizzle': art = <Rain light />; break;
    case 'rain':
    case 'showers': art = <Rain />; break;
    case 'sleet': art = <><Cloud /><path d="M33 77l-5 12M53 78v12M47 81l12 6M59 81l-12 6M75 77l-5 12" /></>; break;
    case 'snow': art = <Snow />; break;
    case 'thunderstorm': art = <><Cloud /><path className="weather-icon-fill" d="M54 72 40 90h11l-4 10 18-23H54Z" /></>; break;
    case 'hail': art = <><Cloud /><path d="M43 79 36 86l7 7 7-7ZM68 79l-7 7 7 7 7-7Z" /></>; break;
    case 'cloudy':
    default: art = <Cloud />;
  }

  return (
    <svg
      className={`weather-icon ${className}`.trim()}
      viewBox="0 0 100 100"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {art}
    </svg>
  );
};

export default WeatherIcon;
