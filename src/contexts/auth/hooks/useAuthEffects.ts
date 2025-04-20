
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile } from '@/services/authService';
import { AuthState } from '../types';

export const useAuthEffects = (updateState: (updates: Partial<AuthState>) => void) => {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        updateState({
          session: session,
          user: session?.user ?? null
        });
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id).then((profile) => {
              updateState({ profile });
            });
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          updateState({ profile: null });
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      updateState({
        session,
        user: session?.user ?? null
      });
      
      if (session?.user) {
        fetchUserProfile(session.user.id).then((profile) => {
          updateState({ 
            profile,
            loading: false,
            isLoading: false
          });
        });
      } else {
        updateState({ loading: false, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [updateState]);
};
