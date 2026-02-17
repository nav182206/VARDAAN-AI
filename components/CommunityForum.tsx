
import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Plus, X, GraduationCap, CheckCircle2, Sparkles, Users2, ArrowRight } from 'lucide-react';
import { ForumPost, SUBJECTS, DoubtPool } from '../types';

interface Props {
  posts: ForumPost[];
  onUpdatePosts: (posts: ForumPost[]) => void;
}

const MOCK_POOLS: DoubtPool[] = [
  { id: 'p1', subject: 'Maths', topic: 'Calculus - Limits', studentCount: 8, description: 'Logic gap: Confusing infinity with a large number.' },
  { id: 'p2', subject: 'Physics', topic: 'Gauss Law', studentCount: 5, description: 'Conceptual bottleneck: Surface integral vs volume integral.' },
  { id: 'p3', subject: 'Computer Science', topic: 'Recursion Depth', studentCount: 12, description: 'Phantom step: Misunderstanding base cases in recursive stack.' },
];

const CommunityForum: React.FC<Props> = ({ posts, onUpdatePosts }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', subject: 'Physics' });

  const handleUpvote = (id: string) => {
    onUpdatePosts(posts.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  const handleAddPost = () => {
    if (!newPost.title || !newPost.content) return;
    const post: ForumPost = {
      id: Date.now().toString(),
      author: 'You',
      title: newPost.title,
      content: newPost.content,
      subject: newPost.subject,
      upvotes: 0,
      replyCount: 0,
      timestamp: Date.now(),
      teacherReplies: [],
      isResolved: false
    };
    onUpdatePosts([post, ...posts]);
    setShowModal(false);
    setNewPost({ title: '', content: '', subject: 'Physics' });
  };

  return (
    <div className="max-w-4xl mx-auto p-10 animate-in fade-in duration-500">
      {/* Doubt Pooling Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
           <div className="p-2 bg-indigo-600 rounded-xl text-white">
             <Sparkles className="w-5 h-5" />
           </div>
           <h3 className="text-xl font-black text-slate-800">AI Doubt-Pooling Pods</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {MOCK_POOLS.map(pool => (
             <div key={pool.id} className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem] hover:shadow-lg transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-[10px] font-black uppercase text-indigo-600 bg-white px-3 py-1 rounded-full shadow-sm">{pool.subject}</span>
                   <div className="flex items-center gap-1 text-[10px] font-black text-slate-500">
                      <Users2 className="w-3 h-3" /> {pool.studentCount} Peers stuck
                   </div>
                </div>
                <h4 className="font-black text-indigo-900 mb-2">{pool.topic}</h4>
                <p className="text-xs text-indigo-700/70 mb-4 line-clamp-2">{pool.description}</p>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 group-hover:gap-4 transition-all">
                   Join Study Pod <ArrowRight className="w-4 h-4" />
                </button>
             </div>
           ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Peer Learning Circle</h2>
          <p className="text-slate-500 font-medium">Collaborate and learn from verified teachers.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl"
        >
          <Plus className="w-5 h-5" /> Ask a Doubt
        </button>
      </div>

      <div className="flex gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
        {['All', ...SUBJECTS].map((sub) => (
          <button
            key={sub}
            onClick={() => setActiveFilter(sub)}
            className={`px-6 py-3 rounded-2xl text-sm font-black transition-all ${
              activeFilter === sub ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      <div className="space-y-10">
        {posts
          .filter(p => activeFilter === 'All' || p.subject === activeFilter)
          .map((post) => (
          <div key={post.id} className="space-y-4">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center font-black text-[10px] text-slate-400">
                    {post.author.charAt(0)}
                  </div>
                  <span className="text-xs font-black text-slate-700">{post.author}</span>
                  <span className="text-indigo-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-indigo-50 rounded-full">{post.subject}</span>
                </div>
                {post.isResolved && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Resolved
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{post.title}</h3>
              <p className="text-slate-500 leading-relaxed mb-6">{post.content}</p>
              <div className="flex gap-6 pt-6 border-t border-slate-50">
                <button onClick={() => handleUpvote(post.id)} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all">
                  <ThumbsUp className="w-4 h-4" /> <span className="text-xs font-black">{post.upvotes}</span>
                </button>
                <div className="flex items-center gap-2 text-slate-400">
                  <MessageCircle className="w-4 h-4" /> <span className="text-xs font-black">{post.replyCount} Replies</span>
                </div>
              </div>
            </div>

            {/* Teacher Replies Display */}
            {post.teacherReplies.map((reply) => (
              <div key={reply.id} className="ml-12 bg-gradient-to-br from-emerald-50 to-white p-6 rounded-[2rem] border-l-4 border-emerald-500 shadow-md relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-emerald-600 text-white rounded-lg shadow-sm">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-emerald-900">{reply.author}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-white/60 px-2 py-0.5 rounded-full border border-emerald-100">Verified Educator</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">{reply.content}</p>
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Sparkles className="w-16 h-16 text-emerald-600" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full"><X /></button>
            <h3 className="text-2xl font-black text-slate-800 mb-8">Post a Doubt</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Subject</label>
                <select className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={newPost.subject} onChange={e => setNewPost({...newPost, subject: e.target.value})}>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Topic Title</label>
                <input className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" placeholder="Explain your doubt..." value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Details</label>
                <textarea className="w-full p-4 bg-slate-50 border rounded-2xl font-bold h-32 resize-none" placeholder="Explain your doubt in detail..." value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} />
              </div>
              <button onClick={handleAddPost} className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black shadow-xl">Post Question</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityForum;
