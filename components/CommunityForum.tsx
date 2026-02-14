
import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, MessageCircle, Filter, Plus, User } from 'lucide-react';
import { ForumPost, SUBJECTS } from '../types';

const mockPosts: ForumPost[] = [
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
    content: "Vardaan gave me a great analogy about a roommate not wanting you to open the door, but I need more examples for my school project.",
    subject: 'Physics',
    upvotes: 8,
    replies: 2,
    timestamp: Date.now() - 7200000
  },
  {
    id: '3',
    author: 'Rahul K.',
    title: 'Organic Chemistry nomenclature doubt',
    content: "In IUPAC naming, why does the double bond get priority over the alkyl group? NCERT says one thing, my tuition notes say another.",
    subject: 'Chemistry',
    upvotes: 15,
    replies: 7,
    timestamp: Date.now() - 10800000
  }
];

const CommunityForum: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Peer Learning Circle</h2>
          <p className="text-slate-500 text-sm">Learn together, succeed together.</p>
        </div>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <Plus className="w-5 h-5" />
          Ask a Question
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {['All', ...SUBJECTS].map((sub) => (
          <button
            key={sub}
            onClick={() => setActiveFilter(sub)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              activeFilter === sub 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {mockPosts
          .filter(p => activeFilter === 'All' || p.subject === activeFilter)
          .map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer group shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-xs font-bold text-slate-500">{post.author}</span>
              <span className="text-slate-300 text-xs">•</span>
              <span className="text-[10px] uppercase font-black text-indigo-500 tracking-wider px-2 py-0.5 bg-indigo-50 rounded">{post.subject}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{post.title}</h3>
            <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-xs font-bold">{post.upvotes} Upvotes</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs font-bold">{post.replies} Replies</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityForum;
