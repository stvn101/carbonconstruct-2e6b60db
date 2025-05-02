
import { toast } from "sonner";

/**
 * Simple toast error handler without complex deduplication or cooldowns
 */
export function showErrorToast(message: string, duration: number = 5000): void {
  if (!message) return;
  
  toast.error(message, { duration });
}

/**
 * Show a success toast message
 */
export function showSuccessToast(message: string, duration: number = 3000): void {
  if (!message) return;
  
  toast.success(message, { duration });
}

/**
 * Simple network error handler
 */
export function handleNetworkError(error: unknown, context: string = ''): Error {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const message = errorObj.message;
  
  if (message.includes('Failed to fetch') || message.includes('NetworkError') || !navigator.onLine) {
    showErrorToast("Network connection issue. Please check your internet connection.");
  } else if (message.includes('timeout') || message.includes('timed out')) {
    showErrorToast("Request timed out. Please try again.");
  } else {
    showErrorToast(`An error occurred${context ? ' during ' + context : ''}. Please try again later.`);
  }
  
  console.error(`Error${context ? ' in ' + context : ''}: ${message}`);
  return errorObj;
}
