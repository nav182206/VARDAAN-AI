
import React, { useState, useEffect, useRef } from 'react';
import { Wind, X, Volume2, Play, Pause, RefreshCw } from 'lucide-react';
import { getBreathingCue } from '../services/geminiService';

interface Props {
  onClose: () => void;
  language: string;
}

const ExamPanicAlert: React.FC<Props> = ({ onClose, language }) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)'>('Inhale');
  const [seconds, setSeconds] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playCue = async (text: string) => {
    const base64Audio = await getBreathingCue(text);
    if (!base64Audio) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') await ctx.resume();
    
    const bytes = atob(base64Audio).split('').map(c => c.charCodeAt(0));
    const dataInt16 = new Int16Array(new Uint8Array(bytes).buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
  };

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            setPhase(p => {
              if (p === 'Inhale') { playCue("Hold your breath..."); return 'Hold (Full)'; }
              if (p === 'Hold (Full)') { playCue("Slowly exhale..."); return 'Exhale'; }
              if (p === 'Exhale') { playCue("Hold empty..."); return 'Hold (Empty)'; }
              playCue("Breathe in..."); return 'Inhale';
            });
            return 4;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggleExercise = () => {
    if (!isActive) {
      playCue("Let's start the box breathing. Breathe in deeply through your nose.");
    }
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setPhase('Inhale');
    setSeconds(4);
    setIsActive(false);
  };

  const progress = ((4 - seconds) / 4) * 100;
  const strokeDasharray = 2 * Math.PI * 90; // r=90
  const strokeDashoffset = strokeDasharray - (strokeDasharray * progress) / 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-3xl px-4">
      <div className="bg-white w-full max-w-lg rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-500" />
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-full transition-all active:scale-90"
        >
          <X className="w-6 h-6 text-slate-400" />
        </button>

        <div className="flex flex-col items-center text-center space-y-10">
          <div className="relative flex items-center justify-center">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle cx="128" cy="128" r="90" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
              <circle 
                cx="128" 
                cy="128" 
                r="90" 
                stroke="currentColor" 
                strokeWidth="12" 
                fill="transparent" 
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }}
                className={`transition-colors duration-500 ${isActive ? 'text-indigo-600' : 'text-slate-300'}`}
              />
            </svg>
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${isActive && phase === 'Inhale' ? 'scale-110' : isActive && phase === 'Exhale' ? 'scale-90' : 'scale-100'}`}>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">{phase}</span>
              <span className="text-7xl font-black text-slate-800 tabular-nums">{seconds}</span>
            </div>
          </div>

          <div className="max-w-xs">
            <h2 className="text-3xl font-black text-slate-800">Breathe with Vardaan</h2>
            <p className="text-slate-500 mt-2 font-medium leading-relaxed">Box breathing resets your nervous system. Follow the timer and audio cues.</p>
          </div>

          <div className="flex gap-4 w-full">
            <button
              onClick={toggleExercise}
              className={`flex-1 py-6 rounded-[2rem] font-black flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-95 ${isActive ? 'bg-slate-100 text-slate-600' : 'bg-indigo-600 text-white shadow-indigo-200'}`}
            >
              {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              {isActive ? 'Pause' : 'Start Guidance'}
            </button>
            <button
              onClick={resetExercise}
              className="p-6 bg-slate-50 text-slate-400 rounded-[2rem] hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-3 px-8 py-3 bg-indigo-50 rounded-full text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em] animate-pulse">
            <Volume2 className="w-4 h-4" /> AI Voice Guide Active
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPanicAlert;
