import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/MainLayout';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { AcademicDetails } from './pages/student/AcademicDetails';
import { CreditsActivity } from './pages/student/CreditsActivity';
import { StudentList } from './pages/teacher/StudentList';
import { StudentDetail } from './pages/teacher/StudentDetail';
import { CreditsMonitor } from './pages/teacher/CreditsMonitor';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/student-login" element={<Login role="student" />} />
          <Route path="/teacher-login" element={<Login role="teacher" />} />

          {/* Student Portal */}
          <Route path="/student" element={
            <ProtectedRoute role="student">
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="academic" element={<AcademicDetails />} />
            <Route path="risk" element={<div className="card p-8 text-center text-slate-500">Risk Analysis Engine is analyzing your data...</div>} />
            <Route path="credits" element={<CreditsActivity />} />
            <Route path="history" element={<div className="card p-8 text-center text-slate-500">Academic History Timeline</div>} />
            <Route path="settings" element={<div className="card p-8 text-center text-slate-500">Profile Settings</div>} />
          </Route>

          {/* Teacher Portal */}
          <Route path="/teacher" element={
            <ProtectedRoute role="teacher">
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="students" element={<StudentList />} />
            <Route path="student/:id" element={<StudentDetail />} />
            <Route path="risk" element={<div className="card p-8 text-center text-slate-500">Departmental Risk Analytics</div>} />
            <Route path="credits" element={<CreditsMonitor />} />
            <Route path="reports" element={<div className="card p-8 text-center text-slate-500">Report Generation Engine</div>} />
            <Route path="settings" element={<div className="card p-8 text-center text-slate-500">Teacher Account Settings</div>} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/student-login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
