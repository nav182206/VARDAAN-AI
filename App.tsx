
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  LayoutDashboard, 
  BrainCircuit, 
  Sparkles,
  Mic,
  MicOff,
  Users,
  Trophy,
  Star,
  LogOut,
  ShieldCheck,
  Flame,
  CalendarDays,
  Volume2,
  Loader2,
  Settings,
  Bot
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Language, ChatMessage, AppState, User, ForumPost, ForumReply } from './types';
import { getCoachingResponse } from './services/geminiService';
import LanguageSelector from './components/LanguageSelector';
import MasteryDashboard from './components/MasteryDashboard';
import ExamPanicAlert from './components/ExamPanicAlert';
import CommunityForum from './components/CommunityForum';
import AchievementsView from './components/AchievementsView';
import LoginPage from './components/LoginPage';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import StudyPlanner from './components/StudyPlanner';

const INITIAL_BADGES = [
  { id: '1', name: 'Socratic Seeker', description: 'Ask 5 high-quality conceptual questions.', icon: 'award', unlocked: true },
  { id: '2', name: 'Logic Master', description: 'Solve a Phantom Step misconception.', icon: 'award', unlocked: true },
  { id: '3', name: 'NCERT Guru', description: 'Complete 10 Physics chapters.', icon: 'award', unlocked: false },
  { id: '4', name: 'Exam Ready', description: 'Score 90% in a mock rubric test.', icon: 'award', unlocked: false },
];

const INITIAL_POSTS: ForumPost[] = [
  {
    id: '1',
    author: 'Arjun P.',
    title: 'Struggling with Integration by Parts',
    content: "Whenever I see two functions multiplied, I get confused about which one to pick as 'u'. Any simple rule of thumb?",
    subject: 'Maths',
    upvotes: 12,
    replyCount: 1,
    timestamp: Date.now() - 3600000,
    teacherReplies: [],
    isResolved: false
  },
  {
    id: '2',
    author: 'Priya S.',
    title: 'Lenz Law local analogy help!',
    content: "Vardaan gave me a great analogy about a roommate not wanting you to open the door, but I need more examples.",
    subject: 'Physics',
    upvotes: 8,
    replyCount: 0,
    timestamp: Date.now() - 7200000,
    teacherReplies: [],
    isResolved: false
  }
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    language: 'English',
    selectedSubject: 'Physics',
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: "Namaste! I am Vardaan. I'll guide you to the answer, not just give it to you. Speak or type a concept to begin.",
        timestamp: Date.now(),
        stressLevel: 'low'
      }
    ],
    isThinking: false,
    stressWarning: false,
    stressLevel: 'low',
    stats: {
      points: Number(localStorage.getItem('vardaan_points')) || 9840,
      level: 12,
      badges: INITIAL_BADGES
    },
    notifications: [],
    studyPlan: JSON.parse(localStorage.getItem('vardaan_plan') || 'null')
  });

  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem('vardaan_forum_v2');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [input, setInput] = useState('');
  const [view, setView] = useState<'chat' | 'hub' | 'dashboard' | 'forum' | 'achievements' | 'teacher-home' | 'admin-home' | 'planner'>('hub');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [streak, setStreak] = useState(0);
  
  const liveSessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('vardaan_forum_v2', JSON.stringify(forumPosts));
  }, [forumPosts]);

  const handleTeacherReply = (postId: string, content: string) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newReply: ForumReply = {
          id: Date.now().toString(),
          author: state.user?.name || 'Verified Teacher',
          content,
          isTeacher: true,
          timestamp: Date.now()
        };
        return {
          ...post,
          teacherReplies: [...post.teacherReplies, newReply],
          isResolved: true,
          replyCount: post.replyCount + 1
        };
      }
      return post;
    }));
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  useEffect(() => {
    const lastLogin = localStorage.getItem('vardaan_last_login');
    const currentStreak = Number(localStorage.getItem('vardaan_streak')) || 1;
    const today = new Date().toDateString();

    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastLogin === yesterday.toDateString()) {
        const newStreak = currentStreak + 1;
        setStreak(newStreak);
        localStorage.setItem('vardaan_streak', newStreak.toString());
      } else {
        setStreak(1);
        localStorage.setItem('vardaan_streak', '1');
      }
      localStorage.setItem('vardaan_last_login', today);
    } else {
      setStreak(currentStreak);
    }
  }, []);

  useEffect(() => {
    if (state.user?.role === 'teacher') setView('teacher-home');
    else if (state.user?.role === 'admin') setView('admin-home');
  }, [state.user]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [state.messages, state.isThinking]);

  useEffect(() => {
    if (isVoiceActive) startVoiceSession();
    else stopVoiceSession();
    return () => stopVoiceSession();
  }, [isVoiceActive]);

  const stopVoiceSession = () => {
    if (liveSessionRef.current) { 
      try { liveSessionRef.current.close(); } catch(e){} 
      liveSessionRef.current = null; 
    }
    if (audioContextRef.current) { 
      try { audioContextRef.current.close(); } catch(e){} 
      audioContextRef.current = null; 
    }
  };

  const startVoiceSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;
      let nextStartTime = 0;
      const sources = new Set<AudioBufferSourceNode>();

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: any) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              nextStartTime = Math.max(nextStartTime, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTime);
              nextStartTime += buffer.duration;
              sources.add(source);
              source.onended = () => sources.delete(source);
            }
          },
          onerror: (e) => {
            console.error("Voice Error:", e);
            setIsVoiceActive(false);
          },
          onclose: () => setIsVoiceActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `Vardaan AI Academic Coach. Language: ${state.language}. Socratic approach. Very brief responses. Focus on 11th-12th grade India (NCERT).`
        }
      });
      liveSessionRef.current = await sessionPromise;
    } catch (err) { 
      console.error("Voice Setup Failed:", err);
      setIsVoiceActive(false); 
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToUse = customText || input;
    if (!textToUse.trim() || state.isThinking) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: textToUse, timestamp: Date.now() };
    setState(prev => ({ ...prev, messages: [...prev.messages, userMsg], isThinking: true }));
    if (!customText) setInput('');
    try {
      const result = await getCoachingResponse(textToUse, state.messages, state.language, state.selectedSubject);
      const aiMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: result.explanation, 
        timestamp: Date.now(), 
        phantomStepDetected: result.phantomStepDetected, 
        misconceptionDescription: result.misconceptionDescription, 
        rubricFeedback: result.rubricFeedback, 
        stressLevel: result.stressDetection as any, 
        analogyUsed: result.analogyUsed 
      };
      
      if (result.stressDetection === 'high') {
        setState(prev => ({ ...prev, stressWarning: true, stressLevel: 'high' }));
      }

      const newPoints = state.stats.points + (result.phantomStepDetected ? 200 : 50);
      localStorage.setItem('vardaan_points', newPoints.toString());
      setState(prev => ({ ...prev, messages: [...prev.messages, aiMsg], isThinking: false, stats: { ...prev.stats, points: newPoints } }));
    } catch (e) { setState(prev => ({ ...prev, isThinking: false })); }
  };

  const handleLogin = (user: User) => setState(prev => ({ ...prev, user }));
  const handleLogout = () => setState(prev => ({ ...prev, user: null }));

  if (!state.user) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-1000 ${state.stressLevel === 'high' ? 'bg-amber-50' : 'bg-slate-50'}`}>
      {state.stressWarning && <ExamPanicAlert onClose={() => setState(p => ({ ...p, stressWarning: false, stressLevel: 'low' }))} />}
      
      <aside className="w-72 bg-white/95 backdrop-blur-2xl border-r border-slate-200 flex flex-col hidden md:flex shrink-0 z-30">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg bg-indigo-600 rotate-12`}><Sparkles className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 leading-none">VARDAAN</h1>
              <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Bharat Learner</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto scrollbar-hide">
          {state.user.role === 'student' && (
            <>
              <button onClick={() => setView('hub')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${view === 'hub' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutDashboard className="w-5 h-5" /> Hub</button>
              <button onClick={() => setView('planner')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${view === 'planner' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-50'}`}><CalendarDays className="w-5 h-5" /> Planner</button>
              <button onClick={() => setView('chat')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${view === 'chat' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-50'}`}><BrainCircuit className="w-5 h-5" /> Coach</button>
              <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${view === 'dashboard' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-50'}`}><Star className="w-5 h-5" /> Mastery</button>
              <button onClick={() => setView('forum')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${view === 'forum' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-50'}`}><Users className="w-5 h-5" /> Peers</button>
            </>
          )}
          {state.user.role === 'teacher' && (
            <>
              <button onClick={() => setView('teacher-home')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${view === 'teacher-home' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutDashboard className="w-5 h-5" /> Classroom Pulse</button>
              <button className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all"><Settings className="w-5 h-5" /> Gradebook</button>
            </>
          )}
          {state.user.role === 'admin' && <button onClick={() => setView('admin-home')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${view === 'admin-home' ? 'bg-slate-800 text-white font-bold shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}><ShieldCheck className="w-5 h-5" /> System Control</button>}
        </nav>
        <div className="p-6 border-t border-slate-100"><button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-slate-400 hover:text-rose-600 font-bold text-sm"><LogOut className="w-4 h-4" /> Sign Out</button></div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden h-full">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-40">
          <div className="flex items-center gap-6">
            <LanguageSelector selected={state.language} onSelect={(lang) => setState(p => ({ ...p, language: lang }))} />
            <div className={`flex items-center gap-3`}><div className={`w-2.5 h-2.5 rounded-full animate-pulse bg-emerald-500`} /><p className="text-[10px] font-black uppercase text-slate-500">Live Engine Ready</p></div>
          </div>
          <div className="flex items-center gap-5">
             <div className="hidden lg:flex items-center px-5 py-2 bg-white rounded-2xl border border-slate-100 gap-2"><Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500' : 'text-slate-300'}`} /><span className="text-xs font-black text-slate-700">{streak} Day Streak</span></div>
             <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-900 rounded-2xl text-white shadow-xl"><Trophy className="w-4 h-4 text-amber-400" /><span className="text-sm font-black tracking-tight">{state.stats.points.toLocaleString()} XP</span></div>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto relative z-10 scrollbar-hide ${view === 'chat' ? 'overflow-hidden flex flex-col' : ''}`}>
          {view === 'hub' && <div className="p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700"><div className="bg-indigo-600 rounded-[3.5rem] p-12 text-white shadow-2xl shadow-indigo-100"><div><h2 className="text-5xl font-black mb-4 tracking-tight">Bharat's AI Partner</h2><p className="text-indigo-100 text-lg leading-relaxed max-w-md opacity-80">Socratic coaching, logical analysis, and stress monitoring for {state.user.name.split(' ')[0]}.</p><div className="mt-10 flex gap-4"><button onClick={() => setView('chat')} className="bg-white text-indigo-600 px-8 py-5 rounded-[2rem] font-black hover:scale-105 transition-all shadow-xl">Start Coaching</button></div></div></div><MasteryDashboard /></div>}
          {view === 'planner' && <div className="p-10 w-full"><StudyPlanner plan={state.studyPlan} language={state.language} onPlanCreated={(p) => { setState(s => ({ ...s, studyPlan: p })); localStorage.setItem('vardaan_plan', JSON.stringify(p)); }} onStartSession={(t,s) => { setState(prev => ({ ...prev, selectedSubject: s as any })); setView('chat'); setTimeout(() => handleSendMessage(`I want to focus on ${t}.`), 300); }} /></div>}
          {view === 'chat' && (
            <div className="flex flex-col h-full bg-slate-50 relative">
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 md:px-20 py-10 space-y-12 scroll-smooth">
                {state.messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-2 px-4">
                       {msg.role === 'assistant' ? (
                         <>
                           <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white"><Bot className="w-3.5 h-3.5" /></div>
                           <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Vardaan AI</span>
                         </>
                       ) : (
                         <>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">You</span>
                         </>
                       )}
                    </div>
                    <div className={`max-w-[85%] transition-all duration-300 transform scale-100 hover:scale-[1.01]`}>
                      <div className={`relative p-7 rounded-[2.5rem] text-lg leading-relaxed shadow-lg border-2 ${
                        msg.role === 'user' 
                          ? 'bg-slate-900 text-white border-slate-800 rounded-tr-none' 
                          : 'bg-indigo-50/80 backdrop-blur-sm text-slate-900 border-indigo-200 border-l-8 border-l-indigo-600 rounded-tl-none'
                      }`}>
                        {msg.content}
                        {msg.role === 'assistant' && msg.analogyUsed && (
                          <div className="mt-5 p-5 bg-white/60 rounded-3xl border border-indigo-100 text-sm italic text-indigo-800 flex items-start gap-3">
                             <Sparkles className="w-4 h-4 shrink-0 text-indigo-500 mt-0.5" />
                             <span><strong>Analogy:</strong> {msg.analogyUsed}</span>
                          </div>
                        )}
                        {msg.role === 'assistant' && msg.phantomStepDetected && (
                          <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-amber-700 flex items-start gap-2">
                             <Star className="w-4 h-4 shrink-0 mt-0.5" />
                             <span>Insight: {msg.misconceptionDescription}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {state.isThinking && (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-2 px-4">
                       <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white"><Bot className="w-3.5 h-3.5" /></div>
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Vardaan AI</span>
                    </div>
                    <div className="bg-indigo-50/50 p-6 rounded-[2rem] flex items-center gap-3 border border-indigo-100 shadow-sm">
                      <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                      <span className="text-xs font-black uppercase text-indigo-400 tracking-widest">Generating Socratic Hint...</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-10 bg-white border-t border-slate-200 relative z-50">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                  <div className="flex-1 bg-slate-100 rounded-[2.5rem] border-2 border-slate-200 p-2 pl-8 flex items-center gap-4 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
                    <input 
                      type="text" 
                      value={input} 
                      onChange={(e) => setInput(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
                      placeholder={`Discuss ${state.selectedSubject} with Vardaan...`} 
                      className="flex-1 py-4 text-slate-800 focus:outline-none font-bold text-lg bg-transparent" 
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsVoiceActive(!isVoiceActive)} 
                        className={`p-4 rounded-full transition-all flex items-center justify-center ${isVoiceActive ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 ring-4 ring-rose-100' : 'text-slate-400 hover:bg-slate-200'}`}
                      >
                        {isVoiceActive ? <Mic className="w-6 h-6 animate-pulse" /> : <MicOff className="w-6 h-6" />}
                      </button>
                      <button 
                        onClick={() => handleSendMessage()} 
                        disabled={!input.trim() || state.isThinking} 
                        className="p-5 bg-indigo-600 text-white rounded-[1.5rem] shadow-xl hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
                      >
                        <Send className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {view === 'forum' && <CommunityForum posts={forumPosts} onUpdatePosts={setForumPosts} />}
          {view === 'dashboard' && <div className="p-10"><MasteryDashboard /></div>}
          {view === 'teacher-home' && <TeacherDashboard forumPosts={forumPosts} onReply={handleTeacherReply} />}
          {view === 'admin-home' && <AdminDashboard />}
        </div>
      </main>
    </div>
  );
};

export default App;
