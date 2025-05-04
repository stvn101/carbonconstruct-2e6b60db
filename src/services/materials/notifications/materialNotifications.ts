
/**
 * User notification utilities for material fetching operations
 */
import { toast } from 'sonner';
import { isOffline } from '@/utils/errorHandling';

/**
 * Display appropriate toast messages based on error type
 */
export function handleMaterialApiError(error: unknown, context: string): void {
  if (isOffline()) {
    toast.info("You're offline. Using fallback material data.", {
      id: "offline-materials",
      duration: 3000
    });
    return;
  }
  
  if (error instanceof Error && error.message === 'No materials found') {
    toast.warning("No materials found in database. Using default materials.", {
      id: "no-materials",
      duration: 3000
    });
    return;
  }
  
  toast.error(`Failed to ${context}. Using fallback data.`, {
    id: "materials-error",
    duration: 3000
  });
}
