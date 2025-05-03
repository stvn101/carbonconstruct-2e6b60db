
import { useCallback } from 'react';
import { checkNetworkStatus } from '@/utils/errorHandling/networkChecker';
import { checkSupabaseConnectionWithRetry } from '@/services/supabase/connection';
import { toast } from 'sonner';

export const useConnectionHandlers = (resetErrorBoundary: () => void) => {
  const handleReset = useCallback(async () => {
    try {
      const isOnline = await checkNetworkStatus();
      
      if (!isOnline) {
        toast.error("You're currently offline. Please check your connection first.", {
          id: "reset-offline-error",
          duration: 5000,
        });
        return;
      }
      
      const dbConnected = await checkSupabaseConnectionWithRetry(1, 1500);
      
      if (!dbConnected) {
        toast.error("Cannot connect to the server. Please try again when you have better connectivity.", {
          id: "reset-db-error",
          duration: 5000,
        });
        return;
      }
      
      resetErrorBoundary();
    } catch (error) {
      console.error("Error while checking connection:", error);
      
      toast.warning("Connection check failed, but attempting recovery anyway", {
        id: "reset-warning",
        duration: 3000,
      });
      
      resetErrorBoundary();
    }
  }, [resetErrorBoundary]);

  const handleGoBack = useCallback(() => {
    window.history.back();
    resetErrorBoundary();
  }, [resetErrorBoundary]);

  const handleGoHome = useCallback(() => {
    window.location.href = '/';
  }, []);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    handleReset,
    handleGoBack,
    handleGoHome,
    handleRefresh
  };
};
