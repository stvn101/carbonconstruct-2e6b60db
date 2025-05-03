
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';
import { toast } from 'sonner';
import { handleNetworkError, isOffline } from '@/utils/errorHandling';

export const useAuthHandlers = () => {
  const login = async (email: string, password: string) => {
    try {
      if (isOffline()) {
        toast.error("You're offline. Please check your internet connection.", { 
          id: "offline-login-error" 
        });
        throw new Error("Network unavailable");
      }
      
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
      handleNetworkError(error, 'login');
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (isOffline()) {
        toast.error("You're offline. Some changes may not be saved.", {
          id: "offline-logout-warning"
        });
      }
      
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error("Logout error:", error.message);
      handleNetworkError(error, 'logout');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      if (isOffline()) {
        toast.error("You're offline. Please check your internet connection.", { 
          id: "offline-register-error" 
        });
        throw new Error("Network unavailable");
      }
      
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
      handleNetworkError(error, 'register');
      throw error;
    }
  };

  const signInWithGitHub = async () => {
    try {
      if (isOffline()) {
        toast.error("You're offline. Please check your internet connection.", { 
          id: "offline-github-error" 
        });
        throw new Error("Network unavailable");
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("GitHub login error:", error.message);
      handleNetworkError(error, 'github-login');
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (isOffline()) {
        toast.error("You're offline. Please check your internet connection.", { 
          id: "offline-google-error" 
        });
        throw new Error("Network unavailable");
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Google login error:", error.message);
      handleNetworkError(error, 'google-login');
      throw error;
    }
  };

  const updateProfile = async (updatedProfile: UserProfile) => {
    try {
      if (isOffline()) {
        toast.error("You're offline. Profile updates will be saved when you reconnect.", {
          id: "offline-profile-warning",
          duration: 5000
        });
      }
      
      if (!updatedProfile.id) {
        throw new Error('Profile ID is required for updating');
      }
      
      // Make a copy of the profile to avoid mutation issues
      const profileToUpdate = { ...updatedProfile };
      
      // Ensure we don't submit undefined values
      Object.keys(profileToUpdate).forEach(key => {
        if (profileToUpdate[key as keyof UserProfile] === undefined) {
          delete profileToUpdate[key as keyof UserProfile];
        }
      });
      
      const { error } = await supabase
        .from('profiles')
        .update(profileToUpdate)
        .eq('id', profileToUpdate.id);
        
      if (error) throw error;
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error.message);
      handleNetworkError(error, 'profile-update');
      toast.error("Failed to update profile");
      throw error;
    }
  };

  return {
    login,
    logout,
    register,
    signInWithGitHub,
    signInWithGoogle,
    updateProfile
  };
};
