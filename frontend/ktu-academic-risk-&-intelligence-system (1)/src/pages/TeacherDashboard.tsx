import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line
} from 'recharts';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Star,
  Award,
  CreditCard
} from 'lucide-react';
import { motion } from 'motion/react';

const MOCK_GPA_DISTRIBUTION = [
  { name: '9.0+', value: 15, color: '#10b981' },
  { name: '8.0-9.0', value: 45, color: '#3b82f6' },
  { name: '7.0-8.0', value: 30, color: '#f59e0b' },
  { name: '< 7.0', value: 10, color: '#ef4444' },
];

const MOCK_ACTIVITY_PROGRESS = [
  { name: 'S1', points: 15 },
  { name: 'S2', points: 25 },
  { name: 'S3', points: 40 },
  { name: 'S4', points: 55 },
  { name: 'S5', points: 70 },
  { name: 'S6', points: 85 },
];

const MOCK_STUDENTS = [
  { id: 'S101', name: 'Alice Johnson', dept: 'CS', sem: 6, gpa: 7.2, credits: 12, activityPoints: 35 },
  { id: 'S102', name: 'Bob Smith', dept: 'EC', sem: 4, gpa: 8.5, credits: 0, activityPoints: 10 },
  { id: 'S103', name: 'Charlie Brown', dept: 'ME', sem: 6, gpa: 6.8, credits: 4, activityPoints: 45 },
  { id: 'S104', name: 'Diana Prince', dept: 'CS', sem: 2, gpa: 9.2, credits: 0, activityPoints: 5 },
  { id: 'S105', name: 'Ethan Hunt', dept: 'EE', sem: 8, gpa: 6.1, credits: 18, activityPoints: 85 },
];

export const TeacherDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Academic Overview</h1>
          <p className="text-slate-500">Monitoring student performance and activity point progress.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: '1,284', icon: Users, color: 'blue', trend: '+12%' },
          { label: 'Avg. GPA', value: '7.84', icon: Star, color: 'emerald', trend: '+0.2' },
          { label: 'Pending Approvals', value: '24', icon: Award, color: 'orange', trend: '+5' },
          { label: 'Credit Gaps', value: '45', icon: CreditCard, color: 'red', trend: '-2%' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.trend}
                {stat.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GPA Distribution */}
        <div className="card p-6 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-900 mb-6">GPA Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_GPA_DISTRIBUTION}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_GPA_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Point Progress */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Avg. Activity Points per Semester</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_ACTIVITY_PROGRESS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="points" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Students Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Student Performance</h3>
          <button className="text-primary text-sm font-bold hover:underline">View All Students</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dept/Sem</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">GPA</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Credit Gap</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SAP Points</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_STUDENTS.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700">{student.dept} - S{student.sem}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{student.gpa}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${student.credits > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                      {student.credits}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${(student.activityPoints / 120) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{student.activityPoints}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-primary font-bold text-sm hover:underline">Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
