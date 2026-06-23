import { Platform, TextStyle } from 'react-native';

/**
 * CivicSensor Typography System
 *
 * Display/Heading: System bold — tight tracking → authority feel
 * Body: System regular — generous line-height → readable at a glance
 * Data/Stat: Monospaced numbers → scores, points, counters feel precise
 */

const fontFamily = {
  // React Native uses platform defaults; we override weights explicitly
  regular:   Platform.select({ ios: 'System', android: 'Roboto' }) as string,
  medium:    Platform.select({ ios: 'System', android: 'Roboto-Medium' }) as string,
  semiBold:  Platform.select({ ios: 'System', android: 'Roboto-Medium' }) as string,
  bold:      Platform.select({ ios: 'System', android: 'Roboto-Bold' }) as string,
  mono:      Platform.select({ ios: 'Courier New', android: 'monospace' }) as string,
};

const fontWeight = {
  regular:  '400' as TextStyle['fontWeight'],
  medium:   '500' as TextStyle['fontWeight'],
  semiBold: '600' as TextStyle['fontWeight'],
  bold:     '700' as TextStyle['fontWeight'],
  heavy:    '800' as TextStyle['fontWeight'],
};

// Type scale — named by semantic role
export const typography = {
  // ── Display (hero numbers, splash) ───────────────────────────
  displayXL: {
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.heavy,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -1.5,
  } satisfies TextStyle,

  displayLG: {
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -1,
  } satisfies TextStyle,

  // ── Headings ─────────────────────────────────────────────────
  h1: {
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
  } satisfies TextStyle,

  h2: {
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.3,
  } satisfies TextStyle,

  h3: {
    fontFamily: fontFamily.semiBold,
    fontWeight: fontWeight.semiBold,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: -0.2,
  } satisfies TextStyle,

  h4: {
    fontFamily: fontFamily.semiBold,
    fontWeight: fontWeight.semiBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  } satisfies TextStyle,

  // ── Body ─────────────────────────────────────────────────────
  bodyLG: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    fontSize: 17,
    lineHeight: 26,
    letterSpacing: 0.1,
  } satisfies TextStyle,

  body: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    fontSize: 15,
    lineHeight: 23,
    letterSpacing: 0.1,
  } satisfies TextStyle,

  bodySM: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.1,
  } satisfies TextStyle,

  // ── Labels & UI ───────────────────────────────────────────────
  labelLG: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.2,
  } satisfies TextStyle,

  label: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.3,
  } satisfies TextStyle,

  labelSM: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
  } satisfies TextStyle,

  // ── Captions ─────────────────────────────────────────────────
  caption: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.3,
  } satisfies TextStyle,

  // ── Gamification / Stats (mono-spaced precision) ─────────────
  stat: {
    fontFamily: fontFamily.mono,
    fontWeight: fontWeight.bold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.5,
  } satisfies TextStyle,

  statSM: {
    fontFamily: fontFamily.mono,
    fontWeight: fontWeight.bold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  } satisfies TextStyle,

  // ── Buttons ───────────────────────────────────────────────────
  btnLG: {
    fontFamily: fontFamily.semiBold,
    fontWeight: fontWeight.semiBold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.3,
  } satisfies TextStyle,

  btn: {
    fontFamily: fontFamily.semiBold,
    fontWeight: fontWeight.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.3,
  } satisfies TextStyle,

  btnSM: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.4,
  } satisfies TextStyle,
} as const;

export type TypographyKey = keyof typeof typography;