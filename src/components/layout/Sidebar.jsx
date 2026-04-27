import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  FileUp,
  Users,
  Eye,
  Bell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const sidebarLinks = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Result Entry', path: '/admin/result-entry', icon: FileUp },
  { label: 'All Users', path: '/admin/users', icon: Users },
  { label: 'All Results', path: '/admin/all-results', icon: Eye },
  { label: 'Notification Log', path: '/admin/notifications', icon: Bell },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={cn(
      'sticky top-16 h-[calc(100vh-4rem)] border-r border-gray-200 bg-white flex flex-col transition-all duration-300',
      collapsed ? 'w-[68px]' : 'w-64'
    )}>
      {/* Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              title={collapsed ? link.label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                active
                  ? 'bg-ceylon-maroon text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className={cn(
                'h-5 w-5 flex-shrink-0 transition-colors',
                active ? 'text-ceylon-gold' : 'text-gray-400 group-hover:text-gray-600'
              )} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-3 border-t border-gray-100">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
