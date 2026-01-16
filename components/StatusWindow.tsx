
import React, { useState, useEffect } from 'react';
import { UserProfile, Salah, KnowledgeQuest, Exercise } from '../types';

interface StatusWindowProps {
  profile: UserProfile;
  salah: Salah[];
  knowledge: KnowledgeQuest[];
  studyMinutes: number;
  exercises: Exercise[];
  getTarget: (ex: Exercise) => number;
  onOpenModal: () => void;
}

const StatusWindow: React.FC<StatusWindowProps> = ({ profile, salah, knowledge, studyMinutes, exercises, getTarget, onOpenModal }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const salahCount = salah.filter(s => s.completed).length;
  const knowledgeProgress = knowledge.reduce((acc, k) => acc + (k.currentMinutes / k.targetMinutes), 0) / (knowledge.length || 1);
  const physicalProgress = exercises.filter(e => e.completed).length / (exercises.length || 1);
  const studyProgress = Math.min(1, studyMinutes / 120);

  const totalCompletion = ((salahCount/5 * 40) + (knowledgeProgress * 20) + (physicalProgress * 30) + (studyProgress * 10));
  
  // Fix: Explicitly cast values to number array to resolve comparison with 'unknown' type
  const hasDebt = (Object.values(profile.penaltyDebt) as number[]).some(d => d > 0);

  return (
    <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex justify-between items-center px-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-system text-emerald-500 uppercase tracking-widest">SYSTEM INITIALIZED</span>
          <span className="font-system text-lg text-white tabular-nums tracking-tighter">{time.toLocaleTimeString([], { hour12: false })}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-system text-emerald-500 uppercase tracking-widest">STREAK</span>
          <div className="flex items-center gap-1 justify-end">
             <span className="font-system text-xl font-black text-white">{profile.streak}</span>
             <span className="text-[9px] text-gray-500 font-system uppercase">Days</span>
          </div>
        </div>
      </div>

      <div className="bg-black/40 border border-emerald-500/20 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden">
        {hasDebt && (
          <div className="absolute top-0 right-0 px-3 py-1 bg-red-600/20 border-b border-l border-red-500/40 text-red-500 font-system text-[8px] font-black uppercase tracking-widest">
            PENALTY ACTIVE
          </div>
        )}
        
        <div className="flex justify-between items-start mb-6">
           <div>
             <h2 className="font-system text-xl font-bold text-white mb-1 uppercase tracking-tight">STATUS WINDOW</h2>
             <div className="flex items-center gap-2">
               <span className="text-emerald-400 font-system text-[10px] font-semibold tracking-widest uppercase">STEWARD:</span>
               <span className="text-white font-system font-bold uppercase text-sm">{profile.name}</span>
             </div>
             <div className="mt-2 flex gap-2">
               <div className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 rounded text-[10px] text-emerald-400 font-system font-bold uppercase">
                  LVL: {profile.physicalLevel}
               </div>
               {profile.streak >= 5 && (
                 <div className="px-2 py-0.5 bg-gold-500/20 border border-gold-500/40 rounded text-[10px] text-yellow-500 font-system font-bold uppercase">
                    REWARD READY
                 </div>
               )}
             </div>
           </div>
           <div className="text-right">
              <span className="block text-[8px] font-system text-gray-500 uppercase mb-1">COMPLETION</span>
              <span className={`text-4xl font-system font-black text-emerald-400 system-glow leading-none`}>{Math.round(totalCompletion)}%</span>
           </div>
        </div>

        <div className="space-y-2">
           <div className="flex justify-between text-[8px] font-system uppercase text-gray-400">
             <span>DAILY PROGRESS</span>
             <span className="text-emerald-400">{Math.round(totalCompletion)}% Complete</span>
           </div>
           <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
             <div 
               className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
               style={{ width: `${totalCompletion}%` }}
             />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
           <span className="text-[8px] font-system text-gray-500 uppercase block mb-1">STREAK STATUS</span>
           <span className="text-sm font-system font-bold text-white">{profile.streak >= 7 ? "S-RANK STREAK" : profile.streak >= 3 ? "B-RANK STREAK" : "INITIATE"}</span>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
           <span className="text-[8px] font-system text-gray-500 uppercase block mb-1">RECOVERY STATUS</span>
           <span className={`text-sm font-system font-bold ${profile.recoveryPrivilegeUsed ? 'text-emerald-400' : 'text-gray-400'}`}>
             {profile.recoveryPrivilegeUsed ? "ACTIVE" : profile.streak >= 5 ? "AVAILABLE" : "LOCKED"}
           </span>
        </div>
      </div>

      {profile.streak >= 7 && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12z" /></svg>
             </div>
             <div>
               <span className="text-[10px] font-system text-emerald-400 font-bold uppercase block">Shadow Recovery</span>
               <p className="text-[8px] text-gray-500 font-system uppercase">Consistent effort rewarded.</p>
             </div>
           </div>
           <span className="text-[10px] font-system text-white font-black italic uppercase">Biriyani Mode Unlocked</span>
        </div>
      )}
    </div>
  );
};

const ReportBar: React.FC<{ label: string, progress: number, text: string, color: string }> = ({ label, progress, text, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-[8px] font-system uppercase tracking-wider">
      <span className="text-gray-500">{label}</span>
      <span className={`font-bold text-white`}>{text}</span>
    </div>
    <div className="h-1 w-full bg-black/40 rounded-full border border-white/5 overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-700`} 
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  </div>
);

export default StatusWindow;
