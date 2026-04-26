import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { StatCard } from '../../components/ui/stat-card';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { getExams } from '../../services/adminService';
import {
  CalendarCheck, Calendar, Clock, CheckCircle2, Loader2, AlertCircle, RefreshCw,
} from 'lucide-react';

const ExamSessionManagement = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExams();
      setExams(data.exams || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="page-container page-transition flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-ceylon-maroon mx-auto mb-4" />
          <p className="text-gray-500">Loading exam sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container page-transition">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Exam Sessions</h1>
          <p className="section-subtitle">View exam events from the database</p>
        </div>
        <Button onClick={fetchExams} variant="outline" className="gap-1.5">
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
        <StatCard title="Total Exams" value={exams.length} icon={CalendarCheck} />
        <StatCard
          title="With Dates"
          value={exams.filter(e => e.exam_date).length}
          icon={Calendar}
        />
        <StatCard
          title="Recent"
          value={exams.filter(e => {
            if (!e.exam_date) return false;
            const diff = Date.now() - new Date(e.exam_date).getTime();
            return diff < 30 * 24 * 60 * 60 * 1000; // last 30 days
          }).length}
          icon={Clock}
        />
      </div>

      {/* Exam Cards */}
      {exams.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {exams.map((exam) => (
            <Card key={exam.id} className="group hover:-translate-y-0.5 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{exam.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Exam ID: {exam.id}</p>
                  </div>
                  <Badge variant="default" className="gap-1">
                    <CalendarCheck className="h-3 w-3" />
                    Exam
                  </Badge>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-400 mb-1">Exam Date</p>
                  <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    {exam.exam_date
                      ? new Date(exam.exam_date).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })
                      : 'No date set'}
                  </p>
                </div>

                {/* Display any additional fields the backend returns */}
                {exam.description && (
                  <p className="text-sm text-gray-500 mt-2">{exam.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-16 text-center">
          <p className="text-gray-400">No exams found in the database.</p>
        </Card>
      )}
    </div>
  );
};

export default ExamSessionManagement;
