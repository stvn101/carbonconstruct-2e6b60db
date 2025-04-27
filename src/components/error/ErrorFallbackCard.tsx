
import React from 'react';
import { WifiOff, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ErrorFallbackCardProps {
  error: Error;
  isNetworkError: boolean;
  isChecking: boolean;
  onReset: () => void;
}

const ErrorFallbackCard: React.FC<ErrorFallbackCardProps> = ({
  error,
  isNetworkError,
  isChecking,
  onReset
}) => {
  return (
    <Card className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md text-center">
      <div className="flex flex-col items-center p-2">
        {isNetworkError ? (
          <WifiOff className="h-10 w-10 text-red-600 mb-2" aria-hidden="true" />
        ) : (
          <AlertTriangle className="h-10 w-10 text-red-600 mb-2" aria-hidden="true" />
        )}
        
        <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
          {isNetworkError ? "Connection Error" : 'Something went wrong'}
        </h3>
        
        <p className="mt-2 text-red-700 dark:text-red-400 text-sm">
          {isNetworkError
            ? "There was a problem connecting to the server. Please check your internet connection."
            : error?.message || "An unexpected error occurred."}
        </p>
        
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
      </div>
    </Card>
  );
};

export default ErrorFallbackCard;
