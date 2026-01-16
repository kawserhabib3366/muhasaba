
import React, { useState, useEffect } from 'react';
import { CustomTask, TaskTrackingType } from '../types';

interface ManualTaskModalProps {
  onClose: () => void;
  onAddTask: (task: Omit<CustomTask, 'id' | 'completed'>) => void;
}

const ManualTaskModal: React.FC<ManualTaskModalProps> = ({ onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Physical' | 'Spiritual' | 'Intellectual'>('Physical');
  const [trackingType, setTrackingType] = useState<TaskTrackingType>('reps');
  const [target, setTarget] = useState(10);
  const [current, setCurrent] = useState(0);
  const [unit, setUnit] = useState('reps');
  const [expReward, setExpReward] = useState(5);

  useEffect(() => {
    if (trackingType === 'checkbox') {
      setTarget(1);
      setUnit('complete');
    } else if (trackingType === 'minutes' || trackingType === 'timer') {
      setUnit('min');
    } else {
      setUnit('reps');
    }
  }, [trackingType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title,
      category,
      trackingType,
      target,
      current: trackingType === 'checkbox' ? 0 : current,
      unit,
      expReward
    });
  };

  const categories: { id: typeof category; icon: React.ReactNode; label: string }[] = [
    { 
      id: 'Physical', 
      label: 'Physical', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> 
    },
    { 
      id: 'Spiritual', 
      label: 'Spiritual', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6" /></svg> 
    },
    { 
      id: 'Intellectual', 
      label: 'Intellectual', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" /></svg> 
    },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-black border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in slide-in-from-bottom-4 transition-theme">
        <div className="absolute top-0 left-0 w-full h-1 system-bg" />
        
        <div className="flex justify-between items-start mb-8">
           <div>
             <h2 className="font-system text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Register_Act</h2>
             <p className="text-[10px] font-system system-text tracking-[0.2em] uppercase mt-2 font-black">Registry Entry Protocol</p>
           </div>
           <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="space-y-2">
            <label className="text-[10px] font-system text-gray-500 uppercase tracking-widest block ml-1 font-black">Title of Deed</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Morning Adhkar"
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-[var(--primary)] outline-none transition-all placeholder-gray-700 italic font-medium"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-system text-gray-500 uppercase tracking-widest block ml-1 font-black">Stewardship Category</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300 ${
                    category === cat.id 
                      ? 'system-border system-bg scale-105 shadow-xl' 
                      : 'border-white/5 opacity-40 grayscale hover:opacity-100'
                  }`}
                >
                  <div className={`${category === cat.id ? 'system-text' : 'text-gray-400'}`}>
                    {cat.icon}
                  </div>
                  <span className="text-[8px] font-system font-black uppercase tracking-tighter text-white">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-system text-gray-500 uppercase tracking-widest block ml-1 font-black">Tracking Mode</label>
                <select 
                  value={trackingType}
                  onChange={e => setTrackingType(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] text-white font-system font-black uppercase focus:border-[var(--primary)] outline-none appearance-none cursor-pointer"
                >
                  <option value="reps">Repetitions</option>
                  <option value="minutes">Minutes</option>
                  <option value="timer">Timer</option>
                  <option value="checkbox">Checkbox</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-system text-gray-500 uppercase tracking-widest block ml-1 font-black">EXP Reward</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={expReward}
                    onChange={e => setExpReward(parseInt(e.target.value) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[11px] text-emerald-400 font-system font-black focus:border-[var(--primary)] outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-system font-black text-gray-500 uppercase">EXP</span>
                </div>
             </div>
          </div>

          {trackingType !== 'checkbox' && (
            <div className="space-y-3">
              <label className="text-[10px] font-system text-gray-500 uppercase tracking-widest block ml-1 font-black">Target Workload ({unit})</label>
              <div className="flex items-center gap-4">
                <button 
                  type="button" onClick={() => setTarget(Math.max(1, target - 5))}
                  className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/5"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={target}
                  onChange={e => setTarget(parseInt(e.target.value) || 1)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-center font-system font-black text-white"
                />
                <button 
                  type="button" onClick={() => setTarget(target + 5)}
                  className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/5"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 border border-white/10 rounded-2xl text-gray-500 font-system text-[11px] font-black uppercase tracking-widest hover:bg-white/5 transition-all italic"
            >
              DISCARD
            </button>
            <button 
              type="submit" 
              className="flex-2 py-4 system-btn text-black font-system text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-2xl italic"
            >
              [ REGISTER_ACT ]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualTaskModal;
