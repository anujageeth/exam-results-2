/**
 * resultService.js — Result Service API
 *
 * Backend: result-service on port 4002
 *
 * Endpoints:
 *   GET /results/:studentId       — student's published results (any role, own results only for students)
 *   GET /results/exam/:examId     — all results for an exam (admin only)
 */

import api from './api';

/**
 * Fetch all published results for a student.
 *
 * Backend response format:
 * {
 *   source: 'cache' | 'database',
 *   results: [
 *     { id, student_id, exam_name, exam_date, score, grade, published_at }
 *   ]
 * }
 *
 * @param {number} studentId
 * @returns {Promise<{source: string, results: Array}>}
 */
export async function getStudentResults(studentId) {
  return api.get('result', `/results/${studentId}`);
}

/**
 * Fetch all results for a specific exam (admin only).
 *
 * Backend response format:
 * {
 *   results: [
 *     { id, student_id, exam_id, score, grade, published_at, exam_name }
 *   ]
 * }
 *
 * @param {number} examId
 * @returns {Promise<{results: Array}>}
 */
export async function getExamResults(examId) {
  return api.get('result', `/results/exam/${examId}`);
}
