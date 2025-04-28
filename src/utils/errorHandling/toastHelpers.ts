import { toast } from "sonner";

// Keep track of shown error toasts to prevent duplicates
export const shownErrorToasts = new Set<string>();
// Toast cooldowns to prevent spam
const toastCooldowns: Record<string, number> = {};
// Minimum time between similar toasts (20 seconds)
export const TOAST_COOLDOWN = 20000;

/**
 * Clear specific error toasts with improved cleanup
 */
export const clearErrorToasts = (toastIds: string[]): void => {
  toastIds.forEach(id => {
    toast.dismiss(id);
    shownErrorToasts.delete(id);
    delete toastCooldowns[id];
  });
};

/**
 * Clear all error toasts
 */
export const clearAllErrorToasts = (): void => {
  toast.dismiss();
  shownErrorToasts.clear();
  Object.keys(toastCooldowns).forEach(key => delete toastCooldowns[key]);
};

/**
 * Show an error toast with deduplication and cooldown
 */
export const showErrorToast = (
  message: string, 
  id: string, 
  options: { 
    duration?: number,
    persistent?: boolean 
  } = {}
): void => {
  // Skip if message is empty (used to dismiss toasts)
  if (!message) {
    toast.dismiss(id);
    return;
  }

  const now = Date.now();
  
  // Skip if we've shown this recently
  if (shownErrorToasts.has(id) && 
      toastCooldowns[id] && 
      now - toastCooldowns[id] < TOAST_COOLDOWN) {
    return;
  }
  
  // Show the toast
  toast.error(message, {
    id,
    duration: options.persistent ? 0 : (options.duration || 5000)
  });
  
  // Track that we've shown this toast
  shownErrorToasts.add(id);
  toastCooldowns[id] = now;
  
  // Auto-cleanup for non-persistent toasts
  if (!options.persistent) {
    setTimeout(() => {
      shownErrorToasts.delete(id);
    }, TOAST_COOLDOWN + 5000);
  }
};

/**
 * Show a success toast with deduplication
 */
export const showSuccessToast = (
  message: string, 
  id: string, 
  duration: number = 3000
): void => {
  const now = Date.now();
  
  // Skip if we've shown this recently
  if (shownErrorToasts.has(id) && 
      toastCooldowns[id] && 
      now - toastCooldowns[id] < TOAST_COOLDOWN) {
    return;
  }
  
  toast.success(message, {
    id,
    duration
  });
  
  // Track that we've shown this toast
  shownErrorToasts.add(id);
  toastCooldowns[id] = now;
  
  // Auto-cleanup
  setTimeout(() => {
    shownErrorToasts.delete(id);
  }, TOAST_COOLDOWN);
};
