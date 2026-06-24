import { create } from 'zustand';
import type { UserProfile } from '@appTypes/index';
import { MOCK_USER } from '@assets/mock/mockData';
import { sleep } from '@utils/helpers';

interface AuthStore {
  // State
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (displayName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateUser: (partial: Partial<UserProfile>) => void;
  setOnboardingComplete: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Mock network delay — replace with Firebase Auth
      await sleep(1200);

      if (!email || !password) {
        set({ error: 'Email and password are required.', isLoading: false });
        return false;
      }

      if (password.length < 8) {
        set({ error: 'Password must be at least 8 characters.', isLoading: false });
        return false;
      }

      // Simulate successful login with mock user
      set({
        user: { ...MOCK_USER, email },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (e) {
      set({ error: 'Login failed. Please try again.', isLoading: false });
      return false;
    }
  },

  signUp: async (displayName, email, _password) => {
    set({ isLoading: true, error: null });
    try {
      await sleep(1400);

      if (!displayName.trim()) {
        set({ error: 'Please enter your name.', isLoading: false });
        return false;
      }

      // New user — onboarding not complete yet
      const newUser: UserProfile = {
        ...MOCK_USER,
        id: `user-${Date.now()}`,
        uid: `firebase-${Date.now()}`,
        displayName: displayName.trim(),
        email,
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
      };

      set({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (e) {
      set({ error: 'Sign up failed. Please try again.', isLoading: false });
      return false;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),

  updateUser: (partial) => {
    const current = get().user;
    if (!current) return;
    set({ user: { ...current, ...partial, updatedAt: new Date().toISOString() } });
  },

  setOnboardingComplete: () => {
    const current = get().user;
    if (!current) return;
    set({ user: { ...current, onboardingComplete: true } });
  },
}));