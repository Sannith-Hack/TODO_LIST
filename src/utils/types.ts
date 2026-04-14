export type SkillType = 'Coding' | 'Workout' | 'Cultural' | 'Sports' | 'Mental';

export type TaskCategory = 'Regular' | 'Challenge' | 'LongTerm';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  category: TaskCategory;
  skillType: SkillType;
  currentCount?: number; // For pushups/squats
  targetCount?: number;  // For pushups/squats
  xpValue: number;
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
  skills: Record<SkillType, SkillProgress>;
}
