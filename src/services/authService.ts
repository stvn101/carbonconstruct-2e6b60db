
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';
import { toast } from 'sonner';
import { isOffline } from '@/utils/errorHandling';

// Maximum retries for database operations
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper for retry logic
async function withRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      console.log(`Operation failed, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(operation, retries - 1, delay * 1.5);
    }
    console.error('Operation failed after retries:', error);
    return null;
  }
}

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  if (isOffline()) {
    console.warn('Offline: Cannot fetch user profile');
    return null;
  }

  try {
    const profileData = await withRetry(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    });

    if (!profileData) {
      return null;
    }

    // Transform the data to ensure it matches the UserProfile type
    const profile: UserProfile = {
      id: profileData.id,
      full_name: profileData.full_name,
      company_name: profileData.company_name,
      avatar_url: profileData.avatar_url,
      website: profileData.website,
      role: profileData.role,
      subscription_tier: profileData.subscription_tier || 'free',
      had_trial: profileData.had_trial || false
    };

    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    
    // Specific handling for resource limitations
    if (error instanceof Error && 
        (error.message.includes('INSUFFICIENT_RESOURCES') || 
         error.message.includes('Failed to fetch'))) {
      toast.error("Database connection issue. Some features may be limited.", {
        id: "database-resource-error",
        duration: 5000
      });
    }
    
    return null;
  }
}

export async function createUserProfile(profile: UserProfile): Promise<UserProfile | null> {
  if (isOffline()) {
    console.warn('Offline: Cannot create user profile');
    toast.warning("You're offline. Profile will be created when connection is restored.");
    return profile; // Return the profile object to allow the app to continue
  }

  try {
    const profileData = await withRetry(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single();

      if (error) {
        // Check if the profile already exists (unique constraint)
        if (error.code === '23505') {
          // If the profile already exists, fetch it instead
          const { data: existingData, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', profile.id)
            .single();
            
          if (fetchError) throw fetchError;
          return existingData;
        }
        throw error;
      }
      return data;
    });

    if (!profileData) {
      // If we couldn't create the profile due to connection issues,
      // return the original profile to allow the app to continue
      return profile;
    }

    // Transform returned data to ensure it matches UserProfile type
    const createdProfile: UserProfile = {
      id: profileData.id,
      full_name: profileData.full_name,
      company_name: profileData.company_name,
      avatar_url: profileData.avatar_url,
      website: profileData.website,
      role: profileData.role,
      subscription_tier: profileData.subscription_tier || 'free',
      had_trial: profileData.had_trial || false
    };

    return createdProfile;
  } catch (error) {
    console.error('Error creating profile:', error);
    
    // Specific handling for resource limitations
    if (error instanceof Error && 
        (error.message.includes('INSUFFICIENT_RESOURCES') || 
         error.message.includes('Failed to fetch'))) {
      toast.error("Database connection issue. Operating in limited mode.", {
        id: "database-resource-error",
        duration: 5000
      });
    }
    
    // Return the original profile to allow the app to continue
    return profile;
  }
}

export async function updateUserProfile(profile: UserProfile): Promise<UserProfile | null> {
  if (isOffline()) {
    console.warn('Offline: Cannot update user profile');
    toast.warning("You're offline. Changes will be saved when connection is restored.");
    return profile; // Return the profile object to allow the app to continue
  }

  try {
    const profileData = await withRetry(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    });

    if (!profileData) {
      // If we couldn't update the profile due to connection issues,
      // return the original profile to allow the app to continue
      return profile;
    }

    // Transform returned data to ensure it matches UserProfile type
    const updatedProfile: UserProfile = {
      id: profileData.id,
      full_name: profileData.full_name,
      company_name: profileData.company_name,
      avatar_url: profileData.avatar_url,
      website: profileData.website,
      role: profileData.role,
      subscription_tier: profileData.subscription_tier || 'free',
      had_trial: profileData.had_trial || false
    };

    return updatedProfile;
  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Specific handling for resource limitations
    if (error instanceof Error && 
        (error.message.includes('INSUFFICIENT_RESOURCES') || 
         error.message.includes('Failed to fetch'))) {
      toast.error("Database connection issue. Changes may not be saved.", {
        id: "database-resource-error",
        duration: 5000
      });
    }
    
    // Return the original profile to allow the app to continue
    return profile;
  }
}
