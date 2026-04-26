import api from './api';

/**
 * Fetch the 50 most recent notification log entries.
 *
 * @returns {Promise<{notifications: Array, count: number}>}
 */
export async function getNotifications() {
  return api.get('notification', '/notifications');
}

/**
 * Fetch all notification history for a specific student.
 *
 * @param {number} studentId
 * @returns {Promise<{notifications: Array}>}
 */
export async function getStudentNotifications(studentId) {
  return api.get('notification', `/notifications/student/${studentId}`);
}

/**
 * Fetch notification summary counts.
 *
 * @returns {Promise<{total: number, sent: number, failed: number}>}
 */
export async function getNotificationStats() {
  return api.get('notification', '/notifications/stats');
}
