import React from 'react';
import { Search, Filter, Download, MoreVertical, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_STUDENTS = [
  { id: 'S101', name: 'Alice Johnson', dept: 'CS', sem: 6, gpa: 7.2, credits: 12, activityPoints: 35 },
  { id: 'S102', name: 'Bob Smith', dept: 'EC', sem: 4, gpa: 8.5, credits: 0, activityPoints: 10 },
  { id: 'S103', name: 'Charlie Brown', dept: 'ME', sem: 6, gpa: 6.8, credits: 4, activityPoints: 45 },
  { id: 'S104', name: 'Diana Prince', dept: 'CS', sem: 2, gpa: 9.2, credits: 0, activityPoints: 5 },
  { id: 'S105', name: 'Ethan Hunt', dept: 'EE', sem: 8, gpa: 6.1, credits: 18, activityPoints: 85 },
  { id: 'S106', name: 'Fiona Gallagher', dept: 'CS', sem: 6, gpa: 6.5, credits: 8, activityPoints: 20 },
  { id: 'S107', name: 'George Miller', dept: 'ME', sem: 4, gpa: 7.9, credits: 0, activityPoints: 15 },
];

export const StudentList: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Directory</h1>
          <p className="text-slate-500">Monitor academic performance across all departments.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download size={18} />
          Export List
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={18} />
              Filter
            </button>
            <select className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 bg-white outline-none">
              <option>All Departments</option>
              <option>Computer Science</option>
              <option>Electronics</option>
              <option>Mechanical</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dept/Sem</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">GPA</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Credits</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SAP Points</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_STUDENTS.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {student.dept} • S{student.sem}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    {student.gpa}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">
                      {student.credits}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(student.activityPoints / 120) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{student.activityPoints}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/teacher/student/${student.id}`} className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={18} />
                      </Link>
                      <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Showing 7 of 1,284 students</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-600">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
