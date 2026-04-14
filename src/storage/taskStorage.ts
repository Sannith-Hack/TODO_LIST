import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, UserStats, SkillType, SkillProgress } from '../utils/types';

const TASKS_KEY = '@quests_log';
const STATS_KEY = '@user_status';
const SETTINGS_KEY = '@user_settings';

const INITIAL_SKILL_PROGRESS: SkillProgress = {
  level: 1,
  xp: 0,
  requiredXp: 100,
  rank: 'E',
};

const INITIAL_STATS: UserStats = {
  totalLevel: 1,
  totalXp: 0,
  statPoints: 0,
  reputationTitle: 'E-RANK HUNTER',
  lastResetDate: Date.now(),
  skills: {
    Coding: { ...INITIAL_SKILL_PROGRESS },
    Workout: { ...INITIAL_SKILL_PROGRESS },
    Cultural: { ...INITIAL_SKILL_PROGRESS },
    Sports: { ...INITIAL_SKILL_PROGRESS },
    Mental: { ...INITIAL_SKILL_PROGRESS },
  },
};

export const saveLastUsedSettings = async (category: string, skill: string): Promise<void> => {
  try {
    const settings = JSON.stringify({ category, skill });
    await AsyncStorage.setItem(SETTINGS_KEY, settings);
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

export const loadLastUsedSettings = async (): Promise<{ category: string, skill: string } | null> => {
  try {
    const settings = await AsyncStorage.getItem(SETTINGS_KEY);
    return settings != null ? JSON.parse(settings) : null;
  } catch (e) {
    console.error('Failed to load settings:', e);
    return null;
  }
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save quests:', e);
  }
};

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load quests:', e);
    return [];
  }
};

export const saveStats = async (stats: UserStats): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(stats);
    await AsyncStorage.setItem(STATS_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
};

export const loadStats = async (): Promise<UserStats> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STATS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : INITIAL_STATS;
  } catch (e) {
    console.error('Failed to load stats:', e);
    return INITIAL_STATS;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([TASKS_KEY, STATS_KEY, SETTINGS_KEY]);
  } catch (e) {
    console.error('Failed to clear data:', e);
  }
};

export const getTitleByLevel = (totalLevel: number): string => {
  if (totalLevel >= 100) return 'SHADOW SOVEREIGN';
  if (totalLevel >= 80) return 'S-RANK MONARCH';
  if (totalLevel >= 60) return 'A-RANK HUNTER';
  if (totalLevel >= 40) return 'B-RANK HUNTER';
  if (totalLevel >= 25) return 'C-RANK HUNTER';
  if (totalLevel >= 10) return 'D-RANK HUNTER';
  return 'E-RANK HUNTER';
};

export const calculateLevelUp = (skill: SkillProgress, xpGain: number): { updatedSkill: SkillProgress, levelUpCount: number } => {
  let { level, xp, requiredXp, rank } = skill;
  let levelUpCount = 0;
  xp += xpGain;

  while (xp >= requiredXp) {
    xp -= requiredXp;
    level++;
    levelUpCount++;
    requiredXp = Math.floor(requiredXp * 1.5); // Increase difficulty
    
    // Rank update logic
    if (level >= 50) rank = 'S';
    else if (level >= 40) rank = 'A';
    else if (level >= 30) rank = 'B';
    else if (level >= 20) rank = 'C';
    else if (level >= 10) rank = 'D';
  }

  return { 
    updatedSkill: { level, xp, requiredXp, rank },
    levelUpCount 
  };
};
