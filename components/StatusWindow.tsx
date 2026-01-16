
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Salah, KnowledgeQuest, Exercise, SystemTheme } from '../types';
import WeeklyReport from './WeeklyReport';
import RankPath from './RankPath';

interface StatusWindowProps {
  profile: UserProfile;
  salah: Salah[];
  knowledge: KnowledgeQuest[];
  studyMinutes: number;
  exercises: Exercise[];
  getTarget: (ex: Exercise) => number;
  onOpenModal: () => void;
  onChangeTheme: (theme: SystemTheme) => void;
  onToggleSound: () => void;
}

const StatusWindow: React.FC<StatusWindowProps> = ({ profile, salah, knowledge, studyMinutes, exercises, getTarget, onOpenModal, onChangeTheme, onToggleSound }) => {
  const [time, setTime] = useState(new Date());
  const [showRankPath, setShowRankPath] = useState(false);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const prevLevelRef = useRef(profile.physicalLevel);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Level Up Flourish Detection
  useEffect(() => {
    if (profile.physicalLevel > prevLevelRef.current) {
      setIsLevelingUp(true);
      const timer = setTimeout(() => setIsLevelingUp(false), 2500);
      prevLevelRef.current = profile.physicalLevel;
      return () => clearTimeout(timer);
    }
    prevLevelRef.current = profile.physicalLevel;
  }, [profile.physicalLevel]);

  const salahCount = salah.filter(s => s.completed).length;
  const knowledgeProgress = knowledge.reduce((acc, k) => acc + (k.currentMinutes / k.targetMinutes), 0) / (knowledge.length || 1);
  const physicalProgress = exercises.filter(e => e.completed).length / (exercises.length || 1);
  const studyProgress = Math.min(1, studyMinutes / 120);
  const totalCompletion = ((salahCount/5 * 40) + (knowledgeProgress * 20) + (physicalProgress * 30) + (studyProgress * 10));
  const hasDebt = (Object.values(profile.penaltyDebt) as number[]).some(d => d > 0);

  const expPercentage = (profile.exp / profile.nextLevelExp) * 100;

  const themes: { id: SystemTheme; color: string; label: string; sub: string }[] = [
    { id: 'emerald', color: 'bg-emerald-500', label: 'Emerald', sub: 'The System' },
    { id: 'blue', color: 'bg-blue-500', label: 'Monarch', sub: 'Awakened' },
    { id: 'red', color: 'bg-red-500', label: 'Frenzy', sub: 'Bloodlust' },
    { id: 'gold', color: 'bg-amber-500', label: 'Royal', sub: 'National' },
    { id: 'violet', color: 'bg-purple-500', label: 'Abyssal', sub: 'Shadow' },
  ];

  const currentRank = profile.physicalLevel > 30 ? 'NAT' : 
                     profile.physicalLevel > 25 ? 'S' : 
                     profile.physicalLevel > 20 ? 'A' : 
                     profile.physicalLevel > 15 ? 'B' : 
                     profile.physicalLevel > 10 ? 'C' : 
                     profile.physicalLevel > 5 ? 'D' : 'E';

  return (
    <div className="w-full flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex justify-between items-end px-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-system system-text uppercase tracking-[0.2em] font-black">SYSTEM_TIME</span>
          <span className="font-system text-2xl text-white tabular-nums tracking-tighter system-glow leading-none transition-theme">
            {time.toLocaleTimeString([], { hour12: false })}
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={onToggleSound}
            className="group flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-all"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${profile.soundEnabled ? 'system-text system-bg' : 'text-gray-600'}`}>
              {profile.soundEnabled ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M6.5 8H4v8h2.5l4.5 4.5V3.5L6.5 8z" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4V9h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
              )}
            </div>
            <span className="text-[7px] font-system uppercase font-black tracking-widest">{profile.soundEnabled ? 'AUDIO_ON' : 'AUDIO_MUTED'}</span>
          </button>

          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-system system-text uppercase tracking-[0.2em] font-black">DAILY_STREAK</span>
            <div className="flex items-center gap-2">
               <span className="font-system text-3xl font-black text-white italic leading-none transition-theme">{profile.streak}</span>
               <span className="text-[10px] text-gray-500 font-system uppercase tracking-widest font-black">DAYS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Status Panel */}
      <div className="bg-black/40 border border-white/10 p-7 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group transition-theme">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        {hasDebt && (
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-red-600/30 border-b border-l border-red-500/50 text-red-500 font-system text-[9px] font-black uppercase tracking-widest animate-pulse z-20">
            PENALTY_OVERLOAD
          </div>
        )}
        
        <div className="flex justify-between items-start mb-6 relative z-10">
           <div className="space-y-3">
             <div className="space-y-1">
               <h2 className="font-system text-xs font-black text-gray-500 uppercase tracking-[0.3em]">STEWARD_CLASS</h2>
               <div className="flex items-center gap-2">
                 <span className="text-white font-system font-black uppercase text-2xl system-glow tracking-tight transition-theme">{profile.name}</span>
               </div>
             </div>
             <div className="flex gap-2">
               <button 
                onClick={() => setShowRankPath(!showRankPath)}
                className={`px-3 py-1 system-bg border system-border rounded-xl text-[11px] system-text font-system font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${showRankPath ? 'brightness-125' : ''}`}
               >
                  RANK: {currentRank}
               </button>
               
               {/* Level Badge with Flourish */}
               <div className="relative">
                 <div className={`px-3 py-1 system-bg border system-border rounded-xl text-[11px] system-text font-system font-black uppercase tracking-wider transition-all relative z-10 ${isLevelingUp ? 'level-up-animate brightness-150 scale-110 shadow-[0_0_20px_var(--primary-glow)]' : 'transition-theme'}`}>
                    LVL: {profile.physicalLevel}
                 </div>
                 {isLevelingUp && (
                   <>
                     <div className="absolute inset-0 bg-white rounded-xl blur-md animate-ping opacity-60 z-0 transition-theme"></div>
                     <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-system font-black system-text tracking-[0.3em] animate-bounce z-20 shadow-2xl">
                       LEVEL UP!
                     </div>
                     <div className="absolute -inset-2 border-2 system-border rounded-2xl animate-pulse opacity-40 z-0"></div>
                   </>
                 )}
               </div>
             </div>
           </div>
           <div className="text-right">
              <span className="block text-[10px] font-system text-gray-500 uppercase mb-1 tracking-widest font-black">SYNC_RATE</span>
              <span className={`text-6xl font-system font-black system-text system-glow leading-none italic transition-theme`}>{Math.round(totalCompletion)}%</span>
           </div>
        </div>

        <div className="space-y-4 relative z-10">
           <div className="space-y-1.5">
             <div className="flex justify-between text-[9px] font-system uppercase text-gray-400 tracking-widest font-black">
               <span>EXPERIENCE_GAUGE</span>
               <span className="system-text">{profile.exp} / {profile.nextLevelExp} EXP</span>
             </div>
             <div className="h-1.5 w-full bg-black/60 rounded-full border border-white/5 overflow-hidden">
               <div 
                 className={`h-full bg-white transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,255,255,0.4)] ${isLevelingUp ? 'brightness-200' : ''}`} 
                 style={{ width: `${expPercentage}%` }}
               />
             </div>
           </div>

           <div className="space-y-1.5">
             <div className="flex justify-between text-[9px] font-system uppercase text-gray-400 tracking-widest font-black">
               <span>STEWARDSHIP_INDEX</span>
               <span className="system-text font-black">CALIBRATED</span>
             </div>
             <div className="h-2 w-full bg-black/60 rounded-full border border-white/5 overflow-hidden">
               <div 
                 className={`h-full system-btn transition-all duration-1000 ease-out ${isLevelingUp ? 'brightness-150 animate-pulse' : ''}`} 
                 style={{ width: `${totalCompletion}%` }}
               />
             </div>
           </div>
        </div>
      </div>

      {/* Conditional Rank Progression Pathway */}
      {showRankPath && <RankPath profile={profile} />}

      {/* Weekly Summary Report */}
      <WeeklyReport history={profile.weeklyHistory || []} />

      {/* Theme Switcher & Actions */}
      <div className="bg-black/60 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md transition-theme space-y-6">
        <div>
          <h3 className="font-system text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-5 px-1">AESTHETIC_PROTOCOLS</h3>
          <div className="grid grid-cols-5 gap-3">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => onChangeTheme(t.id)}
                className={`group flex flex-col items-center gap-2 p-2 rounded-2xl border transition-all duration-300 ${
                  profile.theme === t.id ? 'system-border system-bg scale-105 bg-white/5' : 'border-transparent opacity-40 hover:opacity-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl ${t.color} shadow-2xl relative ${profile.theme === t.id ? 'ring-2 ring-white/30' : ''}`}>
                   {profile.theme === t.id && <div className="absolute inset-0 system-btn blur-md opacity-50 -z-10"></div>}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-system font-black uppercase tracking-tighter text-white">{t.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col gap-1 group hover:bg-white/10 transition-all hover:-translate-y-1">
           <span className="text-[10px] font-system text-gray-500 uppercase tracking-widest font-black">LIMIT_BREAK</span>
           <span className="text-lg font-system font-black text-white italic tracking-tighter transition-theme">
             {profile.streak >= 7 ? "SYSTEM_OVERRIDE" : profile.streak >= 3 ? "STABLE_FLOW" : "INITIALIZING"}
           </span>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col gap-1 group hover:bg-white/10 transition-all hover:-translate-y-1">
           <span className="text-[10px] font-system text-gray-500 uppercase tracking-widest font-black">RECOVERY_POOL</span>
           <span className={`text-lg font-system font-black italic tracking-tighter transition-theme ${profile.recoveryPrivilegeUsed ? 'system-text' : 'text-gray-600'}`}>
             {profile.recoveryPrivilegeUsed ? "REGENERATING" : profile.streak >= 5 ? "POOL_MAX" : "EMPTY"}
           </span>
        </div>
      </div>

      <div className="mt-2 p-6 border-l-4 system-border system-bg rounded-r-[2rem] transition-theme">
        <p className="text-[12px] font-system system-text leading-relaxed italic uppercase font-black tracking-tight">
          "The System tracks every breath, every muscle fiber, and every second of silence. Consistency is the only currency that never devalues."
        </p>
      </div>
    </div>
  );
};

export default StatusWindow;
