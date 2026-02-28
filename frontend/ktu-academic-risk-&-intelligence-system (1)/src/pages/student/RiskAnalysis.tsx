import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { AlertCircle, TrendingDown, ShieldCheck, Zap, Info } from 'lucide-react';
import { motion } from 'motion/react';

const MOCK_RISK_FACTORS = [
  { subject: 'Attendance', A: 85, fullMark: 100 },
  { subject: 'Internal Marks', A: 65, fullMark: 100 },
  { subject: 'Backlogs', A: 40, fullMark: 100 },
  { subject: 'GPA Trend', A: 75, fullMark: 100 },
  { subject: 'Credits Gap', A: 55, fullMark: 100 },
  { subject: 'Activity Pts', A: 90, fullMark: 100 },
];

const MOCK_PREDICTION_DATA = [
  { name: 'Current', risk: 68 },
  { name: 'Scenario A', risk: 45, desc: 'With 100% Attendance' },
  { name: 'Scenario B', risk: 30, desc: 'Clearing 1 Backlog' },
  { name: 'Scenario C', risk: 15, desc: 'Both Combined' },
];

export const RiskAnalysis: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Detailed Risk Analysis</h1>
        <p className="text-slate-500">AI-powered breakdown of your academic standing and risk factors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Factor Radar */}
        <div className="card p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Risk Factor Breakdown</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_RISK_FACTORS}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Performance"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 text-center mt-4 italic">
            * Higher values indicate lower risk in that specific category.
          </p>
        </div>

        {/* AI Insights & Recommendations */}
        <div className="space-y-6">
          <div className="card p-6 border-l-4 border-primary">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-primary" size={24} />
              <h3 className="text-lg font-bold text-slate-900">AI Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-2xl">
                <p className="text-sm text-blue-800 font-medium">
                  "Your primary risk factor is the <span className="font-bold">Credit Gap</span>. You have 18 credits pending from previous semesters which might block your S7 registration."
                </p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl">
                <p className="text-sm text-emerald-800 font-medium">
                  "Positive Trend: Your Internal Marks have improved by 15% compared to the last assessment."
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={20} />
              Recommended Actions
            </h3>
            <ul className="space-y-3">
              {[
                'Attend all classes for the next 2 weeks to reach 75% threshold.',
                'Register for the supplementary exam for "Data Structures".',
                'Complete 2 MOOC courses to earn 10 additional activity points.',
                'Focus on Internal Assessment 2 to compensate for IA1 scores.'
              ].map((action, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* What-If Analysis */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900">What-If Analysis</h3>
            <p className="text-sm text-slate-500">Predict how specific actions will impact your overall risk score.</p>
          </div>
          <div className="flex items-center gap-2 text-primary bg-primary/5 px-3 py-1.5 rounded-xl text-xs font-bold">
            <TrendingDown size={14} />
            Risk Reduction Simulator
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_PREDICTION_DATA.map((scenario, i) => (
            <motion.div 
              key={scenario.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                i === 0 ? 'border-slate-200 bg-white' : 'border-emerald-100 bg-emerald-50/30 hover:border-emerald-300'
              }`}
            >
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{scenario.name}</p>
              <div className="flex items-end gap-2">
                <h4 className="text-3xl font-black text-slate-900">{scenario.risk}%</h4>
                <span className="text-xs font-bold text-slate-500 mb-1.5">Risk</span>
              </div>
              {scenario.desc && (
                <p className="text-xs text-emerald-600 font-bold mt-3 flex items-center gap-1">
                  <TrendingDown size={12} />
                  {scenario.desc}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-slate-50 rounded-2xl flex items-start gap-3">
          <Info className="text-slate-400 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-slate-500 leading-relaxed">
            This simulation uses a Random Forest classifier trained on 5 years of KTU academic data to predict your probability of being placed on condonation or facing a year-back.
          </p>
        </div>
      </div>
    </div>
  );
};
