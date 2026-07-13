const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

async function request(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // non-JSON error body — keep the generic status message
    }
    throw new Error(message);
  }

  return res.json();
}

export function register({ email, name, password }) {
  return request('/api/auth/register', { email, name, password });
}

export function login({ email, password }) {
  return request('/api/auth/login', { email, password });
}

export function googleAuth(idToken) {
  return request('/api/auth/google', { idToken });
}

export function authFetch(path, options = {}) {
  const token = localStorage.getItem('kosmos_token');
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

async function authRequest(path, method, body) {
  const res = await authFetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // non-JSON error body — keep the generic status message
    }
    throw new Error(message);
  }

  return res.status === 204 ? null : res.json();
}

export function listUsers() {
  return authRequest('/api/users', 'GET');
}

export function listCompanies() {
  return authRequest('/api/companies', 'GET');
}

export function listCompanyAssignments() {
  return authRequest('/api/companies/assignments', 'GET');
}

export function assignCompanies(userId, companyIds) {
  return authRequest(`/api/companies/assignments/${userId}`, 'PUT', { companyIds });
}

export function listAgendaEvents(from, to) {
  const params = new URLSearchParams({ from, to });
  return authRequest(`/api/agenda-events?${params}`, 'GET');
}

export function createAgendaEvent(event) {
  return authRequest('/api/agenda-events', 'POST', event);
}

export function updateAgendaEvent(id, event) {
  return authRequest(`/api/agenda-events/${id}`, 'PUT', event);
}

export function deleteAgendaEvent(id) {
  return authRequest(`/api/agenda-events/${id}`, 'DELETE');
}

export async function getAgendaFeedUrl() {
  const { feedPath } = await authRequest('/api/users/me/agenda-feed', 'GET');
  return `${API_URL}${feedPath}`;
}

export function listExternalCalendars() {
  return authRequest('/api/external-calendars', 'GET');
}

export function addExternalCalendar({ label, sourceUrl }) {
  return authRequest('/api/external-calendars', 'POST', { label, sourceUrl });
}

export function deleteExternalCalendar(id) {
  return authRequest(`/api/external-calendars/${id}`, 'DELETE');
}

export function listExternalEvents(from, to) {
  const params = new URLSearchParams({ from, to });
  return authRequest(`/api/external-calendars/events?${params}`, 'GET');
}

const COLUMN_TO_API = { backlog: 'BACKLOG', todo: 'TODO', progress: 'PROGRESS', review: 'REVIEW', done: 'DONE' };
const COLUMN_FROM_API = Object.fromEntries(Object.entries(COLUMN_TO_API).map(([k, v]) => [v, k]));
const TYPE_TO_API = { story: 'STORY', task: 'TASK', bug: 'BUG' };
const TYPE_FROM_API = Object.fromEntries(Object.entries(TYPE_TO_API).map(([k, v]) => [v, k]));
const PRIORITY_TO_API = { low: 'LOW', medium: 'MEDIUM', high: 'HIGH', critical: 'CRITICAL' };
const PRIORITY_FROM_API = Object.fromEntries(Object.entries(PRIORITY_TO_API).map(([k, v]) => [v, k]));

function taskFromApi(t) {
  return {
    id: t.id,
    title: t.title,
    description: t.description || '',
    type: TYPE_FROM_API[t.type],
    priority: PRIORITY_FROM_API[t.priority],
    assignee: t.assignee,
    column: COLUMN_FROM_API[t.column],
    points: String(t.points),
    label: t.label,
    resolutionDays: t.resolutionDays,
    createdAt: t.createdAt,
  };
}

function taskToApiRequest(t) {
  return {
    title: t.title,
    description: t.description || '',
    type: TYPE_TO_API[t.type],
    priority: PRIORITY_TO_API[t.priority],
    assignee: t.assignee,
    column: COLUMN_TO_API[t.column],
    points: parseInt(t.points, 10) || 0,
    label: t.label,
  };
}

export function listTasks() {
  return authRequest('/api/tasks', 'GET').then((data) => data.map(taskFromApi));
}

export function createTask(task) {
  return authRequest('/api/tasks', 'POST', taskToApiRequest(task)).then(taskFromApi);
}

export function updateTask(id, task) {
  return authRequest(`/api/tasks/${id}`, 'PUT', taskToApiRequest(task)).then(taskFromApi);
}

export function deleteTask(id) {
  return authRequest(`/api/tasks/${id}`, 'DELETE');
}

export function moveTask(id, { targetColumn, targetAssignee, targetPosition }) {
  return authRequest(`/api/tasks/${id}/move`, 'PUT', {
    targetColumn: COLUMN_TO_API[targetColumn],
    targetAssignee,
    targetPosition,
  }).then(taskFromApi);
}
