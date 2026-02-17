
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
  Bot,
  Heart,
  ArrowRight,
  Lightbulb,
  FileText,
  Library
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Language, ChatMessage, AppState, User, ForumPost, ForumReply, SUBJECTS, VaultItem, SharedResource } from './types';
import { getCoachingResponse, getStressSupport } from './services/geminiService';
import LanguageSelector from './components/LanguageSelector';
import MasteryDashboard from './components/MasteryDashboard';
import ExamPanicAlert from './components/ExamPanicAlert';
import CommunityForum from './components/CommunityForum';
import AchievementsView from './components/AchievementsView';
import LoginPage from './components/LoginPage';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import StudyPlanner from './components/StudyPlanner';
import KnowledgeVault from './components/KnowledgeVault';

const INITIAL_BADGES = [
  { id: '1', name: 'Socratic Seeker', description: 'Ask 5 high-quality conceptual questions.', icon: 'award', unlocked: true },
  { id: '2', name: 'Logic Master', description: 'Solve a Phantom Step misconception.', icon: 'award', unlocked: true },
  { id: '3', name: 'Multidisciplinary Guru', description: 'Master concepts in 4 different subjects.', icon: 'award', unlocked: false },
  { id: '4', name: 'Study Pod Alpha', description: 'Help resolve 5 shared doubts in pods.', icon: 'award', unlocked: false },
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
    title: 'Off-by-one errors in C++',
    content: "Why do my loops always run one time extra or less? I always mess up the <= vs < logic.",
    subject: 'Computer Science',
    upvotes: 8,
    replyCount: 0,
    timestamp: Date.now() - 7200000,
    teacherReplies: [],
    isResolved: false
  }
];

const INITIAL_RESOURCES: SharedResource[] = [
  { id: 'r1', name: 'NCERT Physics Class 12 - Mechanics', subject: 'Physics', chapter: 'Mechanics', size: '15.4 MB', type: 'PDF', status: 'Indexed', timestamp: Date.now() },
  { id: 'r2', name: 'NCERT Maths Class 12 - Calculus', subject: 'Maths', chapter: 'Calculus', size: '12.8 MB', type: 'PDF', status: 'Indexed', timestamp: Date.now() },
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    language: 'English',
    selectedSubject: 'Maths',
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: "Namaste! I am Vardaan. I'll guide you to the answer across all your subjects. Speak or type any doubt to begin.",
        timestamp: Date.now(),
        stressLevel: 'low'
      }
    ],
    vault: JSON.parse(localStorage.getItem('vardaan_vault') || '[]'),
    sharedResources: JSON.parse(localStorage.getItem('vardaan_shared') || JSON.stringify(INITIAL_RESOURCES)),
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
  const [view, setView] = useState<'chat' | 'hub' | 'dashboard' | 'forum' | 'achievements' | 'teacher-home' | 'admin-home' | 'planner' | 'vault'>('hub');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [streak, setStreak] = useState(0);
  const [affirmation, setAffirmation] = useState<{ affirmation: string; tip: string } | null>(null);
  const [subjectMenuOpen, setSubjectMenuOpen] = useState(false);
  
  const liveSessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('vardaan_forum_v2', JSON.stringify(forumPosts));
  }, [forumPosts]);

  useEffect(() => {
    localStorage.setItem('vardaan_vault', JSON.stringify(state.vault));
  }, [state.vault]);

  useEffect(() => {
    localStorage.setItem('vardaan_shared', JSON.stringify(state.sharedResources));
  }, [state.sharedResources]);

  useEffect(() => {
    if (view === 'hub' && state.user) {
      loadAffirmation();
    }
  }, [view, state.user, state.selectedSubject]);

  const loadAffirmation = async () => {
    const support = await getStressSupport(state.stressLevel, state.selectedSubject, state.language);
    setAffirmation(support);
  };

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
          systemInstruction: `Vardaan AI Academic Coach. Focus on: VOICE-TO-CONCEPT. Parse spoken user native language (Hindi, Tamil, etc.) into precise NCERT technical terminology for ${state.selectedSubject}. Use a Socratic coaching style.`
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
      const aiMsg: any = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: result.explanation, 
        timestamp: Date.now(), 
        phantomStepDetected: result.phantomStepDetected, 
        misconceptionDescription: result.misconceptionDescription, 
        rubricFeedback: result.rubricFeedback, 
        stressLevel: result.stressDetection as any, 
        analogyUsed: result.conceptualExample || result.analogyUsed,
        conceptNote: result.conceptNote
      };
      
      // Auto-save to vault if there's a concept note
      if (result.conceptNote && result.conceptNote.length > 0) {
        const vaultItem: VaultItem = {
          id: Date.now().toString(),
          subject: state.selectedSubject,
          topic: textToUse.length > 30 ? textToUse.substring(0, 30) + '...' : textToUse,
          content: result.conceptNote,
          misconception: result.phantomStepDetected ? result.misconceptionDescription : undefined,
          timestamp: Date.now()
        };
        setState(prev => ({ ...prev, vault: [vaultItem, ...prev.vault] }));
      }

      if (result.stressDetection === 'high') {
        setState(prev => ({ ...prev, stressWarning: true, stressLevel: 'high' }));
      }

      const newPoints = state.stats.points + (result.phantomStepDetected ? 200 : 50);
      localStorage.setItem('vardaan_points', newPoints.toString());
      setState(prev => ({ ...prev, messages: [...prev.messages, aiMsg], isThinking: false, stats: { ...prev.stats, points: newPoints } }));
    } catch (e) { setState(prev => ({ ...prev, isThinking: false })); }
  };

  const handleDeleteVaultItem = (id: string) => {
    setState(prev => ({ ...prev, vault: prev.vault.filter(item => item.id !== id) }));
  };

  const handleAddSharedResource = (resource: SharedResource) => {
    setState(prev => ({ ...prev, sharedResources: [resource, ...prev.sharedResources] }));
  };

  const handleRemoveSharedResource = (id: string) => {
    setState(prev => ({ ...prev, sharedResources: prev.sharedResources.filter(r => r.id !== id) }));
  };

  const handleUpdateResourceStatus = (id: string, status: 'Indexed' | 'Processing') => {
    setState(prev => ({
      ...prev,
      sharedResources: prev.sharedResources.map(r => r.id === id ? { ...r, status } : r)
    }));
  };

  const handleLogin = (user: User) => setState(prev => ({ ...prev, user }));
  const handleLogout = () => setState(prev => ({ ...prev, user: null }));

  const startBridgeLesson = (topic: string, subject: string) => {
    setState(prev => ({ 
      ...prev, 
      selectedSubject: subject as any,
      messages: [{ id: 'init', role: 'assistant', content: `Mastery Bridge: ${topic}. Identifying foundation gaps...`, timestamp: Date.now() }] 
    }));
    setView('chat');
    setTimeout(() => handleSendMessage(`I am ready for the bridge lesson on ${topic} in ${subject}. Explain with notes and scientific examples.`), 500);
  };

  if (!state.user) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-1000 ${state.stressLevel === 'high' ? 'bg-amber-50' : 'bg-slate-50'}`}>
      {state.stressWarning && <ExamPanicAlert language={state.language} onClose={() => setState(p => ({ ...p, stressWarning: false, stressLevel: 'low' }))} />}
      
      <aside className="w-72 bg-white/95 backdrop-blur-2xl border-r border-slate-200 flex flex-col hidden md:flex shrink-0 z-30 shadow-2xl shadow-slate-200/50">
        <div className="p-10 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 rotate-12 transition-transform hover:rotate-0`}><Sparkles className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 leading-none tracking-tight">VARDAAN</h1>
              <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-1 block">Empowering Bharat</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto scrollbar-hide">
          {state.user.role === 'student' && (
            <>
              <button onClick={() => setView('hub')} className={`w-full flex items-center gap-3 px-6 py-5 rounded-[2rem] transition-all group ${view === 'hub' ? 'bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}>
                <LayoutDashboard className={`w-5 h-5 transition-transform group-hover:scale-110`} /> Hub
              </button>
              <button onClick={() => setView('planner')} className={`w-full flex items-center gap-3 px-6 py-5 rounded-[2rem] transition-all group ${view === 'planner' ? 'bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}>
                <CalendarDays className={`w-5 h-5 transition-transform group-hover:scale-110`} /> Roadmap
              </button>
              <button onClick={() => setView('chat')} className={`w-full flex items-center gap-3 px-6 py-5 rounded-[2rem] transition-all group ${view === 'chat' ? 'bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}>
                <BrainCircuit className={`w-5 h-5 transition-transform group-hover:scale-110`} /> Socratic Coach
              </button>
              <button onClick={() => setView('vault')} className={`w-full flex items-center gap-3 px-6 py-5 rounded-[2rem] transition-all group ${view === 'vault' ? 'bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}>
                <Library className={`w-5 h-5 transition-transform group-hover:scale-110`} /> Knowledge Vault
              </button>
              <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-6 py-5 rounded-[2rem] transition-all group ${view === 'dashboard' ? 'bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}>
                <Star className={`w-5 h-5 transition-transform group-hover:scale-110`} /> Mastery Map
              </button>
              <button onClick={() => setView('forum')} className={`w-full flex items-center gap-3 px-6 py-5 rounded-[2rem] transition-all group ${view === 'forum' ? 'bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}>
                <Users className={`w-5 h-5 transition-transform group-hover:scale-110`} /> Study Pods
              </button>
            </>
          )}
          {state.user.role === 'teacher' && (
            <>
              <button onClick={() => setView('teacher-home')} className={`w-full flex items-center gap-3 px-6 py-5 rounded-[2rem] transition-all group ${view === 'teacher-home' ? 'bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-100' : 'text-slate-500 hover:bg-slate-50'}`}>
                <LayoutDashboard className={`w-5 h-5 transition-transform group-hover:scale-110`} /> Classroom Pulse
              </button>
              <button className="w-full flex items-center gap-3 px-6 py-5 rounded-[2rem] text-slate-500 hover:bg-slate-50 transition-all"><Settings className="w-5 h-5" /> Analytics</button>
            </>
          )}
          {state.user.role === 'admin' && <button onClick={() => setView('admin-home')} className={`w-full flex items-center gap-3 px-6 py-5 rounded-[2rem] transition-all group ${view === 'admin-home' ? 'bg-slate-800 text-white font-bold shadow-2xl' : 'text-slate-500 hover:bg-slate-50'}`}><ShieldCheck className="w-5 h-5" /> Knowledge Portal</button>}
        </nav>
        <div className="p-6 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-5 rounded-[2rem] text-slate-400 hover:text-rose-600 font-bold text-sm transition-colors">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden h-full">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 flex items-center justify-between z-40">
          <div className="flex items-center gap-8">
            <LanguageSelector selected={state.language} onSelect={(lang) => setState(p => ({ ...p, language: lang }))} />
            <div className={`flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-full border border-slate-100 shadow-inner`}>
              <div className={`w-3 h-3 rounded-full animate-pulse ${isVoiceActive ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{isVoiceActive ? 'Voice-to-Concept Active' : 'System Engine Online'}</p>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setSubjectMenuOpen(!subjectMenuOpen)}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-all"
              >
                 <span className="text-[10px] font-black uppercase text-indigo-600 tracking-tighter">Subject: {state.selectedSubject}</span>
                 <Settings className="w-3 h-3 text-indigo-400" />
              </button>
              {subjectMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[100] animate-in zoom-in-95 duration-200">
                   {SUBJECTS.map(s => (
                     <button 
                       key={s} 
                       onClick={() => { setState(p => ({...p, selectedSubject: s})); setSubjectMenuOpen(false); }}
                       className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${state.selectedSubject === s ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                     >
                        {s}
                     </button>
                   ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden lg:flex items-center px-6 py-2.5 bg-white rounded-2xl border border-slate-100 gap-3 shadow-sm group hover:scale-105 transition-all">
                <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500 animate-bounce' : 'text-slate-300'}`} />
                <span className="text-xs font-black text-slate-700 tracking-tight">{streak} Day Streak</span>
             </div>
             <div className="flex items-center gap-3 px-6 py-3 bg-slate-900 rounded-[1.5rem] text-white shadow-2xl shadow-slate-900/20 hover:scale-105 transition-all">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-black tracking-tight">{state.stats.points.toLocaleString()} XP</span>
             </div>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto relative z-10 scrollbar-hide ${view === 'chat' ? 'overflow-hidden flex flex-col' : ''}`}>
          {view === 'hub' && (
            <div className="p-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[4rem] p-16 text-white shadow-[0_40px_80px_-20px_rgba(79,70,229,0.3)] relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-6xl font-black mb-6 tracking-tighter leading-none">Welcome, {state.user.name.split(' ')[0]}!</h2>
                    <p className="text-indigo-100 text-xl leading-relaxed max-w-xl opacity-80 font-medium">
                      Mastering {state.selectedSubject} logic today? I've analyzed your foundations across all NCERT domains.
                    </p>
                    <div className="mt-12 flex flex-wrap gap-5">
                      <button onClick={() => setView('chat')} className="bg-white text-indigo-700 px-10 py-6 rounded-[2.5rem] font-black hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-900/40 text-lg">Deep Learning Mode</button>
                      <button onClick={() => setView('planner')} className="bg-indigo-500/30 backdrop-blur-md border border-white/20 text-white px-10 py-6 rounded-[2.5rem] font-black hover:bg-white/10 transition-all text-lg">Weekly Roadmap</button>
                    </div>
                  </div>
                  <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
                </div>

                <div className="flex flex-col gap-8">
                  <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-xl flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3"><Heart className="w-6 h-6 text-rose-500" /> Focus Support</h3>
                      {affirmation ? (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
                          <p className="text-2xl font-black text-slate-700 leading-tight italic">"{affirmation.affirmation}"</p>
                          <div className="p-5 bg-rose-50 rounded-3xl border border-rose-100 flex items-start gap-4">
                            <Sparkles className="w-5 h-5 text-rose-500 mt-1 shrink-0" />
                            <p className="text-sm font-bold text-rose-700 leading-relaxed">{affirmation.tip}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="h-8 bg-slate-100 rounded-full w-full animate-pulse" />
                          <div className="h-20 bg-slate-100 rounded-[2rem] w-full animate-pulse" />
                        </div>
                      )}
                    </div>
                    <button onClick={() => setState(p => ({ ...p, stressWarning: true }))} className="mt-8 w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">Guided Relaxation</button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-3xl font-black text-slate-800">Mastery Snapshot</h3>
                  <button onClick={() => setView('dashboard')} className="text-indigo-600 font-black flex items-center gap-2 hover:gap-4 transition-all uppercase text-xs tracking-widest">Syllabus Overview <ArrowRight className="w-5 h-5" /></button>
                </div>
                <MasteryDashboard onStartLesson={startBridgeLesson} />
              </div>
            </div>
          )}
          {view === 'planner' && <div className="p-10 w-full"><StudyPlanner plan={state.studyPlan} language={state.language} onPlanCreated={(p) => { setState(s => ({ ...s, studyPlan: p })); localStorage.setItem('vardaan_plan', JSON.stringify(p)); }} onStartSession={(t,s) => { setState(prev => ({ ...prev, selectedSubject: s as any })); setView('chat'); setTimeout(() => handleSendMessage(`Help me master ${t} in ${s}.`), 300); }} /></div>}
          {view === 'chat' && (
            <div className="flex flex-col h-full bg-slate-50 relative">
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 md:px-20 py-10 space-y-12 scroll-smooth">
                {state.messages.map((msg: any) => (
                  <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-2 px-4">
                       {msg.role === 'assistant' ? (
                         <>
                           <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md"><Bot className="w-3.5 h-3.5" /></div>
                           <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Vardaan Socratic Coach</span>
                         </>
                       ) : (
                         <>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aap (Student)</span>
                         </>
                       )}
                    </div>
                    <div className={`max-w-[85%] transition-all duration-300 transform scale-100 hover:scale-[1.01]`}>
                      <div className={`relative p-8 rounded-[3rem] text-xl leading-relaxed shadow-xl border-2 ${
                        msg.role === 'user' 
                          ? 'bg-indigo-50 text-slate-900 border-indigo-200 rounded-tr-none' 
                          : 'bg-white text-slate-900 border-indigo-300 border-l-[10px] border-l-indigo-600 rounded-tl-none'
                      }`}>
                        {msg.content}
                        
                        {msg.role === 'assistant' && msg.analogyUsed && (
                          <div className="mt-6 p-6 bg-slate-100 rounded-[2rem] border-2 border-slate-200 text-base italic text-slate-900 font-bold flex items-start gap-4">
                             <Lightbulb className="w-5 h-5 shrink-0 text-amber-500 mt-1" />
                             <span><strong>Concept Explainer:</strong> {msg.analogyUsed}</span>
                          </div>
                        )}

                        {msg.role === 'assistant' && msg.conceptNote && msg.conceptNote.length > 0 && (
                          <div className="mt-5 p-6 bg-indigo-50 border-2 border-indigo-200 text-slate-900 rounded-[2rem] shadow-lg relative overflow-hidden group">
                             <div className="relative z-10">
                               <div className="flex items-center gap-2 mb-3">
                                 <FileText className="w-4 h-4 text-indigo-600" />
                                 <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Digital Concept Note</span>
                               </div>
                               <ul className="space-y-2">
                                 {msg.conceptNote.map((note: string, idx: number) => (
                                   <li key={idx} className="text-sm font-black flex gap-2">
                                      <span className="text-indigo-400">•</span> {note}
                                   </li>
                                 ))}
                               </ul>
                               <p className="mt-4 text-[9px] font-black uppercase tracking-widest opacity-40">Auto-saved to Vault</p>
                             </div>
                             <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-indigo-100/30 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                          </div>
                        )}

                        {msg.role === 'assistant' && msg.phantomStepDetected && (
                          <div className="mt-4 p-5 bg-amber-50 rounded-[2rem] border-2 border-amber-300 text-sm font-black text-amber-900 flex items-start gap-3">
                             <Star className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
                             <span><strong>Phantom Step Detected:</strong> {msg.misconceptionDescription}</span>
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
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Analyzing Logic...</span>
                    </div>
                    <div className="bg-indigo-50/50 p-7 rounded-[2.5rem] flex items-center gap-4 border border-indigo-100 shadow-sm">
                      <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                      <span className="text-sm font-black uppercase text-indigo-400 tracking-[0.2em]">Consulting Knowledge Engine...</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-12 bg-white border-t border-slate-200 relative z-50 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)]">
                <div className="max-w-4xl mx-auto flex items-center gap-5">
                  <div className="flex-1 bg-slate-100 rounded-[3rem] border-2 border-slate-200 p-2.5 pl-10 flex items-center gap-5 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-8 focus-within:ring-indigo-50 transition-all duration-300">
                    <input 
                      type="text" 
                      value={input} 
                      onChange={(e) => setInput(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
                      placeholder={`Discuss ${state.selectedSubject} with Vardaan AI...`} 
                      className="flex-1 py-5 text-slate-800 focus:outline-none font-bold text-xl bg-transparent" 
                    />
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIsVoiceActive(!isVoiceActive)} 
                        className={`p-5 rounded-full transition-all flex items-center justify-center ${isVoiceActive ? 'bg-rose-500 text-white shadow-2xl shadow-rose-200 ring-8 ring-rose-50' : 'text-slate-400 hover:bg-slate-200'}`}
                      >
                        {isVoiceActive ? <Mic className="w-7 h-7 animate-pulse" /> : <MicOff className="w-7 h-7" />}
                      </button>
                      <button 
                        onClick={() => handleSendMessage()} 
                        disabled={!input.trim() || state.isThinking} 
                        className="p-6 bg-indigo-600 text-white rounded-[2rem] shadow-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95 group"
                      >
                        <Send className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {view === 'forum' && <CommunityForum posts={forumPosts} onUpdatePosts={setForumPosts} />}
          {view === 'vault' && <KnowledgeVault items={state.vault} sharedResources={state.sharedResources} onDeleteItem={handleDeleteVaultItem} />}
          {view === 'dashboard' && <div className="p-10"><MasteryDashboard onStartLesson={startBridgeLesson} /></div>}
          {view === 'teacher-home' && <TeacherDashboard forumPosts={forumPosts} onReply={handleTeacherReply} />}
          {view === 'admin-home' && (
            <AdminDashboard 
              resources={state.sharedResources} 
              onAddResource={handleAddSharedResource} 
              onRemoveResource={handleRemoveSharedResource} 
              onUpdateStatus={handleUpdateResourceStatus}
            />
          )}
          {view === 'achievements' && <AchievementsView stats={state.stats} />}
        </div>
      </main>
    </div>
  );
};

export default App;
