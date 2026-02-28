import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area
} from 'recharts';
import { History as HistoryIcon, Calendar, TrendingUp, Award } from 'lucide-react';

const MOCK_HISTORY_DATA = [
  { month: 'Aug', risk: 20, attendance: 95, gpa: 8.2 },
  { month: 'Sep', risk: 25, attendance: 92, gpa: 8.1 },
  { month: 'Oct', risk: 45, attendance: 78, gpa: 7.8 },
  { month: 'Nov', risk: 65, attendance: 70, gpa: 7.5 },
  { month: 'Dec', risk: 55, attendance: 74, gpa: 7.6 },
  { month: 'Jan', risk: 68, attendance: 72, gpa: 7.8 },
];

export const History: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Academic History</h1>
        <p className="text-slate-500">Review your performance trends and risk history over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Score Timeline */}
        <div className="card p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <HistoryIcon className="text-primary" size={20} />
            Risk Score Timeline
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_HISTORY_DATA}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="risk" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Trend */}
        <div className="card p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Calendar className="text-emerald-500" size={20} />
            Attendance Trend
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_HISTORY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[60, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GPA Progression */}
        <div className="card p-8 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Award className="text-purple-500" size={20} />
            GPA Progression
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_HISTORY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[7, 9]} />
                <Tooltip />
                <Line type="monotone" dataKey="gpa" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
