
import React from 'react';
import { Trophy, Medal, Star, Flame, Award, Crown } from 'lucide-react';
import { UserStats } from '../types';

interface Props {
  stats: UserStats;
}

const mockLeaderboard = [
  { name: 'Arjun Patel', score: 14500, avatar: 'AP' },
  { name: 'Priya Sharma', score: 13200, avatar: 'PS' },
  { name: 'You', score: 9840, avatar: 'ME', active: true },
  { name: 'Rahul Kumar', score: 8700, avatar: 'RK' },
  { name: 'Sanya Gupta', score: 7200, avatar: 'SG' },
];

const AchievementsView: React.FC<Props> = ({ stats }) => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                <Trophy className="w-10 h-10 text-amber-300" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-100 opacity-80 mb-1">Current Standing</p>
                <h2 className="text-3xl font-black mb-1">Academic Warrior</h2>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-orange-400" /> 5 Day Streak</span>
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-300" /> Level {stats.level}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-2 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold">{stats.points} XP Earned</span>
                <span className="text-xs font-medium opacity-80">Next Level: 10,000 XP</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-1000" 
                  style={{ width: `${(stats.points / 10000) * 100}%` }} 
                />
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 opacity-10">
               <Crown className="w-64 h-64" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Medal className="w-6 h-6 text-indigo-600" />
              Unlocked Badges
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.badges.map((badge) => (
                <div 
                  key={badge.id} 
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center group ${
                    badge.unlocked 
                      ? 'bg-white border-indigo-100 hover:border-indigo-300 hover:shadow-lg' 
                      : 'bg-slate-50 border-slate-100 opacity-40 grayscale'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                    badge.unlocked ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-400'
                  }`}>
                    <Award className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-black text-slate-800 mb-1">{badge.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm h-fit">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500" />
            Regional Leaderboard
          </h3>
          <div className="space-y-4">
            {mockLeaderboard.map((user, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  user.active ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-lg' : 'hover:bg-slate-50'
                }`}
              >
                <span className={`text-sm font-black w-4 ${user.active ? 'text-white' : 'text-slate-400'}`}>{idx + 1}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                  user.active ? 'bg-white/20' : 'bg-slate-100 text-slate-600'
                }`}>
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${user.active ? 'text-white' : 'text-slate-800'}`}>{user.name}</p>
                  <p className={`text-[10px] font-bold opacity-70 ${user.active ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {user.score.toLocaleString()} XP
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-wider">
            View National Ranking
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementsView;
