import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, UserStats, SkillType, SkillProgress } from '../utils/types';

const TASKS_KEY = '@quests_log';
const STATS_KEY = '@user_status';

const INITIAL_SKILL_PROGRESS: SkillProgress = {
  level: 1,
  xp: 0,
  requiredXp: 100,
  rank: 'E',
};

const INITIAL_STATS: UserStats = {
  totalLevel: 1,
  totalXp: 0,
  skills: {
    Coding: { ...INITIAL_SKILL_PROGRESS },
    Workout: { ...INITIAL_SKILL_PROGRESS },
    Cultural: { ...INITIAL_SKILL_PROGRESS },
    Sports: { ...INITIAL_SKILL_PROGRESS },
    Mental: { ...INITIAL_SKILL_PROGRESS },
  },
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

export const calculateLevelUp = (skill: SkillProgress, xpGain: number): SkillProgress => {
  let { level, xp, requiredXp, rank } = skill;
  xp += xpGain;

  while (xp >= requiredXp) {
    xp -= requiredXp;
    level++;
    requiredXp = Math.floor(requiredXp * 1.5); // Increase difficulty
    
    // Rank update logic
    if (level >= 50) rank = 'S';
    else if (level >= 40) rank = 'A';
    else if (level >= 30) rank = 'B';
    else if (level >= 20) rank = 'C';
    else if (level >= 10) rank = 'D';
  }

  return { level, xp, requiredXp, rank };
};
