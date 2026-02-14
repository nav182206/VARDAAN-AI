
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  BookOpen, 
  LayoutDashboard, 
  BrainCircuit, 
  MessageSquare,
  Sparkles,
  Search,
  Mic,
  MicOff,
  Lightbulb,
  FileCheck,
  Users,
  Trophy,
  Star,
  Bell
} from 'lucide-react';
import { Language, ChatMessage, AppState, SUBJECTS, Notification } from './types';
import { getCoachingResponse } from './services/geminiService';
import LanguageSelector from './components/LanguageSelector';
import MasteryDashboard from './components/MasteryDashboard';
import ExamPanicAlert from './components/ExamPanicAlert';
import CommunityForum from './components/CommunityForum';
import AchievementsView from './components/AchievementsView';
import NotificationsDropdown from './components/NotificationsDropdown';

const INITIAL_BADGES = [
  { id: '1', name: 'Socratic Seeker', description: 'Ask 5 high-quality conceptual questions.', icon: 'award', unlocked: true },
  { id: '2', name: 'Logic Master', description: 'Solve a Phantom Step misconception.', icon: 'award', unlocked: true },
  { id: '3', name: 'NCERT Guru', description: 'Complete 10 Physics chapters.', icon: 'award', unlocked: false },
  { id: '4', name: 'Exam Ready', description: 'Score 90% in a mock rubric test.', icon: 'award', unlocked: false },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'progress',
    title: 'Weekly Progress Summary',
    message: 'Your mastery in Calculus improved by 12% this week! Keep it up.',
    timestamp: Date.now() - 3600000 * 2,
    read: false
  },
  {
    id: 'n2',
    type: 'forum',
    title: 'New Reply in Maths Forum',
    message: 'Arjun P. replied to your question about Integration by Parts.',
    timestamp: Date.now() - 3600000 * 5,
    read: false
  }
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    language: 'English',
    selectedSubject: 'Physics',
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: "Namaste! I am Vardaan, your Socratic coach. What topic are we diving into today? I'm ready to help with Physics, Chemistry, Maths, or Biology.",
        timestamp: Date.now()
      }
    ],
    isThinking: false,
    stressWarning: false,
    stats: {
      points: 9840,
      level: 12,
      badges: INITIAL_BADGES
    },
    notifications: INITIAL_NOTIFICATIONS
  });

  const [input, setInput] = useState('');
  const [view, setView] = useState<'chat' | 'dashboard' | 'forum' | 'achievements'>('chat');
  const [isRecording, setIsRecording] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages]);

  // Simulate a new notification after a delay (e.g., achievement unlocked)
  useEffect(() => {
    const timer = setTimeout(() => {
      const newNotif: Notification = {
        id: 'n3',
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'You just earned the "Night Owl" badge for late-night study sessions.',
        timestamp: Date.now(),
        read: false
      };
      setState(prev => ({
        ...prev,
        notifications: [newNotif, ...prev.notifications]
      }));
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || state.isThinking) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setState(prev => ({ 
      ...prev, 
      messages: [...prev.messages, userMsg],
      isThinking: true 
    }));
    setInput('');

    try {
      const result = await getCoachingResponse(
        input, 
        state.messages, 
        state.language, 
        state.selectedSubject
      );

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.explanation,
        timestamp: Date.now(),
        phantomStepDetected: result.phantomStepDetected,
        rubricFeedback: result.rubricFeedback,
        stressLevel: result.stressDetection
      };

      let bonusPoints = 50; 
      if (result.phantomStepDetected) bonusPoints += 150;

      setState(prev => {
        const newState = {
          ...prev,
          messages: [...prev.messages, aiMsg],
          isThinking: false,
          stressWarning: result.stressDetection === 'high',
          stats: {
            ...prev.stats,
            points: prev.stats.points + bonusPoints
          }
        };

        // Trigger an achievement notification if they cross a threshold
        if (newState.stats.points >= 10000 && prev.stats.points < 10000) {
          const milestoneNotif: Notification = {
            id: 'n' + Date.now(),
            type: 'achievement',
            title: 'XP Milestone Reached!',
            message: 'Incredible! You have surpassed 10,000 XP. You are now in the top 5% of learners.',
            timestamp: Date.now(),
            read: false
          };
          newState.notifications = [milestoneNotif, ...newState.notifications];
        }

        return newState;
      });
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isThinking: false }));
    }
  };

  const markNotificationAsRead = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  };

  const clearAllNotifications = () => {
    setState(prev => ({ ...prev, notifications: [] }));
    setShowNotifications(false);
  };

  const unreadCount = state.notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {state.stressWarning && <ExamPanicAlert onClose={() => setState(p => ({ ...p, stressWarning: false }))} />}

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">VARDAAN AI</h1>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">By ByteForcee</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
          <button 
            onClick={() => setView('chat')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              view === 'chat' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Socratic Coach
          </button>
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              view === 'dashboard' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Mastery Hub
          </button>
          <button 
            onClick={() => setView('forum')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              view === 'forum' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="w-5 h-5" />
            Community
          </button>
          <button 
            onClick={() => setView('achievements')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              view === 'achievements' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Trophy className="w-5 h-5" />
            Achievements
          </button>
          
          <div className="pt-6 pb-2 px-4">
            <span className="text-[10px] uppercase font-bold text-slate-400">Subject Focus</span>
          </div>
          {SUBJECTS.map((sub) => (
            <button
              key={sub}
              onClick={() => setState(p => ({ ...p, selectedSubject: sub }))}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all ${
                state.selectedSubject === sub ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {sub}
              </div>
              {state.selectedSubject === sub && <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-100/50">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs font-bold opacity-80">Level {state.stats.level}</p>
                <p className="text-sm font-black uppercase tracking-tight">Concept Guru</p>
              </div>
              <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-1 overflow-hidden">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${(state.stats.points % 1000 / 1000) * 100}%` }} 
              />
            </div>
            <p className="text-[10px] font-bold opacity-70">{(1000 - (state.stats.points % 1000))} XP to Next Level</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <LanguageSelector 
              selected={state.language} 
              onSelect={(lang) => setState(p => ({ ...p, language: lang }))} 
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-4 relative">
             <div className="hidden sm:flex items-center px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold gap-2 border border-indigo-100">
                <Trophy className="w-3.5 h-3.5" />
                {state.stats.points.toLocaleString()} XP
             </div>
             
             <div className="relative">
               <button 
                 onClick={() => setShowNotifications(!showNotifications)}
                 className={`p-2.5 rounded-xl transition-all relative ${
                   showNotifications ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                 }`}
               >
                 <Bell className="w-5 h-5" />
                 {unreadCount > 0 && (
                   <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-bounce" />
                 )}
               </button>

               {showNotifications && (
                 <NotificationsDropdown 
                   notifications={state.notifications} 
                   onClose={() => setShowNotifications(false)}
                   onMarkRead={markNotificationAsRead}
                   onClearAll={clearAllNotifications}
                 />
               )}
             </div>

             <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
               <Search className="w-5 h-5" />
             </button>
          </div>
        </header>

        {/* View Content */}
        {view === 'chat' && (
          <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
              {state.messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                    <div className={`p-5 rounded-3xl shadow-sm leading-relaxed text-sm md:text-base ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100' 
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>

                    {msg.phantomStepDetected && (
                      <div className="mt-2 bg-rose-50 border border-rose-100 p-4 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-sm">
                        <BrainCircuit className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs font-bold text-rose-800">Phantom Step Analyzed</p>
                            <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded font-black">+150 XP</span>
                          </div>
                          <p className="text-xs text-rose-700 leading-relaxed italic">
                            Detected a common logical bridge error. Remember, in 11th grade Physics, we don't just add magnitudes; vector direction matters!
                          </p>
                        </div>
                      </div>
                    )}

                    {msg.rubricFeedback && (
                      <div className="mt-2 bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-700 shadow-sm">
                        <FileCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-amber-800 mb-1">Board Exam Marking Hint</p>
                          <p className="text-xs text-amber-700 leading-relaxed">
                            {msg.rubricFeedback}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {state.isThinking && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-2 items-center shadow-sm">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-.15s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-.3s]" />
                    <span className="text-xs text-slate-400 font-medium ml-2 uppercase tracking-tighter">Thinking step-by-step...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-200">
              <div className="max-w-4xl mx-auto flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={`Ask Vardaan about ${state.selectedSubject}...`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all pr-12 text-slate-700"
                  />
                  <button 
                    onClick={() => setIsRecording(!isRecording)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors ${
                      isRecording ? 'bg-rose-100 text-rose-600 animate-pulse' : 'text-slate-400 hover:text-indigo-600'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || state.isThinking}
                  className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <Lightbulb className="w-3 h-3" />
                  Socratic Hints Only
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                   <BrainCircuit className="w-3 h-3" />
                   Phantom Step Analysis
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-8 max-w-7xl mx-auto">
               <div className="mb-8">
                 <h2 className="text-3xl font-black text-slate-800">Mastery Hub</h2>
                 <p className="text-slate-500 mt-1 italic">Real-time analysis of your conceptual clarity vs. exam rubrics.</p>
               </div>
               <MasteryDashboard />
            </div>
          </div>
        )}

        {view === 'forum' && (
          <div className="flex-1 overflow-y-auto bg-slate-50">
            <CommunityForum />
          </div>
        )}

        {view === 'achievements' && (
          <div className="flex-1 overflow-y-auto bg-slate-50">
            <AchievementsView stats={state.stats} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
