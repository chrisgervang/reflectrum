const readJson = async (response) => {
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error('Linear integration is unavailable.');
  }
  if (!response.ok) throw new Error(payload.error || `Linear service returned HTTP ${response.status}.`);
  return payload;
};

export const fetchAssignedIssues = async ({ signal } = {}) => {
  const response = await fetch('/api/linear/issues', {
    headers: { Accept: 'application/json' },
    signal,
  });
  return readJson(response);
};

export const completeAssignedIssue = async (id, { signal } = {}) => {
  if (!id) throw new Error('A Linear issue ID is required.');
  const response = await fetch('/api/linear/issues/complete', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
    signal,
  });
  return readJson(response);
};
