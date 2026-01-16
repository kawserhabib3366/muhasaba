
import React from 'react';
import { UserProfile } from '../types';

interface RankPathProps {
  profile: UserProfile;
}

const RankPath: React.FC<RankPathProps> = ({ profile }) => {
  const ranks = [
    { name: 'E', minLvl: 1, label: 'Insignificant' },
    { name: 'D', minLvl: 6, label: 'Awakened' },
    { name: 'C', minLvl: 11, label: 'Veteran' },
    { name: 'B', minLvl: 16, label: 'Elite' },
    { name: 'A', minLvl: 21, label: 'Master' },
    { name: 'S', minLvl: 26, label: 'Transcendent' },
    { name: 'NAT', minLvl: 31, label: 'National' },
  ];

  const currentLevel = profile.physicalLevel;
  const nextRank = ranks.find(r => r.minLvl > currentLevel) || ranks[ranks.length - 1];
  const levelsToNextRank = nextRank.minLvl - currentLevel;

  return (
    <div className="bg-black/60 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-xl shadow-2xl transition-theme animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-system text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">HUNTER_PATHWAY</h3>
          <p className="text-white font-system font-black uppercase text-sm italic tracking-tighter">Ascension Progress</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-system system-text font-black uppercase tracking-widest">NEXT_PHASE</span>
          <p className="text-white font-system font-black text-xs italic">LVL {nextRank.minLvl}</p>
        </div>
      </div>

      {/* Visual Rank Ladder */}
      <div className="relative mb-8 px-2">
        <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-0.5 bg-white/5" />
        <div className="flex flex-col gap-4">
          {ranks.map((rank, i) => {
            const isCurrent = currentLevel >= rank.minLvl && (i === ranks.length - 1 || currentLevel < ranks[i + 1].minLvl);
            const isAchieved = currentLevel >= rank.minLvl;
            const isLocked = currentLevel < rank.minLvl;

            return (
              <div key={rank.name} className={`flex items-center gap-4 transition-all duration-500 ${isAchieved ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-system font-black text-xs border-2 transition-all relative ${
                  isCurrent ? 'system-border system-bg system-text scale-110 system-glow z-10' : 
                  isAchieved ? 'border-white/20 text-white' : 'border-white/5 text-gray-700'
                }`}>
                  {isCurrent && <div className="absolute inset-0 system-bg blur-md -z-10 animate-pulse" />}
                  {rank.name}
                </div>
                <div className="flex flex-col">
                  <span className={`font-system text-[10px] font-black uppercase tracking-widest leading-none ${isAchieved ? 'text-white' : 'text-gray-700'}`}>
                    {rank.label}
                  </span>
                  <span className="text-[8px] font-system text-gray-500 uppercase tracking-tighter">REQ: LVL {rank.minLvl}</span>
                </div>
                {isCurrent && (
                   <div className="ml-auto flex items-center gap-2 animate-in slide-in-from-right-2">
                      <div className="w-1.5 h-1.5 rounded-full system-btn shadow-lg" />
                      <span className="text-[9px] font-system system-text font-black uppercase italic">CURRENT_STATUS</span>
                   </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="space-y-4 p-5 bg-white/5 border border-white/5 rounded-[2rem]">
        <div className="flex justify-between items-center px-1">
          <span className="text-[9px] font-system text-gray-500 uppercase font-black tracking-widest">LEVEL_ANALYSIS</span>
          <span className="text-[9px] font-system system-text font-black uppercase">SYNC_ACTIVE</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[8px] text-gray-600 font-black uppercase block tracking-tighter">LVL_DELTA_RANK</span>
            <span className="text-lg font-system font-black text-white italic tracking-tighter tabular-nums">
              {levelsToNextRank} <span className="text-[8px] text-gray-500">LEVELS</span>
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[8px] text-gray-600 font-black uppercase block tracking-tighter">EXP_REMAINING</span>
            <span className="text-lg font-system font-black text-white italic tracking-tighter tabular-nums">
              {profile.nextLevelExp - profile.exp} <span className="text-[8px] text-gray-500">POINTS</span>
            </span>
          </div>
        </div>

        <div className="h-1.5 w-full bg-black/40 rounded-full border border-white/5 overflow-hidden">
           <div 
             className="h-full system-btn transition-all duration-1000" 
             style={{ width: `${(profile.exp / profile.nextLevelExp) * 100}%` }}
           />
        </div>
        
        <p className="text-[8px] font-system text-gray-600 uppercase italic tracking-tight leading-relaxed">
          *System Note: EXP requirements increase by 20% compounded with every level advancement. Discipline is non-negotiable.
        </p>
      </div>
    </div>
  );
};

export default RankPath;
