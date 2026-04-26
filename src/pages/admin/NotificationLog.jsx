import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { StatCard } from '../../components/ui/stat-card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { getNotifications, getNotificationStats } from '../../services/notificationService';
import {
  Bell, Mail, CheckCircle2, XCircle, Clock,
  Loader2, AlertCircle, RefreshCw, BarChart3,
} from 'lucide-react';

const statusConfig = {
  sent:    { variant: 'pass', icon: CheckCircle2, label: 'Sent' },
  failed:  { variant: 'fail', icon: XCircle, label: 'Failed' },
  pending: { variant: 'pending', icon: Clock, label: 'Pending' },
};

const NotificationLog = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ total: 0, sent: 0, failed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [notifsData, statsData] = await Promise.allSettled([
        getNotifications(),
        getNotificationStats(),
      ]);

      if (notifsData.status === 'fulfilled') setNotifications(notifsData.value.notifications || []);
      if (statsData.status === 'fulfilled') setStats(statsData.value);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page-container page-transition flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-ceylon-maroon mx-auto mb-4" />
          <p className="text-gray-500">Loading notification log...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container page-transition">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Notification Log</h1>
          <p className="section-subtitle">Email notification history and delivery status</p>
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Notifications"
          value={stats.total}
          icon={Bell}
        />
        <StatCard
          title="Sent Successfully"
          value={stats.sent}
          icon={CheckCircle2}
          trend="up"
          trendValue={stats.total > 0 ? `${((stats.sent / stats.total) * 100).toFixed(0)}%` : '0%'}
        />
        <StatCard
          title="Failed"
          value={stats.failed}
          icon={XCircle}
          subtitle={stats.total > 0 ? `${((stats.failed / stats.total) * 100).toFixed(1)}% failure rate` : ''}
        />
      </div>

      {/* Notification Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-ceylon-maroon" />
            Recent Notifications
          </CardTitle>
          <CardDescription>
            Showing the {notifications.length} most recent notification entries
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Exam ID</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Sent At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notif) => {
                  const config = statusConfig[notif.status] || statusConfig.pending;
                  const StatusIcon = config.icon;
                  return (
                    <TableRow key={notif._id}>
                      <TableCell>
                        <Badge variant={config.variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{notif.student_id}</TableCell>
                      <TableCell className="text-sm text-gray-600">{notif.email}</TableCell>
                      <TableCell className="text-center">{notif.exam_id || '-'}</TableCell>
                      <TableCell className="text-center font-semibold">{notif.score ?? '-'}</TableCell>
                      <TableCell className="text-center">
                        {notif.grade ? (
                          <span className={`font-bold ${
                            notif.grade.startsWith('A') ? 'text-emerald-600' :
                            notif.grade.startsWith('B') ? 'text-ceylon-gold-600' :
                            notif.grade === 'F' ? 'text-red-600' : 'text-gray-700'
                          }`}>
                            {notif.grade}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="text-[10px] capitalize">
                          {notif.channel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {notif.sent_at
                          ? new Date(notif.sent_at).toLocaleString()
                          : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="py-16 text-center">
              <Bell className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">No notifications recorded yet.</p>
              <p className="text-xs text-gray-300 mt-1">
                Notifications are created when results are published via the SAGA pipeline.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error details for failed notifications */}
      {notifications.some(n => n.status === 'failed' && n.error) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base text-red-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Failed Notification Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications
                .filter(n => n.status === 'failed' && n.error)
                .map((notif) => (
                  <div key={notif._id} className="p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Student {notif.student_id} — {notif.email}
                      </span>
                    </div>
                    <p className="text-sm text-red-600">{notif.error}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationLog;
