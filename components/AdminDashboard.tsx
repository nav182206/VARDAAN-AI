
import React, { useState, useRef } from 'react';
import { ShieldCheck, Database, Users, HardDrive, Activity, FileText, Plus, Trash2, RefreshCw, BarChart3, Wallet, Clock, Upload, CheckCircle2, Loader2, X } from 'lucide-react';
import { SharedResource, SUBJECTS } from '../types';

interface Props {
  resources: SharedResource[];
  onAddResource: (resource: SharedResource) => void;
  onRemoveResource: (id: string) => void;
  onUpdateStatus: (id: string, status: 'Indexed' | 'Processing') => void;
}

const AdminDashboard: React.FC<Props> = ({ resources, onAddResource, onRemoveResource, onUpdateStatus }) => {
  const [isHealthy, setIsHealthy] = useState(true);
  const [view, setView] = useState<'rag' | 'analytics' | 'users'>('rag');
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    subject: 'Physics',
    chapter: '',
    fileSize: '0.0 MB'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setFormData({
        ...formData,
        name: file.name,
        fileSize: `${sizeMB} MB`
      });
    }
  };

  const handleIndexResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.chapter) return;

    setIsUploading(true);
    // Simulate real indexing delay
    setTimeout(() => {
      const newSource: SharedResource = {
        id: Date.now().toString(),
        name: formData.name,
        size: formData.fileSize,
        status: 'Indexed',
        type: 'PDF',
        chapter: formData.chapter,
        subject: formData.subject as any,
        timestamp: Date.now()
      };
      onAddResource(newSource);
      setIsUploading(false);
      setShowUploadForm(false);
      setFormData({ name: '', subject: 'Physics', chapter: '', fileSize: '0.0 MB' });
    }, 2500);
  };

  const handleRefresh = (id: string) => {
    onUpdateStatus(id, 'Processing');
    setTimeout(() => onUpdateStatus(id, 'Indexed'), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">System Control Panel</h2>
          <p className="text-slate-500 font-medium text-lg">Global Knowledge Governance & RAG Management</p>
        </div>
        <div className="flex gap-4">
          <nav className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
            <button onClick={() => setView('rag')} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${view === 'rag' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Knowledge</button>
            <button onClick={() => setView('analytics')} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${view === 'analytics' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Usage</button>
            <button onClick={() => setView('users')} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${view === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Users</button>
          </nav>
          <button 
            onClick={() => setIsHealthy(!isHealthy)}
            className={`px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-3 transition-all ${
              isHealthy ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}
          >
            <Activity className={`w-4 h-4 ${isHealthy ? 'animate-pulse' : ''}`} />
            {isHealthy ? 'System: Stable' : 'System: Maintenance'}
          </button>
        </div>
      </div>

      {view === 'rag' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Indexing Section */}
          <div className="lg:col-span-1 space-y-6">
            {!showUploadForm ? (
              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center group hover:border-indigo-200 transition-all">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                   <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Push New Content</h3>
                <p className="text-sm text-slate-500 mb-8 px-4">Publish NCERT PDFs or board papers to the Student Portal instantly.</p>
                <button 
                  onClick={() => setShowUploadForm(true)}
                  className="w-full py-5 bg-indigo-600 rounded-[2rem] font-black text-white flex items-center justify-center gap-3 hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-100"
                >
                  <Plus className="w-5 h-5" /> Start New Indexing
                </button>
              </div>
            ) : (
              <div className="bg-white p-10 rounded-[3.5rem] border-2 border-indigo-600 shadow-2xl animate-in zoom-in-95 duration-300 relative">
                <button 
                  onClick={() => setShowUploadForm(false)} 
                  className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-black text-slate-800 mb-6">Index Knowledge Source</h3>
                
                <form onSubmit={handleIndexResource} className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest">Select Subject</label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-indigo-600 transition-all"
                    >
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest">Chapter / Topic Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Modern Physics - Atomic Models"
                      value={formData.chapter}
                      onChange={(e) => setFormData({...formData, chapter: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-indigo-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest">PDF Source File</label>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden" 
                      accept=".pdf"
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full p-6 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                        formData.name ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-indigo-300'
                      }`}
                    >
                      {formData.name ? (
                        <div className="flex flex-col items-center gap-1">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                          <p className="text-xs font-black text-emerald-800 truncate max-w-[200px]">{formData.name}</p>
                          <p className="text-[9px] font-bold text-emerald-600">{formData.fileSize}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <FileText className="w-8 h-8 text-slate-300 mb-2" />
                          <p className="text-xs font-bold text-slate-400">Click to Select PDF</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isUploading || !formData.name || !formData.chapter}
                    className={`w-full py-5 rounded-[2rem] font-black text-white flex items-center justify-center gap-3 transition-all shadow-xl ${
                      isUploading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 active:scale-95'
                    }`}
                  >
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                    {isUploading ? 'Indexing for Students...' : 'Publish to Portal'}
                  </button>
                </form>
              </div>
            )}
            
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                 <h4 className="text-lg font-black mb-4 flex items-center gap-2 text-indigo-400">
                    <Activity className="w-5 h-5" /> Portal Stats
                 </h4>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Indexed</p>
                       <p className="text-2xl font-black">{resources.length}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Knowledge Nodes</p>
                       <p className="text-2xl font-black">1.2k</p>
                    </div>
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full" />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Database className="w-7 h-7 text-indigo-600" /> Live Resource Inventory
              </h3>
              <div className="flex gap-2">
                 <span className="text-[10px] font-black text-slate-400 border px-3 py-1 rounded-full uppercase tracking-widest">{resources.length} Files</span>
              </div>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto pr-4 scrollbar-hide">
              {resources.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                   <HardDrive className="w-16 h-16 mb-4" />
                   <p className="text-xl font-black">Vault is Empty</p>
                   <p className="text-sm font-bold">Start indexing NCERT materials above.</p>
                </div>
              ) : (
                resources.map(source => (
                  <div key={source.id} className="p-6 rounded-[2.5rem] border border-slate-50 bg-slate-50/50 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                        source.status === 'Indexed' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-400'
                      }`}>
                        <FileText className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-sm">{source.name}</h4>
                        <div className="flex gap-2 items-center mt-1">
                          <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest px-2 py-0.5 bg-indigo-50 rounded-md">{source.chapter}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase px-2 py-0.5 border border-slate-200 rounded-md">{source.subject}</span>
                          <p className="text-[9px] text-slate-400 font-bold uppercase ml-2">{source.size}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase flex items-center gap-1 ${
                        source.status === 'Indexed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {source.status === 'Indexed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                        {source.status}
                      </span>
                      <button onClick={() => handleRefresh(source.id)} className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <RefreshCw className={`w-4 h-4 ${source.status === 'Processing' ? 'animate-spin' : ''}`} />
                      </button>
                      <button onClick={() => onRemoveResource(source.id)} className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {view === 'analytics' && (
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm text-center py-32 animate-in fade-in duration-500">
           <BarChart3 className="w-16 h-16 text-indigo-100 mx-auto mb-6" />
           <h3 className="text-2xl font-black text-slate-800">Resource Analytics</h3>
           <p className="text-slate-500">Tracking student engagement with indexed materials...</p>
        </div>
      )}

      {view === 'users' && (
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm text-center animate-in fade-in duration-500">
           <Users className="w-16 h-16 text-slate-200 mx-auto mb-6" />
           <h3 className="text-2xl font-black text-slate-800 mb-2">Student Directory</h3>
           <p className="text-slate-500 mb-8 max-w-md mx-auto">Manage student and teacher identities across all portals.</p>
           <div className="flex justify-center gap-4">
              <button className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 transition-all">Export User List</button>
              <button className="bg-white border-2 border-slate-100 text-slate-800 px-10 py-5 rounded-[2rem] font-black hover:bg-slate-50 transition-all">Revoke Access</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
