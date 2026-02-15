
import React, { useState } from 'react';
import { ShieldCheck, Database, Users, HardDrive, Activity, FileText, Plus, Trash2, RefreshCw, BarChart3, Wallet, Clock } from 'lucide-react';

const INITIAL_SOURCES = [
  { id: 1, name: 'NCERT Physics Class 12', size: '15.4 MB', status: 'Indexed', type: 'PDF', chapter: 'Mechanics' },
  { id: 2, name: 'JEE Main PYQs 2024', size: '2.1 MB', status: 'Processing', type: 'JSON', chapter: 'Full' },
  { id: 3, name: 'CBSE Sample Papers', size: '4.8 MB', status: 'Indexed', type: 'PDF', chapter: 'Physics' },
  { id: 4, name: 'NCERT Organic Chemistry', size: '12.2 MB', status: 'Indexed', type: 'PDF', chapter: 'Carbon Compounds' },
];

const USAGE_DATA = [
  { day: 'Mon', tokens: 4200, cost: 0.12 },
  { day: 'Tue', tokens: 5800, cost: 0.18 },
  { day: 'Wed', tokens: 3900, cost: 0.11 },
  { day: 'Thu', tokens: 6200, cost: 0.20 },
  { day: 'Fri', tokens: 7500, cost: 0.25 },
];

const AdminDashboard: React.FC = () => {
  const [sources, setSources] = useState(INITIAL_SOURCES);
  const [isHealthy, setIsHealthy] = useState(true);
  const [view, setView] = useState<'rag' | 'analytics' | 'users'>('rag');

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
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">System Control Panel</h2>
          <p className="text-slate-500 font-medium">Global AI Governance & RAG Integrity</p>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Registered Students', value: '14,204', icon: <Users />, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Total Tokens (MTD)', value: '1.2M', icon: <Database />, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'System Latency', value: '185ms', icon: <Clock />, color: 'text-amber-600 bg-amber-50' },
          { label: 'Estimated Spend', value: '$24.50', icon: <Wallet />, color: 'text-slate-600 bg-slate-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${stat.color}`}>
              {React.cloneElement(stat.icon as React.ReactElement, { className: 'w-6 h-6' })}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {view === 'rag' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Database className="w-7 h-7 text-indigo-600" /> RAG Knowledge Manager
              </h3>
              <button className="bg-indigo-600 p-4 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all">
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
                      <div className="flex gap-2 items-center mt-1">
                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest px-2 py-0.5 bg-indigo-50 rounded-md">{source.chapter}</span>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{source.type} • {source.size}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${
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
              <ShieldCheck className="w-7 h-7 text-emerald-400" /> Access & Audit Logs
            </h3>
            <div className="space-y-6 relative z-10">
              {[
                { event: 'Root access verified', time: '1m ago', type: 'system', user: 'Admin' },
                { event: 'Bulk PDF re-indexing', time: '12m ago', type: 'rag', user: 'System' },
                { event: 'New teacher account: math_head', time: '2h ago', type: 'auth', user: 'SuperAdmin' },
                { event: 'Anomalous traffic blocked', time: '5h ago', type: 'sec', user: 'Firewall' },
                { event: 'API Key rotation triggered', time: '1d ago', type: 'system', user: 'Admin' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 items-start border-l-2 border-slate-800 pl-6 py-1">
                  <div className="shrink-0 pt-1 text-slate-500 font-black text-[10px] w-12">{log.time}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{log.event}</p>
                    <div className="flex gap-2 items-center">
                       <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{log.type}</p>
                       <span className="text-slate-600 text-[9px]">by {log.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
          </div>
        </div>
      )}

      {view === 'analytics' && (
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <BarChart3 className="w-7 h-7 text-indigo-600" /> Cost & Token Analytics
              </h3>
              <div className="flex gap-2">
                 <button className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-black">7 Days</button>
                 <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black">30 Days</button>
              </div>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <p className="text-sm font-black text-slate-400 uppercase">Usage Heatmap</p>
                 <div className="space-y-3">
                    {USAGE_DATA.map((u, i) => (
                       <div key={i} className="flex items-center gap-4">
                          <span className="w-10 text-xs font-black text-slate-400">{u.day}</span>
                          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-600" style={{ width: `${(u.tokens / 8000) * 100}%` }} />
                          </div>
                          <span className="text-xs font-black text-slate-800">{u.tokens} tokens</span>
                       </div>
                    ))}
                 </div>
              </div>
              <div className="bg-indigo-50 p-8 rounded-[3rem] border border-indigo-100 flex flex-col justify-center">
                 <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Efficiency Ratio</p>
                 <h4 className="text-4xl font-black text-indigo-900 mb-4">98.2%</h4>
                 <p className="text-xs font-bold text-indigo-700 leading-relaxed">System is running at peak token efficiency. Socratic responses are successfully reducing session length by 24%.</p>
              </div>
           </div>
        </div>
      )}

      {view === 'users' && (
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm text-center">
           <Users className="w-16 h-16 text-slate-200 mx-auto mb-6" />
           <h3 className="text-2xl font-black text-slate-800 mb-2">User Directory</h3>
           <p className="text-slate-500 mb-8 max-w-md mx-auto">Bulk-import students, manage teacher credentials, and monitor individual engagement metrics.</p>
           <div className="flex justify-center gap-4">
              <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl">Bulk Import Students</button>
              <button className="bg-white border-2 border-slate-100 text-slate-800 px-8 py-4 rounded-2xl font-black">Create Teacher User</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
