
/**
 * Check if an error is a network-related error
 * @param error Any error object
 * @returns boolean indicating if the error is network-related
 */
export function isNetworkError(error: unknown): boolean {
  if (!error) return false;
  
  // Check for common network error patterns
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    
    // Network error messages often contain these keywords
    if (
      errorMessage.includes('network') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('offline') ||
      errorMessage.includes('internet') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('failed to fetch') ||
      errorMessage.includes('cors')
    ) {
      return true;
    }
    
    // Check for specific error types
    if (
      error instanceof TypeError || 
      error.name === 'NetworkError' || 
      error.name === 'AbortError'
    ) {
      return true;
    }
  }
  
  // Check for Supabase errors that might be network-related
  if (
    typeof error === 'object' && 
    error !== null && 
    'message' in error && 
    typeof error.message === 'string'
  ) {
    const errorMessage = error.message.toLowerCase();
    
    if (
      errorMessage.includes('network') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('timeout')
    ) {
      return true;
    }
  }
  
  return false;
}
