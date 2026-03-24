import { Platform } from 'react-native';
import colors from './colors';

const baseFont = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const typography = {
  h1: {
    fontFamily: baseFont,
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
  },
  h2: {
    fontFamily: baseFont,
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  h3: {
    fontFamily: baseFont,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  h4: {
    fontFamily: baseFont,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontFamily: baseFont,
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
  },
  bodySmall: {
    fontFamily: baseFont,
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  label: {
    fontFamily: baseFont,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  caption: {
    fontFamily: baseFont,
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  buttonSmall: {
    fontFamily: baseFont,
    fontSize: 14,
    fontWeight: '700',
    color: colors.surface,
  },
};

export default typography;