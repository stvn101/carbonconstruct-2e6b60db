
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { checkNetworkStatus } from '@/utils/errorHandling/networkChecker';
import { checkSupabaseConnectionWithRetry } from '@/services/supabase/connection';

export const useErrorBoundary = () => {
  const [isChecking, setIsChecking] = useState(false);

  const handleReset = useCallback(async (resetErrorBoundary: () => void) => {
    setIsChecking(true);
    
    try {
      const isOnline = await checkNetworkStatus();
      
      if (!isOnline) {
        toast.error("You're currently offline. Please check your connection first.", {
          id: "reset-offline-error",
          duration: 5000,
        });
        setIsChecking(false);
        return;
      }
      
      const dbConnected = await checkSupabaseConnectionWithRetry(1, 1500);
      
      if (!dbConnected) {
        toast.error("Cannot connect to the server. Please try again when you have better connectivity.", {
          id: "reset-db-error",
          duration: 5000,
        });
        setIsChecking(false);
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
    } finally {
      setIsChecking(false);
    }
  }, []);

  const handleGoBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleGoHome = useCallback(() => {
    window.location.href = '/';
  }, []);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    isChecking,
    handleReset,
    handleGoBack,
    handleGoHome,
    handleRefresh
  };
};
