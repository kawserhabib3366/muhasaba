
import React from 'react';
import { Salah, KnowledgeQuest } from '../types';

interface SpiritPanelProps {
  salah: Salah[];
  knowledge: KnowledgeQuest[];
  onToggleSalah: (id: string) => void;
  onUpdateKnowledge: (id: string, minutes: number) => void;
}

const SpiritPanel: React.FC<SpiritPanelProps> = ({ salah, knowledge, onToggleSalah, onUpdateKnowledge }) => {
  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <div className="px-1">
        <h2 className="font-system text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">Farā'id Registry</h2>
        <p className="text-[9px] font-system text-emerald-500 tracking-widest uppercase">Obligatory Stewardship</p>
      </div>

      <div className="bg-black/40 border border-emerald-500/20 p-6 rounded-2xl backdrop-blur-md">
        <h3 className="text-[10px] font-system text-gray-500 uppercase tracking-[0.2em] mb-4">Daily Prayers</h3>
        <div className="grid grid-cols-1 gap-2">
          {salah.map(s => (
            <button 
              key={s.id}
              onClick={() => onToggleSalah(s.id)}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                s.completed 
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500' 
                  : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/30'
              }`}
            >
              <span className="font-system font-bold uppercase tracking-tight text-sm">{s.name}</span>
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                s.completed ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-gray-700'
              }`}>
                {s.completed && <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
              </div>
            </button>
          ))}
        </div>
        <p className="mt-4 text-[8px] text-center text-gray-600 uppercase tracking-widest">These are tracked for self-accountability. Private by default.</p>
      </div>

      <div className="bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
        <h3 className="text-[10px] font-system text-gray-500 uppercase tracking-[0.2em] mb-4">Sacred Knowledge</h3>
        <div className="flex flex-col gap-6">
          {knowledge.map(k => (
            <div key={k.id} className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-system text-xs font-bold text-white uppercase tracking-tight">{k.title}</span>
                </div>
                <span className="text-[10px] font-system text-gray-400 tabular-nums">{k.currentMinutes} / {k.targetMinutes} MIN</span>
              </div>
              <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-500" 
                  style={{ width: `${(k.currentMinutes / k.targetMinutes) * 100}%` }}
                />
              </div>
              {!k.completed && (
                 <input 
                  type="range" min="0" max={k.targetMinutes} value={k.currentMinutes}
                  onChange={(e) => onUpdateKnowledge(k.id, parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1 opacity-40 hover:opacity-100 transition-opacity"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpiritPanel;
