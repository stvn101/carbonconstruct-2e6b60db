import { Session, User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  avatar_url: string | null;
  website: string | null;
  role: string | null;
  subscription_tier: 'free' | 'premium' | 'enterprise' | null;
  had_trial: boolean;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}
