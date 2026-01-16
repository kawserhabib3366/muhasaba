
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
      expReward: 0
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-black border border-emerald-500/30 p-8 rounded-2xl shadow-2xl relative overflow-hidden animate-in zoom-in slide-in-from-bottom-4">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        
        <div className="flex justify-between items-start mb-6">
           <div>
             <h2 className="font-system text-xl font-black text-white uppercase italic tracking-tighter leading-none">Register Act</h2>
             <p className="text-[9px] font-system text-emerald-400 tracking-widest uppercase mt-1">Registry Entry Protocol</p>
           </div>
           <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[9px] font-system text-gray-500 uppercase tracking-widest block ml-1">Title of Deed</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Morning Adhkar"
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-emerald-500 outline-none transition-all placeholder-gray-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="text-[9px] font-system text-gray-500 uppercase tracking-widest block ml-1">Category</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:border-emerald-500 outline-none appearance-none"
                >
                  <option value="Physical">Physical</option>
                  <option value="Spiritual">Spiritual</option>
                  <option value="Intellectual">Intellectual</option>
                </select>
             </div>
             <div className="space-y-1.5">
                <label className="text-[9px] font-system text-gray-500 uppercase tracking-widest block ml-1">Tracking</label>
                <select 
                  value={trackingType}
                  onChange={e => setTrackingType(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:border-emerald-500 outline-none appearance-none"
                >
                  <option value="reps">Repetitions</option>
                  <option value="minutes">Minutes</option>
                  <option value="timer">Timer</option>
                  <option value="checkbox">Checkbox</option>
                </select>
             </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3.5 border border-white/10 rounded-xl text-gray-500 font-system text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-2 py-3.5 bg-emerald-600 text-white font-system text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/10"
            >
              Add to Registry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualTaskModal;
