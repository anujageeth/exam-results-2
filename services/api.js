const API_BASE = {
  auth:         'http://localhost:4001',
  result:       'http://localhost:4002',
  admin:        'http://localhost:4003',
  notification: 'http://localhost:4004',
};

/**
 * Generic fetch wrapper.
 * @param {'auth'|'result'|'admin'|'notification'} service  — which microservice
 * @param {string} path      — e.g. '/results/5'
 * @param {object} options   — fetch options (method, body, headers, etc.)
 * @returns {Promise<any>}   — parsed JSON response
 */
async function request(service, path, options = {}) {
  const url = `${API_BASE[service]}${path}`;

  const token = localStorage.getItem('token');

  const headers = {
    ...(options.headers || {}),
  };

  // Don't set Content-Type for FormData (browser sets boundary automatically)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If token is expired / invalid, redirect to login
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  // Parse JSON (some responses may not have a body)
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

// Convenience methods
const api = {
  get:  (service, path) => request(service, path, { method: 'GET' }),
  post: (service, path, body) => {
    const options = { method: 'POST' };
    if (body instanceof FormData) {
      options.body = body;
    } else {
      options.body = JSON.stringify(body);
    }
    return request(service, path, options);
  },
  put:    (service, path, body) => request(service, path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (service, path) => request(service, path, { method: 'DELETE' }),
};

export default api;
export { API_BASE };
