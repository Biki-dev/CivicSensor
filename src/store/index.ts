import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserProfile,
  Issue,
  Badge,
  Challenge,
  AppNotification,
  IssueCategory,
  UrgencyLevel,
  GeoPoint,
} from '@appTypes/index';
import { getLevelFromPoints, getLevelProgress, BADGES } from '@constants/index';
export { useAuthStore } from './authStore';

const AUTH_STORAGE_KEY = 'CIVIC_SENSOR_AUTH';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  isOnboarded: boolean;
  user: UserProfile | null;
  
  // App Data
  issues: Issue[];
  notifications: AppNotification[];
  challenges: Challenge[];
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  completeOnboarding: (neighborhoodName: string) => Promise<void>;
  restoreSession: () => Promise<void>;
  
  // Issue Actions
  addIssue: (
    title: string,
    description: string,
    category: IssueCategory,
    urgency: UrgencyLevel,
    address: string,
    coordinates: GeoPoint
  ) => void;
  verifyIssue: (issueId: string, userId: string) => void;
  disputeIssue: (issueId: string, userId: string) => void;
  
  // Notifications
  markAllNotificationsRead: () => void;
  
  // Reward system helper
  awardPoints: (amount: number, description: string) => void;
}

// Initial mock issues for realistic app representation
const INITIAL_ISSUES: Issue[] = [
  {
    id: 'issue-1',
    title: 'Crater Pothole on Main St',
    description: 'Dangerous double pothole right in the middle of the fast lane. Cars are swerving to avoid it, causing near misses.',
    category: 'pothole',
    urgency: 'critical',
    status: 'pending',
    location: { latitude: 37.7749, longitude: -122.4194 },
    address: '450 Main St, Downtown',
    neighborhoodId: 'neigh-1',
    neighborhoodName: 'Downtown Civic Core',
    media: [
      {
        id: 'media-1',
        uri: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=500',
        type: 'image',
        uploadedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      }
    ],
    reportedById: 'user-2',
    reportedByName: 'Marcus K.',
    reportedByAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    verificationCount: 7,
    disputeCount: 0,
    verifiedByIds: ['user-3', 'user-4'],
    disputedByIds: [],
    isVerified: true,
    viewCount: 142,
    upvotes: 24,
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: 'issue-2',
    title: 'Overflowing Trash Bins near Park',
    description: 'Garbage bins at the north entrance of Elm Park are overflowing. Trash is blowing onto the grass and kids play area.',
    category: 'waste_garbage',
    urgency: 'medium',
    status: 'verified',
    location: { latitude: 37.7833, longitude: -122.4167 },
    address: 'Elm Park North, Greenview',
    neighborhoodId: 'neigh-2',
    neighborhoodName: 'Greenview Valley',
    media: [],
    reportedById: 'user-3',
    reportedByName: 'Elena R.',
    reportedByAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    verificationCount: 4,
    disputeCount: 0,
    verifiedByIds: ['user-1'],
    disputedByIds: [],
    isVerified: true,
    viewCount: 54,
    upvotes: 12,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 22 * 3600000).toISOString(),
  },
  {
    id: 'issue-3',
    title: 'Broken Streetlight - Dark Alleyway',
    description: 'The street lamp is completely dead. This alleyway gets extremely dark at night and has become a safety concern.',
    category: 'streetlight',
    urgency: 'high',
    status: 'in_progress',
    location: { latitude: 37.7699, longitude: -122.4468 },
    address: '88 Oak Lane, Oakridge',
    neighborhoodId: 'neigh-3',
    neighborhoodName: 'Oakridge Heights',
    media: [],
    reportedById: 'user-4',
    reportedByName: 'David L.',
    reportedByAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    verificationCount: 12,
    disputeCount: 1,
    verifiedByIds: ['user-2', 'user-3'],
    disputedByIds: [],
    isVerified: true,
    assignedAuthorityId: 'auth-1',
    assignedAuthorityName: 'City Power & Light Dept',
    viewCount: 201,
    upvotes: 45,
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'issue_verified',
    title: 'Report Verified!',
    body: 'Your report on "Main St Pothole" has been verified by 5 community watchers. +10 Points!',
    referenceId: 'issue-1',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'notif-2',
    type: 'badge_earned',
    title: 'New Badge Unlocked!',
    body: 'Congratulations! You earned the "First Fix" badge for your contribution. +20 Points!',
    referenceId: 'first_fix',
    isRead: true,
    createdAt: new Date(Date.now() - 10 * 3600000).toISOString(),
  }
];

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'chal-1',
    title: 'Weekend Watcher',
    description: 'Verify 3 issues reported in your neighborhood.',
    type: 'verify',
    target: 3,
    current: 1,
    rewardPoints: 25,
    expiresAt: new Date(Date.now() + 48 * 3600000).toISOString(),
    isCompleted: false,
    iconName: 'eye-outline',
  },
  {
    id: 'chal-2',
    title: 'Pothole Buster',
    description: 'Report a road damage or pothole issue with clear pictures.',
    type: 'report',
    target: 1,
    current: 0,
    rewardPoints: 30,
    expiresAt: new Date(Date.now() + 72 * 3600000).toISOString(),
    isCompleted: false,
    iconName: 'road-variant',
  }
];

const DEFAULT_PROFILE = (name: string, email: string, neighborhood: string): UserProfile => {
  const points = 75;
  const level = getLevelFromPoints(points);
  return {
    id: 'user-current',
    uid: 'firebase-uid-123',
    displayName: name,
    email: email,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'citizen',
    neighborhoodId: 'neigh-current',
    neighborhoodName: neighborhood,
    city: 'Metro City',
    state: 'CA',
    points: points,
    level: level,
    levelProgress: getLevelProgress(points, level),
    streakDays: 4,
    lastActiveDate: new Date().toISOString(),
    badges: ['first_fix'],
    reportCount: 2,
    verificationCount: 8,
    fixedIssueCount: 1,
    credibilityScore: 88,
    accuracyRate: 0.9,
    isBanned: false,
    isShadowBanned: false,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    onboardingComplete: true,
    notificationsEnabled: true,
  };
};

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  isOnboarded: false,
  user: null,
  issues: INITIAL_ISSUES,
  notifications: INITIAL_NOTIFICATIONS,
  challenges: INITIAL_CHALLENGES,
  
  restoreSession: async () => {
    try {
      const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw) as UserProfile;
      set({
        user: stored,
        isAuthenticated: true,
        isOnboarded: stored.onboardingComplete,
      });
    } catch {
      // ignore restore failures
    }
  },
  
  login: async (email: string, password: string) => {
    const user = DEFAULT_PROFILE('Elena Rostova', email, 'Greenview Valley');
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    set({
      isAuthenticated: true,
      isOnboarded: true,
      user,
    });
  },
  
  logout: async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    set({
      isAuthenticated: false,
      isOnboarded: false,
      user: null,
    });
  },
  
  signup: async (name: string, email: string, _password: string) => {
    const newUser = DEFAULT_PROFILE(name, email, '');
    newUser.onboardingComplete = false;
    newUser.neighborhoodName = '';
    newUser.neighborhoodId = 'pending';
    newUser.points = 0;
    newUser.level = 'newcomer';
    newUser.levelProgress = 0;
    newUser.streakDays = 0;
    newUser.badges = [];
    newUser.reportCount = 0;
    newUser.verificationCount = 0;
    newUser.fixedIssueCount = 0;
    newUser.credibilityScore = 50;
    newUser.accuracyRate = 1;
    newUser.createdAt = new Date().toISOString();
    newUser.updatedAt = new Date().toISOString();
    newUser.onboardingComplete = false;

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    set({
      isAuthenticated: true,
      isOnboarded: false,
      user: newUser,
    });
  },
  
  completeOnboarding: async (neighborhoodName: string) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      neighborhoodName,
      neighborhoodId: `nb-${neighborhoodName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      onboardingComplete: true,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    set({
      isOnboarded: true,
      isAuthenticated: true,
      user: updatedUser,
    });
  },
  
  addIssue: (title, description, category, urgency, address, coordinates) => {
    const currentUser = get().user;
    if (!currentUser) return;
    
    const newIssue: Issue = {
      id: `issue-${Date.now()}`,
      title,
      description,
      category,
      urgency,
      status: 'pending',
      location: coordinates,
      address,
      neighborhoodId: currentUser.neighborhoodId,
      neighborhoodName: currentUser.neighborhoodName,
      media: [],
      reportedById: currentUser.id,
      reportedByName: currentUser.displayName,
      reportedByAvatar: currentUser.avatarUrl,
      verificationCount: 0,
      disputeCount: 0,
      verifiedByIds: [],
      disputedByIds: [],
      isVerified: false,
      viewCount: 1,
      upvotes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set(state => ({
      issues: [newIssue, ...state.issues]
    }));
    
    // Reward points for submitting report
    get().awardPoints(15, `Submitted civic report: "${title}"`);
    
    // Add custom notification for feedback
    const newNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'nearby_issue',
      title: 'Report Submitted!',
      body: `Your report for "${title}" is live. Awaiting community verification.`,
      referenceId: newIssue.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    set(state => ({
      notifications: [newNotification, ...state.notifications]
    }));
  },
  
  verifyIssue: (issueId, userId) => {
    set(state => {
      const updatedIssues = state.issues.map(issue => {
        if (issue.id !== issueId) return issue;
        if (issue.verifiedByIds.includes(userId)) return issue; // Already verified
        
        const verifiedByIds = [...issue.verifiedByIds, userId];
        const verificationCount = issue.verificationCount + 1;
        const isVerified = verificationCount >= 3;
        
        return {
          ...issue,
          verifiedByIds,
          verificationCount,
          isVerified,
          status: isVerified && issue.status === 'pending' ? 'verified' : issue.status,
          updatedAt: new Date().toISOString(),
        };
      });
      
      return { issues: updatedIssues };
    });
    
    // Reward points to verify
    get().awardPoints(5, 'Verified a neighborhood issue');
  },
  
  disputeIssue: (issueId, userId) => {
    set(state => {
      const updatedIssues = state.issues.map(issue => {
        if (issue.id !== issueId) return issue;
        if (issue.disputedByIds.includes(userId)) return issue;
        
        const disputedByIds = [...issue.disputedByIds, userId];
        const disputeCount = issue.disputeCount + 1;
        
        return {
          ...issue,
          disputedByIds,
          disputeCount,
          status: disputeCount >= 2 ? 'disputed' : issue.status,
          updatedAt: new Date().toISOString(),
        };
      });
      
      return { issues: updatedIssues };
    });
  },
  
  markAllNotificationsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true }))
    }));
  },
  
  awardPoints: (amount, description) => {
    const currentUser = get().user;
    if (!currentUser) return;
    
    const newPoints = Math.max(0, currentUser.points + amount);
    const newLevel = getLevelFromPoints(newPoints);
    const progress = getLevelProgress(newPoints, newLevel);
    
    // Check if user leveled up
    const hasLeveledUp = newLevel !== currentUser.level;
    
    set(state => {
      const updatedNotifications = [...state.notifications];
      if (hasLeveledUp) {
        updatedNotifications.unshift({
          id: `notif-lvl-${Date.now()}`,
          type: 'level_up',
          title: 'LEVEL UP!',
          body: `Congratulations! You reached level: ${newLevel.replace('_', ' ').toUpperCase()}!`,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      }
      
      return {
        user: currentUser ? {
          ...currentUser,
          points: newPoints,
          level: newLevel,
          levelProgress: progress,
          updatedAt: new Date().toISOString(),
        } : null,
        notifications: updatedNotifications
      };
    });
  }
}));
