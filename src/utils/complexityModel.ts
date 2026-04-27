import { Task, TaskCategory, SkillType } from './types';

// Semantic Keyword Weights
const INTENSITY_WEIGHTS: Record<string, number> = {
  // --- High Intensity (S/A Rank) ---
  // Complexity & Completion
  'project': 50, 'build': 45, 'marathon': 120, 'exam': 70, 'thesis': 90, 'final': 40,
  'master': 85, 'complete': 30, 'finish': 35, 'production': 60, 'launch': 50,
  'deploy': 45, 'migration': 55, 'refactor': 50, 'architecture': 65, 'prototype': 45,
  'optimization': 50, 'performance': 40, 'advanced': 30, 'intensive': 40,
  // High Effort Activities & Elite Fitness
  'championship': 100, 'tournament': 80, 'competition': 70, 'sprint': 30,
  'heavy': 30, 'brutal': 50, 'ultimate': 60, 'extreme': 70, 'max': 40,
  'publication': 80, 'presentation': 40, 'speech': 40, 'exhibition': 50,
  'deadlift': 60, 'squat': 45, 'benchpress': 45, 'olympic': 70, 'triathlon': 150,
  'crossfit': 50, 'hiit': 40, 'powerlifting': 60, 'weightlifting': 50, 'burpees': 45,
  'muscleups': 65, 'muscle-ups': 65, 'ironman': 150, 'ultramarathon': 180,
  'planche': 85, 'front-lever': 75, 'back-lever': 65, 'handstand-pushups': 60,
  'clean-and-jerk': 75, 'snatch': 75, 'weighted-pullups': 55, 'human-flag': 95,
  'power-clean': 55, 'power-snatch': 55, 'hang-clean': 50, 'zercher-squat': 55,
  'sprinting': 40, 'sparring': 45, 'mma-fight': 120, 'bjj-rolling': 55,
  'murph': 100, 'hero-wod': 70, 'spartan-race': 100, 'iron-distance': 150,
  'dragon-flag': 50, 'one-arm-pullup': 80, 'one-arm-pushup': 40,

  // --- Medium Intensity (B/C Rank) ---
  // Standard Productive Tasks
  'study': 20, 'review': 15, 'practice': 18, 'workout': 22, 'learn': 20,
  'write': 15, 'code': 20, 'debug': 20, 'fix': 15, 'improve': 15,
  'create': 20, 'draft': 15, 'sketch': 15, 'design': 20, 'prepare': 15,
  'organize': 15, 'plan': 12, 'research': 20, 'develop': 22, 'configure': 18,
  // Exercises & Specific Movements
  'training': 20, 'drill': 15, 'session': 12, 'exercise': 15, 'pullups': 25,
  'pull-ups': 25, 'pushups': 15, 'push-ups': 15, 'chinups': 22, 'chin-ups': 22,
  'dips': 18, 'plank': 15, 'lunges': 15, 'situps': 12, 'sit-ups': 12,
  'crunches': 12, 'cardio': 20, 'running': 25, 'swimming': 30, 'cycling': 25,
  'yoga': 20, 'pilates': 20, 'climbing': 40, 'boxing': 35, 'mma': 45,
  'bjj': 45, 'karate': 30, 'gym': 20, 'kettlebell': 25, 'dumbbell': 18,
  'barbell': 22, 'rowing': 25, 'jump': 15, 'rope': 10, 'hiking': 30,
  'bench': 20, 'press': 18, 'overhead': 25, 'bicep': 12, 'tricep': 12,
  'curls': 12, 'rows': 15, 'shrugs': 12, 'flies': 12, 'lateral': 15,
  'raises': 12, 'legpress': 25, 'calf': 10, 'hamstring': 15, 'glute': 15,
  'thrusts': 20, 'pistol-squat': 35, 'leg-raises': 15, 'v-ups': 18,
  'mountain-climbers': 15, 'russian-twist': 12, 'bicycle-crunches': 12,
  'handstand': 30, 'l-sit': 40, 'face-pulls': 15, 'skull-crushers': 18,
  'hammer-curls': 15, 'dead-hang': 15, 'diamond-pushups': 20, 'pike-pushups': 20,
  'arnold-press': 20, 'bulgarian': 25, 'kettlebell-swings': 22, 'goblet-squats': 20,
  'box-jumps': 25, 'wall-walks': 30, 'ring-dips': 25, 'rdl': 20, 'romanian': 20,
  'lat-pulldowns': 18, 'bent-over-rows': 20, 'preacher-curls': 15, 'leg-extensions': 15,
  'leg-curls': 15, 't-bar-rows': 20, 'cable-flies': 15, 'bench-dips': 12,
  // Sports
  'basketball': 30, 'soccer': 30, 'football': 30, 'tennis': 25, 'volleyball': 25,
  'badminton': 20, 'hockey': 35, 'baseball': 25, 'golf': 15, 'rugby': 40,
  'cricket': 20, 'skating': 25, 'surfing': 35, 'squash': 30, 'wrestling': 45,

  // --- Low Intensity (D/E Rank) ---
  // Maintenance & Minor Tasks
  'read': 5, 'check': 3, 'buy': 2, 'email': 5, 'clean': 10, 'walk': 8,
  'log': 4, 'update': 5, 'entry': 3, 'notes': 5, 'list': 3, 'sort': 5,
  'basic': 5, 'simple': 3, 'quick': 3, 'briefly': 3, 'light': 5, 'easy': 2,
  'wash': 6, 'tidying': 8, 'call': 5, 'message': 2, 'remind': 2, 'grocery': 5,
  'browse': 2, 'watch': 3, 'listen': 3, 'meditate': 10, 'stretch': 8,
  'jogging': 12, 'calisthenics': 12, 'warmup': 5, 'cooldown': 5, 'abs': 10,
  'stretching': 8, 'mobility': 10, 'foam-rolling': 5, 'walking': 8,
  'shadow-boxing': 15, 'light-cardio': 10, 'band-work': 8, 'isometric': 10,
};

interface ComplexityResult {
  difficulty: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  xpValue: number;
}

export const analyzeQuestComplexity = (
  name: string, 
  category: TaskCategory, 
  targetCount?: number
): ComplexityResult => {
  let score = 0;
  const words = name.toLowerCase().split(/\s+/);

  // 1. Semantic Analysis
  words.forEach(word => {
    if (INTENSITY_WEIGHTS[word]) {
      score += INTENSITY_WEIGHTS[word];
    }
  });

  // 2. Quantitative Scaling (Reps/Counts)
  if (targetCount) {
    if (targetCount >= 100) score += 50;
    else if (targetCount >= 50) score += 25;
    else if (targetCount >= 10) score += 10;
  }

  // 3. Category Multipliers
  if (category === 'LongTerm') score *= 2.5;
  if (category === 'OneTime') score *= 1.2;

  // 4. Word Length Bonus (More descriptive = usually more complex)
  score += words.length * 2;

  // Map Score to Ranks
  if (score >= 150) return { difficulty: 'S', xpValue: 500 };
  if (score >= 80) return { difficulty: 'A', xpValue: 250 };
  if (score >= 40) return { difficulty: 'B', xpValue: 100 };
  if (score >= 20) return { difficulty: 'C', xpValue: 50 };
  if (score >= 10) return { difficulty: 'D', xpValue: 25 };
  
  return { difficulty: 'E', xpValue: 10 };
};
