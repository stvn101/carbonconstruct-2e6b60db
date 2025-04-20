
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
  signUp: async () => ({}),
  signIn: async () => ({}),
  signOut: async () => {},
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  signInWithGitHub: async () => {},
  updateProfile: async () => {},
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
    signUp: (email: string, password: string, captchaToken: string | null) => {
      const options = captchaToken ? { captchaToken } : undefined;
      return supabase.auth.signUp({ email, password, options });
    },
    signIn: (email: string, password: string, captchaToken: string | null) => {
      const options = captchaToken ? { captchaToken } : undefined;
      return supabase.auth.signInWithPassword({ email, password, options });
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
