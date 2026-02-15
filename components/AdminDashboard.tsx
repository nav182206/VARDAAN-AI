
import React, { useState } from 'react';
import { ShieldCheck, Database, Users, HardDrive, Settings, Activity, FileText, Plus, Trash2, RefreshCw } from 'lucide-react';

const INITIAL_SOURCES = [
  { id: 1, name: 'NCERT Physics Class 12', size: '15.4 MB', status: 'Indexed', type: 'PDF' },
  { id: 2, name: 'JEE Main PYQs 2024', size: '2.1 MB', status: 'Processing', type: 'JSON' },
  { id: 3, name: 'CBSE Sample Papers', size: '4.8 MB', status: 'Indexed', type: 'PDF' },
];

const AdminDashboard: React.FC = () => {
  const [sources, setSources] = useState(INITIAL_SOURCES);
  const [isHealthy, setIsHealthy] = useState(true);

  const deleteSource = (id: number) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

  const refreshSource = (id: number) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, status: 'Processing' } : s));
    setTimeout(() => {
      setSources(prev => prev.map(s => s.id === id ? { ...s, status: 'Indexed' } : s));
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">System Management</h2>
          <p className="text-slate-500 font-medium">Control Vardaan's RAG and Logic Core</p>
        </div>
        <button 
          onClick={() => setIsHealthy(!isHealthy)}
          className={`px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-3 transition-all ${
            isHealthy ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
          }`}
        >
          <Activity className={`w-5 h-5 ${isHealthy ? 'animate-pulse' : ''}`} />
          {isHealthy ? 'System: Healthy' : 'System: Maintenance'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Active Learners', value: '14,204', icon: <Users />, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'RAG Knowledge', value: '852k bits', icon: <Database />, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Avg Latency', value: '240ms', icon: <Activity />, color: 'text-amber-600 bg-amber-50' },
          { label: 'Disk Usage', value: '1.2 TB', icon: <HardDrive />, color: 'text-slate-600 bg-slate-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${stat.color}`}>
              {React.cloneElement(stat.icon as React.ReactElement, { className: 'w-7 h-7' })}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <Database className="w-7 h-7 text-indigo-600" /> Knowledge Sources
            </h3>
            <button className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:rotate-90 transition-all">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            {sources.map(source => (
              <div key={source.id} className="p-5 rounded-3xl border border-slate-50 bg-slate-50/50 flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">{source.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{source.type} • {source.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                    source.status === 'Indexed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {source.status}
                  </span>
                  <button onClick={() => refreshSource(source.id)} className="p-2 text-slate-300 hover:text-indigo-600 transition-all">
                    <RefreshCw className={`w-4 h-4 ${source.status === 'Processing' ? 'animate-spin' : ''}`} />
                  </button>
                  <button onClick={() => deleteSource(source.id)} className="p-2 text-slate-300 hover:text-rose-600 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-400" /> Security Logs
          </h3>
          <div className="space-y-6 relative z-10">
            {[
              { event: 'Root access verified', time: '1m ago', type: 'system' },
              { event: 'Bulk PDF re-indexing', time: '12m ago', type: 'rag' },
              { event: 'New teacher account: physics_dept', time: '2h ago', type: 'auth' },
              { event: 'Anomalous traffic blocked', time: '5h ago', type: 'sec' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 items-start border-l-2 border-slate-800 pl-6 py-1">
                <div className="shrink-0 pt-1 text-slate-500 font-black text-[10px] w-12">{log.time}</div>
                <div>
                  <p className="text-sm font-bold text-slate-200">{log.event}</p>
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{log.type}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
