import { SkillType, TaskCategory } from './types';

export interface QuestTemplate {
  id: string;
  name: string;
  category: TaskCategory;
  skillType: SkillType;
  targetCount?: number;
  xpValue: number;
}

export const QUEST_TEMPLATES: Record<SkillType, QuestTemplate[]> = {
  Coding: [
    { id: 'c1', name: 'LeetCode Easy', category: 'Regular', skillType: 'Coding', xpValue: 10 },
    { id: 'c2', name: 'LeetCode Medium', category: 'Challenge', skillType: 'Coding', xpValue: 50 },
    { id: 'c3', name: 'Project Commit', category: 'Regular', skillType: 'Coding', xpValue: 20 },
    { id: 'c4', name: 'Read Tech Documentation', category: 'Regular', skillType: 'Coding', xpValue: 15 },
    { id: 'c5', name: 'Code Review', category: 'Regular', skillType: 'Coding', xpValue: 15 },
  ],
  Workout: [
    { id: 'w1', name: 'Pushups Training', category: 'Regular', skillType: 'Workout', targetCount: 100, xpValue: 20 },
    { id: 'w2', name: 'Squats Session', category: 'Regular', skillType: 'Workout', targetCount: 50, xpValue: 15 },
    { id: 'w3', name: 'Daily Pullups', category: 'Regular', skillType: 'Workout', targetCount: 20, xpValue: 25 },
    { id: 'w4', name: 'Morning Run (5KM)', category: 'Challenge', skillType: 'Workout', targetCount: 1, xpValue: 50 },
    { id: 'w5', name: 'Plank Endurance', category: 'Regular', skillType: 'Workout', targetCount: 3, xpValue: 20 },
  ],
  Cultural: [
    { id: 'cl1', name: 'Read 20 Pages', category: 'Regular', skillType: 'Cultural', xpValue: 10 },
    { id: 'cl2', name: 'Learn 5 New Words', category: 'Regular', skillType: 'Cultural', xpValue: 10 },
    { id: 'cl3', name: 'Watch Educational Video', category: 'Regular', skillType: 'Cultural', xpValue: 15 },
    { id: 'cl4', name: 'Visit Art Gallery/Museum', category: 'LongTerm', skillType: 'Cultural', xpValue: 200 },
  ],
  Sports: [
    { id: 's1', name: 'Basketball Practice', category: 'Regular', skillType: 'Sports', xpValue: 30 },
    { id: 's2', name: 'Football Match', category: 'Challenge', skillType: 'Sports', xpValue: 60 },
    { id: 's3', name: 'Swimming (10 Laps)', category: 'Regular', skillType: 'Sports', xpValue: 40 },
    { id: 's4', name: 'Tennis Session', category: 'Regular', skillType: 'Sports', xpValue: 30 },
  ],
  Mental: [
    { id: 'm1', name: '15min Meditation', category: 'Regular', skillType: 'Mental', xpValue: 10 },
    { id: 'm2', name: 'Deep Work (1 Hour)', category: 'Regular', skillType: 'Mental', xpValue: 25 },
    { id: 'm3', name: 'Journaling', category: 'Regular', skillType: 'Mental', xpValue: 10 },
    { id: 'm4', name: 'Plan Next Day', category: 'Regular', skillType: 'Mental', xpValue: 15 },
  ],
};
