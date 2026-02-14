
import React from 'react';
import { Wind, Heart, Timer, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const ExamPanicAlert: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse">
            <Heart className="w-8 h-8 text-indigo-600" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Breathe with Vardaan</h2>
            <p className="text-slate-600 mt-2">
              Our stress sensors detected a bit of tension. High school is tough, but you're tougher. Let's take 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
              <Wind className="w-6 h-6 text-sky-500 mb-2" />
              <span className="text-xs font-bold text-slate-500">Box Breathing</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
              <Timer className="w-6 h-6 text-amber-500 mb-2" />
              <span className="text-xs font-bold text-slate-500">Quick Break</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
              <Heart className="w-6 h-6 text-pink-500 mb-2" />
              <span className="text-xs font-bold text-slate-500">Hydration</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200"
          >
            I feel better, let's continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPanicAlert;
