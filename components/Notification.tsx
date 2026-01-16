
import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'warning';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const getColors = () => {
    switch(type) {
      case 'success': return 'bg-black border-[var(--primary)] text-white';
      case 'warning': return 'bg-black border-red-500 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className={`w-full max-w-sm p-10 rounded-[2.5rem] border shadow-2xl animate-in zoom-in slide-in-from-top-10 duration-500 ${getColors()} relative overflow-hidden`}>
        <div className="absolute top-0 left-0 w-full h-1 system-bg"></div>
        <div className="flex flex-col items-center text-center gap-8 relative z-10">
          <div className={`w-20 h-20 rounded-3xl ${type === 'success' ? 'system-bg' : 'bg-red-500/10'} border-2 ${type === 'success' ? 'system-border' : 'border-red-500/50'} flex items-center justify-center`}>
             <svg className={`w-10 h-10 ${type === 'success' ? 'system-text' : 'text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-system font-black uppercase tracking-tighter system-text italic">SYSTEM_ALERT</h3>
            <p className="font-system text-md italic leading-tight text-gray-300 font-medium">{message}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-full py-5 system-btn text-black font-system font-black uppercase tracking-[0.3em] rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl"
          >
            ACKNOWLEDGE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
