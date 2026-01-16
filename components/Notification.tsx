
import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'warning';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const getColors = () => {
    switch(type) {
      case 'success': return 'bg-emerald-900 border-emerald-500 text-white';
      case 'warning': return 'bg-red-900 border-red-500 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`w-full max-w-sm p-8 rounded-2xl border-2 shadow-2xl animate-in zoom-in slide-in-from-top-4 duration-500 ${getColors()}`}>
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
             <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-system font-black uppercase tracking-tight">Muhāsabah Alert</h3>
            <p className="font-system text-md italic leading-tight">{message}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-full py-3 bg-white text-black font-system font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
