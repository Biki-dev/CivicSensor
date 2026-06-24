import type { UserProfile } from '@appTypes/index';

export interface AuthPayload {
  email: string;
  password: string;
  displayName?: string;
}

export interface AuthService {
  login(email: string, password: string): Promise<UserProfile>;
  signUp(email: string, password: string, displayName: string): Promise<UserProfile>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<UserProfile | null>;
}
