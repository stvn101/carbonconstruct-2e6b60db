
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

    // Transform the data to ensure it matches the UserProfile type
    const profile: UserProfile = {
      id: data.id,
      full_name: data.full_name,
      company_name: data.company_name,
      avatar_url: data.avatar_url,
      website: data.website,
      role: data.role,
      subscription_tier: data.subscription_tier || 'free',
      had_trial: data.had_trial || false
    };

    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function createUserProfile(profile: UserProfile): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    // Transform returned data to ensure it matches UserProfile type
    const createdProfile: UserProfile = {
      id: data.id,
      full_name: data.full_name,
      company_name: data.company_name,
      avatar_url: data.avatar_url,
      website: data.website,
      role: data.role,
      subscription_tier: data.subscription_tier || 'free',
      had_trial: data.had_trial || false
    };

    return createdProfile;
  } catch (error) {
    console.error('Error creating profile:', error);
    return null;
  }
}

export async function updateUserProfile(profile: UserProfile): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    // Transform returned data to ensure it matches UserProfile type
    const updatedProfile: UserProfile = {
      id: data.id,
      full_name: data.full_name,
      company_name: data.company_name,
      avatar_url: data.avatar_url,
      website: data.website,
      role: data.role,
      subscription_tier: data.subscription_tier || 'free',
      had_trial: data.had_trial || false
    };

    return updatedProfile;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
}
