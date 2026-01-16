
import React, { useState } from 'react';
import { Reflection } from '../types';

interface JournalProps {
  reflections: Reflection[];
  onAddReflection: (reflection: Omit<Reflection, 'id'>) => void;
}

const Journal: React.FC<JournalProps> = ({ reflections, onAddReflection }) => {
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('Daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    onAddReflection({
      date: new Date().toISOString(),
      note,
      category
    });
    setNote('');
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      <div className="bg-black/60 border border-emerald-500/20 p-6 rounded-2xl backdrop-blur-xl shadow-2xl">
        <h2 className="font-system text-xl font-black text-white uppercase italic mb-4">Muhāsabah Log</h2>
        <p className="text-[10px] font-system text-gray-400 tracking-widest uppercase mb-6 leading-relaxed">
          Record your intentions, your failures, and your resolves. Sincerity is the only metric that matters.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            {['Daily', 'Spirit', 'Mind', 'Physical'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`flex-1 py-2 rounded-lg text-[9px] font-system font-bold uppercase border transition-all ${
                  category === cat ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'border-white/10 text-gray-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Review your actions with honesty. Where did you find sincerity today? Where did you falter?"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none min-h-[120px] transition-all"
          />

          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 text-white font-system font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/40"
          >
            [ Seal Record ]
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-system text-[9px] font-bold text-gray-600 uppercase tracking-widest px-2">Stewardship Archives</h3>
        {reflections.length === 0 ? (
          <div className="p-8 text-center text-gray-700 italic text-sm border border-white/5 rounded-2xl">No archives found. Begin your first log above.</div>
        ) : (
          reflections.map(ref => (
            <div key={ref.id} className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-2 group hover:border-emerald-500/20 transition-all">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-system text-emerald-400 font-black uppercase tracking-widest">{ref.category}</span>
                <span className="text-[10px] font-system text-gray-600 tabular-nums">{new Date(ref.date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-300 italic leading-relaxed">"{ref.note}"</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal;
