
import React, { useState, useEffect } from 'react';
import { CustomTask } from '../types';

interface CustomQuestsProps {
  tasks: CustomTask[];
  onOpenAddModal: () => void;
  onUpdateTask: (id: string, current: number) => void;
  onRemoveTask: (id: string) => void;
}

const CustomQuests: React.FC<CustomQuestsProps> = ({ tasks, onOpenAddModal, onUpdateTask, onRemoveTask }) => {
  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="font-system text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">Registry of Acts</h2>
          <p className="text-[9px] font-system text-emerald-400 tracking-widest uppercase">Self-Defined Stewardship</p>
        </div>
        <button 
          onClick={onOpenAddModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-system font-bold text-[10px] uppercase px-4 py-2 rounded-lg transition-all"
        >
          [ ADD NEW ACT ]
        </button>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="p-16 text-center text-gray-600 border border-white/5 rounded-3xl italic text-sm bg-black/20">
            Registry is currently empty. Define a new personal act to track your growth.
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`p-5 rounded-2xl border transition-all ${task.completed ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60' : 'bg-black/40 border-white/10 shadow-xl'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[7px] font-system font-black px-1.5 py-0.5 rounded-full inline-block w-fit uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                    {task.category} • {task.trackingType}
                  </span>
                  <h3 className="font-system text-base font-bold text-white uppercase leading-tight tracking-tight">{task.title}</h3>
                </div>
                <button 
                  onClick={() => onRemoveTask(task.id)}
                  className="text-gray-600 hover:text-red-500 transition-colors p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>

              <div className="space-y-4">
                 {task.trackingType === 'checkbox' ? (
                   <button 
                     onClick={() => onUpdateTask(task.id, task.completed ? 0 : 1)}
                     className={`w-full py-3 rounded-xl font-system text-[10px] font-black uppercase tracking-widest transition-all ${task.completed ? 'bg-emerald-600 text-white' : 'bg-white/5 border border-white/10 text-gray-400'}`}
                   >
                     {task.completed ? '[ FULFILLED ]' : '[ MARK COMPLETE ]'}
                   </button>
                 ) : (
                   <div className="flex items-center gap-4">
                     <input 
                       type="range" min="0" max={task.target} value={task.current}
                       disabled={task.completed}
                       onChange={e => onUpdateTask(task.id, parseInt(e.target.value))}
                       className="flex-1 accent-emerald-500 h-1"
                     />
                     <span className="font-system text-[11px] font-black text-white w-20 text-right tabular-nums">
                       {task.current} / {task.target} {task.unit}
                     </span>
                   </div>
                 )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomQuests;
