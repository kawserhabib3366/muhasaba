
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CustomTask } from '../types';

interface SessionSegment {
  type: 'work' | 'rest';
  durationSeconds: number;
  timestamp: Date;
}

interface StudyPanelProps {
  currentMinutes: number;
  onCompleteSession: (minutes: number) => void;
  customTasks: CustomTask[];
  onUpdateCustomTask: (id: string, current: number) => void;
  onNotify?: (type: 'success' | 'notification' | 'warning') => void;
}

const StudyPanel: React.FC<StudyPanelProps> = ({ 
  currentMinutes, 
  onCompleteSession, 
  customTasks, 
  onUpdateCustomTask,
  onNotify 
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionGoal, setSessionGoal] = useState(25);
  const [segments, setSegments] = useState<SessionSegment[]>([]);
  const [lastMarkSeconds, setLastMarkSeconds] = useState(0);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isActive && !isPaused && seconds < sessionGoal * 60) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (seconds >= sessionGoal * 60 && isActive) {
      finalizeSession();
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, isPaused, seconds, sessionGoal]);

  const finalizeSession = () => {
    setIsActive(false);
    setIsPaused(false);
    onCompleteSession(sessionGoal);
    setSeconds(0);
    setSegments([]);
    setLastMarkSeconds(0);
    if (onNotify) onNotify('success');
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setSeconds(0);
    setSegments([]);
    setLastMarkSeconds(0);
    if (onNotify) onNotify('notification');
  };

  const toggleTimer = () => {
    if (!isActive) {
      setIsActive(true);
      setIsPaused(false);
      setLastMarkSeconds(0);
      setSegments([]);
    } else {
      setIsPaused(!isPaused);
    }
    if (onNotify) onNotify('notification');
  };

  const markSegment = (type: 'work' | 'rest') => {
    const duration = seconds - lastMarkSeconds;
    if (duration <= 0) return;
    
    setSegments(prev => [...prev, {
      type,
      durationSeconds: duration,
      timestamp: new Date()
    }]);
    setLastMarkSeconds(seconds);
    if (onNotify) onNotify('notification');
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = useMemo(() => {
    const work = segments.reduce((acc, s) => s.type === 'work' ? acc + s.durationSeconds : acc, 0) + 
                 (isActive && segments[segments.length-1]?.type !== 'rest' ? (seconds - lastMarkSeconds) : 0);
    const rest = segments.reduce((acc, s) => s.type === 'rest' ? acc + s.durationSeconds : acc, 0) +
                 (isActive && segments[segments.length-1]?.type === 'rest' ? (seconds - lastMarkSeconds) : 0);
    const total = work + rest || 1;
    return {
      work,
      rest,
      efficiency: Math.round((work / total) * 100)
    };
  }, [segments, seconds, lastMarkSeconds, isActive]);

  const handleCustomAdd = (taskId: string, currentVal: number, target: number, amount: number) => {
    onUpdateCustomTask(taskId, Math.min(target, currentVal + amount));
  };

  const progress = (seconds / (sessionGoal * 60)) * 100;

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <div className="px-1 flex justify-between items-end">
        <div>
          <h2 className="font-system text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1 transition-theme">Intellectual Grind</h2>
          <p className="text-[9px] font-system system-text tracking-widest uppercase font-black transition-theme">Mental Stewardship • Deep Focus</p>
        </div>
        <div className="text-right">
          <span className="text-[8px] font-system text-gray-600 uppercase font-black tracking-widest transition-theme">EFFICIENCY_RATING</span>
          <div className="text-xl font-system system-text font-black italic tabular-nums leading-none transition-theme">
            {isActive ? stats.efficiency : '0'}%
          </div>
        </div>
      </div>

      <div className="bg-black/60 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl text-center relative overflow-hidden shadow-2xl transition-theme">
        {/* Visual Progress Background */}
        <div 
          className="absolute inset-x-0 bottom-0 system-bg opacity-10 transition-all duration-1000"
          style={{ height: `${progress}%` }}
        />

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-500 font-system text-[9px] uppercase tracking-[0.3em] font-black transition-theme">FOCUS_FREQUENCY_STABILIZED</div>
            {isActive && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full system-btn animate-pulse transition-theme" />
                <span className="text-[8px] font-system text-white uppercase font-black tracking-widest">SYNCHRONIZING</span>
              </div>
            )}
          </div>
          
          <div className="text-7xl font-system font-black text-white mb-8 tracking-tighter tabular-nums leading-none system-glow transition-theme">
            {formatTime(Math.max(0, sessionGoal * 60 - seconds))}
          </div>

          {/* New Visual Timeline */}
          {isActive && (
            <div className="h-2 w-full bg-black/40 rounded-full mb-8 flex overflow-hidden border border-white/5">
              {segments.map((seg, i) => (
                <div 
                  key={i} 
                  className={`h-full transition-all duration-500 ${seg.type === 'work' ? 'system-btn' : 'bg-amber-500/60'}`} 
                  style={{ width: `${(seg.durationSeconds / (sessionGoal * 60)) * 100}%` }}
                />
              ))}
              <div 
                className={`h-full transition-all duration-500 ${segments.length === 0 || segments[segments.length-1].type === 'rest' ? 'system-btn' : 'bg-amber-500/60'}`} 
                style={{ width: `${((seconds - lastMarkSeconds) / (sessionGoal * 60)) * 100}%` }}
              />
            </div>
          )}

          <div className="flex flex-col gap-3 mb-8">
            <div className="flex gap-2">
              <button 
                onClick={toggleTimer}
                className={`flex-1 py-5 rounded-2xl font-system font-black uppercase tracking-[0.2em] text-[11px] transition-all italic flex items-center justify-center gap-2 ${
                  !isActive 
                    ? 'system-btn text-black' 
                    : isPaused 
                      ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                      : 'bg-red-600/20 border-2 border-red-500/50 text-red-500'
                }`}
              >
                {!isActive ? '[ INITIALIZE_SESSION ]' : isPaused ? '[ RESUME_GRIND ]' : '[ PAUSE_THOUGHTS ]'}
              </button>
              
              {(isActive || seconds > 0) && (
                <button 
                  onClick={resetTimer}
                  title="Recalibrate Session"
                  className="px-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all flex items-center justify-center active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
            
            {isActive && (
              <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2">
                 <button 
                  onClick={() => markSegment('work')}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-system text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all italic flex items-center justify-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full system-btn transition-theme" />
                  LOG_WORK
                </button>
                 <button 
                  onClick={() => markSegment('rest')}
                  className="flex-1 py-4 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-amber-500 font-system text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/40 transition-all italic flex items-center justify-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  LOG_REST
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[25, 50, 90].map(mins => (
              <button 
                key={mins}
                disabled={isActive}
                onClick={() => { setSessionGoal(mins); setSeconds(0); setIsActive(false); setSegments([]); }}
                className={`py-3 rounded-xl text-[10px] font-system font-black uppercase border transition-all ${
                  sessionGoal === mins ? 'system-border system-bg system-text' : 'border-white/5 text-gray-600'
                } ${isActive ? 'opacity-20 cursor-not-allowed' : 'hover:border-white/20'}`}
              >
                {mins}M_GOAL
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline of segments */}
      {isActive && (
        <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] animate-in slide-in-from-top-2 transition-theme">
           <div className="flex justify-between items-center mb-6 px-1">
             <div className="flex flex-col">
               <span className="text-[10px] font-system text-gray-500 uppercase tracking-widest font-black leading-none mb-1">SESSION_LOG</span>
               <span className="text-[8px] font-system text-gray-600 uppercase font-black">TEMPORAL_MARKERS</span>
             </div>
             <div className="flex gap-4">
                <div className="text-right">
                   <span className="text-[7px] text-gray-600 uppercase font-black block">FOCUS</span>
                   <span className="text-xs font-system text-white tabular-nums font-black">{formatTime(stats.work)}</span>
                </div>
                <div className="text-right">
                   <span className="text-[7px] text-gray-600 uppercase font-black block">REST</span>
                   <span className="text-xs font-system text-amber-500 tabular-nums font-black">{formatTime(stats.rest)}</span>
                </div>
             </div>
           </div>
           
           <div className="space-y-3">
             {segments.length === 0 && (
               <div className="text-center py-10 border border-dashed border-white/10 rounded-3xl bg-black/20">
                 <p className="text-[10px] text-gray-700 font-system uppercase italic tracking-widest">Protocol initialized. No manual markers logged yet.</p>
               </div>
             )}
             {segments.map((seg, i) => (
               <div key={i} className={`flex items-center justify-between p-4 bg-black/40 border rounded-2xl group transition-all ${seg.type === 'work' ? 'border-white/5 hover:border-emerald-500/30' : 'border-amber-500/10 hover:border-amber-500/30'}`}>
                 <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-theme ${seg.type === 'work' ? 'bg-white/5 system-text' : 'bg-amber-500/10 text-amber-500'}`}>
                      {seg.type === 'work' ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                      )}
                   </div>
                   <div>
                      <span className="text-[10px] font-system text-white uppercase font-black block leading-none mb-1">
                        {seg.type === 'work' ? 'FOCUS_BURST' : 'NEURAL_RECOVERY'}
                      </span>
                      <span className="text-[8px] font-system text-gray-600 uppercase tracking-tighter">SEGMENT_COMPLETE</span>
                   </div>
                 </div>
                 <div className="text-right">
                   <span className="text-xs font-system text-white tabular-nums font-black italic">{formatTime(seg.durationSeconds)}</span>
                 </div>
               </div>
             ))}
             {/* Current active segment */}
             <div className="flex items-center justify-between p-4 bg-white/5 border-2 border-dashed system-border rounded-2xl animate-pulse transition-theme">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center system-text transition-theme">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-system system-text uppercase font-black block leading-none mb-1 transition-theme">ACTIVE_SAMPLING</span>
                    <span className="text-[8px] font-system text-gray-500 uppercase tracking-tighter">CHRONO_BUFFER</span>
                  </div>
                </div>
                <span className="text-xs font-system text-white tabular-nums font-black italic">{formatTime(seconds - lastMarkSeconds)}</span>
             </div>
           </div>
        </div>
      )}

      {/* Custom Intellectual Acts */}
      {customTasks.length > 0 && (
        <div className="space-y-4 px-1">
          <h3 className="text-[10px] font-system text-gray-500 uppercase tracking-widest font-black ml-2 transition-theme">Registry Acts: Intellectual</h3>
          {customTasks.map(task => (
            <div key={task.id} className={`p-6 rounded-[2rem] border transition-all duration-500 ${task.completed ? 'bg-black/20 border-white/5 opacity-50' : 'bg-black/60 border-white/10 shadow-xl'}`}>
              <div className="flex justify-between items-start mb-4">
                 <h4 className="font-system text-md font-black text-white uppercase italic tracking-tight">{task.title}</h4>
                 <span className="text-[8px] font-system font-black px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase tracking-widest">+{task.expReward} EXP</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className="flex-1 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-blue-500" style={{ width: `${(task.current / task.target) * 100}%` }} />
                   </div>
                   <span className="font-system text-xs font-black text-white italic tabular-nums">{task.current}/{task.target} {task.unit}</span>
                </div>
                {!task.completed && (
                  <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => handleCustomAdd(task.id, task.current, task.target, 1)} className="py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-system text-[9px] font-black uppercase tracking-widest italic">+1</button>
                     <button onClick={() => handleCustomAdd(task.id, task.current, task.target, 5)} className="py-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-system text-[9px] font-black uppercase tracking-widest italic">+5</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between hover:bg-white/10 transition-all">
        <div>
          <span className="text-[10px] font-system text-gray-500 block uppercase mb-1 tracking-widest font-black transition-theme">CUMULATIVE_DEPTH</span>
          <span className="text-2xl font-system font-black text-white tracking-tight tabular-nums italic transition-theme">
            {Math.floor(currentMinutes / 60)}H <span className="text-gray-500">{currentMinutes % 60}M</span>
          </span>
        </div>
        <div className="system-text transition-theme">
           <svg className="w-8 h-8 system-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" /></svg>
        </div>
      </div>
    </div>
  );
};

export default StudyPanel;
