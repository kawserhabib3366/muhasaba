
import React from 'react';
import { Exercise, UserProfile } from '../types';

interface QuestsProps {
  exercises: Exercise[];
  profile: UserProfile;
  getTarget: (ex: Exercise) => number;
  onUpdateProgress: (id: string, progress: number) => void;
  onUseRecovery: () => void;
}

const Quests: React.FC<QuestsProps> = ({ exercises, profile, getTarget, onUpdateProgress, onUseRecovery }) => {
  // Fix: Explicitly cast values to number array to resolve comparison with 'unknown' type
  const hasDebt = (Object.values(profile.penaltyDebt) as number[]).some(d => d > 0);

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="font-system text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">DAILY QUESTS</h2>
          <p className="text-[9px] font-system text-emerald-500 tracking-widest uppercase">Physical Discipline • Level {profile.physicalLevel}</p>
        </div>
        <div className="text-right">
          <span className="block text-[7px] text-gray-500 font-system uppercase tracking-widest">PENALTY RISK</span>
          <span className={`text-[10px] font-system font-bold ${hasDebt ? 'text-red-500' : 'text-emerald-400'}`}>
            {hasDebt ? "CRITICAL" : "MINIMAL"}
          </span>
        </div>
      </div>

      {profile.streak >= 5 && !profile.recoveryPrivilegeUsed && (
        <button 
          onClick={onUseRecovery}
          className="w-full py-4 bg-emerald-600/20 border border-emerald-500/40 rounded-xl text-emerald-400 font-system text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600/30 transition-all flex items-center justify-center gap-2 animate-pulse"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12z" /></svg>
          [ ACTIVATE RECOVERY PRIVILEGE ]
        </button>
      )}

      {profile.recoveryPrivilegeUsed && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-center">
           <span className="text-[10px] font-system text-emerald-400 font-black uppercase tracking-widest">Recovery Active: All targets reduced by 50%</span>
        </div>
      )}

      <div className="space-y-4">
        {exercises.map(ex => {
          const target = getTarget(ex);
          const debt = profile.penaltyDebt[ex.id] || 0;
          
          return (
            <div key={ex.id} className={`p-5 rounded-2xl border transition-all duration-300 ${ex.completed ? 'bg-emerald-600/5 border-emerald-500/20 opacity-60' : 'bg-black/40 border-white/10 shadow-lg'} relative overflow-hidden`}>
              {debt > 0 && !ex.completed && (
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-red-600 text-white font-system text-[7px] font-black uppercase tracking-widest">
                  +{debt} PENALTY
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${ex.completed ? 'bg-emerald-500 text-black' : 'bg-white/5 text-emerald-400 border border-white/10'}`}>
                    {getExerciseIcon(ex.id)}
                  </div>
                  <div>
                    <h3 className="font-system text-sm font-black text-white uppercase tracking-tight leading-tight">{ex.title}</h3>
                    <p className="text-[8px] text-gray-500 font-system uppercase tracking-wider">Required: {target} {ex.unit}</p>
                  </div>
                </div>
                {ex.completed && (
                  <div className="text-emerald-500 text-[8px] font-system font-black border border-emerald-500/30 px-2 py-1 rounded">
                    FULFILLED
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <input 
                  type="range" 
                  min="0" 
                  max={target} 
                  value={ex.currentProgress}
                  onChange={(e) => onUpdateProgress(ex.id, parseInt(e.target.value))}
                  disabled={ex.completed}
                  className="flex-1 accent-emerald-500 h-1"
                />
                <span className="font-system text-[11px] font-black text-white w-16 text-right tabular-nums">
                  {ex.currentProgress}/{target}
                </span>
              </div>
              
              {!ex.completed && (
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => onUpdateProgress(ex.id, ex.currentProgress + 1)}
                    className="py-2 bg-white/5 border border-white/10 rounded-lg text-white font-system text-[9px] font-bold hover:bg-white/10 transition-all uppercase tracking-widest"
                  >
                    +1 {ex.unit}
                  </button>
                  <button 
                    onClick={() => onUpdateProgress(ex.id, ex.currentProgress + 10)}
                    className="py-2 bg-emerald-600/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-system text-[9px] font-bold hover:bg-emerald-600/20 transition-all uppercase tracking-widest"
                  >
                    +10 {ex.unit}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 bg-red-950/10 border border-red-500/10 p-4 rounded-xl">
        <p className="text-[8px] font-system text-red-400/60 uppercase tracking-widest text-center leading-relaxed">
          WARNING: Unfinished reps will be carried forward to the next cycle with an additional +15 penalty.
        </p>
      </div>
    </div>
  );
};

const getExerciseIcon = (id: string) => {
  switch(id) {
    case 'pushups': return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    case 'squats': return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
    case 'situps': return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
    case 'plank': return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    default: return null;
  }
};

export default Quests;
