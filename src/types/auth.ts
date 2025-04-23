
import { Session, User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  avatar_url: string | null;
  website: string | null;
  role: string | null;
  subscription_tier: string | null;
  had_trial: boolean;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  updateProfile: (updatedProfile: UserProfile) => Promise<void>;
  signUp: (email: string, password: string, captchaToken: string | null) => Promise<void>;
  signIn: (email: string, password: string, captchaToken: string | null) => Promise<void>;
  signOut: () => Promise<void>;
}
