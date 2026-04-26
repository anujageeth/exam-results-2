import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { StatCard } from '../../components/ui/stat-card';
import { Avatar } from '../../components/ui/avatar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { getStoredUser } from '../../services/authService';
import { getStudentResults } from '../../services/resultService';
import { getStudentNotifications } from '../../services/notificationService';
import {
  GraduationCap,
  BookOpen,
  Award,
  TrendingUp,
  FileText,
  ArrowRight,
  Calendar,
  Download,
  Bell,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const StudentDashboard = () => {
  const [results, setResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = getStoredUser();

  useEffect(() => {
    async function fetchData() {
      if (!user?.user_id) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch results and notifications in parallel
        const [resultsData, notifData] = await Promise.allSettled([
          getStudentResults(user.user_id),
          getStudentNotifications(user.user_id),
        ]);

        if (resultsData.status === 'fulfilled') {
          setResults(resultsData.value.results || []);
        }
        if (notifData.status === 'fulfilled') {
          setNotifications(notifData.value.notifications || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.user_id]);

  // Compute stats from results
  const totalResults = results.length;
  const passedResults = results.filter(r => r.grade && r.grade !== 'F').length;
  const recentResults = results.slice(0, 4); // already sorted by published_at DESC from backend

  // Compute average score as a "GPA-like" metric (since backend returns scores, not grade points)
  const avgScore = totalResults > 0
    ? (results.reduce((sum, r) => sum + (r.score || 0), 0) / totalResults).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="page-container page-transition flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-ceylon-maroon mx-auto mb-4" />
          <p className="text-gray-500">Loading your dashboard...</p>
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
          <p className="text-gray-400 text-sm mt-1">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const getGradeColor = (grade) => {
    if (!grade || grade === '-') return 'text-gray-400';
    if (grade.startsWith('A')) return 'text-emerald-600';
    if (grade.startsWith('B')) return 'text-ceylon-gold-600';
    if (grade.startsWith('C')) return 'text-orange-500';
    if (grade === 'F') return 'text-red-600';
    return 'text-gray-700';
  };

  return (
    <div className="page-container page-transition">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-ceylon-maroon to-ceylon-maroon-800 rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-ceylon-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-ceylon-gold/5 rounded-full blur-2xl translate-y-1/2" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar name={user?.email || 'Student'} size="xl" className="bg-ceylon-gold/20 text-ceylon-gold text-xl" />
          <div className="flex-1">
            <p className="text-ceylon-gold/80 text-sm font-medium mb-1">Welcome back,</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{user?.email || 'Student'}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="text-sm text-white/60">ID: {user?.user_id}</span>
              <span className="text-white/30">•</span>
              <span className="text-sm text-white/60 capitalize">{user?.role}</span>
            </div>
          </div>
          <div className="hidden lg:block text-right">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Results</p>
            <p className="text-3xl font-bold text-ceylon-gold">{totalResults}</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Average Score"
          value={avgScore}
          subtitle="Out of 100"
          icon={Award}
        />
        <StatCard
          title="Total Results"
          value={totalResults}
          subtitle="Published exams"
          icon={BookOpen}
        />
        <StatCard
          title="Passed"
          value={passedResults}
          subtitle={`${totalResults - passedResults} failed`}
          icon={GraduationCap}
        />
        <StatCard
          title="Notifications"
          value={notifications.length}
          subtitle="Email alerts"
          icon={Bell}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Results */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Results</CardTitle>
                <Link to="/student/transcript">
                  <Button variant="ghost" size="sm" className="gap-1 text-ceylon-maroon">
                    View All <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentResults.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead>Published</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{result.exam_name}</p>
                            <p className="text-xs text-gray-500">
                              {result.exam_date ? new Date(result.exam_date).toLocaleDateString() : ''}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-semibold">{result.score}</TableCell>
                        <TableCell className="text-center">
                          <span className={`font-semibold ${getGradeColor(result.grade)}`}>
                            {result.grade}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-gray-500">
                            {result.published_at
                              ? new Date(result.published_at).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-400">No results published yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Score Overview & Quick Links */}
        <div className="space-y-6">
          {/* Score Card */}
          <Card>
            <CardHeader>
              <CardTitle>Score Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <div className="relative w-36 h-36">
                  {/* Background circle */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="50" fill="none"
                      stroke="#5F0A0C"
                      strokeWidth="10"
                      strokeDasharray={`${(parseFloat(avgScore) / 100) * 314} ${314 - (parseFloat(avgScore) / 100) * 314}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{avgScore}</span>
                    <span className="text-xs text-gray-500">avg score</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/student/transcript">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                  <div className="p-2 rounded-lg bg-ceylon-maroon-50 group-hover:bg-ceylon-maroon transition-colors">
                    <FileText className="h-4 w-4 text-ceylon-maroon group-hover:text-ceylon-gold transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Full Transcript</p>
                    <p className="text-xs text-gray-500">View all results</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-ceylon-maroon transition-colors" />
                </div>
              </Link>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                <div className="p-2 rounded-lg bg-ceylon-maroon-50 group-hover:bg-ceylon-maroon transition-colors">
                  <Download className="h-4 w-4 text-ceylon-maroon group-hover:text-ceylon-gold transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Download Report</p>
                  <p className="text-xs text-gray-500">PDF format</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-ceylon-maroon transition-colors" />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                <div className="p-2 rounded-lg bg-ceylon-maroon-50 group-hover:bg-ceylon-maroon transition-colors">
                  <TrendingUp className="h-4 w-4 text-ceylon-maroon group-hover:text-ceylon-gold transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Score Calculator</p>
                  <p className="text-xs text-gray-500">Project your scores</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-ceylon-maroon transition-colors" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
