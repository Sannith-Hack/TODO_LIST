export const COLORS = {
  background: '#050505',
  surface: '#121212',
  primary: '#00D1FF', // Electric Blue
  secondary: '#1A1A1A',
  text: '#FFFFFF',
  textDim: '#A0A0A0',
  accent: '#7000FF', // Purple accent
  success: '#00FF94',
  danger: '#FF2E2E',
  border: '#1E1E1E',
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
  Challenge: '#7000FF',
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
