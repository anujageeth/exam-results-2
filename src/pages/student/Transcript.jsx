import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { getStoredUser } from '../../services/authService';
import { getStudentResults } from '../../services/resultService';
import { Download, Search, Printer, Filter, Loader2, AlertCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Transcript = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examFilter, setExamFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const user = getStoredUser();

  useEffect(() => {
    async function fetchResults() {
      if (!user?.user_id) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getStudentResults(user.user_id);
        setResults(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [user?.user_id]);

  // Dynamic filter options from API data
  const examOptions = useMemo(() =>
    [...new Set(results.map(r => r.exam_name).filter(Boolean))].map(name => ({ value: name, label: name })),
    [results]
  );

  const gradeOptions = useMemo(() =>
    [...new Set(results.map(r => r.grade).filter(Boolean))].sort().map(g => ({ value: g, label: g })),
    [results]
  );

  const filteredResults = useMemo(() => {
    return results.filter(r => {
      const matchExam = !examFilter || r.exam_name === examFilter;
      const matchGrade = !gradeFilter || r.grade === gradeFilter;
      const matchSearch = !searchTerm ||
        (r.exam_name && r.exam_name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchExam && matchGrade && matchSearch;
    });
  }, [results, examFilter, gradeFilter, searchTerm]);

  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    const parsedDate = new Date(dateValue);
    return Number.isNaN(parsedDate.getTime()) ? 'N/A' : parsedDate.toLocaleDateString();
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const generatedOn = new Date().toLocaleString();

    doc.setFontSize(16);
    doc.text('Academic Transcript', 40, 46);

    doc.setFontSize(10);
    doc.text(`Student: ${user?.email || 'N/A'}`, 40, 64);
    doc.text(`Student ID: ${user?.user_id || 'N/A'}`, 40, 78);
    doc.text(`Generated: ${generatedOn}`, 40, 92);

    autoTable(doc, {
      startY: 110,
      head: [['Exam Name', 'Exam Date', 'Score', 'Grade', 'Published Date']],
      body: filteredResults.map((result) => [
        result.exam_name || 'Unknown Exam',
        formatDate(result.exam_date),
        result.score ?? 'N/A',
        result.grade || 'N/A',
        formatDate(result.published_at),
      ]),
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [95, 10, 12] },
      margin: { left: 40, right: 40 },
    });

    const safeStudentId = String(user?.user_id || 'student');
    const safeDate = new Date().toISOString().slice(0, 10);
    doc.save(`transcript-${safeStudentId}-${safeDate}.pdf`);
  };

  const getGradeColor = (grade) => {
    if (!grade || grade === '-') return 'text-gray-400';
    if (grade.startsWith('A')) return 'text-emerald-600';
    if (grade.startsWith('B')) return 'text-ceylon-gold-600';
    if (grade.startsWith('C')) return 'text-orange-500';
    if (grade === 'F') return 'text-red-600';
    return 'text-gray-700';
  };

  if (loading) {
    return (
      <div className="page-container page-transition flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-ceylon-maroon mx-auto mb-4" />
          <p className="text-gray-500">Loading transcript...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container page-transition flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Academic Transcript</h1>
          <p className="section-subtitle mb-0">
            {user?.email} — ID: {user?.user_id}
          </p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" size="sm" className="gap-1.5">
            <Printer className="h-4 w-4" /> Print
          </Button> */}
          <Button
            variant="default"
            size="sm"
            className="gap-1.5"
            onClick={handleDownloadPdf}
            disabled={filteredResults.length === 0}
          >
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Filter className="h-4 w-4" />
              Filters
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              <Select
                placeholder="All Exams"
                options={examOptions}
                value={examFilter}
                onChange={(e) => setExamFilter(e.target.value)}
              />
              <Select
                placeholder="All Grades"
                options={gradeOptions}
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
              />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            {(examFilter || gradeFilter || searchTerm) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setExamFilter(''); setGradeFilter(''); setSearchTerm(''); }}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      {filteredResults.length > 0 ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">All Results</CardTitle>
            <CardDescription>
              {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Name</TableHead>
                  <TableHead className="text-center">Exam Date</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead className="text-center">Published Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium text-gray-900">{result.exam_name || 'Unknown Exam'}</TableCell>
                    <TableCell className="text-center text-sm text-gray-600">
                      {formatDate(result.exam_date)}
                    </TableCell>
                    <TableCell className="text-center font-semibold">{result.score}</TableCell>
                    <TableCell className="text-center">
                      <span className={`font-bold text-base ${getGradeColor(result.grade)}`}>
                        {result.grade}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-sm text-gray-600">
                      {formatDate(result.published_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="py-16 text-center">
          <p className="text-gray-400">No results found for the selected filters.</p>
        </Card>
      )}

      {/* Summary */}
      {/* <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Total Results</p>
              <p className="text-2xl font-bold text-gray-900">{totalResults}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Average Score</p>
              <p className="text-2xl font-bold text-ceylon-maroon">{avgScore}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Passed</p>
              <p className="text-2xl font-bold text-emerald-600">{passCount}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Failed</p>
              <p className="text-2xl font-bold text-red-600">{totalResults - passCount}</p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default Transcript;
