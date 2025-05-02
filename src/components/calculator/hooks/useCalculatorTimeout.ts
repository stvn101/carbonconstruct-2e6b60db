
import { useState, useCallback, useEffect } from 'react';

export function useCalculatorTimeout() {
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const clearSaveTimeout = useCallback(() => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
      setSaveTimeout(null);
    }
  }, [saveTimeout]);
  
  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      clearSaveTimeout();
    };
  }, [clearSaveTimeout]);
  
  return {
    saveTimeout,
    setSaveTimeout,
    clearSaveTimeout
  };
}
