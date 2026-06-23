/**
 * CivicSensor — Core Type Definitions
 * These models drive every screen, store, and API contract.
 */

// ─────────────────────────────────────────────────────────────────────────────
// USER & AUTH
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = 'citizen' | 'moderator' | 'admin' | 'official';

export type UserLevel =
  | 'newcomer'
  | 'local_watcher'
  | 'neighborhood_warden'
  | 'community_hero'
  | 'civic_champion'
  | 'city_guardian';

export interface UserProfile {
  id: string;
  uid: string;             // Firebase / auth UID
  displayName: string;
  email: string;
  avatarUrl?: string;
  phoneNumber?: string;
  role: UserRole;

  // Location
  neighborhoodId: string;
  neighborhoodName: string;
  city: string;
  state: string;
  coordinates?: GeoPoint;

  // Gamification
  points: number;
  level: UserLevel;
  levelProgress: number;   // 0–100 percent to next level
  streakDays: number;
  lastActiveDate: string;  // ISO date string
  badges: string[];        // badge IDs earned
  reportCount: number;
  verificationCount: number;
  fixedIssueCount: number;

  // Trust
  credibilityScore: number;       // 0–100 hidden score
  accuracyRate: number;           // ratio of accurate reports
  isBanned: boolean;
  isShadowBanned: boolean;

  // Meta
  createdAt: string;
  updatedAt: string;
  onboardingComplete: boolean;
  notificationsEnabled: boolean;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// ISSUES / REPORTS
// ─────────────────────────────────────────────────────────────────────────────

export type IssueCategory =
  | 'pothole'
  | 'waste_garbage'
  | 'streetlight'
  | 'water_leak'
  | 'broken_footpath'
  | 'illegal_dumping'
  | 'graffiti'
  | 'fallen_tree'
  | 'drainage_flooding'
  | 'road_damage'
  | 'public_property_damage'
  | 'safety_hazard'
  | 'other';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type IssueStatus =
  | 'pending'          // submitted, awaiting verification
  | 'verified'         // community verified
  | 'in_review'        // under authority review
  | 'in_progress'      // work started
  | 'resolved'         // fixed/closed
  | 'rejected'         // false/spam
  | 'disputed';        // flagged as potentially false

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface MediaAttachment {
  id: string;
  uri: string;
  type: 'image' | 'video';
  thumbnailUri?: string;
  uploadedAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  urgency: UrgencyLevel;
  status: IssueStatus;

  // Location
  location: GeoPoint;
  address: string;
  neighborhoodId: string;
  neighborhoodName: string;

  // Media
  media: MediaAttachment[];

  // Reporter
  reportedById: string;
  reportedByName: string;
  reportedByAvatar?: string;

  // AI classification
  aiCategoryConfidence?: number;
  aiSuggestedCategory?: IssueCategory;

  // Verification
  verificationCount: number;
  disputeCount: number;
  verifiedByIds: string[];
  disputedByIds: string[];
  isVerified: boolean;

  // Authority
  assignedAuthorityId?: string;
  assignedAuthorityName?: string;
  twitterPostId?: string;         // X (Twitter) post reference

  // Meta
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  viewCount: number;
  upvotes: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// GAMIFICATION
// ─────────────────────────────────────────────────────────────────────────────

export type BadgeCategory =
  | 'specialty'    // issue-type specialist
  | 'impact'       // X issues fixed
  | 'accuracy'     // verification accuracy
  | 'streak'       // consistency
  | 'community'    // social engagement
  | 'special';     // limited / event

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;        // vector-icons name
  iconColor: string;
  category: BadgeCategory;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: string;     // human-readable unlock requirement
  pointsAwarded: number;
  earnedAt?: string;       // ISO string — only set if user has earned it
}

export type PointEventType =
  | 'report_submitted'
  | 'report_verified'
  | 'report_resolved'
  | 'verification_accurate'
  | 'streak_bonus'
  | 'challenge_complete'
  | 'badge_earned'
  | 'penalty_false_report';

export interface PointEvent {
  id: string;
  userId: string;
  type: PointEventType;
  points: number;          // positive = earned, negative = penalty
  referenceId?: string;    // issue ID or challenge ID
  description: string;
  createdAt: string;
}

export interface LevelConfig {
  level: UserLevel;
  label: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  iconName: string;
  perks: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// LEADERBOARD
// ─────────────────────────────────────────────────────────────────────────────

export type LeaderboardScope = 'neighborhood' | 'city' | 'global';
export type LeaderboardPeriod = 'weekly' | 'monthly' | 'all_time';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  level: UserLevel;
  points: number;
  badgeCount: number;
  isCurrentUser?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// NEIGHBORHOOD / LOCATION
// ─────────────────────────────────────────────────────────────────────────────

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  state: string;
  bounds?: {
    northeast: GeoPoint;
    southwest: GeoPoint;
  };
  activeIssueCount: number;
  resolvedIssueCount: number;
  memberCount: number;
  healthScore: number;   // 0–100 aggregate score
}

// ─────────────────────────────────────────────────────────────────────────────
// CHALLENGES / QUESTS
// ─────────────────────────────────────────────────────────────────────────────

export type ChallengeType = 'report' | 'verify' | 'fix_rate' | 'streak' | 'category';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  target: number;          // e.g. report 5 potholes
  current: number;         // user's current progress
  rewardPoints: number;
  rewardBadgeId?: string;
  expiresAt: string;
  neighborhoodId?: string;
  isCompleted: boolean;
  iconName: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

export type NotificationType =
  | 'issue_verified'
  | 'issue_resolved'
  | 'issue_disputed'
  | 'badge_earned'
  | 'level_up'
  | 'challenge_complete'
  | 'streak_reminder'
  | 'nearby_issue'
  | 'community_update';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// API / NETWORK
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION PARAMS (kept here to co-locate with types)
// ─────────────────────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  ChooseNeighborhood: undefined;
  Walkthrough: { step?: number };
  ProfileSetup: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Report: undefined;
  Feed: undefined;
  Map: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  Dashboard: undefined;
  IssueDetail: { issueId: string };
  Leaderboard: undefined;
  Badges: undefined;
  Challenges: undefined;
  Notifications: undefined;
};

export type ReportStackParamList = {
  ReportForm: undefined;
  LocationPicker: undefined;
  CategorySelect: undefined;
  ReviewSubmit: undefined;
};