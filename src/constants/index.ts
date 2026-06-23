import { palette } from '@theme/colors';
import type { LevelConfig, Badge, IssueCategory, UserLevel } from '@appTypes/index';

// ─────────────────────────────────────────────────────────────────────────────
// POINT ECONOMY
// ─────────────────────────────────────────────────────────────────────────────

export const POINTS = {
  REPORT_SUBMITTED:        10,
  VERIFICATION_GIVEN:       5,
  ISSUE_RESOLVED:          20,
  VERIFICATION_ACCURATE:    3,
  STREAK_BONUS_WEEKLY:     15,
  STREAK_BONUS_MONTHLY:    50,
  CHALLENGE_BASE:          25,
  BADGE_EARNED:            10,
  PENALTY_FALSE_REPORT:   -15,
  PENALTY_SPAM:           -25,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL PROGRESSION
// ─────────────────────────────────────────────────────────────────────────────

export const LEVELS: LevelConfig[] = [
  {
    level: 'newcomer',
    label: 'Newcomer',
    minPoints: 0,
    maxPoints: 49,
    color: palette.slateGray,
    iconName: 'account-outline',
    perks: ['Submit up to 3 reports per day'],
  },
  {
    level: 'local_watcher',
    label: 'Local Watcher',
    minPoints: 50,
    maxPoints: 199,
    color: palette.tealSoft,
    iconName: 'eye-outline',
    perks: ['Submit up to 5 reports per day', 'Verify reports'],
  },
  {
    level: 'neighborhood_warden',
    label: 'Neighborhood Warden',
    minPoints: 200,
    maxPoints: 599,
    color: palette.tealVibrant,
    iconName: 'shield-outline',
    perks: ['Submit up to 10 reports per day', 'Access dispute resolution'],
  },
  {
    level: 'community_hero',
    label: 'Community Hero',
    minPoints: 600,
    maxPoints: 1499,
    color: palette.amber,
    iconName: 'star-outline',
    perks: ['Unlimited reports', 'Moderation suggestions', 'Community badge'],
  },
  {
    level: 'civic_champion',
    label: 'Civic Champion',
    minPoints: 1500,
    maxPoints: 3999,
    color: palette.gold,
    iconName: 'trophy-outline',
    perks: ['Priority issue escalation', 'Monthly city council recognition'],
  },
  {
    level: 'city_guardian',
    label: 'City Guardian',
    minPoints: 4000,
    maxPoints: Infinity,
    color: palette.xpPurple,
    iconName: 'city-variant-outline',
    perks: ['Ambassador status', 'Direct authority line', 'All perks unlocked'],
  },
];

export const getLevelConfig = (level: UserLevel): LevelConfig =>
  LEVELS.find(l => l.level === level) ?? LEVELS[0];

export const getLevelFromPoints = (points: number): UserLevel => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) return LEVELS[i].level;
  }
  return 'newcomer';
};

export const getLevelProgress = (points: number, level: UserLevel): number => {
  const config = getLevelConfig(level);
  if (config.maxPoints === Infinity) return 100;
  const range = config.maxPoints - config.minPoints;
  const earned = points - config.minPoints;
  return Math.min(100, Math.round((earned / range) * 100));
};

// ─────────────────────────────────────────────────────────────────────────────
// ISSUE CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

export const ISSUE_CATEGORIES: {
  value: IssueCategory;
  label: string;
  icon: string;
  color: string;
}[] = [
  { value: 'pothole',               label: 'Pothole',             icon: 'road-variant',       color: '#E04040' },
  { value: 'waste_garbage',         label: 'Waste / Garbage',     icon: 'trash-can-outline',  color: '#2ECC71' },
  { value: 'streetlight',           label: 'Streetlight',         icon: 'lightbulb-outline',  color: '#F5A623' },
  { value: 'water_leak',            label: 'Water Leak',          icon: 'water',              color: '#3498DB' },
  { value: 'broken_footpath',       label: 'Broken Footpath',     icon: 'walk',               color: '#9B59B6' },
  { value: 'illegal_dumping',       label: 'Illegal Dumping',     icon: 'dump-truck',         color: '#E74C3C' },
  { value: 'graffiti',              label: 'Graffiti',            icon: 'spray',              color: '#E67E22' },
  { value: 'fallen_tree',           label: 'Fallen Tree',         icon: 'tree-outline',       color: '#27AE60' },
  { value: 'drainage_flooding',     label: 'Drainage / Flooding', icon: 'waves',              color: '#2980B9' },
  { value: 'road_damage',           label: 'Road Damage',         icon: 'road',               color: '#C0392B' },
  { value: 'public_property_damage',label: 'Property Damage',     icon: 'home-alert-outline', color: '#8E44AD' },
  { value: 'safety_hazard',         label: 'Safety Hazard',       icon: 'alert-outline',      color: '#E74C3C' },
  { value: 'other',                 label: 'Other',               icon: 'help-circle-outline',color: '#95A5A6' },
];

// ─────────────────────────────────────────────────────────────────────────────
// BADGES CATALOGUE
// ─────────────────────────────────────────────────────────────────────────────

export const BADGES: Badge[] = [
  // Specialty badges
  {
    id: 'pothole_patrol',
    name: 'Pothole Patrol',
    description: 'Reported 10 pothole issues',
    iconName: 'road-variant',
    iconColor: '#E04040',
    category: 'specialty',
    rarity: 'common',
    requirement: 'Report 10 pothole issues',
    pointsAwarded: 50,
  },
  {
    id: 'eco_warrior',
    name: 'Eco Warrior',
    description: 'Reported 10 waste / illegal dumping issues',
    iconName: 'leaf',
    iconColor: '#2ECC71',
    category: 'specialty',
    rarity: 'common',
    requirement: 'Report 10 waste or illegal dumping issues',
    pointsAwarded: 50,
  },
  {
    id: 'bright_knight',
    name: 'Bright Knight',
    description: 'Reported 10 streetlight outages',
    iconName: 'lightbulb-on-outline',
    iconColor: '#F5A623',
    category: 'specialty',
    rarity: 'common',
    requirement: 'Report 10 streetlight issues',
    pointsAwarded: 50,
  },
  // Impact badges
  {
    id: 'first_fix',
    name: 'First Fix',
    description: 'Your first report was resolved!',
    iconName: 'check-circle-outline',
    iconColor: '#2ECC71',
    category: 'impact',
    rarity: 'common',
    requirement: 'Have 1 issue resolved',
    pointsAwarded: 20,
  },
  {
    id: 'impact_10',
    name: 'Impact Maker',
    description: '10 of your reports led to real fixes',
    iconName: 'hammer-wrench',
    iconColor: '#3498DB',
    category: 'impact',
    rarity: 'rare',
    requirement: 'Have 10 issues resolved',
    pointsAwarded: 100,
  },
  {
    id: 'impact_50',
    name: 'Change Agent',
    description: '50 of your reports led to real fixes',
    iconName: 'rocket-launch-outline',
    iconColor: '#9B59B6',
    category: 'impact',
    rarity: 'epic',
    requirement: 'Have 50 issues resolved',
    pointsAwarded: 300,
  },
  {
    id: 'impact_100',
    name: 'City Transformer',
    description: '100 of your reports led to real fixes',
    iconName: 'city-variant',
    iconColor: '#F5A623',
    category: 'impact',
    rarity: 'legendary',
    requirement: 'Have 100 issues resolved',
    pointsAwarded: 1000,
  },
  // Accuracy badges
  {
    id: 'the_auditor',
    name: 'The Auditor',
    description: 'Maintained 90%+ verification accuracy over 50 verifications',
    iconName: 'magnify-scan',
    iconColor: '#8B5CF6',
    category: 'accuracy',
    rarity: 'epic',
    requirement: '90%+ accuracy over 50 verifications',
    pointsAwarded: 200,
  },
  // Streak badges
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Active 7 days in a row',
    iconName: 'fire',
    iconColor: '#FF4500',
    category: 'streak',
    rarity: 'common',
    requirement: '7-day active streak',
    pointsAwarded: 30,
  },
  {
    id: 'monthly_guardian',
    name: 'Monthly Guardian',
    description: 'Active 30 days in a row',
    iconName: 'calendar-check',
    iconColor: '#FF6B6B',
    category: 'streak',
    rarity: 'rare',
    requirement: '30-day active streak',
    pointsAwarded: 150,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ANTI-ABUSE THRESHOLDS
// ─────────────────────────────────────────────────────────────────────────────

export const ABUSE_THRESHOLDS = {
  MIN_CREDIBILITY_TO_REPORT:  20,   // below this → throttled
  FALSE_REPORT_CREDIBILITY_HIT: 10,
  SPAM_CREDIBILITY_HIT:       25,
  DUPLICATE_RADIUS_METERS:    50,   // flag as potential duplicate
  MAX_REPORTS_PER_DAY_BASE:    3,   // newcomer limit
  REVIEW_DISPUTE_RATIO:       0.4,  // if > 40% dispute → auto-review
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// APP CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const APP_CONFIG = {
  APP_NAME:              'CivicSensor',
  APP_TAGLINE:           'Your city. Your voice. Your change.',
  VERSION:               '1.0.0',
  SUPPORT_EMAIL:         'support@civicsensor.app',
  TWITTER_HANDLE:        '@CivicSensor',
  DEFAULT_MAP_ZOOM:      14,
  ISSUES_PER_PAGE:       20,
  LEADERBOARD_TOP_N:     50,
  MIN_DESCRIPTION_CHARS: 20,
  MAX_DESCRIPTION_CHARS: 500,
  MAX_MEDIA_PER_REPORT:  5,
  ONBOARDING_STEPS:      4,
} as const;