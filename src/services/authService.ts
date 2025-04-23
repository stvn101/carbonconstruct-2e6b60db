
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
      // Return null instead of throwing when profile not found
      return null;
    }

    return data as UserProfile;
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

    return data as UserProfile;
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

    return data as UserProfile;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
}
