import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select } from '../../components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { getAllResults, getExams } from '../../services/adminService';
import {
  CheckCircle2, Eye, Loader2, AlertCircle, RefreshCw,
  Calendar, Filter,
} from 'lucide-react';

const ResultPublishing = () => {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examFilter, setExamFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [resultsData, examsData] = await Promise.allSettled([
        getAllResults(),
        getExams(),
      ]);

      if (resultsData.status === 'fulfilled') setResults(resultsData.value.results || []);
      if (examsData.status === 'fulfilled') setExams(examsData.value.exams || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      return matchExam && matchGrade;
    });
  }, [results, examFilter, gradeFilter]);

  // Group by exam
  const groupedByExam = useMemo(() => {
    const groups = {};
    filteredResults.forEach(r => {
      const key = r.exam_name || `Exam ${r.exam_id}`;
      if (!groups[key]) {
        groups[key] = {
          examName: key,
          examId: r.exam_id,
          results: [],
        };
      }
      groups[key].results.push(r);
    });
    return Object.values(groups);
  }, [filteredResults]);

  // Stats
  const totalResults = results.length;
  const publishedCount = results.filter(r => r.published_at).length;
  const uniqueExams = [...new Set(results.map(r => r.exam_id))].length;
  const uniqueStudents = [...new Set(results.map(r => r.student_id))].length;

  const getGradeColor = (grade) => {
    if (!grade) return 'text-gray-400';
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
          <p className="text-gray-500">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container page-transition">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Published Results</h1>
          <p className="section-subtitle">View all published examination results</p>
        </div>
        <Button onClick={fetchData} variant="outline" className="gap-1.5">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Summary Banner */}
      <div className="bg-gradient-to-r from-ceylon-maroon-50 to-ceylon-gold-50 rounded-xl border border-ceylon-maroon-100/50 p-5 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-2.5 rounded-xl bg-ceylon-maroon/10">
            <Eye className="h-5 w-5 text-ceylon-maroon" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ceylon-maroon">
              {totalResults} total result{totalResults !== 1 ? 's' : ''} across {uniqueExams} exam{uniqueExams !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {uniqueStudents} students • {publishedCount} published
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Filter className="h-4 w-4" /> Filters
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
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
            </div>
            {(examFilter || gradeFilter) && (
              <Button variant="ghost" size="sm" onClick={() => { setExamFilter(''); setGradeFilter(''); }}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results grouped by exam */}
      {groupedByExam.length > 0 ? (
        <div className="space-y-4">
          {groupedByExam.map((group) => (
            <Card key={group.examName} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{group.examName}</CardTitle>
                    <CardDescription>
                      {group.results.length} result{group.results.length !== 1 ? 's' : ''} •
                      Exam ID: {group.examId}
                    </CardDescription>
                  </div>
                  <Badge variant="pass" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Published
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Result ID</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead>Published At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-mono text-sm text-gray-900">#{result.id}</TableCell>
                        <TableCell className="font-medium">{result.student_id}</TableCell>
                        <TableCell className="text-center font-semibold">{result.score}</TableCell>
                        <TableCell className="text-center">
                          <span className={`font-bold text-base ${getGradeColor(result.grade)}`}>
                            {result.grade}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            {result.published_at
                              ? new Date(result.published_at).toLocaleString()
                              : 'N/A'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-16 text-center">
          <p className="text-gray-400">No results found.</p>
        </Card>
      )}
    </div>
  );
};

export default ResultPublishing;
