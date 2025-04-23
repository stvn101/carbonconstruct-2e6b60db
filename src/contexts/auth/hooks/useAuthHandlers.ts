
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';
import { toast } from 'sonner';

export const useAuthHandlers = () => {
  const login = async (email: string, password: string) => {
    try {
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
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("GitHub login error:", error.message);
      throw error;
    }
  };

  const updateProfile = async (updatedProfile: UserProfile) => {
    try {
      if (!updatedProfile.id) {
        throw new Error('Profile ID is required for updating');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', updatedProfile.id);
        
      if (error) throw error;
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error.message);
      toast.error("Failed to update profile");
      throw error;
    }
  };

  return {
    login,
    logout,
    register,
    signInWithGitHub,
    updateProfile
  };
};
