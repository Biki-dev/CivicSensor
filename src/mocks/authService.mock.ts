import type { AuthService } from '@features/auth/services/authService';
import type { UserProfile } from '@appTypes/index';
import { MOCK_USER } from '@assets/mock/mockData';
import { sleep } from '@utils/helpers';

const PERSIST_KEY = 'CIVIC_SENSOR_USER';

const cloneUser = (user: UserProfile): UserProfile => ({ ...user });

export const authServiceMock: AuthService = {
  login: async (email, password) => {
    await sleep(800);
    if (!email || !password || password.length < 8) {
      throw new Error('Invalid login credentials');
    }
    const user: UserProfile = {
      ...cloneUser(MOCK_USER),
      email,
      displayName: MOCK_USER.displayName,
      onboardingComplete: true,
    };
    try {
      await localStorage.setItem(PERSIST_KEY, JSON.stringify(user));
    } catch {
      // ignore persistence failures in mock
    }
    return user;
  },

  signUp: async (email, password, displayName) => {
    await sleep(1000);
    if (!email || !password || password.length < 8 || !displayName.trim()) {
      throw new Error('Invalid signup values');
    }
    const newUser: UserProfile = {
      ...cloneUser(MOCK_USER),
      id: `user-${Date.now()}`,
      uid: `uid-${Date.now()}`,
      email,
      displayName: displayName.trim(),
      points: 0,
      level: 'newcomer',
      levelProgress: 0,
      streakDays: 0,
      badges: [],
      reportCount: 0,
      verificationCount: 0,
      fixedIssueCount: 0,
      credibilityScore: 50,
      accuracyRate: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      onboardingComplete: false,
      notificationsEnabled: true,
    };
    try {
      await localStorage.setItem(PERSIST_KEY, JSON.stringify(newUser));
    } catch {
      // ignore
    }
    return newUser;
  },

  logout: async () => {
    await sleep(200);
    try {
      await localStorage.removeItem(PERSIST_KEY);
    } catch {
      // ignore
    }
  },

  getCurrentUser: async () => {
    try {
      const raw = await localStorage.getItem(PERSIST_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  },
};
