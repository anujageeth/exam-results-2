/**
 * authService.js — Authentication helpers
 *
 * Handles Google OAuth flow, JWT token storage, and user extraction.
 * The backend uses Google OAuth 2.0 — there is no username/password login.
 *
 * Flow:
 *   1. Frontend redirects user to backend's /auth/google
 *   2. Backend redirects to Google → user logs in
 *   3. Google redirects back to backend's /auth/google/callback
 *   4. Backend issues JWT, redirects to frontend /auth/callback?token=<JWT>
 *   5. Frontend stores JWT in localStorage, decodes user info from payload
 */

import api, { API_BASE } from './api';

// ── Google OAuth ──────────────────────────────────────────────────────────

/**
 * Returns the URL to initiate Google OAuth login.
 * The frontend navigates here to start the authentication flow.
 */
export function getGoogleAuthUrl() {
  return `${API_BASE.auth}/auth/google`;
}

/**
 * Redirects the browser to Google OAuth login.
 */
export function redirectToGoogleAuth() {
  window.location.href = getGoogleAuthUrl();
}

// ── Token Management ──────────────────────────────────────────────────────

/**
 * Store the JWT token and decoded user in localStorage.
 */
export function setAuthData(token) {
  localStorage.setItem('token', token);
  const user = decodeTokenPayload(token);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

/**
 * Get the stored JWT token.
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Get the stored user object (decoded from JWT).
 * Returns { user_id, email, role } or null.
 */
export function getStoredUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Clear all auth data (logout).
 */
export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Check if the user is authenticated (has a non-expired token).
 */
export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;

  const payload = decodeTokenPayload(token);
  if (!payload || !payload.exp) return false;

  // Check if token is expired
  return payload.exp * 1000 > Date.now();
}

// ── Token Verification ────────────────────────────────────────────────────

/**
 * Verify the current token against the auth service.
 * Returns { valid: true, payload } or throws on invalid.
 */
export async function verifyToken() {
  return api.get('auth', '/auth/verify');
}

// ── Helpers ───────────────────────────────────────────────────────────────

/**
 * Decode a JWT payload without verification (client-side only).
 * JWTs are base64url-encoded: header.payload.signature
 * We only need the payload to read user_id, email, role.
 */
function decodeTokenPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    // base64url → base64 → decode
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}
