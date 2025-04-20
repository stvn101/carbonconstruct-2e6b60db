
import { useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile } from '@/types/auth';
import { AuthState } from '../types';

export const useAuthState = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    isLoading: true
  });

  const updateState = (updates: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return {
    state,
    updateState
  };
};
