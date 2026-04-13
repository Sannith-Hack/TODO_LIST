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

export const SHADOWS = {
  glow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
};

export const FONTS = {
  // We'll use system fonts for now, but focus on weight
  bold: 'System',
  medium: 'System',
  regular: 'System',
};
