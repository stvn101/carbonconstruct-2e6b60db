
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, WifiOff, RefreshCw } from 'lucide-react';

interface ErrorFallbackCardProps {
  error: Error;
  isNetworkError: boolean;
  isChecking: boolean;
  onReset: () => void;
  hasExceededRetries?: boolean;
}

const ErrorFallbackCard: React.FC<ErrorFallbackCardProps> = ({
  error,
  isNetworkError,
  isChecking,
  onReset,
  hasExceededRetries = false
}) => {
  return (
    <Card className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md text-center">
      <div className="flex flex-col items-center p-2">
        <div className="mb-4 text-red-500 dark:text-red-400">
          {isNetworkError ? (
            <WifiOff size={24} className="mx-auto" />
          ) : (
            <AlertTriangle size={24} className="mx-auto" />
          )}
        </div>
        
        <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
          {isNetworkError 
            ? "Connection Issue" 
            : "Something went wrong"}
        </h3>
        
        <p className="text-sm text-red-700 dark:text-red-400 mb-4">
          {isNetworkError 
            ? "We're having trouble connecting to our servers. Please check your internet connection and try again."
            : "We apologize for the inconvenience. This section encountered an error."}
        </p>
        
        {!hasExceededRetries ? (
          <Button 
            onClick={onReset} 
            variant="destructive"
            disabled={isChecking}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking Connection...' : 'Try Again'}
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-red-700 dark:text-red-400">
              Too many retry attempts. Please reload the page.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </Button>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-24">
          {error.message}
        </div>
      </div>
    </Card>
  );
};

export default ErrorFallbackCard;
