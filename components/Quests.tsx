
import React from 'react';
import { Exercise, UserProfile, CustomTask } from '../types';

interface QuestsProps {
  exercises: Exercise[];
  profile: UserProfile;
  getTarget: (ex: Exercise) => number;
  onUpdateProgress: (id: string, progress: number) => void;
  onUseRecovery: () => void;
  customTasks: CustomTask[];
  onUpdateCustomTask: (id: string, current: number) => void;
}

const Quests: React.FC<QuestsProps> = ({ exercises, profile, getTarget, onUpdateProgress, onUseRecovery, customTasks, onUpdateCustomTask }) => {
  const hasDebt = (Object.values(profile.penaltyDebt) as number[]).some(d => d > 0);

  const handleCustomAdd = (taskId: string, currentVal: number, target: number, amount: number) => {
    onUpdateCustomTask(taskId, Math.min(target, currentVal + amount));
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="font-system text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-1 italic">DAILY_VESSEL</h2>
          <p className="text-[10px] font-system system-text tracking-[0.2em] uppercase font-black">STEWARD_PROTOCOL • LEVEL {profile.physicalLevel}</p>
        </div>
        <div className="text-right">
          <span className="block text-[9px] text-gray-600 font-system uppercase tracking-widest font-black">FAILURE_RISK</span>
          <span className={`text-[12px] font-system font-black italic ${hasDebt ? 'text-red-500' : 'system-text'}`}>
            {hasDebt ? "CRITICAL_OVERLOAD" : "STABLE"}
          </span>
        </div>
      </div>

      {profile.streak >= 5 && !profile.recoveryPrivilegeUsed && (
        <button 
          onClick={onUseRecovery}
          className="group relative w-full py-5 system-bg border-2 system-border rounded-[1.5rem] system-text font-system text-[11px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-xl"
        >
          <div className="absolute inset-0 system-btn opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <div className="flex items-center justify-center gap-3 relative z-10">
            <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12z" /></svg>
            [ INITIALIZE_RECOVERY_PRIVILEGE ]
          </div>
        </button>
      )}

      {profile.recoveryPrivilegeUsed && (
        <div className="bg-white/5 border-2 system-border border-dashed p-4 rounded-2xl text-center">
           <span className="text-[11px] font-system system-text font-black uppercase tracking-widest italic animate-pulse">RECOVERY_MODE_ACTIVE: 0.5x WORKLOAD</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5">
        {/* Standard Exercises */}
        {exercises.map(ex => {
          const target = getTarget(ex);
          const debt = profile.penaltyDebt[ex.id] || 0;
          
          return (
            <div key={ex.id} className={`group p-6 rounded-[2rem] border transition-all duration-500 ${ex.completed ? 'bg-black/20 border-white/5 opacity-50 grayscale' : 'bg-black/60 border-white/10 shadow-2xl hover:border-white/30'} relative overflow-hidden`}>
              <div className="absolute inset-x-0 bottom-0 h-1 system-bg opacity-30"></div>
              
              {debt > 0 && !ex.completed && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-red-600 text-white font-system text-[8px] font-black uppercase tracking-widest z-10 rounded-bl-xl shadow-lg">
                  +{debt}_DEBT
                </div>
              )}
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${ex.completed ? 'bg-emerald-500 text-black' : 'bg-white/5 system-text border border-white/10 shadow-lg'}`}>
                    {getExerciseIcon(ex.id)}
                  </div>
                  <div>
                    <h3 className="font-system text-lg font-black text-white uppercase tracking-tighter leading-none mb-1 italic">{ex.title}</h3>
                    <p className="text-[10px] text-gray-500 font-system uppercase tracking-widest font-black">GOAL: {target} {ex.unit}</p>
                  </div>
                </div>
                {ex.completed && (
                  <div className="system-text text-[10px] font-system font-black border-2 system-border px-3 py-1 rounded-xl system-glow italic">
                    FULFILLED
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-5">
                  <input 
                    type="range" 
                    min="0" 
                    max={target} 
                    value={ex.currentProgress}
                    onChange={(e) => onUpdateProgress(ex.id, parseInt(e.target.value))}
                    disabled={ex.completed}
                    className="flex-1 accent-[var(--primary)] h-1.5 rounded-full cursor-pointer"
                  />
                  <div className="flex flex-col items-end">
                    <span className="font-system text-[10px] font-black text-gray-500 uppercase tracking-tighter">PROGRESS</span>
                    <span className="font-system text-xl font-black text-white tabular-nums leading-none tracking-tighter italic">
                      {ex.currentProgress}<span className="text-xs text-gray-600">/{target}</span>
                    </span>
                  </div>
                </div>
                
                {!ex.completed && (
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => onUpdateProgress(ex.id, ex.currentProgress + 1)}
                      className="py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-system text-[11px] font-black hover:bg-white/10 transition-all uppercase tracking-widest italic"
                    >
                      +1 {ex.unit}
                    </button>
                    <button 
                      onClick={() => onUpdateProgress(ex.id, ex.currentProgress + 10)}
                      className="py-3 system-bg border system-border rounded-2xl system-text font-system text-[11px] font-black hover:bg-white/10 transition-all uppercase tracking-widest italic"
                    >
                      +10 {ex.unit}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Custom Physical Acts */}
        {customTasks.length > 0 && (
          <div className="mt-4 space-y-4">
            <h3 className="text-[10px] font-system text-gray-500 uppercase tracking-widest ml-2 font-black">Registry Acts: Physical</h3>
            {customTasks.map(task => (
              <div key={task.id} className={`p-6 rounded-[2rem] border transition-all duration-500 ${task.completed ? 'bg-black/20 border-white/5 opacity-50' : 'bg-black/60 border-white/10 shadow-xl'}`}>
                <div className="flex justify-between items-start mb-4">
                   <h4 className="font-system text-md font-black text-white uppercase italic tracking-tight">{task.title}</h4>
                   <span className="text-[8px] font-system font-black px-2 py-1 rounded-lg system-bg system-text uppercase tracking-widest">+{task.expReward} EXP</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="flex-1 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full system-btn" style={{ width: `${(task.current / task.target) * 100}%` }} />
                     </div>
                     <span className="font-system text-xs font-black text-white italic tabular-nums">{task.current}/{task.target} {task.unit}</span>
                  </div>
                  {!task.completed && (
                    <div className="grid grid-cols-2 gap-2">
                       <button onClick={() => handleCustomAdd(task.id, task.current, task.target, 1)} className="py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-system text-[9px] font-black uppercase tracking-widest italic">+1</button>
                       <button onClick={() => handleCustomAdd(task.id, task.current, task.target, 5)} className="py-2.5 system-bg border system-border rounded-xl system-text font-system text-[9px] font-black uppercase tracking-widest italic">+5</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 bg-red-950/20 border border-red-500/20 p-5 rounded-[1.5rem]">
        <p className="text-[10px] font-system text-red-500 font-black uppercase tracking-[0.2em] text-center leading-relaxed">
          FAILSAFE: ANY UNLOGGED EFFORT WILL BE COMPOUNDED AT A RATE OF +15 PENALTY UNITS UPON NEXT CYCLE.
        </p>
      </div>
    </div>
  );
};

const getExerciseIcon = (id: string) => {
  switch(id) {
    case 'pushups': return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    case 'squats': return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
    case 'situps': return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
    case 'plank': return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    default: return null;
  }
};

export default Quests;
