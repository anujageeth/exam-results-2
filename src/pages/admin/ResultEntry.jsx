import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { getStudents, uploadResults, getSagaStatus } from '../../services/adminService';
import {
  Upload, CheckCircle2, Loader2, AlertCircle,
  RefreshCw, Plus, Trash2,
} from 'lucide-react';

const sagaStatusConfig = {
  STARTED:      { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Started' },
  IN_PROGRESS:  { color: 'text-amber-600', bg: 'bg-amber-50', label: 'In Progress' },
  COMPLETED:    { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Completed' },
  FAILED:       { color: 'text-red-600', bg: 'bg-red-50', label: 'Failed' },
  COMPENSATING: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Compensating' },
  COMPENSATED:  { color: 'text-red-600', bg: 'bg-red-50', label: 'Compensated (Rolled Back)' },
};

const HARD_CODED_EXAMS = [
  { id: 7208, name: 'EC7208 Cloud Computing' },
  { id: 5382, name: 'Machine Learning' },
  { id: 6205, name: 'Distributed Systems' },
  { id: 5110, name: 'Advanced Database Systems' },
];

function calculateGrade(rawScore) {
  const score = Number(rawScore);
  if (!Number.isFinite(score)) return '';
  if (score < 0 || score > 100) return '';

  if (score < 35) return 'E';
  if (score < 40) return 'C-';
  if (score < 45) return 'C';
  if (score < 50) return 'C+';
  if (score < 55) return 'B-';
  if (score < 60) return 'B';
  if (score < 65) return 'B+';
  if (score < 70) return 'A-';
  if (score < 80) return 'A';
  return 'A+';
}

function createEmptyEntry() {
  return { studentId: '', score: '', grade: '' };
}

const ResultEntry = () => {
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState(null);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [entries, setEntries] = useState([createEmptyEntry()]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [sagaPolling, setSagaPolling] = useState(false);
  const [sagaState, setSagaState] = useState(null);
  const [formError, setFormError] = useState(null);

  // Fetch students from DB on mount
  useEffect(() => {
    async function fetchStudents() {
      try {
        setStudentsLoading(true);
        setStudentsError(null);
        const data = await getStudents();
        setStudents(data.students || []);
      } catch (err) {
        setStudentsError(err.message);
      } finally {
        setStudentsLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const examOptions = HARD_CODED_EXAMS.map(e => ({ value: String(e.id), label: `${e.name} (ID: ${e.id})` }));
  const studentOptions = useMemo(
    () => students.map(s => ({ value: String(s.id), label: `${s.name || 'Unnamed'} (${s.email})` })),
    [students]
  );

  const updateEntry = (index, patch) => {
    setEntries(prev => {
      const next = [...prev];
      const merged = { ...next[index], ...patch };
      if (Object.prototype.hasOwnProperty.call(patch, 'score')) {
        merged.grade = calculateGrade(patch.score);
      }
      next[index] = merged;
      return next;
    });
    setUploadResult(null);
    setUploadError(null);
    setSagaState(null);
    setFormError(null);
  };

  const addEntryRow = () => {
    setEntries(prev => [...prev, createEmptyEntry()]);
  };

  const removeEntryRow = (index) => {
    setEntries(prev => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const validateForm = () => {
    if (!selectedExam) return 'Please select an exam.';
    if (!selectedDate) return 'Please select an exam date.';

    for (let i = 0; i < entries.length; i += 1) {
      const row = entries[i];
      if (!row.studentId) return `Row ${i + 1}: please select a student.`;
      if (row.score === '' || row.score === null) return `Row ${i + 1}: please enter a score.`;

      const scoreNum = Number(row.score);
      if (!Number.isFinite(scoreNum) || scoreNum < 0 || scoreNum > 100) {
        return `Row ${i + 1}: score must be between 0 and 100.`;
      }
      if (!row.grade) return `Row ${i + 1}: invalid score for grade calculation.`;
    }

    const studentIds = entries.map(r => r.studentId);
    if (new Set(studentIds).size !== studentIds.length) {
      return 'Each student can appear only once in a bulk submission.';
    }

    return null;
  };

  const buildCsvFile = () => {
    const exam = HARD_CODED_EXAMS.find(e => String(e.id) === selectedExam);
    const lines = [
      'student_id,exam_id,score,grade,exam_name,exam_date',
      ...entries.map(row => [
        Number(row.studentId),
        Number(selectedExam),
        Number(row.score),
        row.grade,
        `"${(exam?.name || '').replace(/"/g, '""')}"`,
        selectedDate,
      ].join(',')),
    ];

    const csv = `${lines.join('\n')}\n`;
    const fileName = `results_${selectedExam}_${selectedDate}.csv`;
    return new File([csv], fileName, { type: 'text/csv' });
  };

  const handleUpload = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);
      setUploadResult(null);
      setSagaState(null);
      setFormError(null);

      const csvFile = buildCsvFile();
      const result = await uploadResults(csvFile);
      setUploadResult(result);

      // Start polling SAGA status if we got a sagaId
      if (result.sagaId) {
        pollSagaStatus(result.sagaId);
      }
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const pollSagaStatus = async (sagaId) => {
    setSagaPolling(true);
    try {
      const saga = await getSagaStatus(sagaId);
      setSagaState(saga);

      // Continue polling if not in a terminal state
      if (saga.status === 'STARTED' || saga.status === 'IN_PROGRESS' || saga.status === 'COMPENSATING') {
        setTimeout(() => pollSagaStatus(sagaId), 2000);
      } else {
        setSagaPolling(false);
      }
    } catch (err) {
      console.error('SAGA polling error:', err.message);
      setSagaPolling(false);
    }
  };

  const resetUpload = () => {
    setSelectedExam('');
    setSelectedDate(new Date().toISOString().slice(0, 10));
    setEntries([createEmptyEntry()]);
    setUploadResult(null);
    setUploadError(null);
    setSagaState(null);
    setFormError(null);
  };

  return (
    <div className="page-container page-transition">
      <div className="mb-8">
        <h1 className="section-title">Bulk Result Entry</h1>
        <p className="section-subtitle">Create multiple result records and publish them in one backend-compatible bulk request</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Exam"
              options={examOptions}
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              placeholder="Select exam..."
            />
            <Input
              type="date"
              label="Exam Date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-ceylon-maroon" />
            Student Result Rows
          </CardTitle>
          <CardDescription>
            Each row uses student from database, score input, and frontend auto-grade calculation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {entries.map((row, idx) => (
              <div key={`entry-${idx}`} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-lg border border-gray-200">
                <div className="md:col-span-6">
                  <Select
                    label={`Student #${idx + 1}`}
                    options={studentOptions}
                    value={row.studentId}
                    onChange={(e) => updateEntry(idx, { studentId: e.target.value })}
                    placeholder={studentsLoading ? 'Loading students...' : 'Select student...'}
                    disabled={studentsLoading || !!studentsError}
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    label="Score"
                    value={row.score}
                    onChange={(e) => updateEntry(idx, { score: e.target.value })}
                    placeholder="0 - 100"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Grade"
                    value={row.grade}
                    readOnly
                    placeholder="Auto"
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEntryRow(idx)}
                    disabled={entries.length === 1}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <Button type="button" variant="outline" onClick={addEntryRow} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Row
            </Button>
            <Button type="button" onClick={handleUpload} disabled={uploading || studentsLoading} className="gap-1.5">
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" /> Publish Bulk Results
                </>
              )}
            </Button>
            <Button type="button" variant="ghost" onClick={resetUpload}>Reset</Button>
          </div>

          {studentsError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl mb-4 text-sm text-red-600">
              Failed to load students: {studentsError}
            </div>
          )}

          {formError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4 text-sm text-amber-700">
              {formError}
            </div>
          )}

          {uploadError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-4 animate-slide-up">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700">Upload Failed</p>
                  <p className="text-sm text-red-600 mt-1">{uploadError}</p>
                  <Button type="button" variant="ghost" size="sm" onClick={resetUpload} className="mt-2 text-red-600">
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}

          {uploadResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 animate-slide-up">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-700">{uploadResult.message}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                    <div className="text-center p-2 bg-white rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{uploadResult.rowsProcessed}</p>
                      <p className="text-xs text-gray-500">Rows Processed</p>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg">
                      <p className="text-lg font-bold text-gray-900">
                        {uploadResult.studentsAffected?.length || 0}
                      </p>
                      <p className="text-xs text-gray-500">Students Affected</p>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg">
                      <p className="text-lg font-bold text-gray-900">
                        {uploadResult.cacheKeysInvalidated?.length || 0}
                      </p>
                      <p className="text-xs text-gray-500">Cache Keys Cleared</p>
                    </div>
                    <div className="text-center p-2 bg-white rounded-lg">
                      <p className="text-lg font-bold text-ceylon-maroon">{uploadResult.status}</p>
                      <p className="text-xs text-gray-500">SAGA Status</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">SAGA ID: {uploadResult.sagaId}</p>
                </div>
              </div>
            </div>
          )}

          {sagaState && (
            <div className={`p-4 rounded-xl mb-4 animate-slide-up ${sagaStatusConfig[sagaState.status]?.bg || 'bg-gray-50'}`}>
              <div className="flex items-center gap-3 mb-2">
                {sagaPolling ? (
                  <Loader2 className="h-4 w-4 animate-spin text-ceylon-maroon" />
                ) : (
                  <CheckCircle2 className={`h-4 w-4 ${sagaStatusConfig[sagaState.status]?.color || 'text-gray-500'}`} />
                )}
                <p className={`text-sm font-medium ${sagaStatusConfig[sagaState.status]?.color || 'text-gray-700'}`}>
                  SAGA: {sagaStatusConfig[sagaState.status]?.label || sagaState.status}
                </p>
                {sagaPolling && (
                  <span className="text-xs text-gray-400">Polling...</span>
                )}
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Step: {sagaState.step || 0}</p>
                <p>Type: {sagaState.type || 'PUBLISH_RESULTS'}</p>
                <p>Updated: {sagaState.updated_at ? new Date(sagaState.updated_at).toLocaleString() : ''}</p>
              </div>
            </div>
          )}

          {(uploadResult || uploadError) && (
            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={resetUpload} className="gap-1.5">
                <RefreshCw className="h-4 w-4" /> Upload Another File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultEntry;
