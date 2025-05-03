
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

/**
 * Validates if a password meets the strength requirements
 */
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  // Check for at least one special character
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true, message: 'Password meets all requirements' };
};

/**
 * Handles authentication errors in a consistent way
 */
export const handleAuthError = (error: unknown): string => {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  
  // Map common error messages to user-friendly messages
  if (errorMessage.includes('Email not confirmed')) {
    toast.error('Please verify your email address before signing in', { id: 'email-verification' });
    return 'Please check your inbox for the verification link';
  }
  
  if (errorMessage.includes('Invalid login credentials')) {
    return 'Invalid email or password';
  }
  
  if (errorMessage.includes('User already registered')) {
    return 'This email is already registered';
  }
  
  if (errorMessage.includes('network')) {
    toast.error('Network error. Please check your connection', { id: 'network-error' });
    return 'Could not connect to authentication service';
  }
  
  return errorMessage;
};

/**
 * Refreshes the session token when needed
 */
export const refreshSession = async (): Promise<Session | null> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Failed to refresh session:', error);
    return null;
  }
};

/**
 * Check if the user has the specified role
 * This is a placeholder function - implement actual role checking logic
 * based on your user roles design
 */
export const hasRole = async (userId: string, role: string): Promise<boolean> => {
  try {
    // This would need to be implemented based on your role management system
    // For example, querying a user_roles table
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data?.role === role;
  } catch (error) {
    console.error('Failed to check user role:', error);
    return false;
  }
};
