export const COLORS = {
  primary: '#3F4928',      // Dark Olive Green (wireframe CTA buttons)
  primaryDark: '#2C331C',  // Deeper olive (pressed / badges)
  primaryLight: '#E1E7CE', // Soft sage tint (secondary bg, badges)
  accent: '#7FA65A',       // Fresh leaf green (success highlights)

  // Light Mode Colors
  light: {
    background: '#F4EFE4', // Warm cream
    card: '#ffffff',
    text: '#332B22',       // Warm dark brown-black
    textMuted: '#8C8473',  // Warm muted gray-brown
    border: '#E6DFD0',     // Warm light border
    disabledBg: '#E6E2D4',
    disabledText: '#ABA493',
  },

  // Dark Mode Colors
  dark: {
    background: '#23241C', // Dark olive-black
    card: '#2E3023',
    text: '#F4EFE4',
    textMuted: '#A6A08D',
    border: '#3C3D2E',
    disabledBg: '#3C3D2E',
    disabledText: '#6E6A5A',
  },

  success: '#4C7A3D',      // Muted forest success
  warning: '#C9852E',      // Warm amber
  error: '#B3463B',        // Muted brick red
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};
