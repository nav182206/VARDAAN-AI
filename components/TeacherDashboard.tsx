
import React, { useState } from 'react';
import { Users, BrainCircuit, AlertCircle, TrendingUp, ChevronRight, BookOpen, Clock, PlayCircle, Loader2, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CLASS_STATS = [
  { name: 'Physics', score: 68 },
  { name: 'Chemistry', score: 72 },
  { name: 'Maths', score: 64 },
  { name: 'Biology', score: 85 },
];

const PHANTOM_STEPS = [
  { id: 1, topic: "Kirchhoff's Junction Law", count: 70, difficulty: 'High', description: '70% of the class confuses sign conventions for EMF vs. potential drop.' },
  { id: 2, topic: "Work-Energy Theorem", count: 45, difficulty: 'Medium', description: 'Students often neglect negative work done by friction.' },
  { id: 3, topic: "Optical Path Difference", count: 30, difficulty: 'Low', description: 'Confusion between phase diff and path diff calculations.' }
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const TeacherDashboard: React.FC = () => {
  const [generating, setGenerating] = useState<number | null>(null);

  const handleRemedial = (id: number) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      alert("Socratic remedial lesson generated and dispatched to students' Hubs!");
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Classroom Insights</h2>
          <p className="text-slate-500 font-medium mt-1">Class 12-B | Batch 2025</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
            <Users className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-black text-slate-700">42 Students Online</span>
          </div>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
            Full Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" /> Subject Mastery Trends
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CLASS_STATS}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="score" radius={[12, 12, 0, 0]}>
                  {CLASS_STATS.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-rose-500" /> Logic Hurdles
          </h3>
          <div className="space-y-4 flex-1">
             {PHANTOM_STEPS.map(step => (
               <div key={step.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-all">
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-black text-slate-800 text-sm">{step.topic}</h4>
                   <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-full">{step.count}% Failure</span>
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed mb-4">{step.description}</p>
                 <button 
                  onClick={() => handleRemedial(step.id)}
                  className="w-full py-3 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                 >
                   {generating === step.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                   {generating === step.id ? 'Generating...' : 'Remedial Session'}
                 </button>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
