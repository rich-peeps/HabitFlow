const API_BASE_URL = 'http://localhost:5555';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

export const signup = (body) =>
  apiRequest('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) });

export const login = (body) =>
  apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(body) });

export const getMe = () => apiRequest('/api/auth/me');

export const getHabits = () => apiRequest('/api/habits');
export const createHabit = (body) =>
  apiRequest('/api/habits', { method: 'POST', body: JSON.stringify(body) });

export const getToday = () => apiRequest('/api/today');

export const updateHabit = (id, body) =>
  apiRequest(`/api/habits/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

export const deleteHabit = (id) =>
  apiRequest(`/api/habits/${id}`, {
    method: 'DELETE',
  });

  export const createHabitEntry = (habitId, body) =>
  apiRequest(`/api/habits/${habitId}/entries`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const updateHabitEntry = (entryId, body) =>
  apiRequest(`/api/entries/${entryId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });