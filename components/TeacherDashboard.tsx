
import React, { useState } from 'react';
import { Users, AlertCircle, TrendingUp, Sparkles, MessageSquare, GraduationCap, ArrowRight, Loader2, Heart, FileText, Upload, BrainCircuit } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, YAxis } from 'recharts';
import { ForumPost, SUBJECTS } from '../types';

interface Props {
  forumPosts: ForumPost[];
  onReply: (postId: string, content: string) => void;
}

const PHANTOM_DATA = [
  { step: 'Calculus Sign', count: 85, desc: 'Student thinks sqrt(a+b) = sqrt(a) + sqrt(b).', sub: 'Maths' },
  { step: 'EMF Direction', count: 75, desc: 'Misinterpreting potential drop as rise.', sub: 'Physics' },
  { step: 'Velocity Logic', count: 62, desc: 'Assuming zero accel means zero velocity.', sub: 'Physics' },
  { step: 'Molar Misconception', count: 48, desc: 'Confusing molarity with molality.', sub: 'Chemistry' },
  { step: 'Mitosis Steps', count: 42, desc: 'Confusing prophase/metaphase steps.', sub: 'Biology' },
  { step: 'Off-by-one', count: 38, desc: 'Array indexing logic gap in C++.', sub: 'CS' },
  { step: 'Thematic Shift', count: 30, desc: 'Missing subtext in Modernist poetry.', sub: 'English' },
];

const ANXIETY_DATA = [
  { student: 'Arjun P.', stress: 'High', reason: 'Maths Logic' },
  { student: 'Sanya G.', stress: 'Medium', reason: 'CS Project' },
  { student: 'Rahul K.', stress: 'High', reason: 'Physics Bottleneck' },
];

const COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981', '#a855f7', '#0ea5e9', '#64748b'];

const TeacherDashboard: React.FC<Props> = ({ forumPosts, onReply }) => {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rubricView, setRubricView] = useState(false);

  const handleSubmitReply = (postId: string) => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onReply(postId, replyText);
      setReplyText('');
      setActiveReplyId(null);
      setIsSubmitting(false);
    }, 1000);
  };

  const unresolvedPosts = forumPosts.filter(p => !p.isResolved);

  return (
    <div className="max-w-7xl mx-auto p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Classroom Pulse</h2>
          <p className="text-slate-500 font-medium">Socratic Insights & Conceptual Bottleneck Tracking</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setRubricView(!rubricView)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            <FileText className="w-5 h-5" /> {rubricView ? 'Back to Analytics' : 'AI Rubric Gen'}
          </button>
        </div>
      </div>

      {!rubricView ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Aggregated Phantom Step Analytics */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                   <BrainCircuit className="w-6 h-6 text-rose-500" /> Conceptual Bottlenecks
                 </h3>
                 <div className="flex gap-2">
                    {['Maths', 'Physics', 'Chemistry', 'Biology', 'CS', 'English'].map(s => (
                      <span key={s} className="text-[10px] font-black text-slate-400 border px-3 py-1 rounded-full uppercase">{s}</span>
                    ))}
                 </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={PHANTOM_DATA}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="step" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }} width={120} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" radius={[0, 12, 12, 0]} barSize={30}>
                      {PHANTOM_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                 {PHANTOM_DATA.map((p, i) => (
                   <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all group">
                     <p className="text-[10px] font-black text-indigo-500 uppercase mb-1 tracking-widest">{p.sub}</p>
                     <p className="text-xs font-black text-slate-700 mb-1">{p.step}</p>
                     <p className="text-[10px] text-slate-500 font-medium leading-tight">{p.desc}</p>
                   </div>
                 ))}
              </div>
            </div>

            {/* Peer Circle Doubts */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-indigo-600" /> Peer Circle Doubts
                </h3>
                <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {unresolvedPosts.length} Unresolved
                </span>
              </div>
              <div className="space-y-4">
                {unresolvedPosts.map(post => (
                  <div key={post.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-slate-800 text-sm">{post.title}</h4>
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{post.subject}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">{post.content}</p>
                    
                    {activeReplyId === post.id ? (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <textarea 
                          className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-medium resize-none h-24 focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="Guide the student without giving the answer..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleSubmitReply(post.id)} disabled={isSubmitting} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                            {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <GraduationCap className="w-3 h-3" />} Verify Socratic Aid
                          </button>
                          <button onClick={() => setActiveReplyId(null)} className="bg-slate-200 text-slate-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setActiveReplyId(post.id)} className="text-[10px] font-black text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-widest">Help Solve <ArrowRight className="w-3 h-3" /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-rose-50 p-8 rounded-[3rem] border border-rose-100 shadow-sm">
               <h3 className="text-xl font-black text-rose-900 mb-6 flex items-center gap-2">
                 <Heart className="w-6 h-6 text-rose-600 animate-pulse" /> Student Stress Alerts
               </h3>
               <div className="space-y-4">
                  {ANXIETY_DATA.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
                       <div>
                         <p className="text-sm font-black text-slate-800">{item.student}</p>
                         <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{item.reason}</p>
                       </div>
                       <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${item.stress === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{item.stress}</span>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-6 py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">Push Mindfulness Break</button>
            </div>

            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl">
               <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-indigo-400">
                 <Sparkles className="w-5 h-5" /> Batch Insights
               </h3>
               <div className="space-y-4">
                  <div className="p-5 bg-white/10 rounded-2xl border border-white/10">
                     <p className="text-[10px] font-black text-indigo-400 uppercase mb-1 tracking-widest">Misconceptions Fixed</p>
                     <p className="text-2xl font-black">422 <span className="text-sm text-emerald-400">+12%</span></p>
                  </div>
                  <div className="p-5 bg-white/10 rounded-2xl border border-white/10">
                     <p className="text-[10px] font-black text-indigo-400 uppercase mb-1 tracking-widest">AI Doubt Pods</p>
                     <p className="text-2xl font-black">28 <span className="text-xs text-slate-400">Collaborative</span></p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm animate-in zoom-in-95 duration-300">
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="text-center">
              <h3 className="text-3xl font-black text-slate-800 mb-2">Automated Rubric Generator</h3>
              <p className="text-slate-500">Upload a complex question or a student's handwritten answer to generate a precise marking rubric.</p>
            </div>
            <div className="border-4 border-dashed border-slate-100 rounded-[3rem] p-20 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-200 transition-all cursor-pointer">
               <Upload className="w-16 h-16 mb-4" />
               <p className="font-black text-slate-600">Drop PDF, JPG, or Handwritten Scans</p>
               <p className="text-xs font-bold mt-2">Maximum file size: 20MB</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Subject Focus</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none">
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400">Marking Severity</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none">
                    <option>Standard Boards</option>
                    <option>Strict JEE/NEET</option>
                    <option>Socratic Explainer</option>
                  </select>
               </div>
            </div>
            <button className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-lg shadow-2xl hover:bg-slate-800 transition-all">Generate Professional Rubric</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
