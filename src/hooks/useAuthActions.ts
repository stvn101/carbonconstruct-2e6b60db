
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleAuthError, validatePassword } from '@/utils/authHelpers';

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Validate password strength client-side
      const { valid, message } = validatePassword(password);
      if (!valid) {
        setErrorMessage(message);
        return { error: message, success: false };
      }
      
      // Attempt registration
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success("Registration successful! Check your email for verification instructions.");
        return { user: data.user, success: true };
      } else {
        throw new Error("User registration failed");
      }
    } catch (error) {
      const message = handleAuthError(error);
      setErrorMessage(message);
      return { error: message, success: false };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success(`Welcome back${data.user?.user_metadata?.full_name ? `, ${data.user.user_metadata.full_name}` : ''}!`);
      return { session: data.session, user: data.user, success: true };
    } catch (error) {
      const message = handleAuthError(error);
      setErrorMessage(message);
      return { error: message, success: false };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Sign out the current user
   */
  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("You have been logged out successfully");
      return { success: true };
    } catch (error) {
      const message = handleAuthError(error);
      setErrorMessage(message);
      return { error: message, success: false };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Reset password for a user
   */
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset instructions sent to your email");
      return { success: true };
    } catch (error) {
      const message = handleAuthError(error);
      setErrorMessage(message);
      return { error: message, success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    isLoading,
    errorMessage
  };
}
