import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { getAllResults, getExams, getRecentSagas } from '../../services/adminService';
import { getNotificationStats } from '../../services/notificationService';
import {
  Users, ClipboardCheck, Clock, CheckCircle2,
  Upload, CalendarCheck, BookOpen, Bell,
  TrendingUp, Loader2, AlertCircle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts';

const sagaStatusIcons = {
  COMPLETED: CheckCircle2,
  IN_PROGRESS: Clock,
  STARTED: Upload,
  FAILED: AlertCircle,
  COMPENSATING: Clock,
  COMPENSATED: AlertCircle,
};

const sagaStatusVariant = {
  COMPLETED: 'pass',
  IN_PROGRESS: 'pending',
  STARTED: 'pending',
  FAILED: 'fail',
  COMPENSATING: 'pending',
  COMPENSATED: 'fail',
};

const AdminDashboard = () => {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [sagas, setSagas] = useState([]);
  const [notifStats, setNotifStats] = useState({ total: 0, sent: 0, failed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [resultsData, examsData, sagasData, statsData] = await Promise.allSettled([
          getAllResults(),
          getExams(),
          getRecentSagas(),
          getNotificationStats(),
        ]);

        if (resultsData.status === 'fulfilled') setResults(resultsData.value.results || []);
        if (examsData.status === 'fulfilled') setExams(examsData.value.exams || []);
        if (sagasData.status === 'fulfilled') setSagas(sagasData.value.sagas || []);
        if (statsData.status === 'fulfilled') setNotifStats(statsData.value);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Compute stats from API data
  const totalExams = exams.length;
  const totalResults = results.length;
  const publishedResults = results.filter(r => r.published_at).length;
  const unpublishedResults = totalResults - publishedResults;

  // Unique student IDs from results
  const uniqueStudents = [...new Set(results.map(r => r.student_id))].length;

  // Grade distribution from results
  const gradeDistribution = React.useMemo(() => {
    const counts = {};
    results.forEach(r => {
      if (r.grade) {
        counts[r.grade] = (counts[r.grade] || 0) + 1;
      }
    });
    const gradeColors = {
      'A+': '#059669', 'A': '#10B981', 'A-': '#34D399',
      'B+': '#F5BA1D', 'B': '#FBBF24', 'B-': '#FCD34D',
      'C+': '#F97316', 'C': '#FB923C', 'C-': '#FDBA74',
      'D+': '#EF4444', 'D': '#F87171', 'F': '#EF4444',
    };
    return Object.entries(counts)
      .map(([grade, count]) => ({ grade, count, color: gradeColors[grade] || '#6B7280' }))
      .sort((a, b) => {
        const order = ['A+','A','A-','B+','B','B-','C+','C','C-','E'];
        return order.indexOf(a.grade) - order.indexOf(b.grade);
      });
  }, [results]);

  // Pass/Fail ratio
  const passCount = results.filter(r => r.grade && r.grade !== 'E').length;
  const failCount = results.filter(r => r.grade === 'E').length;
  const passRate = totalResults > 0 ? ((passCount / totalResults) * 100).toFixed(1) : 0;
  const failRate = totalResults > 0 ? ((failCount / totalResults) * 100).toFixed(1) : 0;

  const passFailData = [
    { name: 'Pass', value: parseFloat(passRate), color: '#059669' },
    { name: 'Fail', value: parseFloat(failRate), color: '#EF4444' },
  ];

  if (loading) {
    return (
      <div className="page-container page-transition flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-ceylon-maroon mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container page-transition">
      <div className="mb-8">
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="section-subtitle">Overview of examination results management</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Students (with results)"
          value={uniqueStudents}
          icon={Users}
        />
        <StatCard
          title="Total Exams"
          value={totalExams}
          icon={ClipboardCheck}
        />
        <StatCard
          title="Published Results"
          value={publishedResults}
          icon={CheckCircle2}
          trend="up"
          trendValue={`${publishedResults}`}
        />
        <StatCard
          title="Notifications"
          value={notifStats.total}
          subtitle={`${notifStats.sent} sent, ${notifStats.failed} failed`}
          icon={Bell}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Grade Distribution - Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-ceylon-maroon" />
              Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gradeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradeDistribution} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="grade" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '13px',
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Students">
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="py-12 text-center text-gray-400">No grade data available</div>
            )}
          </CardContent>
        </Card>

        {/* Pass/Fail Ratio - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pass / Fail Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={passFailData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {passFailData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 -mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-600" />
                <span className="text-sm text-gray-600">Pass {passRate}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-gray-600">Fail {failRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent SAGA Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Upload Activity (SAGA)</CardTitle>
        </CardHeader>
        <CardContent>
          {sagas.length > 0 ? (
            <div className="space-y-4">
              {sagas.map((saga) => {
                const Icon = sagaStatusIcons[saga.status] || Clock;
                const variant = sagaStatusVariant[saga.status] || 'default';
                return (
                  <div key={saga.saga_id} className="flex items-start gap-3 group">
                    <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-ceylon-maroon-50 transition-colors mt-0.5">
                      <Icon className="h-4 w-4 text-gray-400 group-hover:text-ceylon-maroon transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {saga.type || 'PUBLISH_RESULTS'} — Step {saga.step || 0}
                        </p>
                        <Badge variant={variant} className="text-[10px]">{saga.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">ID: {saga.saga_id?.slice(0, 8)}...</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-400">
                          {saga.created_at ? new Date(saga.created_at).toLocaleString() : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-400">No upload activity yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
