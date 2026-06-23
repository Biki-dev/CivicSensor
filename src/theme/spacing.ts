/**
 * CivicSensor Spacing System
 * Base unit: 4px (tight density for data-rich screens)
 */

export const spacing = {
  px:   1,
  '0':  0,
  '1':  4,    // xs
  '2':  8,    // sm
  '3':  12,
  '4':  16,   // base
  '5':  20,
  '6':  24,   // lg
  '7':  28,
  '8':  32,   // xl
  '10': 40,
  '12': 48,
  '14': 56,
  '16': 64,
  '20': 80,
  '24': 96,

  // Named semantic aliases
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,

  // Screen padding
  screenH: 20,   // horizontal screen padding
  screenV: 24,   // vertical screen padding

  // Card internals
  cardPadH: 16,
  cardPadV: 14,

  // Input
  inputPadH: 14,
  inputPadV: 12,
} as const;

export const radius = {
  none: 0,
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  28,
  full: 999,   // pill/circle

  // Semantic
  card:   12,
  btn:    10,
  badge:  8,
  chip:   999,  // pill chips
  input:  10,
  modal:  20,
} as const;

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#0D1B3E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#0D1B3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#0D1B3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0D1B3E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  teal: {
    // Glowing teal shadow for action CTAs
    shadowColor: '#00C9B1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  amber: {
    // Warm reward glow for badges
    shadowColor: '#F5A623',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 5,
  },
} as const;

export type SpacingKey   = keyof typeof spacing;
export type RadiusKey    = keyof typeof radius;
export type ShadowKey    = keyof typeof shadows;