
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="text-sm sm:text-base">Compliance Check Failed</AlertTitle>
      <AlertDescription className="text-xs sm:text-sm">
        {error}
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
