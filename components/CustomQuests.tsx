
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
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 pb-12 overflow-y-auto max-h-[85vh] scroll-mask px-1">
      <div className="flex justify-between items-center px-2 sticky top-0 z-20 bg-black/60 backdrop-blur-xl py-4 rounded-3xl border border-white/5 transition-theme">
        <div>
          <h2 className="font-system text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">Registry of Acts</h2>
          <p className="text-[9px] font-system system-text tracking-widest uppercase font-black">Self-Defined Stewardship Protocol</p>
        </div>
        <button 
          onClick={onOpenAddModal}
          className="system-btn hover:scale-105 text-black font-system font-black text-[10px] uppercase px-5 py-3 rounded-2xl transition-all active:scale-95 shadow-xl italic"
        >
          [ ADD_NEW_ACT ]
        </button>
      </div>

      <div className="space-y-5 px-1">
        {tasks.length === 0 ? (
          <div className="p-20 text-center text-gray-700 border-2 border-dashed border-white/5 rounded-[3rem] italic text-sm bg-black/20">
            Registry is currently offline. <br/>Define a new act to begin tracking growth.
          </div>
        ) : (
          tasks.map(task => {
            const isJustCompleted = completedIds.has(task.id);
            
            // Refined Category Styling
            const categoryMeta = {
              Physical: {
                label: 'bg-gradient-to-r from-red-900/60 to-red-600/20 text-red-400 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.25)]',
                bar: 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]',
              },
              Spiritual: {
                label: 'bg-gradient-to-r from-emerald-900/60 to-emerald-600/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]',
                bar: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]',
              },
              Intellectual: {
                label: 'bg-gradient-to-r from-blue-900/60 to-blue-600/20 text-blue-400 border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.25)]',
                bar: 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]',
              }
            }[task.category];

            return (
              <div 
                key={task.id} 
                className={`group p-7 rounded-[2.5rem] border-2 transition-all duration-500 ${
                  task.completed 
                    ? 'bg-black/20 border-white/5 opacity-40 grayscale' 
                    : 'bg-black/60 border-white/10 shadow-2xl hover:border-white/20'
                } ${isJustCompleted ? 'animate-complete' : ''} relative overflow-hidden transition-theme`}
              >
                <div className="absolute inset-x-0 bottom-0 h-1.5 system-bg opacity-10"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-system font-black px-4 py-1 rounded-full inline-block w-fit uppercase border tracking-[0.15em] transition-theme ${categoryMeta.label}`}>
                        {task.category}
                      </span>
                      <span className="text-[8px] font-system font-black px-4 py-1 rounded-full inline-block w-fit uppercase bg-white/5 text-white/40 border border-white/5 tracking-[0.1em]">
                        +{task.expReward} EXP
                      </span>
                    </div>
                    <h3 className="font-system text-xl font-black text-white uppercase leading-none tracking-tight italic transition-theme">{task.title}</h3>
                  </div>
                  <button 
                    onClick={() => onRemoveTask(task.id)}
                    className="text-gray-700 hover:text-red-500 transition-colors p-3 bg-white/5 rounded-2xl"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                <div className="space-y-5">
                  {task.trackingType === 'checkbox' ? (
                    <button 
                      onClick={() => onUpdateTask(task.id, task.completed ? 0 : 1)}
                      className={`w-full py-5 rounded-[1.5rem] font-system text-[11px] font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden italic shadow-lg ${
                        task.completed 
                          ? 'system-btn text-black' 
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      {task.completed ? '[ FULFILLED ]' : '[ MARK_COMPLETE ]'}
                    </button>
                  ) : (
                    <div className="space-y-5">
                      <div className="flex items-center gap-5">
                        <div className="flex-1 space-y-2">
                           <div className="h-2 w-full bg-black/60 rounded-full border border-white/5 overflow-hidden">
                             <div 
                               className={`h-full transition-all duration-700 ease-out ${categoryMeta.bar}`} 
                               style={{ width: `${(task.current / task.target) * 100}%` }}
                             />
                           </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                          <span className="font-system text-[9px] font-black text-gray-600 uppercase tracking-tighter">SYST_LOG</span>
                          <span className="font-system text-xl font-black text-white tabular-nums leading-none tracking-tighter italic transition-theme">
                            {task.current}<span className="text-xs text-gray-600 mx-1">/</span><span className="text-sm text-gray-400">{task.target}</span>
                          </span>
                        </div>
                      </div>
                      
                      {!task.completed && (
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <input 
                              type="number" 
                              placeholder={`Qty (${task.unit})`}
                              value={customInputs[task.id] || ''}
                              onChange={(e) => setCustomInputs(prev => ({ ...prev, [task.id]: e.target.value }))}
                              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-4 text-[11px] text-white font-system font-black italic focus:border-[var(--primary)] outline-none transition-all placeholder-gray-700"
                            />
                            <button 
                              onClick={() => handleCustomAdd(task.id, task.current, task.target)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 system-btn text-black font-system font-black text-[9px] uppercase rounded-xl italic transition-all active:scale-95"
                            >
                              LOG
                            </button>
                          </div>
                          <div className="flex gap-1">
                            {[1, 5, 10].map(val => (
                              <button 
                                key={val}
                                onClick={() => onUpdateTask(task.id, Math.min(task.target, task.current + val))}
                                className="w-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-white font-system font-black hover:bg-white/10 transition-all italic"
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
