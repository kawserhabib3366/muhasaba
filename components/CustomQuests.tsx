
import React, { useState, useEffect, useRef } from 'react';
import { CustomTask } from '../types';

interface CustomQuestsProps {
  tasks: CustomTask[];
  onOpenAddModal: () => void;
  onUpdateTask: (id: string, current: number) => void;
  onRemoveTask: (id: string) => void;
}

const CustomQuests: React.FC<CustomQuestsProps> = ({ tasks, onOpenAddModal, onUpdateTask, onRemoveTask }) => {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const prevTasksRef = useRef<CustomTask[]>([]);

  useEffect(() => {
    // Check for newly completed tasks to trigger animation
    tasks.forEach(task => {
      const prevTask = prevTasksRef.current.find(t => t.id === task.id);
      if (task.completed && (!prevTask || !prevTask.completed)) {
        setCompletedIds(prev => new Set(prev).add(task.id));
        setTimeout(() => {
          setCompletedIds(prev => {
            const next = new Set(prev);
            next.delete(task.id);
            return next;
          });
        }, 1000);
      }
    });
    prevTasksRef.current = tasks;
  }, [tasks]);

  const handleCustomAdd = (taskId: string, currentVal: number, target: number) => {
    const inputVal = parseInt(customInputs[taskId] || '0');
    if (isNaN(inputVal) || inputVal <= 0) return;
    onUpdateTask(taskId, Math.min(target, currentVal + inputVal));
    setCustomInputs(prev => ({ ...prev, [taskId]: '' }));
  };

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in duration-500 pb-12 transition-theme">
      <div className="flex justify-between items-center px-2 sticky top-0 z-20 bg-black/60 backdrop-blur-xl py-6 rounded-3xl border border-white/5 shadow-xl transition-theme">
        <div>
          <h2 className="font-system text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1 transition-theme">Acts Registry</h2>
          <p className="text-[9px] font-system system-text tracking-[0.4em] uppercase font-black transition-theme">Self-Defined Quests</p>
        </div>
        <button 
          onClick={onOpenAddModal}
          className="system-btn hover:scale-105 text-black font-system font-black text-[10px] uppercase px-6 py-3 rounded-2xl transition-all active:scale-95 shadow-xl italic"
        >
          [ ADD_ACT ]
        </button>
      </div>

      <div className="space-y-6">
        {tasks.length === 0 ? (
          <div className="p-20 text-center text-gray-700 border-2 border-dashed border-white/5 rounded-[3rem] italic text-sm bg-black/20">
            Registry offline. <br/>Define a quest to begin tracking growth.
          </div>
        ) : (
          tasks.map(task => {
            const isJustCompleted = completedIds.has(task.id);
            
            // Refined Category Meta with Distinct Gradients and Shadows
            const categoryMeta = {
              Physical: {
                label: 'bg-gradient-to-r from-red-600/40 via-red-900/40 to-black/20 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]',
                bar: 'bg-gradient-to-r from-red-500 to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]',
              },
              Spiritual: {
                label: 'bg-gradient-to-r from-emerald-600/40 via-emerald-900/40 to-black/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
                bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]',
              },
              Intellectual: {
                label: 'bg-gradient-to-r from-blue-600/40 via-blue-900/40 to-black/20 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
                bar: 'bg-gradient-to-r from-blue-500 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]',
              }
            }[task.category];

            return (
              <div 
                key={task.id} 
                className={`rpg-panel p-8 corner-accent corner-accent-tl corner-accent-br transition-all duration-500 ${
                  task.completed 
                    ? 'opacity-40 grayscale blur-[0.5px]' 
                    : 'shadow-2xl hover:border-white/20'
                } ${isJustCompleted ? 'animate-complete' : ''} transition-theme`}
              >
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-system font-black px-5 py-1.5 rounded-xl inline-block w-fit uppercase border tracking-[0.2em] transition-theme ${categoryMeta.label}`}>
                        {task.category}
                      </span>
                      <span className="text-[9px] font-system font-black px-4 py-1.5 rounded-xl inline-block w-fit uppercase bg-white/5 text-gray-400 border border-white/5 tracking-widest italic">
                        +{task.expReward} EXP
                      </span>
                    </div>
                    <h3 className="font-system text-2xl font-black text-white uppercase leading-none tracking-tight italic transition-theme">{task.title}</h3>
                  </div>
                  <button 
                    onClick={() => onRemoveTask(task.id)}
                    className="text-gray-700 hover:text-red-500 transition-all p-3 bg-white/5 rounded-2xl active:scale-90"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                <div className="space-y-6 relative z-10">
                  {task.trackingType === 'checkbox' ? (
                    <button 
                      onClick={() => onUpdateTask(task.id, task.completed ? 0 : 1)}
                      className={`w-full py-5 rounded-2xl font-system text-[11px] font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden italic shadow-2xl ${
                        task.completed 
                          ? 'system-btn text-black' 
                          : 'bg-white/5 border border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {task.completed ? '[ OBJECTIVE_FULFILLED ]' : '[ MARK_DEED_COMPLETE ]'}
                    </button>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="flex-1 space-y-2">
                           <div className="h-2.5 w-full bg-black/60 rounded-full border border-white/10 overflow-hidden p-[2px]">
                             <div 
                               className={`h-full transition-all duration-1000 rounded-full ${categoryMeta.bar}`} 
                               style={{ width: `${(task.current / task.target) * 100}%` }}
                             />
                           </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                          <span className="font-system text-[10px] font-black text-gray-600 uppercase tracking-widest opacity-60">LOG_RATIO</span>
                          <span className="font-system text-2xl font-black text-white tabular-nums leading-none tracking-tighter italic transition-theme">
                            {task.current}<span className="text-xs text-gray-600 mx-1">/</span><span className="text-sm text-gray-400">{task.target}</span>
                          </span>
                        </div>
                      </div>
                      
                      {!task.completed && (
                        <div className="flex gap-3">
                          <div className="flex-1 relative">
                            <input 
                              type="number" 
                              placeholder={`Qty (${task.unit})`}
                              value={customInputs[task.id] || ''}
                              onChange={(e) => setCustomInputs(prev => ({ ...prev, [task.id]: e.target.value }))}
                              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4.5 px-5 text-[11px] text-white font-system font-black italic focus:border-[var(--primary)] outline-none transition-all placeholder-gray-800"
                            />
                            <button 
                              onClick={() => handleCustomAdd(task.id, task.current, task.target)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-11 px-6 system-btn text-black font-system font-black text-[10px] uppercase rounded-xl italic transition-all active:scale-95 shadow-lg"
                            >
                              LOG
                            </button>
                          </div>
                          <div className="flex gap-1.5">
                            {[1, 5, 10].map(val => (
                              <button 
                                key={val}
                                onClick={() => onUpdateTask(task.id, Math.min(task.target, task.current + val))}
                                className="w-14 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-white font-system font-black hover:bg-white/10 hover:border-white/30 transition-all italic active:scale-90"
                              >
                                +{val}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CustomQuests;
