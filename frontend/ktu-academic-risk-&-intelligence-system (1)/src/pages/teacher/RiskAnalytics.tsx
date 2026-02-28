import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { Filter, Download, Users, AlertTriangle, TrendingUp, Map } from 'lucide-react';

const MOCK_DEPT_DATA = [
  { name: 'CS', low: 45, moderate: 20, high: 5 },
  { name: 'EC', low: 38, moderate: 25, high: 12 },
  { name: 'ME', low: 30, moderate: 35, high: 15 },
  { name: 'EE', low: 42, moderate: 18, high: 8 },
  { name: 'CE', low: 35, moderate: 22, high: 10 },
];

const MOCK_SCATTER_DATA = [
  { attendance: 65, gpa: 6.2, risk: 85, name: 'Student A' },
  { attendance: 78, gpa: 7.5, risk: 45, name: 'Student B' },
  { attendance: 92, gpa: 8.8, risk: 15, name: 'Student C' },
  { attendance: 70, gpa: 6.8, risk: 65, name: 'Student D' },
  { attendance: 85, gpa: 7.2, risk: 35, name: 'Student E' },
  { attendance: 60, gpa: 5.5, risk: 95, name: 'Student F' },
  { attendance: 95, gpa: 9.2, risk: 5, name: 'Student G' },
];

export const RiskAnalytics: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Departmental Risk Analytics</h1>
          <p className="text-slate-500">Comparative analysis of academic risk across different departments and semesters.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Dept: All
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Comparison */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Risk Distribution by Department</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DEPT_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Legend />
                <Bar dataKey="low" name="Low Risk" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="moderate" name="Moderate Risk" stackId="a" fill="#f59e0b" />
                <Bar dataKey="high" name="High Risk" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="card p-6 bg-red-50 border-red-100">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-600" size={24} />
              <h3 className="text-lg font-bold text-red-900">Critical Alerts</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-xl border border-red-100">
                <p className="text-xs font-bold text-red-600 uppercase">Mechanical Eng.</p>
                <p className="text-sm text-slate-700 mt-1">15% increase in high-risk students in S6.</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-red-100">
                <p className="text-xs font-bold text-red-600 uppercase">Computer Science</p>
                <p className="text-sm text-slate-700 mt-1">8 students below 60% attendance threshold.</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Risk Clusters</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Attendance Issues</span>
                <span className="text-sm font-bold text-slate-900">42%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[42%]"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Credit Gaps</span>
                <span className="text-sm font-bold text-slate-900">28%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-[28%]"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">GPA Decline</span>
                <span className="text-sm font-bold text-slate-900">30%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[30%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Correlation Chart */}
      <div className="card p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Attendance vs GPA Correlation (Risk Heatmap)</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                type="number" 
                dataKey="attendance" 
                name="Attendance" 
                unit="%" 
                domain={[50, 100]}
                label={{ value: 'Attendance %', position: 'bottom', offset: 0 }}
              />
              <YAxis 
                type="number" 
                dataKey="gpa" 
                name="GPA" 
                domain={[4, 10]}
                label={{ value: 'GPA', angle: -90, position: 'left' }}
              />
              <ZAxis type="number" dataKey="risk" range={[50, 400]} name="Risk Score" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Students" data={MOCK_SCATTER_DATA}>
                {MOCK_SCATTER_DATA.map((entry, index) => (
                  <Scatter 
                    key={`cell-${index}`} 
                    fill={entry.risk > 70 ? '#ef4444' : entry.risk > 40 ? '#f59e0b' : '#10b981'} 
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 flex justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-slate-500 font-medium">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs text-slate-500 font-medium">Moderate Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-slate-500 font-medium">Low Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
};
