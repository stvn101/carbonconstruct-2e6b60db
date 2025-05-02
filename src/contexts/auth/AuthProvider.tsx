
import { createContext, useContext, ReactNode, useEffect } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './hooks/useAuthState';
import { useAuthHandlers } from './hooks/useAuthHandlers';
import { useAuthEffects } from './hooks/useAuthEffects';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';
import { toast } from 'sonner';
import { useSimpleOfflineMode } from '@/hooks/useSimpleOfflineMode';

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
  const { isOffline, checkConnection } = useSimpleOfflineMode();

  // Monitor offline status for auth
  useEffect(() => {
    if (isOffline && state.user) {
      toast.info("You're offline. Authentication state will be maintained, but some actions may be limited.", {
        id: "auth-offline-info",
        duration: 5000
      });
    }
  }, [isOffline, state.user]);
  
  // Refresh session when coming back online
  useEffect(() => {
    if (!isOffline && state.user) {
      const refreshSession = async () => {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            updateState({
              session: data.session,
              user: data.session.user
            });
          }
        } catch (error) {
          console.error("Error refreshing session:", error);
        }
      };
      
      refreshSession();
    }
  }, [isOffline, state.user, updateState]);

  const contextValue: AuthContextType = {
    ...state,
    signUp: async (email: string, password: string, captchaToken: string | null) => {
      try {
        if (isOffline) {
          toast.error("Cannot sign up while offline. Please check your connection.", {
            id: "offline-signup-error"
          });
          throw new Error("Network unavailable");
        }
        
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
        if (isOffline) {
          toast.error("Cannot sign in while offline. Please check your connection.", {
            id: "offline-signin-error"
          });
          throw new Error("Network unavailable");
        }
        
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
        if (isOffline) {
          toast.warning("You're offline. You'll be signed out locally but server session may remain active.", {
            id: "offline-signout-warning"
          });
          
          // We can at least clear local storage
          localStorage.removeItem('supabase.auth.token');
          updateState({
            user: null,
            session: null,
            profile: null
          });
          return;
        }
        
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
