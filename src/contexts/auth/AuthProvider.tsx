
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';
import { AuthContextType, AuthState } from './types';
import { 
  fetchUserProfile,
  loginWithPassword,
  registerUser,
  signInWithGitHubOAuth,
  updateUserProfile,
  logoutUser
} from '@/services/authService';
import { toast } from 'sonner';

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
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    isLoading: true
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setState(prev => ({
          ...prev,
          session: session,
          user: session?.user ?? null
        }));
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id).then((profile) => {
              setState(prev => ({ ...prev, profile }));
            });
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setState(prev => ({ ...prev, profile: null }));
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null
      }));
      
      if (session?.user) {
        fetchUserProfile(session.user.id).then((profile) => {
          setState(prev => ({ 
            ...prev, 
            profile,
            loading: false,
            isLoading: false
          }));
        });
      } else {
        setState(prev => ({ ...prev, loading: false, isLoading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, captchaToken: string | null) => {
    const options = captchaToken ? { captchaToken } : undefined;
    
    return await supabase.auth.signUp({
      email,
      password,
      options
    });
  };

  const signIn = async (email: string, password: string, captchaToken: string | null) => {
    const options = captchaToken ? { captchaToken } : undefined;
    
    return await supabase.auth.signInWithPassword({
      email,
      password,
      options
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (error) {
        toast.error(error.message || "Login failed");
        throw error;
      }
      
      toast.success("Signed in successfully!");
    } catch (error: any) {
      console.error("Login error:", error.message);
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error: any) {
      console.error("Logout error:", error.message);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success("Registration successful! Please check your email to verify your account.");
    } catch (error: any) {
      console.error("Registration error:", error.message);
      throw error;
    }
  };

  const signInWithGitHub = async () => {
    try {
      await signInWithGitHubOAuth();
    } catch (error: any) {
      console.error("GitHub login error:", error.message);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!state.user) throw new Error("User not authenticated");
      await updateUserProfile(state.user.id, updates);
      
      setState(prev => ({
        ...prev,
        profile: prev.profile ? {...prev.profile, ...updates} : null
      }));
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error.message);
      toast.error("Failed to update profile");
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signOut,
    login,
    logout,
    register,
    signInWithGitHub,
    updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
