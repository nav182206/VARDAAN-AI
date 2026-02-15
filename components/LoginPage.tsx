
import React from 'react';
import { Sparkles, GraduationCap, School, ShieldCheck } from 'lucide-react';
import { User, UserRole } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const roles: { role: UserRole; title: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      role: 'student',
      title: 'Student',
      desc: 'Access Socratic coaching, mastery graphs, and exam panic predictors.',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'bg-indigo-600'
    },
    {
      role: 'teacher',
      title: 'Teacher',
      desc: 'View classroom insights, track phantom steps, and monitor anxiety levels.',
      icon: <School className="w-8 h-8" />,
      color: 'bg-emerald-600'
    },
    {
      role: 'admin',
      title: 'Admin',
      desc: 'System management, RAG data engine updates, and usage monitoring.',
      icon: <ShieldCheck className="w-8 h-8" />,
      color: 'bg-slate-800'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="bg-indigo-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-black tracking-tight">VARDAAN AI</h1>
            </div>
            <h2 className="text-5xl font-black leading-tight mb-6">Empowering Bharat's Learners.</h2>
            <p className="text-indigo-100 text-lg leading-relaxed opacity-90">
              Personalized academic coaching for 11th & 12th grade students, powered by advanced reasoning and empathetic AI.
            </p>
          </div>
          <div className="relative z-10 pt-12">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Crafted for Excellence</p>
            <p className="text-sm font-medium">By ByteForcee</p>
          </div>
          {/* Decorative circles */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full opacity-50" />
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-700 rounded-full opacity-50" />
        </div>

        <div className="p-12 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-slate-800 mb-2">Welcome Back</h3>
            <p className="text-slate-500 font-medium">Please select your portal to continue.</p>
          </div>

          <div className="space-y-4">
            {roles.map((r) => (
              <button
                key={r.role}
                onClick={() => onLogin({ id: r.role + '-1', name: `Test ${r.title}`, role: r.role })}
                className="w-full group flex items-start gap-4 p-5 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all text-left"
              >
                <div className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 ${r.color}`}>
                  {r.icon}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{r.title} Portal</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100">
            <p className="text-center text-xs text-slate-400 font-medium">
              By continuing, you agree to Vardaan's <span className="text-indigo-600 hover:underline cursor-pointer">Terms of Service</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
