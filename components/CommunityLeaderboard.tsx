import React from 'react';
import { Crown, Trophy } from 'lucide-react';

// Mock data for demonstration
const leaderboardData = [
  { rank: 1, name: 'Aarav Sharma', xp: 15230 },
  { rank: 2, name: 'Diya Patel', xp: 14890 },
  { rank: 3, name: 'Rohan Gupta', xp: 14500 },
  { rank: 4, name: 'Priya Singh', xp: 13980 },
  { rank: 5, name: 'Vikram Kumar', xp: 13500 },
];

const CommunityLeaderboard: React.FC = () => {
  return (
    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm w-full">
      <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
        <Trophy className="w-7 h-7 text-amber-500" />
        Community Leaderboard
      </h3>
      <div className="space-y-4">
        {leaderboardData.map((user, index) => (
          <div key={user.rank} className={`flex items-center p-5 rounded-2xl transition-all ${user.rank === 1 ? 'bg-amber-50 border-2 border-amber-200' : 'bg-slate-50'}`}>
            <div className="flex items-center gap-5 flex-1">
              <span className={`text-xl font-black ${user.rank <= 3 ? 'text-amber-600' : 'text-slate-400'}`}>{user.rank}</span>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center font-black text-indigo-700 text-lg">
                {user.name[0]}
              </div>
              <span className="font-bold text-slate-800 text-lg">{user.name}</span>
              {user.rank === 1 && <Crown className="w-6 h-6 text-amber-500" />}
            </div>
            <div className="text-right">
              <span className="font-black text-xl text-indigo-600">{user.xp.toLocaleString()} XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityLeaderboard;
