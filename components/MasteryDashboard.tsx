
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { TopicMastery } from '../types';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';

const mockData: TopicMastery[] = [
  { name: 'Calculus', mastery: 75, status: 'proficient' },
  { name: 'Electrodynamics', mastery: 45, status: 'developing' },
  { name: 'Organic Chem', mastery: 60, status: 'developing' },
  { name: 'Optics', mastery: 90, status: 'proficient' },
  { name: 'Mechanics', mastery: 30, status: 'learning' },
];

const MasteryDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Knowledge Graph */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Syllabus Mastery Graph
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Mastery"
                dataKey="mastery"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weakness Analysis */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Progress Roadmap
        </h3>
        <div className="space-y-4">
          {mockData.map((topic) => (
            <div key={topic.name} className="group cursor-default">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-700">{topic.name}</span>
                <span className="text-xs font-bold text-slate-500">{topic.mastery}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    topic.mastery > 80 ? 'bg-emerald-500' : topic.mastery > 50 ? 'bg-indigo-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${topic.mastery}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800">Knowledge Gap Identified</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                You're struggling with "Frame of Reference" in Mechanics. This affects your "Vector" application. Focus on 2D kinematics today.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasteryDashboard;
