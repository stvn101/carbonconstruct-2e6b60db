
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
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
    
    // Convert database profile to UserProfile type with subscription_tier default
    return {
      id: data.id,
      full_name: data.full_name,
      company_name: data.company_name,
      avatar_url: data.avatar_url,
      website: data.website,
      role: data.role,
      // If the profile data doesn't have subscription_tier, default to 'free'
      subscription_tier: (data as any).subscription_tier || 'free',
      had_trial: (data as any).had_trial
    } as UserProfile;
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
