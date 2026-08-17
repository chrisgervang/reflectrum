const responseJson = async (response) => {
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error('Home Assistant integration is unavailable.');
  }
  if (!response.ok) throw new Error(payload.error || `Home service returned HTTP ${response.status}.`);
  return payload;
};

export const fetchHomeEntities = async ({ signal } = {}) => {
  const response = await fetch('/api/home/states', {
    headers: { Accept: 'application/json' },
    signal,
  });
  return responseJson(response);
};

export const fetchHomeHistory = async (entities, { hours = 24, signal } = {}) => {
  if (!Array.isArray(entities) || entities.length === 0) return { series: [], hours };
  const query = new URLSearchParams({ entities: entities.join(','), hours: String(hours) });
  const response = await fetch(`/api/home/history?${query}`, {
    headers: { Accept: 'application/json' },
    signal,
  });
  return responseJson(response);
};

export const groupHomeEntities = (entities) => {
  const networkPattern = /(unifi|network|internet|wan|wifi|wlan|throughput|download|upload)/i;
  const domain = (entity) => entity.entityId?.split('.')[0];
  return {
    locks: entities.filter((entity) => domain(entity) === 'lock'),
    lights: entities.filter((entity) => domain(entity) === 'light'),
    sensors: entities.filter((entity) => ['sensor', 'binary_sensor'].includes(domain(entity))
      && !networkPattern.test(`${entity.entityId} ${entity.name}`)),
    network: entities.filter((entity) => networkPattern.test(`${entity.entityId} ${entity.name}`)),
  };
};
