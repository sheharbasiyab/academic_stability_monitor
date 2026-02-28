import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: Role }> = ({ children, role }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={role === 'teacher' ? '/teacher-login' : '/student-login'} state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />;
  }

  return <>{children}</>;
};
