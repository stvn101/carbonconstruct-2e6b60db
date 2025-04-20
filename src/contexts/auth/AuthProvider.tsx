
import { createContext, useContext, ReactNode } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './hooks/useAuthState';
import { useAuthHandlers } from './hooks/useAuthHandlers';
import { useAuthEffects } from './hooks/useAuthEffects';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  signUp: async () => { /* empty implementation */ },
  signIn: async () => { /* empty implementation */ },
  signOut: async () => { /* empty implementation */ },
  login: async () => { /* empty implementation */ },
  logout: async () => { /* empty implementation */ },
  register: async () => { /* empty implementation */ },
  signInWithGitHub: async () => { /* empty implementation */ },
  updateProfile: async () => { /* empty implementation */ },
  loading: true,
  isLoading: true
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { state, updateState } = useAuthState();
  const authHandlers = useAuthHandlers();
  useAuthEffects(updateState);

  const contextValue: AuthContextType = {
    ...state,
    signUp: async (email: string, password: string, captchaToken: string | null) => {
      const options = captchaToken ? { captchaToken } : undefined;
      await supabase.auth.signUp({ email, password, options });
    },
    signIn: async (email: string, password: string, captchaToken: string | null) => {
      const options = captchaToken ? { captchaToken } : undefined;
      await supabase.auth.signInWithPassword({ email, password, options });
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
    ...authHandlers
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
