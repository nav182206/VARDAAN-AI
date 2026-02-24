
import React from 'react';
import { Sparkles, GraduationCap, School, ShieldCheck, ArrowRight } from 'lucide-react';
import { User, UserRole } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const roles: { role: UserRole; title: string; desc: string; icon: React.ReactNode; color: string, name: string }[] = [
    {
      role: 'student',
      title: 'Student Portal',
      desc: 'Personalized coaching & mastery tracking.',
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'from-indigo-500 to-violet-600',
      name: 'Priya Sharma'
    },
    {
      role: 'teacher',
      title: 'Teacher Dashboard',
      desc: 'Classroom insights & student analytics.',
      icon: <School className="w-6 h-6" />,
      color: 'from-emerald-500 to-green-600',
      name: 'Mr. Gupta'
    },
    {
      role: 'admin',
      title: 'Admin Console',
      desc: 'System management & data engine control.',
      icon: <ShieldCheck className="w-6 h-6" />,
      color: 'from-slate-700 to-slate-900',
      name: 'Admin User'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-sans p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-20">
        
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 rotate-12">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">VARDAAN</h1>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-tight sm:leading-none mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
            Academic Excellence, Reimagined.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-lg mx-auto lg:mx-0">
            An elite Socratic academic coach for Class 11-12 students in India, focusing on deep conceptual understanding and exam readiness.
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl sm:rounded-[3rem] p-6 sm:p-8 md:p-12">
          <h3 className="text-2xl sm:text-3xl font-black text-center mb-8 sm:mb-10">Select Your Portal</h3>
          <div className="space-y-4 sm:space-y-5">
            {roles.map((r) => (
              <button
                key={r.role}
                onClick={() => onLogin({ id: r.role + '-1', name: r.name, role: r.role })}
                className="w-full group flex items-center gap-4 sm:gap-5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-700/30 border border-white/10 hover:bg-slate-700/50 hover:border-indigo-500 transition-all text-left"
              >
                <div className={`shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${r.color}`}>
                  {r.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-1">{r.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-400">{r.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
