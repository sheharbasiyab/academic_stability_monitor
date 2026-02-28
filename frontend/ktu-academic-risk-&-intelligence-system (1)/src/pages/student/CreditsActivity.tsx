import React, { useState, useEffect } from 'react';
import { CreditCard, Award, Plus, Trash2, AlertTriangle, CheckCircle2, Info, BookOpen, Save, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const CreditsActivity: React.FC = () => {
  const studentId = 'S101'; // Mock current student
  const [backlogs, setBacklogs] = useState([
    { id: 1, subject: 'Engineering Physics', code: 'PH100', sem: 1 },
    { id: 2, subject: 'Mechanics', code: 'BE100', sem: 2 },
  ]);

  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    socket = io();
    
    socket.on('connect', () => {
      socket.emit('join_student', studentId);
    });

    socket.on('activities_list', (data) => setActivities(data));
    socket.on('activity_added', (activity) => setActivities(prev => [...prev, activity]));
    socket.on('activity_updated', (updated) => {
      setActivities(prev => prev.map(a => a.id === updated.id ? updated : a));
    });
    socket.on('activity_removed', (id) => {
      setActivities(prev => prev.filter(a => a.id !== id));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const [newActivity, setNewActivity] = useState({ name: '', points: '', groupId: 0 });
  const [showAddForm, setShowAddForm] = useState(false);

  const groupConfigs = [
    { name: 'Group 1: Professional & Technical', max: 40, description: 'Hackathons, Paper Presentations, Professional Bodies' },
    { name: 'Group 2: Social & Community', max: 40, description: 'NSS, NCC, Social Service, Environmental Activities' },
    { name: 'Group 3: Creative & Sports', max: 40, description: 'Cultural Events, Sports, Arts, Literature' },
  ];

  const categories = groupConfigs.map((config, index) => {
    const earned = activities
      .filter(a => a.groupId === index && a.status === 'Approved')
      .reduce((sum, a) => sum + a.points, 0);
    return { ...config, earned: Math.min(config.max, earned) };
  });

  const totalEarned = categories.reduce((acc, cat) => acc + cat.earned, 0);
  const totalRequired = 120;

  const addActivity = () => {
    if (!newActivity.name || !newActivity.points) return;
    const activity = {
      studentId,
      name: newActivity.name,
      points: parseInt(newActivity.points as string),
      groupId: newActivity.groupId,
      date: new Date().toISOString().split('T')[0],
      imageUrl: `https://picsum.photos/seed/${Math.random()}/800/600`
    };
    
    socket.emit('add_activity', activity);
    setNewActivity({ name: '', points: '', groupId: 0 });
    setShowAddForm(false);
  };

  const removeActivity = (id: number) => {
    socket.emit('remove_activity', id);
  };

  const [semesterCredits, setSemesterCredits] = useState<Record<number, number>>({
    1: 18,
    2: 20,
    3: 15,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0
  });

  const totalCreditsEarned = Object.values(semesterCredits).reduce((a, b) => (a as number) + (b as number), 0) as number;
  const totalCreditsRequired = 160;

  const updateCredits = (sem: number, value: string) => {
    const numValue = Math.min(30, Math.max(0, parseInt(value) || 0));
    setSemesterCredits({ ...semesterCredits, [sem]: numValue });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Credits & Activity Points</h1>
          <p className="text-slate-500">Manage your semester-wise credits, backlogs, and activity certificates.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Save size={18} />
            Save Progress
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Activity
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Activity Entry Form */}
          {showAddForm && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 bg-slate-50 border-2 border-primary/20"
            >
              <h3 className="text-sm font-bold text-slate-900 uppercase mb-4">Add New Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Activity Name</label>
                  <input 
                    type="text" 
                    value={newActivity.name}
                    onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                    placeholder="e.g. Hackathon"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Points</label>
                  <input 
                    type="number" 
                    value={newActivity.points}
                    onChange={(e) => setNewActivity({...newActivity, points: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Group</label>
                  <select 
                    value={newActivity.groupId}
                    onChange={(e) => setNewActivity({...newActivity, groupId: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none"
                  >
                    {groupConfigs.map((g, i) => (
                      <option key={i} value={i}>{g.name.split(':')[0]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={addActivity}
                  className="btn-primary px-6 py-2 text-sm"
                >
                  Add Activity
                </button>
              </div>
            </motion.div>
          )}

          {/* Credit Accumulation Section */}
          <div className="card">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="text-primary" size={20} />
                Semester-wise Credit Entry
              </h3>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase">Total Earned</p>
                <p className="text-lg font-black text-primary">{totalCreditsEarned} / {totalCreditsRequired}</p>
              </div>
            </div>
            <div className="p-6 bg-slate-50/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(semesterCredits).map(([sem, credits]) => (
                  <div key={sem} className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Semester {sem}</label>
                    <input 
                      type="number"
                      value={credits}
                      onChange={(e) => updateCredits(parseInt(sem), e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Credit Accumulation Rate</p>
                  <p className="text-xs text-slate-500">You are currently at {Math.round(((totalCreditsEarned as number) / totalCreditsRequired) * 100)}% of the total credits required for graduation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Backlogs Section */}
          <div className="card">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-red-500" size={20} />
                Backlog Subjects
              </h3>
              <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                {backlogs.length} Active
              </span>
            </div>
            <div className="p-0">
              {backlogs.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {backlogs.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.subject}</p>
                        <p className="text-xs text-slate-500">{item.code} • Semester {item.sem}</p>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={32} />
                  <p className="text-slate-500 font-medium">No active backlogs!</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Certificates Section */}
          <div className="card">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="text-emerald-500" size={20} />
                Activity Certificates
              </h3>
            </div>
            <div className="p-0">
              <div className="divide-y divide-slate-100">
                {activities.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">{groupConfigs[item.groupId].name.split(':')[0]} • {item.points} Points</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${
                        item.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {item.status}
                      </span>
                      <button 
                        onClick={() => removeActivity(item.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50">
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-bold hover:border-primary hover:text-primary transition-all"
                >
                  + Add New Activity
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Activity Points Breakdown */}
          <div className="card p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <BookOpen size={16} className="text-primary" />
              Points Breakdown
            </h3>
            <div className="space-y-6">
              {categories.map((cat) => (
                <div key={cat.name} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">{cat.name}</span>
                    <span className="text-slate-900 font-bold">{cat.earned} / {cat.max}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${(cat.earned / cat.max) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex gap-3">
                <Info size={18} className="text-blue-500 shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  A total of <span className="font-bold">100 activity points</span> are mandatory for the award of B.Tech degree. Points are capped per category.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-emerald-600 text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Total Earned</p>
            <h4 className="text-4xl font-black">35 / 100</h4>
            <p className="text-xs mt-4 opacity-80 leading-relaxed">
              You are on track. Complete 65 more points through approved activities to meet graduation requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
