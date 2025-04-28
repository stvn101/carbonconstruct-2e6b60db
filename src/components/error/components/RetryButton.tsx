
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RetryButtonProps {
  onReset: () => void;
  isChecking: boolean;
}

export const RetryButton: React.FC<RetryButtonProps> = ({ onReset, isChecking }) => {
  return (
    <Button 
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      onClick={onReset}
      disabled={isChecking}
    >
      {isChecking ? (
        <>
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Checking Connection...
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </>
      )}
    </Button>
  );
};
