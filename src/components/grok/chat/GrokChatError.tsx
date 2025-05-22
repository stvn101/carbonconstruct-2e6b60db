
import React from 'react';
import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { isNetworkError } from '@/utils/errorHandling';

interface GrokChatErrorProps {
  error: string | null;
  isOffline?: boolean;
  onCheckConnection?: () => void;
}

const GrokChatError: React.FC<GrokChatErrorProps> = ({ 
  error,
  isOffline = false,
  onCheckConnection
}) => {
  // No error to display
  if (!error) return null;
  
  // Check if it's a network error
  const isNetworkRelated = isOffline || isNetworkError(error);
  const icon = isNetworkRelated ? WifiOff : AlertCircle;
  
  return (
    <Alert 
      variant={isNetworkRelated ? "warning" : "destructive"} 
      className="w-full mb-3 flex items-center"
    >
      {React.createElement(icon, { className: "h-4 w-4 mr-2" })}
      
      <div className="flex-grow mr-2">
        <AlertDescription className="text-xs sm:text-sm">
          {isNetworkRelated ? 
            "Connection issue. Please check your internet and try again." : 
            error
          }
        </AlertDescription>
      </div>
      
      {isNetworkRelated && onCheckConnection && (
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto flex items-center gap-1 h-7 text-xs" 
          onClick={onCheckConnection}
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </Button>
      )}
    </Alert>
  );
};

export default GrokChatError;
