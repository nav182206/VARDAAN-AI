
import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, MessageCircle, Filter, Plus, User, X } from 'lucide-react';
import { ForumPost, SUBJECTS } from '../types';

const INITIAL_POSTS: ForumPost[] = [
  {
    id: '1',
    author: 'Arjun P.',
    title: 'Struggling with Integration by Parts',
    content: "Whenever I see two functions multiplied, I get confused about which one to pick as 'u'. Any simple rule of thumb?",
    subject: 'Maths',
    upvotes: 12,
    replies: 4,
    timestamp: Date.now() - 3600000
  },
  {
    id: '2',
    author: 'Priya S.',
    title: 'Lenz Law local analogy help!',
    content: "Vardaan gave me a great analogy about a roommate not wanting you to open the door, but I need more examples.",
    subject: 'Physics',
    upvotes: 8,
    replies: 2,
    timestamp: Date.now() - 7200000
  }
];

const CommunityForum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem('vardaan_forum');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', subject: 'Physics' });

  useEffect(() => {
    localStorage.setItem('vardaan_forum', JSON.stringify(posts));
  }, [posts]);

  const handleUpvote = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
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
      replies: 0,
      timestamp: Date.now()
    };
    setPosts([post, ...posts]);
    setShowModal(false);
    setNewPost({ title: '', content: '', subject: 'Physics' });
  };

  return (
    <div className="max-w-4xl mx-auto p-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Peer Learning Circle</h2>
          <p className="text-slate-500 font-medium">Collaborate with fellow 11th & 12th graders across Bharat.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          <Plus className="w-5 h-5" /> Ask a Question
        </button>
      </div>

      {/* Filter */}
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

      <div className="space-y-6">
        {posts
          .filter(p => activeFilter === 'All' || p.subject === activeFilter)
          .map((post) => (
          <div key={post.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center font-black text-[10px] text-slate-400">
                {post.author.charAt(0)}
              </div>
              <span className="text-xs font-black text-slate-700">{post.author}</span>
              <span className="text-indigo-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-indigo-50 rounded-full">{post.subject}</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{post.title}</h3>
            <p className="text-slate-500 leading-relaxed mb-6">{post.content}</p>
            <div className="flex gap-6 pt-6 border-t border-slate-50">
              <button onClick={() => handleUpvote(post.id)} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all">
                <ThumbsUp className="w-4 h-4" /> <span className="text-xs font-black">{post.upvotes}</span>
              </button>
              <div className="flex items-center gap-2 text-slate-400">
                <MessageCircle className="w-4 h-4" /> <span className="text-xs font-black">{post.replies} Replies</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full"><X /></button>
            <h3 className="text-2xl font-black text-slate-800 mb-8">Post to Community</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Subject</label>
                <select 
                  className="w-full p-4 bg-slate-50 border rounded-2xl font-bold outline-none"
                  value={newPost.subject}
                  onChange={e => setNewPost({...newPost, subject: e.target.value})}
                >
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Topic Title</label>
                <input 
                  className="w-full p-4 bg-slate-50 border rounded-2xl font-bold outline-none"
                  placeholder="e.g. Help with Gauss's Law"
                  value={newPost.title}
                  onChange={e => setNewPost({...newPost, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Details</label>
                <textarea 
                  className="w-full p-4 bg-slate-50 border rounded-2xl font-bold outline-none h-32 resize-none"
                  placeholder="Explain your doubt or insight..."
                  value={newPost.content}
                  onChange={e => setNewPost({...newPost, content: e.target.value})}
                />
              </div>
              <button 
                onClick={handleAddPost}
                className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Post Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityForum;
