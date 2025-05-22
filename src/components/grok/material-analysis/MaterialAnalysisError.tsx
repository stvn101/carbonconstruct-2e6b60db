
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MaterialAnalysisErrorProps {
  error: string;
  onDismiss: () => void;
  onRetry: () => void;
}

const MaterialAnalysisError: React.FC<MaterialAnalysisErrorProps> = ({ 
  error, 
  onDismiss, 
  onRetry 
}) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error analyzing materials</AlertTitle>
      <AlertDescription>
        {error}
        <div className="mt-2">
          <Button variant="outline" size="sm" onClick={onDismiss} className="mr-2">
            Dismiss
          </Button>
          <Button variant="default" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default MaterialAnalysisError;
