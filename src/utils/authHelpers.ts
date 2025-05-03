
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

/**
 * Validates if a password meets the strength requirements based on NCC 2025 security standards
 */
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 10) {
    return { valid: false, message: 'Password must be at least 10 characters' };
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
  
  // Check for consecutive repeated characters (not more than 2 identical consecutive characters)
  if (/(.)\1\1/.test(password)) {
    return { valid: false, message: 'Password must not contain more than 2 identical consecutive characters' };
  }
  
  // Check for common patterns
  const commonPatterns = [
    '123456', 'password', 'qwerty', 'admin', 'welcome', 
    'abc123', '111111', '123123', 'dragon', 'baseball'
  ];
  
  const lowercasePassword = password.toLowerCase();
  for (const pattern of commonPatterns) {
    if (lowercasePassword.includes(pattern)) {
      return { valid: false, message: 'Password contains a common pattern and is too predictable' };
    }
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
  
  // NCC 2025 compliance - security through obscurity
  if (errorMessage.includes('password') || errorMessage.includes('auth')) {
    return 'Authentication failed. Please check your credentials and try again.';
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

/**
 * Validates the strength of a password and returns a score from 0-4
 * 0 = Very Weak, 1 = Weak, 2 = Medium, 3 = Strong, 4 = Very Strong
 */
export const getPasswordStrength = (password: string): { score: number; label: string } => {
  let score = 0;
  
  if (password.length >= 10) score += 1;
  if (password.length >= 12) score += 0.5;
  if (password.length >= 14) score += 0.5;
  
  if (/[A-Z]/.test(password)) score += 0.5;
  if (/[a-z]/.test(password)) score += 0.5;
  if (/[0-9]/.test(password)) score += 0.5;
  if (/[^A-Za-z0-9]/.test(password)) score += 0.5;
  
  // Additional points for complexity
  if (/[A-Z].*[A-Z]/.test(password)) score += 0.5; // At least 2 uppercase
  if (/[^A-Za-z0-9].*[^A-Za-z0-9]/.test(password)) score += 0.5; // At least 2 special chars
  
  // Deduct for patterns
  if (/(.)\1\1/.test(password)) score -= 1; // Repeated characters
  if (/123|abc|qwerty|password|admin/i.test(password)) score -= 1; // Common patterns
  
  // Cap the score between 0 and 4
  score = Math.max(0, Math.min(4, score));
  
  const labels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  return { score, label: labels[Math.floor(score)] };
};
