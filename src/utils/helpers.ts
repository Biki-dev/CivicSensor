import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import type { UrgencyLevel, IssueStatus, UserLevel } from '@appTypes/index';
import { colors } from '@theme/colors';

// ─── Date helpers ────────────────────────────────────────────────────────────

export const formatRelativeTime = (isoString: string): string => {
  const date = new Date(isoString);
  if (isToday(date)) return formatDistanceToNow(date, { addSuffix: true });
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'dd MMM yyyy');
};

export const formatShortDate = (isoString: string): string =>
  format(new Date(isoString), 'dd MMM');

// ─── Points / number formatting ──────────────────────────────────────────────

export const formatPoints = (pts: number): string => {
  if (pts >= 1000) return `${(pts / 1000).toFixed(1)}k`;
  return pts.toString();
};

export const formatNumber = (n: number): string =>
  new Intl.NumberFormat('en-IN').format(n);

// ─── Color maps ──────────────────────────────────────────────────────────────

export const urgencyColor = (urgency: UrgencyLevel): string => {
  const map: Record<UrgencyLevel, string> = {
    low:      colors.urgencyLow,
    medium:   colors.urgencyMedium,
    high:     colors.urgencyHigh,
    critical: colors.urgencyCritical,
  };
  return map[urgency];
};

export const urgencyLabel = (urgency: UrgencyLevel): string => {
  const map: Record<UrgencyLevel, string> = {
    low:      'Low',
    medium:   'Medium',
    high:     'High',
    critical: 'Critical',
  };
  return map[urgency];
};

export const statusColor = (status: IssueStatus): string => {
  const map: Record<IssueStatus, string> = {
    pending:     colors.textWarning,
    verified:    colors.info,
    in_review:   colors.xpAccent,
    in_progress: colors.brandAccent,
    resolved:    colors.success,
    rejected:    colors.textDanger,
    disputed:    colors.urgencyHigh,
  };
  return map[status] ?? colors.textMuted;
};

export const statusLabel = (status: IssueStatus): string => {
  const map: Record<IssueStatus, string> = {
    pending:     'Pending',
    verified:    'Verified',
    in_review:   'In Review',
    in_progress: 'In Progress',
    resolved:    'Resolved',
    rejected:    'Rejected',
    disputed:    'Disputed',
  };
  return map[status] ?? status;
};

export const levelLabel = (level: UserLevel): string => {
  const map: Record<UserLevel, string> = {
    newcomer:             'Newcomer',
    local_watcher:        'Local Watcher',
    neighborhood_warden:  'Neighborhood Warden',
    community_hero:       'Community Hero',
    civic_champion:       'Civic Champion',
    city_guardian:        'City Guardian',
  };
  return map[level];
};

// ─── Validation ───────────────────────────────────────────────────────────────

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isValidPassword = (pw: string): boolean => pw.length >= 8;

export const isValidPhone = (phone: string): boolean =>
  /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));

// ─── ID generation (client-side mock) ────────────────────────────────────────

export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// ─── Credibility helpers ──────────────────────────────────────────────────────

/** Returns 0–100 display-safe credibility tier label */
export const credibilityTier = (score: number): 'trusted' | 'neutral' | 'flagged' => {
  if (score >= 70) return 'trusted';
  if (score >= 40) return 'neutral';
  return 'flagged';
};

// ─── Misc ────────────────────────────────────────────────────────────────────

export const truncate = (str: string, maxLen = 80): string =>
  str.length > maxLen ? `${str.slice(0, maxLen - 1)}…` : str;

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));