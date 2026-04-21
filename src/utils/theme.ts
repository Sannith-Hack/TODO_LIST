export const COLORS = {
  background: '#050505',
  surface: '#121212',
  primary: '#00D1FF', // Electric Blue (Default E-Rank)
  secondary: '#1A1A1A',
  text: '#FFFFFF',
  textDim: '#A0A0A0',
  accent: '#7000FF', // Purple accent
  success: '#00FF94',
  danger: '#FF2E2E',
  border: '#1E1E1E',
  white: '#FFFFFF',
};

export const LIGHT_COLORS = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  primary: '#007AFF',
  secondary: '#E5E5EA',
  text: '#1C1C1E',
  textDim: '#8E8E93',
  accent: '#5856D6',
  success: '#34C759',
  danger: '#FF3B30',
  border: '#C7C7CC',
  white: '#FFFFFF',
};

export const getColors = (theme: 'dark' | 'light' = 'dark') => {
  return theme === 'light' ? LIGHT_COLORS : COLORS;
};

export const RANK_THEMES = {
  'E': { primary: '#00D1FF', accent: '#7000FF', glow: '#00D1FF' }, // Blue
  'D': { primary: '#00FF94', accent: '#00D1FF', glow: '#00FF94' }, // Green
  'C': { primary: '#7000FF', accent: '#FF00FF', glow: '#7000FF' }, // Purple
  'B': { primary: '#FF2E2E', accent: '#FF7A00', glow: '#FF2E2E' }, // Red
  'A': { primary: '#FF7A00', accent: '#FFD700', glow: '#FF7A00' }, // Orange
  'S': { primary: '#FFD700', accent: '#FFFFFF', glow: '#FFD700' }, // Gold
};

export const getRankTheme = (rank: string = 'E') => {
  return RANK_THEMES[rank as keyof typeof RANK_THEMES] || RANK_THEMES['E'];
};

export const SKILL_COLORS = {
  Coding: '#00D1FF',
  Workout: '#FF2E2E',
  Cultural: '#00FF94',
  Sports: '#FFD700',
  Mental: '#7000FF',
};

export const CATEGORY_COLORS = {
  Regular: '#00D1FF',
  OneTime: '#7000FF',
  LongTerm: '#FFD700',
};

export const SHADOWS = {
  glow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  glowCustom: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  }),
};

export const FONTS = {
  bold: 'System',
  medium: 'System',
  regular: 'System',
};
