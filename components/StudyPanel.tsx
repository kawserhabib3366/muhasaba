
import React, { useState, useEffect } from 'react';

interface StudyPanelProps {
  currentMinutes: number;
  onCompleteSession: (minutes: number) => void;
}

const StudyPanel: React.FC<StudyPanelProps> = ({ currentMinutes, onCompleteSession }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionGoal, setSessionGoal] = useState(25);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds < sessionGoal * 60) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (seconds >= sessionGoal * 60) {
      setIsActive(false);
      onCompleteSession(sessionGoal);
      setSeconds(0);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, sessionGoal, onCompleteSession]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (seconds / (sessionGoal * 60)) * 100;

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <div className="px-1">
        <h2 className="font-system text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">Intellectual Grind</h2>
        <p className="text-[9px] font-system text-gray-400 tracking-widest uppercase">Mental Stewardship</p>
      </div>

      <div className="bg-black/60 border border-white/10 p-8 rounded-3xl backdrop-blur-xl text-center relative overflow-hidden shadow-2xl">
        <div 
          className="absolute inset-x-0 bottom-0 bg-emerald-500/5 transition-all duration-1000"
          style={{ height: `${progress}%` }}
        />

        <div className="relative z-10">
          <div className="text-gray-500 font-system text-[9px] uppercase tracking-widest mb-4">Current Focus Frequency</div>
          <div className="text-7xl font-system font-black text-white mb-8 tracking-tighter tabular-nums leading-none">
            {formatTime(isActive ? (sessionGoal * 60 - seconds) : (sessionGoal * 60))}
          </div>

          <div className="flex gap-4 mb-8">
            <button 
              onClick={toggleTimer}
              className={`flex-1 py-4 rounded-xl font-system font-black uppercase tracking-[0.2em] text-[10px] transition-all ${
                isActive ? 'bg-red-600/10 border border-red-500/50 text-red-500' : 'bg-emerald-600 text-white'
              }`}
            >
              {isActive ? '[ ABORT SESSION ]' : '[ INITIALIZE ]'}
            </button>
            <button 
              onClick={resetTimer}
              className="px-6 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[25, 50, 90].map(mins => (
              <button 
                key={mins}
                onClick={() => { setSessionGoal(mins); setSeconds(0); setIsActive(false); }}
                className={`py-2 rounded-lg text-[9px] font-system font-bold uppercase border transition-all ${
                  sessionGoal === mins ? 'bg-white/10 border-white/30 text-white' : 'border-white/5 text-gray-500'
                }`}
              >
                {mins}M
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-[9px] font-system text-gray-500 block uppercase mb-1 tracking-widest">Daily Depth</span>
          <span className="text-2xl font-system font-black text-white tracking-tight tabular-nums">{Math.floor(currentMinutes / 60)}H {currentMinutes % 60}M</span>
        </div>
        <div className="text-emerald-500">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" /></svg>
        </div>
      </div>
    </div>
  );
};

export default StudyPanel;
