import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  CreditCard, 
  AlertTriangle,
  ExternalLink,
  FileText,
  User,
  TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

const GROUP_NAMES = [
  'Group 1: Professional & Technical',
  'Group 2: Social & Community',
  'Group 3: Creative & Sports'
];

export const StudentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    socket = io();
    
    socket.on('connect', () => {
      socket.emit('join_teacher');
    });

    socket.on('all_activities', (allActivities) => {
      // For now, we mock the student detail but use real activities from server
      const studentActivities = allActivities.filter((a: any) => a.studentId === id);
      setStudent({
        id: id || 'S101',
        name: id === 'S101' ? 'Alice Johnson' : 'Unknown Student',
        dept: 'Computer Science',
        sem: 6,
        credits: 12,
        activityPoints: studentActivities.filter((a: any) => a.status === 'Approved').reduce((sum: number, a: any) => sum + a.points, 0),
        email: 'student@college.edu',
        phone: '+91 98765 43210',
        backlogs: [],
        activities: studentActivities,
        semesterCredits: { 1: 18, 2: 20, 3: 15, 4: 18, 5: 20, 6: 0 }
      });
    });

    socket.on('activity_updated', (updated) => {
      if (updated.studentId === id) {
        setStudent((prev: any) => {
          if (!prev) return null;
          const newActivities = prev.activities.map((a: any) => a.id === updated.id ? updated : a);
          return {
            ...prev,
            activities: newActivities,
            activityPoints: newActivities.filter((a: any) => a.status === 'Approved').reduce((sum: number, a: any) => sum + a.points, 0)
          };
        });
      }
    });

    socket.on('new_activity_alert', (activity) => {
      if (activity.studentId === id) {
        setStudent((prev: any) => {
          if (!prev) return null;
          return {
            ...prev,
            activities: [...prev.activities, activity]
          };
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleApprove = (activityId: number) => {
    socket.emit('update_activity_status', { id: activityId, status: 'Approved' });
  };

  const handleReject = (activityId: number) => {
    socket.emit('update_activity_status', { id: activityId, status: 'Rejected' });
  };

  if (!student) return <div className="p-8 text-center text-slate-500">Loading student data...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
          <p className="text-slate-500">Student ID: {student.id} • {student.dept} • Semester {student.sem}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Activity Approvals */}
          <div className="card">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="text-emerald-500" size={20} />
                Activity Certificate Approvals
              </h3>
              <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full">
                {student.activities.filter(a => a.status === 'Pending').length} Pending
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {student.activities.map((activity) => (
                <div key={activity.id} className="p-6 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img 
                          src={activity.imageUrl} 
                          alt="Certificate" 
                          className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform"
                          referrerPolicy="no-referrer"
                          onClick={() => window.open(activity.imageUrl, '_blank')}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{activity.name}</h4>
                        <p className="text-xs text-slate-500 mb-1">{GROUP_NAMES[activity.groupId]}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-primary">{activity.points} Points</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{activity.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {activity.status === 'Pending' ? (
                        <>
                          <button 
                            onClick={() => handleReject(activity.id)}
                            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors"
                          >
                            <XCircle size={18} />
                            Reject
                          </button>
                          <button 
                            onClick={() => handleApprove(activity.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                          >
                            <CheckCircle2 size={18} />
                            Approve
                          </button>
                        </>
                      ) : (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
                          activity.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {activity.status === 'Approved' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                          {activity.status}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Semester Credits View */}
          <div className="card">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="text-primary" size={20} />
                Semester-wise Credits
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(student.semesterCredits).map(([sem, credits]) => (
                  <div key={sem} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Semester {sem}</p>
                    <p className="text-lg font-black text-slate-900">{credits}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Student Profile Card */}
          <div className="card p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-3xl mb-4 border-4 border-white shadow-xl">
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{student.name}</h3>
              <p className="text-sm text-slate-500">{student.id}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <User size={18} className="text-slate-400" />
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Contact Email</p>
                  <p className="text-xs font-bold text-slate-700">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <FileText size={18} className="text-slate-400" />
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Department</p>
                  <p className="text-xs font-bold text-slate-700">{student.dept}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Summary */}
          <div className="card p-6 bg-slate-900 text-white">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              Academic Summary
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Total Credits</span>
                <span className="text-sm font-bold text-white">{student.credits}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Activity Points</span>
                <span className="text-sm font-bold text-primary">{student.activityPoints} / 120</span>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <AlertTriangle size={14} />
                  <span className="text-[10px] font-bold uppercase">Active Backlogs</span>
                </div>
                <div className="space-y-2">
                  {student.backlogs.map(b => (
                    <div key={b.id} className="text-xs flex justify-between">
                      <span className="text-slate-400">{b.subject}</span>
                      <span className="font-bold">S{b.sem}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
