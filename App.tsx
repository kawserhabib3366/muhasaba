
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, Exercise, Salah, KnowledgeQuest, Reflection, CustomTask, PenaltyDebt } from './types';
import { INITIAL_PROFILE, INITIAL_EXERCISES, INITIAL_SALAH, INITIAL_KNOWLEDGE } from './constants';
import StatusWindow from './components/StatusWindow';
import Quests from './components/Quests';
import Notification from './components/Notification';
import SpiritPanel from './components/SpiritPanel';
import StudyPanel from './components/StudyPanel';
import Journal from './components/Journal';
import ManualTaskModal from './components/ManualTaskModal';
import CustomQuests from './components/CustomQuests';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('muhasabah_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('muhasabah_exercises');
    return saved ? JSON.parse(saved) : INITIAL_EXERCISES;
  });

  const [salah, setSalah] = useState<Salah[]>(() => {
    const saved = localStorage.getItem('muhasabah_salah');
    return saved ? JSON.parse(saved) : INITIAL_SALAH;
  });

  const [knowledge, setKnowledge] = useState<KnowledgeQuest[]>(() => {
    const saved = localStorage.getItem('muhasabah_knowledge');
    return saved ? JSON.parse(saved) : INITIAL_KNOWLEDGE;
  });

  const [studyMinutes, setStudyMinutes] = useState(() => {
    const saved = localStorage.getItem('muhasabah_study_minutes');
    return saved ? JSON.parse(saved) : 0;
  });

  const [activeTab, setActiveTab] = useState<'status' | 'amal' | 'spirit' | 'mind' | 'journal' | 'custom'>('status');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  // Helper to get total target including level boost and penalty debt
  const getTarget = useCallback((ex: Exercise) => {
    let levelBoost = (profile.physicalLevel - 1) * (ex.id === 'plank' ? 15 : 5);
    let debt = profile.penaltyDebt[ex.id] || 0;
    let target = ex.baseTarget + levelBoost + debt;
    
    // Recovery Privilege: If used today, halve the target
    if (profile.recoveryPrivilegeUsed) {
      target = Math.max(1, Math.floor(target / 2));
    }
    return target;
  }, [profile.physicalLevel, profile.penaltyDebt, profile.recoveryPrivilegeUsed]);

  const handleDailyReset = useCallback(() => {
    const allDone = exercises.every(e => e.completed);
    
    if (allDone) {
      setProfile(prev => ({
        ...prev,
        physicalLevel: prev.physicalLevel + 1,
        streak: prev.streak + 1,
        lastResetDate: new Date().toISOString(),
        penaltyDebt: { pushups: 0, squats: 0, situps: 0, plank: 0 }, // Clear debt on success
        recoveryPrivilegeUsed: false,
        customTasks: prev.customTasks.filter(t => !t.completed)
      }));
      setNotification({ message: "Daily Quests Fulfilled. Level Up: Physical Stewardship increased.", type: 'success' });
    } else {
      // PENALTY LOGIC: Carry over missed reps + bonus penalty
      const newDebt: PenaltyDebt = { ...profile.penaltyDebt };
      exercises.forEach(ex => {
        if (!ex.completed) {
          const target = getTarget(ex);
          const missed = target - ex.currentProgress;
          newDebt[ex.id] = missed + 15; // Penalty: missed + 15 reps
        } else {
          newDebt[ex.id] = 0; // If completed, clear debt for this exercise
        }
      });

      setProfile(prev => ({
        ...prev,
        streak: 0,
        penaltyDebt: newDebt,
        lastResetDate: new Date().toISOString(),
        recoveryPrivilegeUsed: false,
        customTasks: prev.customTasks.filter(t => !t.completed)
      }));
      setNotification({ 
        message: "Penalty Protocol: Daily quests missed. Unfinished effort carried forward with +15 rep penalty.", 
        type: 'warning' 
      });
    }
    
    setExercises(INITIAL_EXERCISES);
    setSalah(INITIAL_SALAH);
    setKnowledge(INITIAL_KNOWLEDGE);
    setStudyMinutes(0);
  }, [exercises, profile.penaltyDebt, getTarget]);

  useEffect(() => {
    const checkReset = () => {
      const now = new Date();
      const lastReset = new Date(profile.lastResetDate);
      if (now.toDateString() !== lastReset.toDateString()) {
        handleDailyReset();
      }
    };
    const interval = setInterval(checkReset, 60000);
    checkReset();
    return () => clearInterval(interval);
  }, [profile.lastResetDate, handleDailyReset]);

  useEffect(() => {
    localStorage.setItem('muhasabah_profile', JSON.stringify(profile));
    localStorage.setItem('muhasabah_exercises', JSON.stringify(exercises));
    localStorage.setItem('muhasabah_salah', JSON.stringify(salah));
    localStorage.setItem('muhasabah_knowledge', JSON.stringify(knowledge));
    localStorage.setItem('muhasabah_study_minutes', JSON.stringify(studyMinutes));
  }, [profile, exercises, salah, knowledge, studyMinutes]);

  const updateExerciseProgress = (id: string, progress: number) => {
    setExercises(prev => prev.map(e => {
      if (e.id === id) {
        const target = getTarget(e);
        const newProgress = Math.min(target, progress);
        const isNowCompleted = newProgress >= target && !e.completed;
        if (isNowCompleted) setNotification({ message: `${e.title} fulfilled for today.`, type: 'success' });
        return { ...e, currentProgress: newProgress, completed: newProgress >= target };
      }
      return e;
    }));
  };

  const useRecoveryPrivilege = () => {
    if (profile.streak >= 5 && !profile.recoveryPrivilegeUsed) {
      setProfile(prev => ({ ...prev, recoveryPrivilegeUsed: true }));
      setNotification({ message: "Recovery Privilege Active: Exercise targets halved for 24 hours.", type: 'success' });
    }
  };

  const toggleSalah = (id: string) => {
    setSalah(prev => prev.map(s => (s.id === id ? { ...s, completed: !s.completed } : s)));
  };

  const updateKnowledgeProgress = (id: string, minutes: number) => {
    setKnowledge(prev => prev.map(k => (k.id === id ? { ...k, currentMinutes: Math.min(k.targetMinutes, minutes), completed: minutes >= k.targetMinutes } : k)));
  };

  const addStudyTime = (minutes: number) => {
    setStudyMinutes(prev => prev + minutes);
  };

  const addReflection = (reflection: Omit<Reflection, 'id'>) => {
    setProfile(prev => ({
      ...prev,
      reflections: [{ ...reflection, id: Date.now().toString() }, ...prev.reflections]
    }));
  };

  const addCustomTask = (task: Omit<CustomTask, 'id' | 'completed'>) => {
    setProfile(prev => ({
      ...prev,
      customTasks: [...prev.customTasks, { ...task, id: Date.now().toString(), completed: task.current >= task.target }]
    }));
    setIsTaskModalOpen(false);
  };

  const updateCustomTask = (id: string, current: number) => {
    setProfile(prev => ({
      ...prev,
      customTasks: prev.customTasks.map(t => (t.id === id ? { ...t, current: Math.min(t.target, current), completed: current >= t.target } : t))
    }));
  };

  const removeCustomTask = (id: string) => {
    setProfile(prev => ({ ...prev, customTasks: prev.customTasks.filter(t => t.id !== id) }));
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pt-10 flex flex-col items-center">
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent"></div>

      <header className="w-full max-w-4xl px-4 mb-8 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-system font-black tracking-tighter text-emerald-500 system-glow mb-2 uppercase">
          Muhāsabah
        </h1>
        <p className="text-gray-400 font-system text-[10px] uppercase tracking-widest">
          The System Never Lies. Every day is a trust.
        </p>
      </header>

      <main className="w-full max-w-lg px-4 flex-1 flex flex-col gap-6 relative z-10">
        {activeTab === 'status' && (
          <StatusWindow 
            profile={profile} 
            salah={salah} 
            knowledge={knowledge} 
            studyMinutes={studyMinutes} 
            exercises={exercises}
            getTarget={getTarget}
            onOpenModal={() => setIsTaskModalOpen(true)}
          />
        )}
        {activeTab === 'amal' && (
          <Quests 
            exercises={exercises} 
            profile={profile}
            getTarget={getTarget}
            onUpdateProgress={updateExerciseProgress}
            onUseRecovery={useRecoveryPrivilege}
          />
        )}
        {activeTab === 'spirit' && (
          <SpiritPanel 
            salah={salah} 
            knowledge={knowledge} 
            onToggleSalah={toggleSalah} 
            onUpdateKnowledge={updateKnowledgeProgress}
          />
        )}
        {activeTab === 'mind' && (
          <StudyPanel 
            currentMinutes={studyMinutes} 
            onCompleteSession={addStudyTime} 
          />
        )}
        {activeTab === 'custom' && (
          <CustomQuests 
            tasks={profile.customTasks} 
            onOpenAddModal={() => setIsTaskModalOpen(true)}
            onUpdateTask={updateCustomTask}
            onRemoveTask={removeCustomTask}
          />
        )}
        {activeTab === 'journal' && <Journal reflections={profile.reflections} onAddReflection={addReflection} />}
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-lg bg-black/95 backdrop-blur-xl border border-emerald-500/20 rounded-2xl flex justify-around p-3 z-50 shadow-2xl">
        <NavButton active={activeTab === 'status'} onClick={() => setActiveTab('status')} icon={<StatusIcon />} label="Trust" />
        <NavButton active={activeTab === 'amal'} onClick={() => setActiveTab('amal')} icon={<AmalIcon />} label="Strength" />
        <NavButton active={activeTab === 'spirit'} onClick={() => setActiveTab('spirit')} icon={<SpiritIcon />} label="Spirit" />
        <NavButton active={activeTab === 'mind'} onClick={() => setActiveTab('mind')} icon={<MindIcon />} label="Focus" />
        <NavButton active={activeTab === 'custom'} onClick={() => setActiveTab('custom')} icon={<CustomIcon />} label="Registry" />
        <NavButton active={activeTab === 'journal'} onClick={() => setActiveTab('journal')} icon={<JournalIcon />} label="Reflection" />
      </nav>

      {isTaskModalOpen && <ManualTaskModal onClose={() => setIsTaskModalOpen(false)} onAddTask={addCustomTask} />}
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center transition-all ${active ? 'text-emerald-500 scale-105' : 'text-gray-600 hover:text-gray-400'}`}>
    <div className={`w-5 h-5 mb-1 ${active ? 'drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]' : ''}`}>{icon}</div>
    <span className="text-[9px] font-system uppercase tracking-tighter">{label}</span>
  </button>
);

const StatusIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;
const AmalIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
const SpiritIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6" /></svg>;
const MindIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" /></svg>;
const JournalIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const CustomIcon = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default App;
