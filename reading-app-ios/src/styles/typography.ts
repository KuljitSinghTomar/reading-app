import { StyleSheet } from 'react-native';

export const Typography = StyleSheet.create({
  heading1: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
    fontFamily: 'System', // Change to 'Montserrat' if custom font loaded
  },
  heading2: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
  },
  heading3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  phonicsLetter: {
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 56,
  },
});
