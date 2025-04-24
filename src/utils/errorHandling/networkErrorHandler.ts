import { toast } from "sonner";
import errorTrackingService from "@/services/error/errorTrackingService";

// Keep track of shown error toasts to prevent duplicates
const shownErrorToasts = new Set<string>();
// Cooldown timers for specific types of toasts
const toastCooldowns: Record<string, number> = {};
// Global minimum delay between similar toasts (5 seconds)
const TOAST_COOLDOWN = 5000;

/**
 * Handles network-related errors with better user feedback
 */
export const handleNetworkError = (error: unknown, context: string): Error => {
  // Network connectivity errors
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    console.error(`Network error in ${context}:`, error);
    
    const toastId = `network-error-${context}`;
    const now = Date.now();
    
    // Prevent showing duplicate toasts within cooldown period
    if (!shownErrorToasts.has(toastId) && 
        (!toastCooldowns[toastId] || now - toastCooldowns[toastId] > TOAST_COOLDOWN)) {
      
      // Check if error is due to insufficient resources
      if (error.message.includes('INSUFFICIENT_RESOURCES')) {
        toast.error("Database resource limit reached. Some features may be unavailable.", {
          id: `resource-error-${context}`,
          duration: 10000,
        });
      } else {
        toast.error("Network connection issue. Please check your internet connection.", {
          id: toastId,
          duration: 5000,
        });
      }
      
      // Track that we've shown this toast and update cooldown
      shownErrorToasts.add(toastId);
      toastCooldowns[toastId] = now;
      
      // Remove from tracking after a reasonable time
      setTimeout(() => {
        shownErrorToasts.delete(toastId);
      }, 10000);
    }
    
    return new Error(`Network connectivity error in ${context}`);
  }
  
  // Timeout errors
  if (error instanceof Error && error.message.includes('timed out')) {
    console.error(`Timeout error in ${context}:`, error);
    
    const toastId = `timeout-error-${context}`;
    const now = Date.now();
    
    if (!shownErrorToasts.has(toastId) && 
        (!toastCooldowns[toastId] || now - toastCooldowns[toastId] > TOAST_COOLDOWN)) {
      
      toast.error("Request timed out. Please try again when you have a better connection.", {
        id: toastId,
        duration: 5000,
      });
      
      shownErrorToasts.add(toastId);
      toastCooldowns[toastId] = now;
      
      setTimeout(() => {
        shownErrorToasts.delete(toastId);
      }, 10000);
    }
    
    return new Error(`Operation timed out in ${context}`);
  }
  
  // General error handling
  const actualError = error instanceof Error ? error : new Error(`Unknown error in ${context}`);
  
  // Log the error for tracking
  errorTrackingService.captureException(actualError, { context });
  
  return actualError;
};
