
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface GrokChatErrorProps {
  error: string | null;
}

const GrokChatError: React.FC<GrokChatErrorProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-2">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default GrokChatError;
