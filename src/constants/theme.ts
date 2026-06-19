export const COLORS = {
  primary: '#6366f1',      // Indigo 500
  primaryDark: '#4f46e5',  // Indigo 600
  primaryLight: '#c7d2fe', // Indigo 200
  
  // Light Mode Colors
  light: {
    background: '#f8fafc', // Slate 50
    card: '#ffffff',
    text: '#0f172a',       // Slate 900
    textMuted: '#64748b',  // Slate 500
    border: '#e2e8f0',     // Slate 200
  },

  // Dark Mode Colors
  dark: {
    background: '#0f172a', // Slate 900
    card: '#1e293b',       // Slate 800
    text: '#f8fafc',       // Slate 50
    textMuted: '#94a3b8',  // Slate 400
    border: '#334155',     // Slate 700
  },

  success: '#10b981',      // Emerald 500
  warning: '#f59e0b',      // Amber 500
  error: '#ef4444',        // Red 500
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
