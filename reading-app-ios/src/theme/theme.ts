/**
 * Wonder Island design system.
 * Tokens mirror the Stitch PRD: chunky, rounded, tactile.
 */

export const Palette = {
  primary: '#FF4B4B',
  primaryShadow: '#D32F2F',
  primaryDark: '#C53030',

  green: '#48BB78',
  greenShadow: '#2F855A',

  yellow: '#FFC837',
  yellowShadow: '#D69E2E',

  blue: '#4AA9FF',
  blueShadow: '#2B7FD0',

  sky: '#E0F4FF',
  skyDeep: '#BEE3F8',

  surface: '#FFFFFF',
  surfaceShadow: '#CBD5E0',
  sand: '#FFF9F2',
  cream: '#FDFAF7',

  text: '#2D3748',
  textSoft: '#5A6B82',
  muted: '#A0AEC0',
  mutedShadow: '#718096',

  ink: '#221610',

  // Letter-block accent colors used across activities
  pink: '#FF8BCB',
  purple: '#9B6BD8',
  coral: '#FF7A5C',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export const Fonts = {
  display: 'FredokaOne_400Regular',
  bodyBold: 'Quicksand_700Bold',
  body: 'Quicksand_600SemiBold',
  bodyMedium: 'Quicksand_500Medium',
} as const;

export const Radius = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  pill: 999,
} as const;

export const Spacing = {
  xs: 6,
  sm: 12,
  md: 20,
  lg: 32,
  xl: 48,
} as const;

/** Vertical offset of the hard "squish" drop shadow. */
export const SQUISH_DEPTH = 8;

/** Soft ambient shadow for floating cards. */
export const softShadow = {
  shadowColor: '#1A2B4A',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.18,
  shadowRadius: 24,
  elevation: 10,
};

export const cardShadow = {
  shadowColor: '#1A2B4A',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 14,
  elevation: 6,
};

export const Type = {
  hero: { fontFamily: Fonts.display, fontSize: 46, color: Palette.text },
  title: { fontFamily: Fonts.display, fontSize: 32, color: Palette.text },
  heading: { fontFamily: Fonts.display, fontSize: 24, color: Palette.text },
  button: { fontFamily: Fonts.display, fontSize: 22, color: Palette.white },
  body: { fontFamily: Fonts.body, fontSize: 18, color: Palette.text },
  bodyLarge: { fontFamily: Fonts.bodyBold, fontSize: 22, color: Palette.text },
  label: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.5,
    color: Palette.muted,
  },
} as const;

export const Theme = {
  Palette,
  Fonts,
  Radius,
  Spacing,
  Type,
  softShadow,
  cardShadow,
};

export default Theme;
