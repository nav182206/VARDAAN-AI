
import React, { useState, useEffect } from 'react';
import { Search, Library, BookOpen, Trash2, Filter, Star, Clock, FileText, ChevronRight, BrainCircuit, Globe, X, Download, Maximize2, ZoomIn, ZoomOut, Loader2, Info, Book } from 'lucide-react';
import { VaultItem, SUBJECTS, SharedResource } from '../types';

interface Props {
  items: VaultItem[];
  sharedResources: SharedResource[];
  onDeleteItem: (id: string) => void;
}

const KnowledgeVault: React.FC<Props> = ({ items, sharedResources, onDeleteItem }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('All');
  const [tab, setTab] = useState<'personal' | 'official'>('official');
  const [viewingResource, setViewingResource] = useState<SharedResource | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const handleOpenPdf = (resource: SharedResource) => {
    setIsPdfLoading(true);
    setViewingResource(resource);
    // Simulate high-speed indexing/rendering
    setTimeout(() => setIsPdfLoading(false), 600);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.topic.toLowerCase().includes(search.toLowerCase()) || 
                          item.content.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'All' || item.subject === filter;
    return matchesSearch && matchesFilter;
  });

  const filteredShared = sharedResources.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.chapter.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || item.subject === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto p-10 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-4">
            <Library className="w-10 h-10 text-indigo-600" />
            Knowledge Vault
          </h2>
          <p className="text-slate-500 font-medium mt-2">Your captures and official educational resources synced from the central repository.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search concepts or PDFs..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold w-64 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="bg-slate-200 p-1.5 rounded-2xl flex gap-1 shadow-sm">
          <button 
            onClick={() => setTab('personal')} 
            className={`flex items-center gap-2 px-8 py-4 rounded-xl text-xs font-black transition-all ${tab === 'personal' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <BookOpen className="w-4 h-4" /> My Notes
          </button>
          <button 
            onClick={() => setTab('official')} 
            className={`flex items-center gap-2 px-8 py-4 rounded-xl text-xs font-black transition-all ${tab === 'official' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Globe className="w-4 h-4" /> Official Resources
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide max-w-full">
          {['All', ...SUBJECTS].map((sub) => (
            <button
              key={sub}
              onClick={() => setFilter(sub)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${
                filter === sub ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {tab === 'personal' ? (
        filteredItems.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">No personal notes</h3>
            <p className="text-slate-400 max-w-xs mx-auto font-medium">Use the Coach to capture logic fixes and NCERT summaries during your study sessions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">{item.subject}</span>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <Clock className="w-3 h-3" /> {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <button 
                    onClick={() => onDeleteItem(item.id)}
                    className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {item.topic || 'Untitled Concept'}
                </h3>

                <div className="flex-1 space-y-4">
                  <div className="p-5 bg-indigo-50 rounded-[2rem] border border-indigo-100/50">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">Digital Note</span>
                    </div>
                    <ul className="space-y-2">
                      {item.content.map((point, idx) => (
                        <li key={idx} className="text-xs font-bold text-slate-700 flex gap-2">
                          <span className="text-indigo-300">•</span> {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {item.misconception && (
                    <div className="p-5 bg-rose-50 rounded-[2rem] border border-rose-100">
                      <div className="flex items-center gap-2 mb-2 text-rose-600">
                        <BrainCircuit className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Phantom Step Fixed</span>
                      </div>
                      <p className="text-xs font-bold text-rose-800 leading-relaxed">{item.misconception}</p>
                    </div>
                  )}
                </div>

                <button className="mt-8 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 group-hover:gap-4 transition-all py-2 border-t border-slate-50 pt-6">
                  Review Insight <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        filteredShared.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">No official resources</h3>
            <p className="text-slate-400 max-w-xs mx-auto font-medium">Official NCERT PDFs and exam materials from admins will appear here after being indexed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredShared.map((resource) => (
              <div key={resource.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <FileText className="w-7 h-7" />
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                    resource.status === 'Indexed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600 animate-pulse'
                  }`}>
                    {resource.status}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {resource.name}
                </h3>
                <p className="text-xs text-slate-500 mb-6 font-medium">Chapter: {resource.chapter} • {resource.subject}</p>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{resource.size} • {resource.type}</span>
                  <button 
                    onClick={() => handleOpenPdf(resource)}
                    className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-200 active:scale-95"
                  >
                    View PDF <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Document Viewer Modal */}
      {viewingResource && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
           {/* Top Bar */}
           <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between px-8">
              <div className="flex items-center gap-4">
                 <div className="p-2.5 bg-indigo-600 rounded-xl text-white">
                    <FileText className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="text-white font-black text-sm tracking-tight">{viewingResource.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{viewingResource.subject} • {viewingResource.chapter}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <button className="p-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                    <Download className="w-5 h-5" />
                 </button>
                 <button 
                  onClick={() => setViewingResource(null)}
                  className="ml-4 bg-rose-600 text-white p-3 rounded-xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-900/20"
                 >
                    <X className="w-5 h-5" />
                 </button>
              </div>
           </div>

           {/* Content Area */}
           <div className="flex-1 overflow-y-auto p-12 flex justify-center bg-slate-900/50 scroll-smooth">
              {isPdfLoading ? (
                <div className="w-full max-w-4xl bg-white shadow-2xl rounded-sm min-h-[1200px] flex flex-col items-center justify-center space-y-4">
                   <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                   <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Rendering Chapter Data...</p>
                </div>
              ) : (
                <div className="w-full max-w-4xl bg-white shadow-2xl rounded-sm min-h-[1200px] p-20 relative animate-in slide-in-from-bottom-8 duration-500">
                    <div className="border-b-4 border-slate-900 pb-10 mb-10 flex justify-between items-start">
                       <div>
                          <p className="text-indigo-600 font-black uppercase text-xs tracking-widest mb-2">Academic Publication • Unit 04</p>
                          <h1 className="text-5xl font-black text-slate-900 mb-2 leading-tight">{viewingResource.chapter}</h1>
                          <p className="text-xl font-bold text-slate-600">Official NCERT Syllabi Integration</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Page 01 of 24</p>
                       </div>
                    </div>

                    <div className="space-y-12">
                       <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                             <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                             Essential Prerequisites
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {[
                               {t: 'Fundamental Laws', d: 'Analyze the basic axioms governing this chapter as per NCERT guidelines.'},
                               {t: 'Theoretical Derivations', d: 'Review the mathematical and logical tools for conceptual proofs.'},
                               {t: 'Historical Context', d: 'The constraints and evolution relevant to this specific topic.'},
                               {t: 'System Dynamics', d: 'Understanding how multiple components interact in standard environments.'},
                             ].map((obj, i) => (
                                <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border border-slate-100">
                                   <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-black text-xs text-white shadow-md shrink-0">{i+1}</div>
                                   <div>
                                      <p className="text-sm font-black text-slate-900">{obj.t}</p>
                                      <p className="text-xs font-bold text-slate-500 mt-1">{obj.d}</p>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </section>

                       <section className="space-y-8">
                          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                             <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                             Detailed Theoretical Framework
                          </h2>
                          <div className="space-y-6 text-slate-900 font-bold leading-relaxed text-lg">
                             <p>
                                In this specific chapter of {viewingResource.subject}, we explore the intricate relationships between physical properties and observable phenomena. 
                                The core logic rests on the assumption that all systems tend toward equilibrium unless acted upon by 
                                external perturbations. This fundamental principle forms the basis of all {viewingResource.chapter} derivations found in the standard NCERT curriculum.
                             </p>
                             <div className="p-8 bg-indigo-50 border-l-8 border-indigo-600 rounded-r-3xl my-10 shadow-sm">
                                <p className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                   <Info className="w-4 h-4" /> NCERT Pro-Tip for Boards
                                </p>
                                <p className="text-indigo-950 text-xl font-black italic">
                                   "The variation of parameters in this specific model depends directly on the square of the initial state, 
                                   often leading students to the mistaken 'Phantom Step' of assuming linear scaling during exam derivations."
                                </p>
                             </div>
                             <p>
                                Experimental data shows that the divergence between theoretical models and real-world 
                                applications becomes evident when boundary conditions are not strictly adhered to. 
                                Students must pay close attention to the vector orientations and initial conditions shown in Fig 1.
                             </p>
                          </div>
                          <div className="aspect-video bg-white border-2 border-slate-200 rounded-[3rem] flex items-center justify-center text-slate-400 flex-col gap-4 shadow-inner group">
                             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200 group-hover:scale-105 transition-transform duration-500">
                                <Book className="w-10 h-10 text-indigo-400" />
                             </div>
                             <div className="text-center">
                                <p className="font-black text-sm uppercase tracking-[0.3em] text-slate-800">Figure 4.1: Structural Diagram</p>
                                <p className="text-xs font-bold text-slate-400 mt-1">[Official Diagram Placeholder]</p>
                             </div>
                          </div>
                          <div className="space-y-6 pt-6 text-slate-900 font-bold leading-relaxed text-lg">
                             <p>
                                Sub-section 4.2 details the derivation of these equations using the principle of least action. 
                                Note that the integration limits are defined from zero to infinity for most board-level problems, 
                                which significantly simplifies the transcendental parts of the resulting expression.
                             </p>
                          </div>
                       </section>

                       <div className="pt-20 text-center border-t-2 border-slate-100">
                          <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.8em]">End of Official Preview • Document Secured by Vardaan RAG</p>
                          <p className="text-slate-400 text-[10px] font-black mt-2">© 2025 National Council of Educational Research and Training (NCERT)</p>
                       </div>
                    </div>
                    
                    {/* Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 pointer-events-none opacity-[0.03] text-[120px] font-black text-slate-900 select-none whitespace-nowrap z-0">
                      VARDAAN ACADEMIC SOURCE
                    </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeVault;
