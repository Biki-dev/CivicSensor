/**
 * CivicSensor Color System
 *
 * Palette philosophy:
 *  - Navy  → authority, trust, civic weight
 *  - Teal  → action, progress, civic energy
 *  - Amber → rewards, achievements, gamification warmth
 *  - Coral → urgency, alerts, critical issues
 *  - Slate → neutral surfaces, backgrounds
 */

export const palette = {
  // ── Primary / Brand ──────────────────────────────────────────
  navyDeep:    '#0D1B3E',   // primary brand, heavy headers
  navyMid:     '#1A3160',   // cards, secondary headers
  navyLight:   '#2A4A8A',   // interactive states, focus rings

  // ── Civic Action (Teal) ───────────────────────────────────────
  tealVibrant: '#00C9B1',   // CTAs, active tabs, progress
  tealMid:     '#00A896',   // hover/pressed teal states
  tealSoft:    '#CCF3EE',   // teal backgrounds, chips

  // ── Gamification (Amber) ──────────────────────────────────────
  amber:       '#F5A623',   // points, badges, rewards
  amberDeep:   '#D4870A',   // dark amber text on light backgrounds
  amberSoft:   '#FEF3D7',   // amber tinted backgrounds

  // ── Urgency / Alerts (Coral) ─────────────────────────────────
  coral:       '#FF6B6B',   // high-urgency issues
  coralDeep:   '#E04040',   // critical alerts
  coralSoft:   '#FFE5E5',   // coral tinted backgrounds

  // ── Status Colors ─────────────────────────────────────────────
  success:     '#2ECC71',
  successSoft: '#D5F5E3',
  warning:     '#F39C12',
  warningSoft: '#FDEBD0',
  info:        '#3498DB',
  infoSoft:    '#D6EAF8',

  // ── Neutrals ──────────────────────────────────────────────────
  white:       '#FFFFFF',
  slateLight:  '#F1F4F8',   // page background
  slateMid:    '#E2E8F0',   // dividers, borders
  slateGray:   '#94A3B8',   // placeholders, secondary text
  charcoal:    '#334155',   // body text
  inkBlack:    '#0F172A',   // headings on light bg

  // ── Gamification Special ──────────────────────────────────────
  gold:        '#FFD700',   // top-rank badges, legendary
  silver:      '#C0C0C0',   // second-rank
  bronze:      '#CD7F32',   // third-rank
  xpPurple:    '#8B5CF6',   // XP / level-up accents
  xpPurpleSoft:'#EDE9FE',

  // ── Transparent overlays ──────────────────────────────────────
  overlay20:   'rgba(13,27,62,0.20)',
  overlay50:   'rgba(13,27,62,0.50)',
  overlay80:   'rgba(13,27,62,0.80)',
} as const;

export type PaletteKey = keyof typeof palette;

// ── Semantic color tokens (maps palette → intent) ─────────────
export const colors = {
  // backgrounds
  bgPrimary:       palette.slateLight,
  bgCard:          palette.white,
  bgDark:          palette.navyDeep,
  bgDarkSecondary: palette.navyMid,

  // text
  textPrimary:     palette.inkBlack,
  textSecondary:   palette.charcoal,
  textMuted:       palette.slateGray,
  textOnDark:      palette.white,
  textOnDarkMuted: 'rgba(255,255,255,0.65)',
  textLink:        palette.tealVibrant,
  textWarning:     palette.amberDeep,
  textDanger:      palette.coralDeep,

  // brand
  brandPrimary:    palette.navyDeep,
  brandAccent:     palette.tealVibrant,
  brandReward:     palette.amber,

  // interactive
  btnPrimary:      palette.tealVibrant,
  btnPrimaryText:  palette.white,
  btnSecondary:    palette.navyDeep,
  btnSecondaryText:palette.white,
  btnGhost:        'transparent',
  btnGhostBorder:  palette.slateMid,
  btnGhostText:    palette.charcoal,
  btnDisabled:     palette.slateMid,
  btnDisabledText: palette.slateGray,

  // navigation
  tabActive:       palette.tealVibrant,
  tabInactive:     palette.slateGray,
  tabBar:          palette.white,

  // states
  urgencyLow:      palette.success,
  urgencyMedium:   palette.amber,
  urgencyHigh:     palette.coral,
  urgencyCritical: palette.coralDeep,

  // borders & dividers
  border:          palette.slateMid,
  borderFocus:     palette.tealVibrant,

  // gamification
  pointsColor:     palette.amber,
  badgeGold:       palette.gold,
  badgeSilver:     palette.silver,
  badgeBronze:     palette.bronze,
  xpAccent:        palette.xpPurple,
  streakFire:      '#FF4500',
} as const;

export type ColorsKey = keyof typeof colors;