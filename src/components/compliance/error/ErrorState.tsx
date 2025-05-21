
import React from "react";
import { AlertCircle, Wifi, ServerCrash, Clock } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  // Determine error type to show appropriate icon and message
  const isNetworkError = error.toLowerCase().includes('network') || 
    error.toLowerCase().includes('connection') ||
    error.toLowerCase().includes('offline') ||
    error.toLowerCase().includes('failed to fetch');
  
  const isServerError = error.toLowerCase().includes('server') || 
    error.toLowerCase().includes('500') ||
    error.toLowerCase().includes('unavailable');
    
  const isTimeoutError = error.toLowerCase().includes('timeout') || 
    error.toLowerCase().includes('timed out');
    
  const getErrorIcon = () => {
    if (isNetworkError) return <Wifi className="h-4 w-4" />;
    if (isServerError) return <ServerCrash className="h-4 w-4" />;
    if (isTimeoutError) return <Clock className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };
  
  const getErrorTitle = () => {
    if (isNetworkError) return "Network Connection Issue";
    if (isServerError) return "Server Error";
    if (isTimeoutError) return "Request Timed Out";
    return "Compliance Check Failed";
  };
  
  const getErrorDescription = () => {
    if (isNetworkError) {
      return "Unable to connect to the server. Please check your internet connection.";
    }
    if (isServerError) {
      return "Our servers are experiencing issues. We're working to resolve this.";
    }
    if (isTimeoutError) {
      return "The request took too long to complete. Please try again.";
    }
    return error || "An unexpected error occurred while checking compliance.";
  };
  
  return (
    <Alert variant="destructive">
      {getErrorIcon()}
      <AlertTitle className="text-sm sm:text-base">{getErrorTitle()}</AlertTitle>
      <AlertDescription className="text-xs sm:text-sm">
        {getErrorDescription()}
        <div className="mt-2">
          <Button variant="outline" size="sm" onClick={onRetry} className="w-full sm:w-auto">
            Retry Check
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorState;
