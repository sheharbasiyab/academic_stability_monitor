import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';
import { 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  Calendar,
  CreditCard,
  Target,
  Info,
  ChevronRight,
  BrainCircuit,
  History,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { AcademicData, AttendanceRecord } from '../types';
import { getPredictiveInsights, PredictiveInsights } from '../services/geminiService';

const MOCK_ACADEMIC_DATA: AcademicData = {
  attendancePercentage: 72,
  internalTotal: 38,
  previousGPA: 7.8,
  backlogsCount: 2,
  consistencyScore: 0.65,
  earnedCredits: 92,
  requiredCredits: 110,
  activityPoints: 65,
  riskScore: 68,
};

const MOCK_HISTORICAL_GPA = [
  { semester: 'S1', gpa: 8.2 },
  { semester: 'S2', gpa: 7.9 },
  { semester: 'S3', gpa: 7.5 },
  { semester: 'S4', gpa: 7.8 },
  { semester: 'S5', gpa: 7.6 },
];

const MOCK_ATTENDANCE_HISTORY: AttendanceRecord[] = [
  { date: '2024-02-20', status: 'present' },
  { date: '2024-02-21', status: 'absent' },
  { date: '2024-02-22', status: 'present' },
  { date: '2024-02-23', status: 'absent' },
  { date: '2024-02-24', status: 'absent' },
];

const MOCK_TREND_DATA = [
  { name: 'Week 1', score: 45 },
  { name: 'Week 2', score: 52 },
  { name: 'Week 3', score: 48 },
  { name: 'Week 4', score: 61 },
  { name: 'Week 5', score: 58 },
  { name: 'Week 6', score: 68 },
];

export const StudentDashboard: React.FC = () => {
  const [data, setData] = useState<AcademicData>(MOCK_ACADEMIC_DATA);
  const [attendance, setAttendance] = useState(MOCK_ATTENDANCE_HISTORY);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [insights, setInsights] = useState<PredictiveInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(true);

  useEffect(() => {
    setData(MOCK_ACADEMIC_DATA);
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const res = await getPredictiveInsights(MOCK_ACADEMIC_DATA);
      setInsights(res);
      setLoadingInsights(false);
    };
    fetchInsights();
  }, []);

  const isDangerZone = data.attendancePercentage < 75;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Intelligence Dashboard</h1>
          <p className="text-slate-500">Track your academic risk, attendance, and credit requirements.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAttendanceModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Calendar size={18} />
            Mark Attendance
          </button>
          <button 
            onClick={() => setShowCreditModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            Update Credits
          </button>
        </div>
      </div>

      {/* AI Predictive Risk Engine */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-95"></div>
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <BrainCircuit size={160} />
        </div>
        
        <div className="relative p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full w-fit">
                <Sparkles size={14} className="text-yellow-300" />
                <span className="text-[10px] font-bold uppercase tracking-widest">AI Predictive Risk Engine</span>
              </div>
              
              {loadingInsights ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-8 bg-white/20 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded-lg w-1/2"></div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-black leading-tight">
                    {insights?.riskLevel} Risk Level Detected
                  </h2>
                  <p className="text-indigo-100 text-lg font-medium leading-relaxed">
                    {insights?.prediction}
                  </p>
                </>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 min-w-[240px]">
              <p className="text-xs font-bold text-indigo-200 uppercase mb-2">Projected GPA</p>
              <div className="flex items-end gap-2">
                <h3 className="text-5xl font-black">{loadingInsights ? '...' : insights?.projectedGPA}</h3>
                <span className="text-sm font-bold text-indigo-200 mb-2">/ 10.0</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-emerald-300 text-xs font-bold">
                <TrendingUp size={14} />
                Based on current trajectory
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {loadingInsights ? (
              [1, 2, 3].map(i => <div key={i} className="h-24 bg-white/10 rounded-2xl animate-pulse"></div>)
            ) : (
              insights?.recommendations.map((rec, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-xs font-bold">
                    0{i + 1}
                  </div>
                  <p className="text-sm font-medium text-indigo-50">{rec}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendance Intelligence Card */}
        <div className={`card p-6 relative overflow-hidden ${isDangerZone ? 'border-red-200 bg-red-50/30' : 'border-emerald-200 bg-emerald-50/30'}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Attendance Status</p>
              <h2 className="text-4xl font-black text-slate-900 mt-1">{data.attendancePercentage}%</h2>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isDangerZone ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {isDangerZone ? 'Danger Zone' : 'Safe Zone'}
            </div>
          </div>

          <div className="space-y-4">
            {isDangerZone ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-red-700 bg-red-100/50 p-4 rounded-2xl">
                  <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                  <p className="text-sm font-medium leading-relaxed">
                    Critical: You must attend <span className="font-bold">8 consecutive classes</span> to return to the Safe Zone (75%).
                  </p>
                </div>
                {insights?.attendanceWarning && (
                  <div className="bg-red-600 text-white p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
                    <AlertTriangle size={14} />
                    {insights.attendanceWarning.toUpperCase()}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-start gap-3 text-emerald-700 bg-emerald-100/50 p-4 rounded-2xl">
                <CheckCircle2 className="shrink-0 mt-0.5" size={20} />
                <p className="text-sm font-medium leading-relaxed">
                  You are academically safe. Maintain your current attendance streak.
                </p>
              </div>
            )}

            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_TREND_DATA.slice(-5)}>
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke={isDangerZone ? '#ef4444' : '#10b981'} 
                    fill={isDangerZone ? '#fee2e2' : '#d1fae5'} 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Historical Performance Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <History size={16} />
              Historical GPA
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Sem 1 to Sem 5</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_HISTORICAL_GPA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <YAxis hide domain={[0, 10]} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="gpa" radius={[6, 6, 0, 0]} barSize={24}>
                  {MOCK_HISTORICAL_GPA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.gpa > 8 ? '#10b981' : entry.gpa > 7.5 ? '#3b82f6' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
            <span>Avg: 7.8</span>
            <span className="text-primary flex items-center gap-1">
              Consistency: 0.65
              <ArrowRight size={10} />
            </span>
          </div>
        </div>

        {/* Risk Probability Visualization */}
        <div className="card p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Risk Probability</h3>
          <div className="relative w-48 h-24 overflow-hidden">
            <div className="absolute inset-0 border-[16px] border-slate-100 rounded-t-full"></div>
            <div 
              className={`absolute inset-0 border-[16px] rounded-t-full transition-all duration-1000 origin-bottom`}
              style={{ 
                borderColor: data.riskScore > 70 ? '#ef4444' : data.riskScore > 40 ? '#f59e0b' : '#10b981',
                transform: `rotate(${(data.riskScore / 100) * 180}deg)`,
                clipPath: 'inset(0 0 50% 0)'
              }}
            ></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-2xl font-black text-slate-900">
              {data.riskScore}%
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <div className={`px-4 py-1.5 rounded-xl text-xs font-bold inline-block ${
              data.riskScore > 70 ? 'bg-red-50 text-red-600' : 
              data.riskScore > 40 ? 'bg-orange-50 text-orange-600' : 
              'bg-emerald-50 text-emerald-600'
            }`}>
              {data.riskScore > 70 ? 'High Risk' : data.riskScore > 40 ? 'Moderate Risk' : 'Low Risk'}
            </div>
            <p className="text-xs text-slate-500 max-w-[200px]">
              Primary risk factor: <span className="font-bold">{isDangerZone ? 'Low Attendance' : 'Credit Gap'}</span>
            </p>
          </div>
        </div>

        {/* Performance Trend */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Performance Trend</h3>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
              <TrendingUp size={14} />
              +12.5%
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Internal Total', value: `${data.internalTotal}/50`, icon: Target, color: 'blue' },
          { label: 'Previous GPA', value: data.previousGPA, icon: TrendingUp, color: 'purple' },
          { label: 'Backlogs Count', value: data.backlogsCount, icon: AlertTriangle, color: 'red' },
          { label: 'Consistency', value: '0.65 Stable', icon: CheckCircle2, color: 'emerald' },
        ].map((stat) => (
          <div key={stat.label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Credits Tracker */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">KTU Credits Tracker</h3>
              <p className="text-sm text-slate-500">Progress towards degree completion</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-primary">{data.earnedCredits}/{data.requiredCredits}</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Credits Earned</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(data.earnedCredits / data.requiredCredits) * 100}%` }}
                className="h-full bg-primary rounded-full shadow-lg shadow-primary/20"
              />
            </div>

            {data.backlogsCount > 0 && (
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex gap-3">
                <Info className="text-orange-500 shrink-0" size={20} />
                <p className="text-sm text-orange-700 font-medium">
                  Warning: You must clear <span className="font-bold">{data.backlogsCount} backlog subjects</span> to meet credit requirements for the next semester.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Points */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Activity Points</h3>
              <p className="text-sm text-slate-500">Mandatory KTU activity points</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-emerald-600">{data.activityPoints}/100</p>
              <p className="text-xs font-bold text-slate-400 uppercase">Points Earned</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeDasharray="100, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <motion.path
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${data.activityPoints}, 100` }}
                  className="text-emerald-500"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xl font-black text-slate-900">
                {data.activityPoints}%
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                You need <span className="font-bold text-slate-900">{100 - data.activityPoints} more points</span> to complete the requirement.
              </p>
              <button className="flex items-center gap-2 text-primary text-sm font-bold hover:gap-3 transition-all">
                Add Activity Certificates
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Entry Modal (Simplified) */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">Mark Absent Days</h3>
            <p className="text-slate-500 mb-6">Select the days you were absent. Your risk score will update automatically.</p>
            
            <div className="space-y-3 mb-8">
              {['Monday, Feb 26', 'Tuesday, Feb 27', 'Wednesday, Feb 28'].map((day) => (
                <label key={day} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="font-medium text-slate-700">{day}</span>
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowAttendanceModal(false)}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAttendanceModal(false)}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
