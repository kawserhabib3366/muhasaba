
import { UserProfile, Salah, KnowledgeQuest, Exercise } from './types';

export const INITIAL_PROFILE: UserProfile = {
  name: "Seeker",
  title: "Al-Muta'allim (The Learner)",
  physicalLevel: 1,
  dailyCompletionRate: 0,
  lastResetDate: new Date().toISOString(),
  streak: 0,
  penaltyDebt: {
    pushups: 0,
    squats: 0,
    situps: 0,
    plank: 0
  },
  recoveryPrivilegeUsed: false,
  reflections: [],
  customTasks: []
};

export const INITIAL_SALAH: Salah[] = [
  { id: 'fajr', name: 'Fajr', completed: false },
  { id: 'dhuhr', name: 'Dhuhr', completed: false },
  { id: 'asr', name: 'Asr', completed: false },
  { id: 'maghrib', name: 'Maghrib', completed: false },
  { id: 'isha', name: 'Isha', completed: false },
];

export const INITIAL_KNOWLEDGE: KnowledgeQuest[] = [
  { id: 'k1', title: 'Qur\'an Reading', targetMinutes: 30, currentMinutes: 0, completed: false, category: 'Quran' },
  { id: 'k2', title: 'Tafsir + Hadith', targetMinutes: 20, currentMinutes: 0, completed: false, category: 'Tafsir/Hadith' },
  { id: 'k3', title: 'Islamic Book', targetMinutes: 30, currentMinutes: 0, completed: false, category: 'Islamic Book' },
];

export const INITIAL_EXERCISES: Exercise[] = [
  { id: 'pushups', title: 'Push-ups', baseTarget: 10, unit: 'reps', completed: false, currentProgress: 0 },
  { id: 'squats', title: 'Squats', baseTarget: 10, unit: 'reps', completed: false, currentProgress: 0 },
  { id: 'situps', title: 'Sit-ups', baseTarget: 10, unit: 'reps', completed: false, currentProgress: 0 },
  { id: 'plank', title: 'Plank', baseTarget: 30, unit: 'sec', completed: false, currentProgress: 0 },
];
