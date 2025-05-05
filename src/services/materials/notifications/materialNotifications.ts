
/**
 * Material notification service - provides user feedback for material operations
 */
import { isOffline } from '@/utils/errorHandling/networkChecker';
import { toast } from 'sonner';

/**
 * Display appropriate toast messages based on error type
 */
export function handleMaterialApiError(error: unknown, context: string): void {
  // Clear any existing toasts to prevent duplicates
  toast.dismiss("offline-materials");
  toast.dismiss("no-materials");
  toast.dismiss("materials-error");
  
  if (isOffline()) {
    toast.info("You're offline. Using fallback material data.", {
      id: "offline-materials",
      duration: 3000
    });
    return;
  }
  
  if (error instanceof Error) {
    if (error.message === 'No materials found') {
      toast.warning("No materials found in database. Using default materials.", {
        id: "no-materials",
        duration: 3000
      });
      return;
    }
    
    if (error.message.includes('timed out')) {
      toast.error(`Request timed out when trying to ${context}. Using fallback data.`, {
        id: "materials-error",
        duration: 5000
      });
      return;
    }
    
    if (error.message.includes('Database connection')) {
      toast.error(`Database connection issue. Using fallback material data.`, {
        id: "materials-error",
        duration: 5000
      });
      return;
    }
  }
  
  toast.error(`Failed to ${context}. Using fallback data.`, {
    id: "materials-error",
    duration: 3000
  });
}

/**
 * Handle successful operations with appropriate notifications
 */
export function handleMaterialSuccess(action: string, count: number): void {
  toast.success(`Successfully ${action} ${count} materials.`, {
    id: "materials-success",
    duration: 3000
  });
}
