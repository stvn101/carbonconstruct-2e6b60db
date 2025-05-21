
/**
 * Notifications related to material service
 */
import { toast } from 'sonner';
import { isOffline } from '@/utils/errorHandling/networkChecker';

/**
 * Handle material API errors with appropriate notifications
 */
export function handleMaterialApiError(error: unknown, context: string): void {
  if (isOffline()) {
    toast.info("You're offline. Using fallback material data.", {
      id: "offline-materials",
      duration: 3000
    });
    return;
  }
  
  if (error instanceof Error) {
    if (error.message?.includes('No materials found')) {
      toast.warning("No materials found in database. Using default materials.", {
        id: "no-materials",
        duration: 3000
      });
      return;
    }
  }
  
  toast.error(`Failed to ${context}. Using fallback data.`, {
    id: "materials-error",
    duration: 3000
  });
}
