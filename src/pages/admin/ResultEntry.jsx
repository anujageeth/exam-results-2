import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { DropZone } from '../../components/ui/dropzone';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { getExams, uploadResults, getSagaStatus } from '../../services/adminService';
import {
  Upload, CheckCircle2, FileSpreadsheet, Loader2, AlertCircle, AlertTriangle,
  Clock, RefreshCw,
} from 'lucide-react';

const sagaStatusConfig = {
  STARTED:      { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Started' },
  IN_PROGRESS:  { color: 'text-amber-600', bg: 'bg-amber-50', label: 'In Progress' },
  COMPLETED:    { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Completed' },
  FAILED:       { color: 'text-red-600', bg: 'bg-red-50', label: 'Failed' },
  COMPENSATING: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Compensating' },
  COMPENSATED:  { color: 'text-red-600', bg: 'bg-red-50', label: 'Compensated (Rolled Back)' },
};

const ResultEntry = () => {
  const [exams, setExams] = useState([]);
  const [examsLoading, setExamsLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [sagaPolling, setSagaPolling] = useState(false);
  const [sagaState, setSagaState] = useState(null);

  // Fetch exams on mount
  useEffect(() => {
    async function fetchExams() {
      try {
        setExamsLoading(true);
        const data = await getExams();
        setExams(data.exams || []);
      } catch (err) {
        console.error('Failed to fetch exams:', err.message);
      } finally {
        setExamsLoading(false);
      }
    }
    fetchExams();
  }, []);

  const examOptions = exams.map(e => ({ value: String(e.id), label: `${e.name} (ID: ${e.id})` }));

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setUploadResult(null);
    setUploadError(null);
    setSagaState(null);
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    try {
      setUploading(true);
      setUploadError(null);
      setUploadResult(null);
      setSagaState(null);

      const result = await uploadResults(uploadedFile);
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
    setUploadedFile(null);
    setUploadResult(null);
    setUploadError(null);
    setSagaState(null);
  };

  return (
    <div className="page-container page-transition">
      <div className="mb-8">
        <h1 className="section-title">Result Entry & Upload</h1>
        <p className="section-subtitle">Upload CSV files to bulk publish student grades via the SAGA pipeline</p>
      </div>

      {/* Exam Selection */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <Select
            label="Exam (optional context — CSV must contain exam_id column)"
            options={examOptions}
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            placeholder={examsLoading ? 'Loading exams...' : 'Select an exam for reference...'}
          />
        </CardContent>
      </Card>

      {/* CSV Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-ceylon-maroon" />
            Bulk Upload via CSV
          </CardTitle>
          <CardDescription>
            Upload a CSV file with columns: <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">student_id, exam_id, score, grade</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DropZone onFileDrop={handleFileUpload} className="mb-6" />

          {uploadedFile && !uploadResult && !uploadError && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-ceylon-maroon" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-400">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={resetUpload}>Cancel</Button>
                <Button onClick={handleUpload} disabled={uploading} className="gap-1.5">
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" /> Upload & Publish
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Upload Error */}
          {uploadError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-4 animate-slide-up">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700">Upload Failed</p>
                  <p className="text-sm text-red-600 mt-1">{uploadError}</p>
                  <Button variant="ghost" size="sm" onClick={resetUpload} className="mt-2 text-red-600">
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Upload Success */}
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

          {/* SAGA Status Polling */}
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

          {/* Reset button after completion */}
          {(uploadResult || uploadError) && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={resetUpload} className="gap-1.5">
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
