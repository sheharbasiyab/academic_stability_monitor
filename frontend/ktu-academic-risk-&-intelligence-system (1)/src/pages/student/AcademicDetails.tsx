import React, { useState, useMemo, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, Calendar, BookOpen, ChevronDown, ChevronUp, Calculator, TrendingUp, Target, Star, Plus, Sparkles, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSubjectRecoveryAdvice, SubjectRecoveryAdvice } from '../../services/geminiService';

interface InternalSplit {
  series1: number;
  series2: number;
  assignments: number;
  attendance: number;
}

interface SubjectData {
  name: string;
  code: string;
  split: InternalSplit;
}

export const AcademicDetails: React.FC = () => {
  const [attendance, setAttendance] = useState(72);
  const [expandedSubject, setExpandedSubject] = useState<string | null>('CS301');
  const [recoveryAdvice, setRecoveryAdvice] = useState<Record<string, SubjectRecoveryAdvice>>({});
  const [loadingAdvice, setLoadingAdvice] = useState<Record<string, boolean>>({});
  
  // CGPA Aimer State
  const [targetCGPA, setTargetCGPA] = useState(8.5);
  const [previousGPAs, setPreviousGPAs] = useState<number[]>([7.8, 8.2, 7.5]); // S1, S2, S3
  const totalSemesters = 8;

  const gpaAnalysis = useMemo(() => {
    const completedSems = previousGPAs.length;
    const remainingSems = totalSemesters - completedSems;
    const currentSum = previousGPAs.reduce((a, b) => a + b, 0);
    const requiredSum = (targetCGPA * totalSemesters) - currentSum;
    const avgNeeded = requiredSum / remainingSems;
    
    return {
      avgNeeded: Math.min(10, Math.max(0, avgNeeded)).toFixed(2),
      isPossible: avgNeeded <= 10,
      currentCGPA: (currentSum / completedSems).toFixed(2)
    };
  }, [targetCGPA, previousGPAs]);

  const [subjects, setSubjects] = useState<SubjectData[]>([
    { name: 'Mathematics IV', code: 'MA202', split: { series1: 12, series2: 10, assignments: 8, attendance: 5 } },
    { name: 'Design & Analysis of Algorithms', code: 'CS301', split: { series1: 14, series2: 13, assignments: 9, attendance: 2 } },
    { name: 'Operating Systems', code: 'CS304', split: { series1: 10, series2: 8, assignments: 7, attendance: 5 } },
    { name: 'Microprocessors', code: 'CS305', split: { series1: 15, series2: 14, assignments: 10, attendance: 10 } },
  ]);

  useEffect(() => {
    if (expandedSubject && !recoveryAdvice[expandedSubject]) {
      const fetchAdvice = async () => {
        setLoadingAdvice(prev => ({ ...prev, [expandedSubject]: true }));
        const subject = subjects.find(s => s.code === expandedSubject);
        if (subject) {
          const advice = await getSubjectRecoveryAdvice(subject);
          setRecoveryAdvice(prev => ({ ...prev, [expandedSubject]: advice }));
        }
        setLoadingAdvice(prev => ({ ...prev, [expandedSubject]: false }));
      };
      fetchAdvice();
    }
  }, [expandedSubject, subjects]);

  const updateSplit = (code: string, field: keyof InternalSplit, value: string) => {
    const numValue = Math.min(field === 'series1' || field === 'series2' ? 15 : 10, Math.max(0, parseInt(value) || 0));
    setSubjects(subjects.map(s => s.code === code ? { ...s, split: { ...s.split, [field]: numValue } } : s));
  };

  const calculateTotal = (split: InternalSplit) => {
    return split.series1 + split.series2 + split.assignments + split.attendance;
  };

  const getRiskLevel = (total: number) => {
    if (total < 23) return { label: 'High Risk', color: 'text-red-600', bg: 'bg-red-50' };
    if (total < 35) return { label: 'Moderate', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Safe', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Academic Intelligence Entry</h1>
          <p className="text-slate-500">Analyze your internal marks split-up and identify failure risks.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Calculator size={18} />
            Auto-Calculate
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Save size={18} />
            Save All Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {subjects.map((subject) => {
            const total = calculateTotal(subject.split);
            const risk = getRiskLevel(total);
            const isExpanded = expandedSubject === subject.code;
            const marksNeeded = Math.max(0, 23 - total);

            return (
              <div key={subject.code} className={`card transition-all duration-300 ${isExpanded ? 'ring-2 ring-primary/10' : ''}`}>
                <div 
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedSubject(isExpanded ? null : subject.code)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${risk.bg} ${risk.color}`}>
                      {total}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{subject.name}</h3>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{subject.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className={`text-xs font-bold uppercase tracking-widest ${risk.color}`}>{risk.label}</p>
                      <p className="text-[10px] text-slate-400 font-bold">INTERNAL TOTAL</p>
                    </div>
                    {isExpanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-100"
                    >
                      <div className="p-6 bg-slate-50/50">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                          {[
                            { label: 'Series 1', field: 'series1', max: 15 },
                            { label: 'Series 2', field: 'series2', max: 15 },
                            { label: 'Assignments', field: 'assignments', max: 10 },
                            { label: 'Attendance', field: 'attendance', max: 10 },
                          ].map((item) => (
                            <div key={item.field} className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.label} (Max {item.max})</label>
                              <input 
                                type="number"
                                value={subject.split[item.field as keyof InternalSplit]}
                                onChange={(e) => updateSplit(subject.code, item.field as keyof InternalSplit, e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="text-xs font-bold text-slate-900 uppercase mb-4 flex items-center gap-2">
                              <Calculator size={14} className="text-primary" />
                              Threshold Recovery Tracker
                            </h4>
                            
                            <div className="space-y-4">
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-2">
                                  <span>Current Components</span>
                                  <span>Score</span>
                                </div>
                                <div className="space-y-1.5">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-slate-600">IE1 (Series 1)</span>
                                    <span className={`font-bold ${subject.split.series1 < 7.5 ? 'text-red-500' : 'text-slate-900'}`}>{subject.split.series1} / 15</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-slate-600">Assignments</span>
                                    <span className="font-bold text-slate-900">{subject.split.assignments} / 10</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-slate-600">Attendance Weight</span>
                                    <span className="font-bold text-slate-900">{subject.split.attendance} / 10</span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <p className="text-[10px] font-bold text-primary uppercase mb-2">Required in IE2 (Series 2)</p>
                                <div className="flex items-end justify-between">
                                  <h4 className={`text-3xl font-black ${marksNeeded > 15 ? 'text-red-600' : 'text-primary'}`}>
                                    {marksNeeded > 15 ? '15+' : marksNeeded}
                                  </h4>
                                  <span className="text-[10px] text-slate-500 font-bold mb-1">OUT OF 15</span>
                                </div>
                                {marksNeeded > 15 && (
                                  <p className="text-[10px] text-red-600 font-bold mt-2 animate-pulse">
                                    ⚠️ IMPOSSIBLE VIA IE2 ALONE. MUST IMPROVE ASSIGNMENTS.
                                  </p>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <div className="flex-1 p-2 bg-slate-50 rounded-lg text-center">
                                  <p className="text-[8px] text-slate-400 font-bold uppercase">Current Total</p>
                                  <p className="text-sm font-black text-slate-700">{total - subject.split.series2}</p>
                                </div>
                                <div className="flex-1 p-2 bg-slate-50 rounded-lg text-center">
                                  <p className="text-[8px] text-slate-400 font-bold uppercase">Gap to 23</p>
                                  <p className="text-sm font-black text-red-500">{Math.max(0, 23 - (total - subject.split.series2))}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="text-xs font-bold text-slate-900 uppercase mb-4 flex items-center gap-2">
                              <Star size={14} className="text-orange-500" />
                              Back on Track Advice
                            </h4>
                            <div className="space-y-3">
                              {total < 23 ? (
                                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                                  <p className="text-xs text-orange-800 font-medium mb-2">Recovery Strategy:</p>
                                  <ul className="space-y-2">
                                    <li className="text-[11px] text-orange-900 flex items-start gap-2">
                                      <div className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                                      <span><b>Assignments:</b> Ensure 10/10 by submitting high-quality work. This is the easiest way to bridge the {marksNeeded} mark gap.</span>
                                    </li>
                                    <li className="text-[11px] text-orange-900 flex items-start gap-2">
                                      <div className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                                      <span><b>Attendance:</b> Don't miss any more classes. Every 5% drop could lose you 1-2 marks.</span>
                                    </li>
                                    <li className="text-[11px] text-orange-900 flex items-start gap-2">
                                      <div className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                                      <span><b>Peer Study:</b> Join a study group for {subject.name} to clarify concepts missed in Series 1.</span>
                                    </li>
                                  </ul>
                                </div>
                              ) : (
                                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                  <p className="text-xs text-blue-800 font-medium mb-1">Maintenance Tip:</p>
                                  <p className="text-[11px] text-blue-700 leading-relaxed">
                                    You are safe for now, but don't get complacent. Review your IE1 and IE2 mistakes to ensure you don't repeat them in the 100-mark University Exam.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* AI Predictive Recovery Analysis */}
                        <div className="mt-6">
                          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                              <BrainCircuit size={80} />
                            </div>
                            
                            <div className="relative">
                              <div className="flex items-center gap-2 mb-4">
                                <Sparkles size={16} className="text-primary" />
                                <h4 className="text-xs font-bold uppercase tracking-widest">AI Predictive Recovery Analysis</h4>
                              </div>

                              {loadingAdvice[subject.code] ? (
                                <div className="flex items-center gap-3 animate-pulse">
                                  <div className="w-4 h-4 bg-white/20 rounded-full"></div>
                                  <div className="h-4 bg-white/20 rounded-lg w-48"></div>
                                </div>
                              ) : recoveryAdvice[subject.code] ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="md:col-span-2 space-y-4">
                                    <p className="text-sm font-medium text-slate-200 leading-relaxed">
                                      {recoveryAdvice[subject.code].strategy}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                      {recoveryAdvice[subject.code].steps.map((step, idx) => (
                                        <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-xl flex gap-2 items-start">
                                          <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-[10px] font-bold text-primary">
                                            {idx + 1}
                                          </div>
                                          <p className="text-[10px] text-slate-300">{step}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Pass Probability</p>
                                    <div className="relative w-20 h-20 flex items-center justify-center">
                                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                                        <motion.circle 
                                          cx="18" cy="18" r="16" fill="none" 
                                          stroke={recoveryAdvice[subject.code].estimatedPassProbability > 70 ? '#10b981' : '#f59e0b'} 
                                          strokeWidth="3" 
                                          strokeDasharray={`${recoveryAdvice[subject.code].estimatedPassProbability}, 100`}
                                          initial={{ strokeDasharray: "0, 100" }}
                                          animate={{ strokeDasharray: `${recoveryAdvice[subject.code].estimatedPassProbability}, 100` }}
                                        />
                                      </svg>
                                      <span className="absolute text-lg font-black">{recoveryAdvice[subject.code].estimatedPassProbability}%</span>
                                    </div>
                                    <div className={`mt-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                      recoveryAdvice[subject.code].priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                      recoveryAdvice[subject.code].priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                      'bg-emerald-500/20 text-emerald-400'
                                    }`}>
                                      {recoveryAdvice[subject.code].priority} Priority
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs text-slate-400 italic">Select a subject to generate AI recovery insights.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="card p-6 bg-slate-900 text-white">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Target size={20} className="text-primary" />
              CGPA Target Aimer
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Target CGPA</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="5" 
                    max="10" 
                    step="0.1"
                    value={targetCGPA}
                    onChange={(e) => setTargetCGPA(parseFloat(e.target.value))}
                    className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-xl font-black text-primary">{targetCGPA}</span>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-slate-400">Current CGPA: <span className="text-white font-bold">{gpaAnalysis.currentCGPA}</span></span>
                  <span className="text-xs text-slate-400">Sems Left: <span className="text-white font-bold">{totalSemesters - previousGPAs.length}</span></span>
                </div>
                
                <div className="text-center py-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Required Avg. GPA</p>
                  <h4 className={`text-3xl font-black ${parseFloat(gpaAnalysis.avgNeeded) > 9 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {gpaAnalysis.avgNeeded}
                  </h4>
                </div>

                {!gpaAnalysis.isPossible && (
                  <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-[10px] text-red-200 text-center font-bold">
                    IMPOSSIBLE TARGET: REQUIRES {gpaAnalysis.avgNeeded} GPA
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Previous Semesters</p>
                <div className="grid grid-cols-4 gap-2">
                  {previousGPAs.map((gpa, i) => (
                    <div key={i} className="bg-white/5 p-2 rounded-lg text-center border border-white/10">
                      <p className="text-[8px] text-slate-500 font-bold">S{i+1}</p>
                      <p className="text-xs font-bold">{gpa}</p>
                    </div>
                  ))}
                  <button 
                    onClick={() => setPreviousGPAs([...previousGPAs, 8.0])}
                    className="bg-primary/20 p-2 rounded-lg text-center border border-primary/30 text-primary hover:bg-primary/30 transition-colors"
                  >
                    <Plus size={14} className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-slate-900 text-white">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Calculator size={20} className="text-primary" />
              Institutional Standards
            </h3>
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <p className="font-bold text-primary mb-1">Passing Rule</p>
                <p className="text-slate-400 text-xs">Minimum 45% (22.5, rounded to 23) in internals is required to appear for the University Exam.</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <p className="font-bold text-emerald-400 mb-1">Attendance Weightage</p>
                <p className="text-slate-400 text-xs">90%+ : 10 marks<br/>85-90% : 9 marks<br/>80-85% : 8 marks</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Attendance Entry
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-4xl font-black text-slate-900">{attendance}%</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${attendance < 75 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {attendance < 75 ? 'BELOW THRESHOLD' : 'SAFE'}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={attendance}
                onChange={(e) => setAttendance(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-xs text-slate-500 italic">
                * Attendance marks are automatically calculated into your internal total based on this percentage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
