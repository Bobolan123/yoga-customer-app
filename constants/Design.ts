import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Colors = {
  primary: '#667eea',
  primaryDark: '#5a6fd8',
  secondary: '#764ba2',
  accent: '#f093fb',
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f8f9fa',
    100: '#e9ecef',
    200: '#dee2e6',
    300: '#ced4da',
    400: '#adb5bd',
    500: '#6c757d',
    600: '#495057',
    700: '#343a40',
    800: '#212529',
    900: '#121212',
  },
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  cardBackground: 'rgba(255, 255, 255, 0.95)',
  inputBackground: '#f8f9fa',
};

export const Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const BorderRadius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
};

export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
};

export const Gradients = {
  primary: [Colors.primary, Colors.secondary] as const,
  accent: [Colors.primary, Colors.secondary, Colors.accent] as const,
  button: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'] as const,
  overlay: ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)'] as const,
};

export const Animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};