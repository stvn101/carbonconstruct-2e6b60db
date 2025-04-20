import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

// Cache for user profiles
const profileCache = new Map<string, { profile: UserProfile | null, timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  // Check cache first
  const cached = profileCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.profile;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    const profile = {
      id: data.id,
      full_name: data.full_name,
      company_name: data.company_name,
      avatar_url: data.avatar_url,
      website: data.website,
      role: data.role,
      subscription_tier: (data as any).subscription_tier || 'free',
      had_trial: (data as any).had_trial
    } as UserProfile;

    // Update cache
    profileCache.set(userId, { profile, timestamp: Date.now() });
    
    return profile;
  } catch (error) {
    console.error('Profile fetch error:', error);
    return null;
  }
}

export async function loginWithPassword(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    throw new Error(error.message);
  }
}

export async function registerUser(name: string, email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });
  
  if (error) {
    throw new Error(error.message);
  }
}

export async function signInWithGitHubOAuth(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) {
    throw new Error(error.message);
  }
}

export async function logoutUser(): Promise<void> {
  await supabase.auth.signOut();
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
    
  if (error) throw error;
}

export function clearProfileCache(userId?: string) {
  if (userId) {
    profileCache.delete(userId);
  } else {
    profileCache.clear();
  }
}
