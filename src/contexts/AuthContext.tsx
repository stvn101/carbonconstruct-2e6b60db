
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';
import { 
  fetchUserProfile,
  loginWithPassword,
  registerUser,
  signInWithGitHubOAuth,
  updateUserProfile,
  logoutUser
} from '@/services/authService';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, captchaToken: string | null) => Promise<any>;
  signIn: (email: string, password: string, captchaToken: string | null) => Promise<any>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  loading: boolean;
}

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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // If user logged in, fetch their profile
        if (session?.user) {
          // Use setTimeout to prevent potential deadlocks with Supabase auth
          setTimeout(() => {
            fetchUserProfile(session.user.id).then((profile) => {
              setProfile(profile);
            });
          }, 0);
        } else {
          setProfile(null);
        }
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id).then((profile) => {
          setProfile(profile);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, captchaToken: string | null) => {
    // Add the captcha token to the options if provided
    const options = captchaToken ? { captchaToken } : undefined;
    
    return await supabase.auth.signUp({
      email,
      password,
      options
    });
  };

  const signIn = async (email: string, password: string, captchaToken: string | null) => {
    // Add the captcha token to the options if provided
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
  
  // Add these methods to match the expected interface
  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Login error:", error.message);
      throw error;
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
      if (!user) throw new Error("User not authenticated");
      await updateUserProfile(user.id, updates);
      
      // Update the local profile state
      setProfile(prev => prev ? {...prev, ...updates} : null);
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error.message);
      toast.error("Failed to update profile");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session, 
      signUp, 
      signIn, 
      signOut, 
      loading, 
      login, 
      logout, 
      register, 
      signInWithGitHub, 
      updateProfile,
      isLoading: loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
