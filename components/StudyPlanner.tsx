
import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Target, ArrowRight, Brain, Sparkles, AlertCircle } from 'lucide-react';
import { StudyPlan, StudyModule, Language, SUBJECTS } from '../types';
import { generateStudyPlan } from '../services/geminiService';

interface Props {
  plan: StudyPlan | null;
  language: Language;
  onPlanCreated: (plan: StudyPlan) => void;
  onStartSession: (topic: string, subject: string) => void;
}

const StudyPlanner: React.FC<Props> = ({ plan, language, onPlanCreated, onStartSession }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [diagData, setDiagData] = useState({
    examType: 'CBSE Boards' as any,
    examDate: '',
    weakSubjects: [] as string[]
  });

  const handleStartDiagnostic = async () => {
    setLoading(true);
    try {
      const modules = await generateStudyPlan(diagData.examType, diagData.examDate, diagData.weakSubjects, language);
      const newPlan: StudyPlan = {
        id: Date.now().toString(),
        examType: diagData.examType,
        examDate: diagData.examDate,
        modules,
        createdAt: Date.now()
      };
      onPlanCreated(newPlan);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-6">
        <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <h3 className="text-2xl font-black text-slate-800">Architecting Your Path...</h3>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-xl">
          <h2 className="text-3xl font-black text-slate-800 mb-6">Setup Your Smart Plan</h2>
          <div className="space-y-6">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <p className="text-slate-500 mb-4">Select your target exam:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['CBSE Boards', 'JEE Mains', 'NEET'].map(t => (
                    <button key={t} onClick={() => { setDiagData(d => ({...d, examType: t as any})); setStep(2); }} className="p-4 border-2 rounded-2xl font-bold hover:bg-slate-50">{t}</button>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <p className="text-slate-500 mb-4">When is the exam?</p>
                <input type="date" className="w-full p-4 border rounded-2xl" onChange={(e) => setDiagData(d => ({...d, examDate: e.target.value}))} />
                <button onClick={() => setStep(3)} className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-black">Next</button>
              </div>
            )}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <p className="text-slate-500 mb-4">Pick subjects you struggle with:</p>
                <div className="grid grid-cols-2 gap-3">
                  {SUBJECTS.map(s => (
                    <button key={s} onClick={() => setDiagData(d => ({...d, weakSubjects: [...d.weakSubjects, s]}))} className={`p-4 border-2 rounded-2xl font-bold ${diagData.weakSubjects.includes(s) ? 'bg-indigo-50 border-indigo-500' : ''}`}>{s}</button>
                  ))}
                </div>
                <button onClick={handleStartDiagnostic} className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl">Generate Roadmap</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em]">Target: {plan.examType}</span>
          <h2 className="text-3xl font-black text-slate-800">Your Adaptive Plan</h2>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400">Exam Date</p>
          <p className="text-lg font-black text-indigo-600">{new Date(plan.examDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="space-y-6 relative">
        <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-slate-100" />
        {plan.modules.map((mod) => (
          <div key={mod.id} className="flex gap-10 group relative z-10">
            <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center border-4 border-white shadow-lg ${
              mod.status === 'completed' ? 'bg-emerald-500 text-white' : mod.status === 'current' ? 'bg-indigo-600 text-white pulse' : 'bg-white text-slate-200'
            }`}>
              {mod.status === 'completed' ? <CheckCircle2 /> : <Brain />}
            </div>
            <div className="flex-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{mod.subject} • Week {mod.week}</p>
                  <h4 className="text-xl font-black text-slate-800">{mod.topic}</h4>
                </div>
                {mod.priority === 'high' && <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black border border-amber-100">Priority Topic</span>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => onStartSession(mod.topic, mod.subject)} className="flex-[2] bg-indigo-600 text-white py-3 rounded-2xl font-black hover:bg-indigo-700 transition-all text-sm">Start Socratic Session</button>
                <button className="flex-1 bg-slate-50 text-slate-500 py-3 rounded-2xl font-black text-sm hover:bg-slate-100">Review Notes</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlanner;
