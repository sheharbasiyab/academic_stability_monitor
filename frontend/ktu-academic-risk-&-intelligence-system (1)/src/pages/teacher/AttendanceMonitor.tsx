import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { AlertCircle, Users, Calendar, Filter, Download } from 'lucide-react';

const MOCK_ATTENDANCE_TREND = [
  { name: 'Mon', avg: 82 },
  { name: 'Tue', avg: 78 },
  { name: 'Wed', avg: 85 },
  { name: 'Thu', avg: 72 },
  { name: 'Fri', avg: 68 },
];

const MOCK_DANGER_STUDENTS = [
  { id: 'S101', name: 'Alice Johnson', attendance: 68, trend: 'Down' },
  { id: 'S105', name: 'Ethan Hunt', attendance: 62, trend: 'Stable' },
  { id: 'S112', name: 'Ian Wright', attendance: 71, trend: 'Down' },
  { id: 'S115', name: 'Kevin Hart', attendance: 65, trend: 'Up' },
];

export const AttendanceMonitor: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Monitor</h1>
          <p className="text-slate-500">Real-time tracking of students in the attendance danger zone.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download size={18} />
          Export Shortage List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Trend */}
        <div className="card p-8 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Calendar className="text-primary" size={20} />
            Average Daily Attendance Trend
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_ATTENDANCE_TREND}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[50, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Danger Zone List */}
        <div className="card p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} />
            Danger Zone (&lt;75%)
          </h3>
          <div className="space-y-4">
            {MOCK_DANGER_STUDENTS.map((student) => (
              <div key={student.id} className="p-4 bg-red-50 rounded-2xl border border-red-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-red-900">{student.name}</p>
                  <span className="text-[10px] font-bold px-2 py-1 bg-red-100 text-red-600 rounded-lg uppercase">
                    {student.attendance}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-red-700">Trend: {student.trend}</span>
                  <button className="text-xs text-red-700 font-bold underline">Notify Student</button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
            View All Shortages
          </button>
        </div>
      </div>

      {/* Threshold Analysis */}
      <div className="card p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Students Near Threshold (75-80%)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { dept: 'CS', count: 12, status: 'Warning' },
            { dept: 'EC', count: 8, status: 'Warning' },
            { dept: 'ME', count: 24, status: 'Critical' },
            { dept: 'EE', count: 5, status: 'Safe' },
          ].map((item) => (
            <div key={item.dept} className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{item.dept} Department</p>
              <h4 className="text-xl font-black text-slate-900 mb-1">{item.count} Students</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase ${
                item.status === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
