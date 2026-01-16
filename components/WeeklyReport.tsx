
import React from 'react';
import { DailyRecord } from '../types';

interface WeeklyReportProps {
  history: DailyRecord[];
}

const WeeklyReport: React.FC<WeeklyReportProps> = ({ history }) => {
  const averageScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length)
    : 0;

  const getRank = (score: number) => {
    if (score >= 90) return 'S-RANK';
    if (score >= 80) return 'A-RANK';
    if (score >= 70) return 'B-RANK';
    if (score >= 60) return 'C-RANK';
    if (score >= 40) return 'D-RANK';
    return 'E-RANK';
  };

  const totalPhysical = history.reduce((acc, curr) => acc + curr.physicalCompletions, 0);
  const totalSpiritual = history.reduce((acc, curr) => acc + curr.spiritualCompletions, 0);
  const totalIntellectual = history.reduce((acc, curr) => acc + curr.intellectualCompletions, 0);

  return (
    <div className="bg-black/60 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-xl shadow-2xl transition-theme">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-system text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">WEEKLY_SUMMARY</h3>
          <p className="text-white font-system font-black uppercase text-sm italic tracking-tighter">Evolution Statistics</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-system text-gray-500 uppercase block tracking-widest font-black">SYNC_RANK</span>
          <span className="text-xl font-system font-black system-text system-glow italic">{getRank(averageScore)}</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 h-32 mb-6 items-end">
        {[...Array(7)].map((_, i) => {
          const record = history[6 - i];
          const score = record ? record.score : 0;
          return (
            <div key={i} className="flex-1 flex flex-col gap-1.5 h-full group">
              <div className="relative flex-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="absolute bottom-0 w-full system-btn transition-all duration-1000 ease-out"
                  style={{ height: `${score}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {record && (
                  <div className="absolute inset-0 flex flex-col-reverse p-1 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-full h-[3px] bg-red-400/50 rounded-full" />
                    <div className="w-full h-[3px] bg-emerald-400/50 rounded-full" />
                    <div className="w-full h-[3px] bg-blue-400/50 rounded-full" />
                  </div>
                )}
              </div>
              <span className="text-[7px] text-center font-system font-black text-gray-700 uppercase">
                D{i+1}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
          <span className="text-[7px] text-gray-600 font-black uppercase tracking-widest mb-1">PHYSICAL</span>
          <span className="text-sm font-system font-black text-red-500 italic tabular-nums">{totalPhysical}</span>
        </div>
        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
          <span className="text-[7px] text-gray-600 font-black uppercase tracking-widest mb-1">SPIRITUAL</span>
          <span className="text-sm font-system font-black text-emerald-500 italic tabular-nums">{totalSpiritual}</span>
        </div>
        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
          <span className="text-[7px] text-gray-600 font-black uppercase tracking-widest mb-1">INTELLECT</span>
          <span className="text-sm font-system font-black text-blue-500 italic tabular-nums">{totalIntellectual}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/5">
        <div className="flex justify-between items-center px-1">
          <span className="text-[9px] font-system text-gray-500 uppercase font-black tracking-widest">CONSISTENCY_QUOTIENT</span>
          <span className="text-xs font-system font-black system-text italic tabular-nums">{averageScore}%</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
