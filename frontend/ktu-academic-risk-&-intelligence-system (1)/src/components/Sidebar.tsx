import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCircle, 
  AlertTriangle, 
  CreditCard, 
  History, 
  Settings, 
  LogOut,
  Users,
  BarChart3,
  ClipboardList,
  FileText,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const studentLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
    { name: 'Academic Details', icon: UserCircle, path: '/student/academic' },
    { name: 'Risk Analysis', icon: AlertTriangle, path: '/student/risk' },
    { name: 'Credits & Activity', icon: CreditCard, path: '/student/credits' },
    { name: 'History', icon: History, path: '/student/history' },
    { name: 'Settings', icon: Settings, path: '/student/settings' },
  ];

  const teacherLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/teacher/dashboard' },
    { name: 'Students', icon: Users, path: '/teacher/students' },
    { name: 'Risk Analytics', icon: BarChart3, path: '/teacher/risk' },
    { name: 'Attendance Monitor', icon: ClipboardList, path: '/teacher/attendance' },
    { name: 'Credits Monitor', icon: CreditCard, path: '/teacher/credits' },
    { name: 'Activity Monitor', icon: Award, path: '/teacher/activity' },
    { name: 'Reports', icon: FileText, path: '/teacher/reports' },
    { name: 'Settings', icon: Settings, path: '/teacher/settings' },
  ];

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">K</div>
          KTU ARIS
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              location.pathname === link.path 
                ? "bg-primary text-white shadow-md shadow-primary/20" 
                : "text-slate-600 hover:bg-slate-50 hover:text-primary"
            )}
          >
            <link.icon size={20} className={cn(
              "transition-colors",
              location.pathname === link.path ? "text-white" : "text-slate-400 group-hover:text-primary"
            )} />
            <span className="font-medium">{link.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
