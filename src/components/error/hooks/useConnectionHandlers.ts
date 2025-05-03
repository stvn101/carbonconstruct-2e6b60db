
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useConnectionHandlers = (resetErrorBoundary: () => void) => {
  const navigate = useNavigate();

  const handleReset = useCallback(() => {
    resetErrorBoundary();
  }, [resetErrorBoundary]);

  const handleGoBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

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
