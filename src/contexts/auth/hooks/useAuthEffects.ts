
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile, createUserProfile } from '@/services/authService';
import { AuthState } from '../types';
import { UserProfile } from '@/types/auth';

export const useAuthEffects = (updateState: (updates: Partial<AuthState>) => void) => {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        updateState({
          session: session,
          user: session?.user ?? null
        });
        
        if (session?.user) {
          try {
            const profile = await fetchUserProfile(session.user.id);
            
            if (!profile) {
              // Create a new profile if one doesn't exist
              const newProfile: UserProfile = {
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name || null,
                company_name: null,
                avatar_url: null,
                website: null,
                role: 'user',
                subscription_tier: 'free',
                had_trial: false
              };
              
              const createdProfile = await createUserProfile(newProfile);
              updateState({ profile: createdProfile });
            } else {
              updateState({ profile });
            }
          } catch (error) {
            console.error('Error processing user profile:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          updateState({ profile: null });
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      updateState({
        session,
        user: session?.user ?? null
      });
      
      if (session?.user) {
        try {
          const profile = await fetchUserProfile(session.user.id);
          
          if (!profile) {
            // Create a new profile if one doesn't exist
            const newProfile: UserProfile = {
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || null,
              company_name: null,
              avatar_url: null,
              website: null,
              role: 'user',
              subscription_tier: 'free',
              had_trial: false
            };
            
            const createdProfile = await createUserProfile(newProfile);
            updateState({ 
              profile: createdProfile,
              loading: false,
              isLoading: false
            });
          } else {
            updateState({ 
              profile,
              loading: false,
              isLoading: false
            });
          }
        } catch (error) {
          console.error('Error processing user profile:', error);
          updateState({ loading: false, isLoading: false });
        }
      } else {
        updateState({ loading: false, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [updateState]);
};
