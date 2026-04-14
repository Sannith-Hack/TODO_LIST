export type SkillType = 'Coding' | 'Workout' | 'Cultural' | 'Sports' | 'Mental';

export type TaskCategory = 'Regular' | 'Challenge' | 'LongTerm';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  category: TaskCategory;
  skillType: SkillType;
  currentCount?: number;
  targetCount?: number;
  xpValue: number;
  isPenalty?: boolean; // New property
}

export interface SkillProgress {
  level: number;
  xp: number;
  requiredXp: number;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
}

export interface UserStats {
  totalLevel: number;
  totalXp: number;
  statPoints: number;
  reputationTitle: string;
  skills: Record<SkillType, SkillProgress>;
  lastResetDate: number; // Timestamp of last daily reset check
}
