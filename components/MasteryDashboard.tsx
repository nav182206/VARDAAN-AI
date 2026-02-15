
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, RadarProps } from 'recharts';
import { TopicMastery } from '../types';
import { Target, TrendingUp, AlertTriangle, ArrowRight, Brain } from 'lucide-react';

const mockData: TopicMastery[] = [
  { name: 'Calculus', mastery: 75, status: 'proficient' },
  { name: 'Electrodynamics', mastery: 45, status: 'developing' },
  { name: 'Organic Chem', mastery: 60, status: 'developing' },
  { name: 'Optics', mastery: 90, status: 'proficient' },
  { name: 'Mechanics', mastery: 30, status: 'learning' },
];

const MasteryDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-2">
      {/* Knowledge Graph Layer */}
      <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-600" />
            Syllabus Neural Map
          </h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">Active Learning</span>
        </div>
        <div className="h-[350px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700, fill: '#475569' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
              <Radar
                name="Mastery"
                dataKey="mastery"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.4}
                animationBegin={0}
                animationDuration={1500}
              />
            </RadarChart>
          </ResponsiveContainer>
          {/* Legend Overlay */}
          <div className="absolute bottom-0 right-0 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col gap-2">
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Proficient
             </div>
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <div className="w-2 h-2 rounded-full bg-amber-500" /> Gap Identified
             </div>
          </div>
        </div>
      </div>

      {/* Actionable Insights */}
      <div className="space-y-6">
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-xl">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            Next Mastery Node
          </h3>
          <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-black text-emerald-900 text-lg mb-1">Rotational Dynamics</h4>
              <p className="text-emerald-700 text-sm mb-4 leading-relaxed">
                You've cleared Linear Kinematics. Bridging to Angular motion will unlock 15% more Physics mastery.
              </p>
              <button className="flex items-center gap-2 text-xs font-black text-white bg-emerald-600 px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                Begin Bridge Lesson <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
               <Target className="w-32 h-32 text-emerald-900" />
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] shadow-lg shadow-amber-100/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-black text-amber-900 mb-1">Misconception Alert</p>
              <p className="text-sm text-amber-800 leading-relaxed mb-4">
                You're consistently applying 1D logic to 2D vector problems. This "Phantom Step" is slowing your progress in Mechanics.
              </p>
              <div className="flex gap-2">
                <span className="text-[10px] font-bold bg-white text-amber-700 px-3 py-1 rounded-full border border-amber-100">Logic Correction Needed</span>
                <span className="text-[10px] font-bold bg-white text-amber-700 px-3 py-1 rounded-full border border-amber-100">NCERT Ch 4.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasteryDashboard;
