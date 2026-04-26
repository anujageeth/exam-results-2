import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import './index.css';

// Layouts
import StudentLayout from './components/layout/StudentLayout';
import AdminLayout from './components/layout/AdminLayout';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import StudentDashboard from './pages/student/Dashboard';
import Transcript from './pages/student/Transcript';
import AdminDashboard from './pages/admin/Dashboard';
import StudentManagement from './pages/admin/StudentManagement';
import ModuleManagement from './pages/admin/ModuleManagement';
import ExamSessionManagement from './pages/admin/ExamSessionManagement';
import ResultEntry from './pages/admin/ResultEntry';
import ResultPublishing from './pages/admin/ResultPublishing';
import NotificationLog from './pages/admin/NotificationLog';

// Auth helpers
import { getStoredUser, setAuthData, clearAuth, isAuthenticated } from './services/authService';

// Shared layout with Navbar + Footer (for Home)
const SharedLayout = ({ user, onLogout, children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar user={user} onLogout={onLogout} />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

/**
 * AuthCallback — handles the redirect from Google OAuth.
 * The backend redirects here with ?token=<JWT> in the URL.
 * We extract the token, store it, and navigate to the appropriate dashboard.
 */
const AuthCallback = ({ onAuthComplete }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setAuthData(token);
      const user = getStoredUser();
      onAuthComplete(user);
      navigate(user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, onAuthComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ceylon-maroon mx-auto mb-4" />
        <p className="text-gray-500">Signing you in...</p>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(() => {
    // On initial load, check localStorage for existing session
    if (isAuthenticated()) {
      return getStoredUser();
    }
    return null;
  });

  const handleAuthComplete = useCallback((userData) => {
    setUser(userData);
  }, []);

  const handleLogout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <SharedLayout user={user} onLogout={handleLogout}>
              <Home />
            </SharedLayout>
          }
        />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Auth Callback — captures JWT from Google OAuth redirect */}
        <Route path="/auth/callback" element={<AuthCallback onAuthComplete={handleAuthComplete} />} />

        {/* Student Routes */}
        <Route element={<StudentLayout user={user} onLogout={handleLogout} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/transcript" element={<Transcript />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout user={user} onLogout={handleLogout} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<StudentManagement />} />
          <Route path="/admin/modules" element={<ModuleManagement />} />
          <Route path="/admin/exam-sessions" element={<ExamSessionManagement />} />
          <Route path="/admin/result-entry" element={<ResultEntry />} />
          <Route path="/admin/result-publishing" element={<ResultPublishing />} />
          <Route path="/admin/notifications" element={<NotificationLog />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
