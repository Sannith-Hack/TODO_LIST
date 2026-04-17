export type SkillType = 'Coding' | 'Workout' | 'Cultural' | 'Sports' | 'Mental';

export type TaskCategory = 'Regular' | 'OneTime' | 'LongTerm';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dueDate?: number; // Timestamp for scheduled date (start date)
  deadline?: number; // Timestamp for when the quest expires
  completedAt?: number; // Timestamp when finished
  category: TaskCategory;
  skillType: SkillType;
  currentCount?: number;
  targetCount?: number;
  xpValue: number;
  isPenalty?: boolean;
}

export interface SkillProgress {
  level: number;
  xp: number;
  requiredXp: number;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
}

export interface UserStats {
  playerName: string;
  totalLevel: number;
  totalXp: number;
  statPoints: number;
  reputationTitle: string;
  skills: Record<SkillType, SkillProgress>;
  lastResetDate: number;
  notificationSettings: {
    enabled: boolean;
    interval: 15 | 30 | 60 | 120; // Minutes
  };
}
