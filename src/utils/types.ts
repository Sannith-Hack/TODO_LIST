export type SkillType = 'Coding' | 'Workout' | 'Cultural' | 'Sports' | 'Mental';

export type TaskCategory = 'Regular' | 'OneTime' | 'LongTerm';

export type TaskFrequency = 'Daily' | 'Weekly' | 'Custom';

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dueDate?: number; 
  deadline?: number; 
  completedAt?: number;
  category: TaskCategory;
  skillType: SkillType;
  currentCount?: number;
  targetCount?: number;
  xpValue: number;
  isPenalty?: boolean;
  subTasks?: SubTask[];
  frequency?: TaskFrequency;
  recurringDays?: number; // For 'Custom' (every X days)
  isArchived?: boolean;
}

export interface HistoryEntry {
  id: string;
  taskId: string;
  text: string;
  category: TaskCategory;
  skillType: SkillType;
  completedAt: number;
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
  attributes: {
    strength: number;
    agility: number;
    intelligence: number;
    sense: number;
    vitality: number;
  };
  streakCount: number;
  maxStreak: number;
  shadowSoldiers: string[]; // List of earned shadow soldier names
  shadowAssignments?: Partial<Record<SkillType, string>>; // Which shadow is assigned to which skill
  achievements: string[]; // List of earned achievement IDs/Names
  lastResetDate: number;
  notificationSettings: {
    enabled: boolean;
    interval: 15 | 30 | 60 | 120;
  };
  theme: 'dark' | 'light';
}
