import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { NotificationBell } from '../ui/notification-bell';
import { 
  GraduationCap, Menu, X, LogOut, User, ChevronDown 
} from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { label: 'Home', path: '/' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-ceylon-maroon shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-1.5 rounded-lg bg-ceylon-gold/20 group-hover:bg-ceylon-gold/30 transition-colors">
              <GraduationCap className="h-7 w-7 text-ceylon-gold" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-white leading-tight tracking-wide">
                Ceylon University
              </h1>
              <p className="text-[10px] text-ceylon-gold/80 tracking-widest uppercase">
                Exam Results Portal
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive(link.path)
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <NotificationBell user={user} />
                <div className="relative">
                  <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Avatar name={user.name} size="sm" className="bg-ceylon-gold/20 text-ceylon-gold" />
                  <span className="text-sm font-medium text-white">{user.name}</span>
                  <ChevronDown className={cn(
                    'h-3.5 w-3.5 text-white/60 transition-transform',
                    profileOpen && 'rotate-180'
                  )} />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-elevated border border-gray-200 py-2 animate-slide-up">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role === 'admin' ? 'Administrator' : 'Student'}</p>
                      </div>
                      <Link
                        to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4" /> Dashboard
                      </Link>
                      <button
                        onClick={() => { setProfileOpen(false); onLogout(); navigate('/'); }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </>
                )}
                </div>
              </div>
            ) : (
              <Button
                variant="gold"
                size="sm"
                onClick={() => navigate('/login')}
                className="ml-2"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(link.path)
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Button
                variant="gold"
                size="sm"
                onClick={() => { navigate('/login'); setMobileOpen(false); }}
                className="w-full mt-2"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
