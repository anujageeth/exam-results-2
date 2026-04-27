/**
 * adminService.js — Admin Service API
 *
 * Backend: admin-service on port 4003
 *
 * Endpoints:
 *   GET  /admin/exams             — list all exams
 *   POST /admin/upload            — upload CSV results (multipart, triggers SAGA)
 *   GET  /admin/results           — list all results
 *   GET  /admin/saga/:sagaId      — poll a specific SAGA run
 *   GET  /admin/sagas             — list 20 most recent SAGA runs
 *   GET  /auth/students           — list all students (via auth-service, admin only)
 */

import api from './api';

/**
 * Fetch all exams.
 *
 * Backend response: { exams: [{ id, name, exam_date, ... }] }
 *
 * @returns {Promise<{exams: Array}>}
 */
export async function getExams() {
  return api.get('admin', '/admin/exams');
}

/**
 * Upload a CSV file to publish results.
 * The CSV must have columns: student_id, exam_id, score, grade
 *
 * Backend response:
 * {
 *   message, sagaId, status,
 *   rowsProcessed, studentsAffected, cacheKeysInvalidated
 * }
 *
 * @param {File} file — the CSV file object
 * @returns {Promise<object>}
 */
export async function uploadResults(file) {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('admin', '/admin/upload', formData);
}

/**
 * Fetch all results in the system (admin monitoring).
 *
 * Backend response:
 * {
 *   results: [{ id, student_id, exam_id, score, grade, published_at, exam_name }],
 *   count: number
 * }
 *
 * @returns {Promise<{results: Array, count: number}>}
 */
export async function getAllResults() {
  return api.get('admin', '/admin/results');
}

/**
 * Get the status of a specific SAGA run.
 *
 * Backend response:
 * { saga_id, type, step, status, payload, created_at, updated_at }
 *
 * Status values: STARTED, IN_PROGRESS, COMPLETED, FAILED, COMPENSATING, COMPENSATED
 *
 * @param {string} sagaId
 * @returns {Promise<object>}
 */
export async function getSagaStatus(sagaId) {
  return api.get('admin', `/admin/saga/${sagaId}`);
}

/**
 * Fetch the 20 most recent SAGA runs.
 *
 * Backend response:
 * {
 *   sagas: [{ saga_id, type, step, status, created_at, updated_at }],
 *   count: number
 * }
 *
 * @returns {Promise<{sagas: Array, count: number}>}
 */
export async function getRecentSagas() {
  return api.get('admin', '/admin/sagas');
}

/**
 * Fetch students from auth-service for result entry.
 *
 * Backend response:
 * {
 *   students: [{ id, name, email, role }],
 *   count: number
 * }
 *
 * @returns {Promise<{students: Array, count: number}>}
 */
export async function getStudents() {
  return api.get('auth', '/auth/students');
}
