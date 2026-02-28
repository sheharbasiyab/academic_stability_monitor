import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line
} from 'recharts';
import { TrendingUp, AlertTriangle, CreditCard, Users } from 'lucide-react';

const MOCK_CREDIT_PROGRESS = [
  { name: 'S1', avg: 18, target: 20 },
  { name: 'S2', avg: 17, target: 20 },
  { name: 'S3', avg: 15, target: 20 },
  { name: 'S4', avg: 16, target: 20 },
  { name: 'S5', avg: 14, target: 20 },
  { name: 'S6', avg: 12, target: 20 },
];

export const CreditsMonitor: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Credits Monitoring</h1>
        <p className="text-slate-500">Track credit accumulation and backlog trends across the institution.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Average Credit Accumulation by Semester</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CREDIT_PROGRESS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avg" name="Avg. Earned" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Required" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Critical Credit Gap</p>
                <h4 className="text-2xl font-black text-slate-900">124</h4>
              </div>
            </div>
            <p className="text-sm text-slate-500">Students who are short of credits for the next semester promotion.</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">On Track</p>
                <h4 className="text-2xl font-black text-slate-900">86%</h4>
              </div>
            </div>
            <p className="text-sm text-slate-500">Percentage of students meeting the minimum credit requirements.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Departmental Credit Health</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['CS', 'EC', 'ME', 'EE'].map((dept) => (
              <div key={dept} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-900">{dept}</span>
                  <span className="text-xs font-bold text-emerald-600">92% Health</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[92%]"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
