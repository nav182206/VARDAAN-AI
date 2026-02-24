import React, { useState } from 'react';
import { getSmartGoals } from '../services/geminiService';
import { Language } from '../types';
import { Target, CheckCircle, Loader2, Wand2 } from 'lucide-react';

interface Milestone {
  milestone: string;
  status: 'pending' | 'completed' | 'error';
}

interface Props {
  language: Language;
}

const SmartGoals: React.FC<Props> = ({ language }) => {
  const [goal, setGoal] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateGoals = async () => {
    if (!goal.trim() || !targetDate) return;
    setIsLoading(true);
    const result = await getSmartGoals(goal, targetDate, language);
    setMilestones(result);
    setIsLoading(false);
  };

  const toggleMilestoneStatus = (index: number) => {
    const newMilestones = [...milestones];
    if (newMilestones[index].status === 'pending') {
      newMilestones[index].status = 'completed';
    } else if (newMilestones[index].status === 'completed') {
      newMilestones[index].status = 'pending';
    }
    setMilestones(newMilestones);
  };

  const progress = milestones.length > 0 ? (milestones.filter(m => m.status === 'completed').length / milestones.length) * 100 : 0;

  return (
    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm w-full mt-10">
      <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
        <Target className="w-7 h-7 text-emerald-500" />
        AI-Powered Smart Goals
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Your Goal</label>
            <input 
              type="text" 
              placeholder="e.g., Master Quantum Physics" 
              value={goal} 
              onChange={(e) => setGoal(e.target.value)} 
              className="mt-2 w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Target Date</label>
            <input 
              type="date" 
              value={targetDate} 
              onChange={(e) => setTargetDate(e.target.value)} 
              className="mt-2 w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
        </div>
        <button 
          onClick={handleGenerateGoals} 
          disabled={isLoading || !goal.trim() || !targetDate} 
          className="w-full bg-emerald-500 text-white px-8 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Wand2 className="w-5 h-5" /> Create Milestones</>}
        </button>
      </div>

      {milestones.length > 0 && (
        <div className="mt-10">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-600">Progress</span>
              <span className="text-sm font-black text-emerald-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4">
              <div className="bg-emerald-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div 
                key={index} 
                onClick={() => toggleMilestoneStatus(index)} 
                className={`flex items-center p-5 rounded-2xl transition-all cursor-pointer border-2 ${milestone.status === 'completed' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-emerald-300'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-5 ${milestone.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  {milestone.status === 'completed' && <CheckCircle className="w-5 h-5 text-white" />}
                </div>
                <span className={`font-bold text-slate-800 ${milestone.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                  {milestone.milestone}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartGoals;
