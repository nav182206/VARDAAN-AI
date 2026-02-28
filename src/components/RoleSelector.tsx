import React from 'react';
import { User, Shield, GraduationCap } from 'lucide-react';

type Role = 'student' | 'teacher' | 'admin';

interface Props {
  onSelectRole: (role: Role) => void;
}

const RoleSelector: React.FC<Props> = ({ onSelectRole }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-100 font-sans">
      <div className="text-center p-8">
        <h1 className="text-5xl font-black text-slate-800 mb-4 tracking-tighter">Welcome to Vardaan</h1>
        <p className="text-slate-600 text-lg mb-16 max-w-md mx-auto">Please select your role to access your personalized dashboard.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <button 
            onClick={() => onSelectRole('student')} 
            className="flex flex-col items-center gap-6 p-10 bg-white rounded-[3rem] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-indigo-500 group"
          >
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-100">
              <GraduationCap className="w-12 h-12 text-indigo-600" />
            </div>
            <span className="text-2xl font-bold text-slate-800">Student</span>
          </button>
          <button 
            onClick={() => onSelectRole('teacher')} 
            className="flex flex-col items-center gap-6 p-10 bg-white rounded-[3rem] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-emerald-500 group"
          >
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-100">
              <User className="w-12 h-12 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-slate-800">Teacher</span>
          </button>
          <button 
            onClick={() => onSelectRole('admin')} 
            className="flex flex-col items-center gap-6 p-10 bg-white rounded-[3rem] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-slate-800 group"
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-slate-200">
              <Shield className="w-12 h-12 text-slate-800" />
            </div>
            <span className="text-2xl font-bold text-slate-800">Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
