import api from './api';

/**
 * Fetch all published results for a student.
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
 * @param {number} examId
 * @returns {Promise<{results: Array}>}
 */
export async function getExamResults(examId) {
  return api.get('result', `/results/exam/${examId}`);
}
