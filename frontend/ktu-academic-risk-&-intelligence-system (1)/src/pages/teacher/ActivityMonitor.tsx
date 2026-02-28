import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Award, CheckCircle2, AlertCircle, Filter, Download } from 'lucide-react';

const MOCK_ACTIVITY_STATS = [
  { name: 'Completed (100+)', value: 45, color: '#10b981' },
  { name: 'In Progress (50-99)', value: 35, color: '#3b82f6' },
  { name: 'At Risk (<50)', value: 20, color: '#ef4444' },
];

const MOCK_DEPT_ACTIVITY = [
  { name: 'CS', avg: 72 },
  { name: 'EC', avg: 65 },
  { name: 'ME', avg: 58 },
  { name: 'EE', avg: 68 },
  { name: 'CE', avg: 62 },
];

export const ActivityMonitor: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Point Monitor</h1>
          <p className="text-slate-500">Tracking mandatory KTU activity point completion across departments.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download size={18} />
          Export Stats
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Overall Completion */}
        <div className="card p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Award className="text-primary" size={20} />
            Overall Completion
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_ACTIVITY_STATS}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_ACTIVITY_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dept-wise Activity */}
        <div className="card p-8 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={20} />
            Avg. Activity Points by Dept
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DEPT_ACTIVITY}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="avg" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pending Verifications */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="text-amber-500" size={20} />
            Pending Certificate Verifications
          </h3>
          <button className="text-primary text-sm font-bold hover:underline">Verify All</button>
        </div>
        <div className="space-y-4">
          {[
            { student: 'Alice Johnson', id: 'S101', cert: 'NSS Camp', points: 20 },
            { student: 'Bob Smith', id: 'S102', cert: 'Technical Fest', points: 10 },
            { student: 'Charlie Brown', id: 'S103', cert: 'Sports Meet', points: 15 },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                  {item.student[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.student} ({item.id})</p>
                  <p className="text-xs text-slate-500">{item.cert} - {item.points} Points</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">View</button>
                <button className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors">Approve</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
