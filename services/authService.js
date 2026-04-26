import api, { API_BASE } from './api';

export function getGoogleAuthUrl() {
  return `${API_BASE.auth}/auth/google`;
}

export function redirectToGoogleAuth() {
  window.location.href = getGoogleAuthUrl();
}

export function setAuthData(token) {
  localStorage.setItem('token', token);
  const user = decodeTokenPayload(token);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getStoredUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;

  const payload = decodeTokenPayload(token);
  if (!payload || !payload.exp) return false;

  // Check if token is expired
  return payload.exp * 1000 > Date.now();
}

export async function verifyToken() {
  return api.get('auth', '/auth/verify');
}

function decodeTokenPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}
