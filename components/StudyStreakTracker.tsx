import React from 'react';
import { Flame } from 'lucide-react';

interface Props {
  streak: number;
}

const StudyStreakTracker: React.FC<Props> = ({ streak }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = new Date().getDay();

  return (
    <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-xl h-full flex flex-col">
      <h3 className="text-3xl font-black text-slate-800 mb-2 flex items-center gap-3">
        <Flame className="w-8 h-8 text-orange-500" />
        Study Streak
      </h3>
      <p className="text-slate-500 font-medium mb-8">You've maintained a study streak for {streak} {streak === 1 ? 'day' : 'days'}. Keep the fire burning!</p>
      
      <div className="flex justify-between items-center mt-auto">
        {days.map((day, index) => {
          const isActive = (todayIndex - index + 7) % 7 < streak;

          return (
            <div key={index} className="flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-lg transition-all
                ${isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-slate-100 text-slate-400'}
                ${index === todayIndex ? 'border-4 border-orange-200' : ''}
              `}>
                {isActive ? <Flame className="w-6 h-6" /> : day[0]}
              </div>
              <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-orange-600' : 'text-slate-400'}`}>{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudyStreakTracker;
