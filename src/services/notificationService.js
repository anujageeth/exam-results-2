/**
 * notificationService.js — Notification Service API
 *
 * Backend: notification-service on port 4004
 *
 * Endpoints:
 *   GET /notifications                      — 50 most recent notification logs
 *   GET /notifications/student/:studentId   — notification history for one student
 *   GET /notifications/stats                — summary counts (total, sent, failed)
 */

import api from './api';

/**
 * Fetch the 50 most recent notification log entries.
 *
 * Backend response:
 * {
 *   notifications: [
 *     { _id, student_id, email, exam_id, score, grade, channel, status, error, sent_at }
 *   ],
 *   count: number
 * }
 *
 * @returns {Promise<{notifications: Array, count: number}>}
 */
export async function getNotifications() {
  return api.get('notification', '/notifications');
}

/**
 * Fetch all notification history for a specific student.
 *
 * Backend response:
 * {
 *   notifications: [
 *     { _id, student_id, email, exam_id, score, grade, channel, status, error, sent_at }
 *   ]
 * }
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
 * Backend response: { total: number, sent: number, failed: number }
 *
 * @returns {Promise<{total: number, sent: number, failed: number}>}
 */
export async function getNotificationStats() {
  return api.get('notification', '/notifications/stats');
}
