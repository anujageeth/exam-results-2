import React, { useState, useEffect, useRef } from 'react';
import { Bell, Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { getNotifications, getStudentNotifications } from '../../services/notificationService';

export const NotificationBell = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const normalizeNotification = (notification) => {
    const status = notification.status || 'pending';
    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
    const subject = notification.subject
      || `Result ${statusLabel}: Exam ${notification.exam_id ?? '-'}`;
    const message = notification.message
      || `Student ${notification.student_id} • Score ${notification.score ?? '-'} • Grade ${notification.grade ?? '-'}`;

    return {
      ...notification,
      type: notification.type || status,
      subject,
      message,
      createdAt: notification.createdAt || notification.sent_at || notification.updatedAt,
    };
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      let res;
      if (user.role === 'admin') {
        res = await getNotifications();
      } else {
        const userId = user.id || user.userId || user.user_id || user.studentId || user._id;
        if (!userId) {
          console.warn("User ID not found for notifications");
          return;
        }
        res = await getStudentNotifications(userId);
      }
      
      // Handle the API response structure safely
      if (res && res.notifications) {
        setNotifications(res.notifications.slice(0, 5).map(normalizeNotification));
      } else if (Array.isArray(res)) {
        setNotifications(res.slice(0, 5).map(normalizeNotification));
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState) {
      fetchNotifications();
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending': return <Info className="h-4 w-4 text-amber-500" />;
      default: return <Bell className="h-4 w-4 text-ceylon-gold" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length || 0;

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors relative flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-ceylon-maroon"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-elevated border border-gray-200 py-2 animate-slide-up z-50">
          <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length > 0 ? (
              <div className="flex flex-col">
                {notifications.map((notification, idx) => (
                  <div key={notification._id || notification.id || idx} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 items-start">
                    <div className="mt-0.5">
                      {getIcon(notification.type || notification.status || 'info')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 font-medium">
                        {notification.title || notification.subject || 'Notification'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {notification.message || notification.content}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {new Date(notification.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No new notifications
              </div>
            )}
          </div>
          
          <div className="px-4 pt-2 border-t border-gray-100 hidden">
            <button className="text-xs text-ceylon-maroon font-medium hover:underline w-full text-center py-1">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
