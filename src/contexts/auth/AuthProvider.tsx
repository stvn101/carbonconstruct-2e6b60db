
import { createContext, useContext, ReactNode, useEffect } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './hooks/useAuthState';
import { useAuthHandlers } from './hooks/useAuthHandlers';
import { useAuthEffects } from './hooks/useAuthEffects';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';
import { addNetworkListeners } from '@/utils/errorHandling';
import { toast } from 'sonner';

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

  // Add network status monitoring
  useEffect(() => {
    const cleanupNetworkListeners = addNetworkListeners(
      // Offline callback
      () => {
        toast.error("You're offline. Authentication services may be limited.", {
          id: "auth-offline-warning",
          duration: 0
        });
      },
      // Online callback
      () => {
        toast.success("You're back online. All authentication services available.", {
          id: "auth-online-notice"
        });
        // Refresh the session when coming back online
        if (state.user) {
          supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
              updateState({
                session: data.session,
                user: data.session.user
              });
            }
          });
        }
      }
    );

    return cleanupNetworkListeners;
  }, [state.user, updateState]);

  const contextValue: AuthContextType = {
    ...state,
    signUp: async (email: string, password: string, captchaToken: string | null) => {
      try {
        const options = captchaToken ? { captchaToken } : undefined;
        const { error } = await supabase.auth.signUp({ email, password, options });
        if (error) throw error;
      } catch (error: any) {
        console.error("Sign up error:", error.message);
        throw error;
      }
    },
    signIn: async (email: string, password: string, captchaToken: string | null) => {
      try {
        const options = captchaToken ? { captchaToken } : undefined;
        const { error } = await supabase.auth.signInWithPassword({ email, password, options });
        if (error) throw error;
      } catch (error: any) {
        console.error("Sign in error:", error.message);
        throw error;
      }
    },
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error: any) {
        console.error("Sign out error:", error.message);
        throw error;
      }
    },
    ...authHandlers
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
