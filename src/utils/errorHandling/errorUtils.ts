
/**
 * Common utility functions for error handling
 */

/**
 * Determine if an error can be safely ignored
 * @param error The error to check
 * @returns Boolean indicating if the error can be ignored
 */
export function shouldIgnoreError(error: Error): boolean {
  // List of error patterns that can be safely ignored
  const ignorePatterns = [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    'Aborted by user',
    'Event handled by user',
    'Network request canceled',
    'Load canceled',
    'cancelled by user',
    'AbortError',
    // Auth related errors that are handled elsewhere
    'User cancelled login',
    'Authentication was canceled',
  ];

  if (!error || !error.message) return false;
  
  return ignorePatterns.some(pattern => 
    error.message.toLowerCase().includes(pattern.toLowerCase())
  );
}

/**
 * Extract meaningful information from an error
 * @param error The error to process
 * @returns An object with extracted error details
 */
export function extractErrorDetails(error: unknown): {
  message: string;
  name: string;
  stack?: string;
  code?: string | number;
  isNetworkError: boolean;
} {
  if (!error) {
    return {
      message: 'Unknown error occurred',
      name: 'UnknownError',
      isNetworkError: false
    };
  }
  
  // Handle error objects
  if (error instanceof Error) {
    const networkError = isNetworkError(error);
    
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: (error as any).code || (error as any).status || (error as any).statusCode,
      isNetworkError: networkError
    };
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
      name: 'StringError',
      isNetworkError: error.toLowerCase().includes('network') || 
                     error.toLowerCase().includes('connection') ||
                     error.toLowerCase().includes('offline')
    };
  }
  
  // Handle objects and other values
  try {
    const errorString = JSON.stringify(error);
    return {
      message: errorString,
      name: 'ObjectError',
      isNetworkError: errorString.toLowerCase().includes('network') || 
                      errorString.toLowerCase().includes('connection') ||
                      errorString.toLowerCase().includes('offline')
    };
  } catch (e) {
    return {
      message: 'Error could not be serialized',
      name: 'UnprocessableError',
      isNetworkError: false
    };
  }
}

/**
 * Determine if an error is related to network connectivity
 */
export function isNetworkError(error: Error | unknown): boolean {
  if (!error) return false;
  
  const errorString = error instanceof Error ? error.message.toLowerCase() : 
    typeof error === 'string' ? error.toLowerCase() : 
    String(error).toLowerCase();
  
  return errorString.includes('network') ||
    errorString.includes('failed to fetch') ||
    errorString.includes('offline') ||
    errorString.includes('connection') ||
    errorString.includes('internet') ||
    errorString.includes('timeout') ||
    errorString.includes('econnrefused') ||
    errorString.includes('enotfound');
}
