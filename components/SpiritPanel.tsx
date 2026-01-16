
import React from 'react';
import { Salah, KnowledgeQuest, CustomTask } from '../types';

interface SpiritPanelProps {
  salah: Salah[];
  knowledge: KnowledgeQuest[];
  onToggleSalah: (id: string) => void;
  onUpdateKnowledge: (id: string, minutes: number) => void;
  customTasks: CustomTask[];
  onUpdateCustomTask: (id: string, current: number) => void;
}

const SpiritPanel: React.FC<SpiritPanelProps> = ({ salah, knowledge, onToggleSalah, onUpdateKnowledge, customTasks, onUpdateCustomTask }) => {
  const handleCustomAdd = (taskId: string, currentVal: number, target: number, amount: number) => {
    onUpdateCustomTask(taskId, Math.min(target, currentVal + amount));
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <div className="px-1">
        <h2 className="font-system text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">Farā'id Registry</h2>
        <p className="text-[9px] font-system text-emerald-500 tracking-widest uppercase font-black">Obligatory Stewardship</p>
      </div>

      <div className="bg-black/40 border border-emerald-500/20 p-6 rounded-[2rem] backdrop-blur-md shadow-xl">
        <h3 className="text-[10px] font-system text-gray-500 uppercase tracking-[0.2em] mb-4 font-black">Daily Prayers</h3>
        <div className="grid grid-cols-1 gap-2">
          {salah.map(s => (
            <button 
              key={s.id}
              onClick={() => onToggleSalah(s.id)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                s.completed 
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]' 
                  : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/30'
              }`}
            >
              <span className="font-system font-black uppercase tracking-tight text-sm italic">{s.name}</span>
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                s.completed ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-gray-800'
              }`}>
                {s.completed && <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md shadow-xl">
        <h3 className="text-[10px] font-system text-gray-500 uppercase tracking-[0.2em] mb-4 font-black">Sacred Knowledge</h3>
        <div className="flex flex-col gap-6">
          {knowledge.map(k => (
            <div key={k.id} className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-system text-xs font-black text-white uppercase tracking-tight italic">{k.title}</span>
                </div>
                <span className="text-[10px] font-system text-gray-400 tabular-nums font-black">{k.currentMinutes} / {k.targetMinutes} MIN</span>
              </div>
              <div className="h-1.5 w-full bg-gray-950 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-500 shadow-[0_0_10px_rgba(52,211,153,0.3)]" 
                  style={{ width: `${(k.currentMinutes / k.targetMinutes) * 100}%` }}
                />
              </div>
              {!k.completed && (
                 <input 
                  type="range" min="0" max={k.targetMinutes} value={k.currentMinutes}
                  onChange={(e) => onUpdateKnowledge(k.id, parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Spiritual Acts */}
      {customTasks.length > 0 && (
        <div className="space-y-4 px-1">
          <h3 className="text-[10px] font-system text-gray-500 uppercase tracking-widest font-black ml-2">Registry Acts: Spiritual</h3>
          {customTasks.map(task => (
            <div key={task.id} className={`p-6 rounded-[2rem] border transition-all duration-500 ${task.completed ? 'bg-black/20 border-white/5 opacity-50' : 'bg-black/60 border-white/10 shadow-xl'}`}>
              <div className="flex justify-between items-start mb-4">
                 <h4 className="font-system text-md font-black text-white uppercase italic tracking-tight">{task.title}</h4>
                 <span className="text-[8px] font-system font-black px-2 py-1 rounded-lg system-bg system-text uppercase tracking-widest">+{task.expReward} EXP</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className="flex-1 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-emerald-500" style={{ width: `${(task.current / task.target) * 100}%` }} />
                   </div>
                   <span className="font-system text-xs font-black text-white italic tabular-nums">{task.current}/{task.target} {task.unit}</span>
                </div>
                {!task.completed && (
                  <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => handleCustomAdd(task.id, task.current, task.target, 1)} className="py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-system text-[9px] font-black uppercase tracking-widest italic">+1</button>
                     <button onClick={() => handleCustomAdd(task.id, task.current, task.target, 5)} className="py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-system text-[9px] font-black uppercase tracking-widest italic">+5</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-[9px] text-center text-gray-600 uppercase tracking-[0.2em] font-black">These are tracked for self-accountability. Private by default.</p>
    </div>
  );
};

export default SpiritPanel;
