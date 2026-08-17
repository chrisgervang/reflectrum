export const getDisplayPower = async ({ signal } = {}) => {
  const response = await fetch('/api/display', {
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!response.ok) throw new Error(`Display service returned HTTP ${response.status}.`);
  return response.json();
};

export const setDisplayPower = async (power, { signal } = {}) => {
  if (power !== 'on' && power !== 'off') throw new Error('Invalid display power state.');
  const response = await fetch('/api/display', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ power }),
    signal,
  });
  if (!response.ok) throw new Error(`Display service returned HTTP ${response.status}.`);
  return response.json();
};
