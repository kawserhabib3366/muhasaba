
export interface Stats {
  physical: number;
  intellectual: number;
  spiritual: number;
}

export interface Salah {
  id: string;
  name: string;
  completed: boolean;
}

export interface KnowledgeQuest {
  id: string;
  title: string;
  targetMinutes: number;
  currentMinutes: number;
  completed: boolean;
  category: 'Quran' | 'Tafsir/Hadith' | 'Islamic Book';
}

export interface Reflection {
  id: string;
  date: string;
  note: string;
  category: string;
}

export type TaskTrackingType = 'reps' | 'minutes' | 'timer' | 'checkbox';

export interface CustomTask {
  id: string;
  title: string;
  category: 'Physical' | 'Spiritual' | 'Intellectual';
  trackingType: TaskTrackingType;
  target: number;
  current: number;
  completed: boolean;
  unit: string;
}

export interface PenaltyDebt {
  pushups: number;
  squats: number;
  situps: number;
  plank: number;
}

export interface UserProfile {
  name: string;
  title: string;
  physicalLevel: number;
  dailyCompletionRate: number;
  lastResetDate: string;
  streak: number;
  penaltyDebt: PenaltyDebt;
  recoveryPrivilegeUsed: boolean;
  reflections: Reflection[];
  customTasks: CustomTask[];
}

export interface Exercise {
  id: 'pushups' | 'squats' | 'situps' | 'plank';
  title: string;
  baseTarget: number;
  unit: string;
  completed: boolean;
  currentProgress: number;
}
