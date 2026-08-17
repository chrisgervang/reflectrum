const allowedActions = new Set(['reboot', 'shutdown']);

export const requestSystemPower = async (action, { signal } = {}) => {
  if (!allowedActions.has(action)) throw new Error('Invalid system power action.');
  const response = await fetch('/api/system/power', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action }),
    keepalive: true,
    signal,
  });
  if (!response.ok) throw new Error(`System power service returned HTTP ${response.status}.`);
  return response.json();
};
