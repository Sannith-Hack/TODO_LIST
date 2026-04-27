import { Alert } from 'react-native';
import { Task, UserStats, SkillType } from './types';
import { calculateLevelUp, getTitleByLevel } from '../storage/taskStorage';
import { triggerHaptic, playSound, FEEDBACK_SOUNDS } from './feedback';
import { announce, SYSTEM_VOICE } from './sovereign';

export interface EngineResult {
  newStats: UserStats;
  levelUpOccurred: boolean;
}

const DUNGEON_DATA = [
  { id: 'd1', floors: 5, name: 'THE TRIALS' },
  { id: 'd2', floors: 10, name: 'RE-AWAKENING GATE' },
  { id: 'd3', floors: 20, name: 'SHADOW DUNGEON' },
  { id: 'd4', floors: 1, name: 'JEJU ISLAND' }
];

export const processQuestCompletion = (
  task: Task, 
  stats: UserStats
): EngineResult => {
  const newStats = { ...stats };
  const skill = task.skillType;
  let levelUpOccurred = false;

  // 1. Calculate Multipliers
  let multiplier = 1 + Math.min(newStats.streakCount * 0.1, 1.0);
  if (newStats.shadowAssignments?.[skill]) {
    multiplier += 0.2;
  }

  // 2. XP Gain
  const baseXP = task.xpValue || 10;
  const xpGain = Math.floor(baseXP * multiplier);
  const { updatedSkill, levelUpCount } = calculateLevelUp(newStats.skills[skill], xpGain);
  
  newStats.skills[skill] = updatedSkill;
  newStats.totalXp += xpGain;

  // 3. Dungeon Progression
  if (newStats.dungeonProgress?.activeDungeonId) {
    const dp = { ...newStats.dungeonProgress };
    dp.floorCompletionCount += 1;
    
    if (dp.floorCompletionCount >= 3) {
      dp.currentFloor += 1;
      dp.floorCompletionCount = 0;
      
      const dungeon = DUNGEON_DATA.find(d => d.id === dp.activeDungeonId);

      if (dungeon && dp.currentFloor > dungeon.floors) {
        dp.clearedDungeons = [...(dp.clearedDungeons || []), dp.activeDungeonId!];
        dp.activeDungeonId = undefined;
        Alert.alert('DUNGEON CLEARED', `You have conquered ${dungeon.name}! Massive XP gained.`);
        newStats.totalXp += 500;
        announce(`Dungeon cleared. You have conquered ${dungeon.name}.`, newStats);
      } else {
        announce(`Floor cleared. Descending to floor ${dp.currentFloor}.`, newStats);
        triggerHaptic('impactHeavy');
      }
    }
    newStats.dungeonProgress = dp;
  }

  // 4. Global Level Up Handling
  if (levelUpCount > 0) {
    levelUpOccurred = true;
    newStats.totalLevel += levelUpCount;
    newStats.statPoints += levelUpCount * 3;
    newStats.reputationTitle = getTitleByLevel(newStats.totalLevel);
    
    announce(SYSTEM_VOICE.LEVEL_UP(newStats.totalLevel), newStats);
    playSound(FEEDBACK_SOUNDS.LEVEL_UP);
    triggerHaptic('impactHeavy');
  }

  return { newStats, levelUpOccurred };
};
