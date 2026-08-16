const readCoordinate = (location, names) => {
  for (const name of names) {
    const rawValue = location?.[name];
    if (rawValue === null || rawValue === undefined || rawValue === '') continue;
    const value = Number(rawValue);
    if (Number.isFinite(value)) return value;
  }
  return null;
};

export const normalizeLocation = (location) => {
  if (!location) return null;

  const lat = readCoordinate(location, ['lat', 'latitude']);
  const long = readCoordinate(location, ['long', 'lon', 'longitude']);
  if (lat === null || long === null || lat < -90 || lat > 90 || long < -180 || long > 180) {
    return null;
  }

  return {
    lat,
    long,
    name: location.name || location.label || 'Current location',
  };
};

const browserLocation = () => new Promise((resolve, reject) => {
  if (!navigator.geolocation) {
    reject(new Error('Browser geolocation is unavailable.'));
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => resolve({
      lat: coords.latitude,
      long: coords.longitude,
      name: 'Current location',
    }),
    () => reject(new Error('Set a location in reflectrum-config.js to show live weather.')),
    { enableHighAccuracy: false, timeout: 20000, maximumAge: 60 * 60 * 1000 },
  );
});

export const resolveLocation = async (configuredLocation) => (
  normalizeLocation(configuredLocation) || browserLocation()
);
