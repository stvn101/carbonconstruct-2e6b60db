import { toast } from 'sonner';
import { handleNetworkError } from './networkErrorHandler';
import { withTimeout, retryWithBackoff } from './timeoutHelper';
import { showErrorToast } from './toastHelpers';

// Keep track of shown errors related to Grok AI
const shownGrokErrors = new Set<string>();
// Grok-specific cooldown period (in milliseconds)
const GROK_ERROR_COOLDOWN = 60000; // 60 seconds
// Track last error time
const lastGrokErrorTime: Record<string, number> = {};

interface GrokAPIErrorOptions {
  retryCount?: number;
  timeout?: number;
  showToast?: boolean;
  context?: string;
}

/**
 * Specialized error handler for Grok API calls
 */
export const handleGrokAPIError = (error: unknown, options: GrokAPIErrorOptions = {}): Error => {
  const { retryCount = 0, showToast = true, context = "grok-api" } = options;
  const now = Date.now();
  
  // Create a normalized error object
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  // Parse error message to determine specific error types
  const errorMessage = errorObj.message.toLowerCase();
  
  // Handle rate limit errors
  if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests') || errorMessage.includes('429')) {
    const errorId = `grok-rate-limit`;
    
    if (showToast && (!lastGrokErrorTime[errorId] || now - lastGrokErrorTime[errorId] > GROK_ERROR_COOLDOWN)) {
      showErrorToast(
        "Grok AI rate limit reached. Please try again in a few minutes.", 
        errorId,
        { duration: 8000 }
      );
      
      lastGrokErrorTime[errorId] = now;
    }
    
    return new Error(`Rate limit exceeded for Grok API: ${errorObj.message}`);
  }
  
  // Handle authentication errors
  if (errorMessage.includes('authentication') || errorMessage.includes('unauthorized') || errorMessage.includes('invalid key') || errorMessage.includes('401')) {
    const errorId = `grok-auth`;
    
    if (showToast && (!lastGrokErrorTime[errorId] || now - lastGrokErrorTime[errorId] > GROK_ERROR_COOLDOWN)) {
      showErrorToast(
        "Grok AI authentication failed. Please check your API key configuration.", 
        errorId,
        { duration: 8000 }
      );
      
      lastGrokErrorTime[errorId] = now;
    }
    
    return new Error(`Authentication failed for Grok API: ${errorObj.message}`);
  }
  
  // Handle model errors
  if (errorMessage.includes('model') && (errorMessage.includes('not found') || errorMessage.includes('unavailable'))) {
    const errorId = `grok-model`;
    
    if (showToast && (!lastGrokErrorTime[errorId] || now - lastGrokErrorTime[errorId] > GROK_ERROR_COOLDOWN)) {
      showErrorToast(
        "Grok AI model unavailable. The system will use fallback options.", 
        errorId,
        { duration: 5000 }
      );
      
      lastGrokErrorTime[errorId] = now;
    }
    
    return new Error(`Model issue with Grok API: ${errorObj.message}`);
  }
  
  // Handle quota errors
  if (errorMessage.includes('quota') || errorMessage.includes('credits') || errorMessage.includes('billing')) {
    const errorId = `grok-quota`;
    
    if (showToast && (!lastGrokErrorTime[errorId] || now - lastGrokErrorTime[errorId] > GROK_ERROR_COOLDOWN)) {
      showErrorToast(
        "Grok AI quota exceeded. Please check your subscription or try again later.", 
        errorId,
        { duration: 8000 }
      );
      
      lastGrokErrorTime[errorId] = now;
    }
    
    return new Error(`Quota exceeded for Grok API: ${errorObj.message}`);
  }
  
  // For other errors, use the general network error handler
  return handleNetworkError(error, `grok-${context}`);
};

/**
 * Enhanced wrapper for Grok API calls with advanced error handling, retries and fallbacks
 */
export async function withGrokErrorHandling<T>(
  promise: Promise<T>, 
  options: {
    timeout?: number,
    maxRetries?: number,
    context?: string,
    showToast?: boolean,
    onRetry?: (attempt: number) => void,
    fallback?: () => Promise<T> | T
  } = {}
): Promise<T> {
  const {
    timeout = 30000,
    maxRetries = 2,
    context = "api-call",
    showToast = true,
    onRetry,
    fallback
  } = options;
  
  let retryCount = 0;
  
  try {
    // First try with timeout
    return await withTimeout(promise, timeout);
  } catch (error) {
    // Track retry attempts
    retryCount++;
    
    // Always process the error for tracking and notification
    handleGrokAPIError(error, {
      retryCount,
      showToast,
      context
    });
    
    // Try retrying with backoff for certain errors
    const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
    
    if (
      errorMessage.includes('network') || 
      errorMessage.includes('timeout') || 
      errorMessage.includes('failed to fetch') ||
      (errorMessage.includes('rate limit') && retryCount <= maxRetries)
    ) {
      try {
        return await retryWithBackoff(
          () => {
            // Notify about retry if callback provided
            if (onRetry) onRetry(retryCount);
            return promise;
          }, 
          maxRetries
        );
      } catch (retryError) {
        // If retry also fails and we have a fallback, use it
        if (fallback) {
          if (showToast) {
            toast.info("Using offline mode for this request. Some features may be limited.");
          }
          return await fallback();
        }
        
        // Otherwise rethrow
        throw retryError;
      }
    }
    
    // For other errors, check if we have a fallback
    if (fallback) {
      if (showToast) {
        toast.info("Using offline mode for this request. Some features may be limited.");
      }
      return await fallback();
    }
    
    // If no fallback, rethrow the original error
    throw error;
  }
}
