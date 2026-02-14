
import React from 'react';
import { MessageSquare, Trophy, TrendingUp, X, Check, BellOff } from 'lucide-react';
import { Notification } from '../types';

interface Props {
  notifications: Notification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

const NotificationsDropdown: React.FC<Props> = ({ notifications, onClose, onMarkRead, onClearAll }) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'forum': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'achievement': return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'progress': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Notifications</h3>
        <div className="flex gap-2">
          {notifications.length > 0 && (
            <button 
              onClick={onClearAll}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase transition-colors"
            >
              Clear All
            </button>
          )}
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <BellOff className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-slate-400 text-sm font-medium">All caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 hover:bg-slate-50 transition-all cursor-default relative flex gap-3 ${!notif.read ? 'bg-indigo-50/30' : ''}`}
              >
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  notif.type === 'forum' ? 'bg-blue-50' : notif.type === 'achievement' ? 'bg-amber-50' : 'bg-emerald-50'
                }`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-sm font-bold truncate ${!notif.read ? 'text-slate-900' : 'text-slate-600'}`}>
                      {notif.title}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>
                  {!notif.read && (
                    <button 
                      onClick={() => onMarkRead(notif.id)}
                      className="mt-2 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors uppercase"
                    >
                      <Check className="w-3 h-3" /> Mark as read
                    </button>
                  )}
                </div>
                {!notif.read && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest transition-colors">
            View All Updates
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
