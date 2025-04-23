
import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  feature: string;
}

const ErrorFallback = ({ error, resetErrorBoundary, feature }: ErrorFallbackProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center dark:bg-red-900/30">
        <AlertTriangle
          className="h-8 w-8 text-red-600 dark:text-red-400"
          aria-hidden="true"
        />
      </div>
      <h2 className="text-2xl font-bold mb-2 dark:text-carbon-50">
        {feature} Error
      </h2>
      <p className="text-gray-600 dark:text-carbon-200 mb-6 max-w-md">
        Sorry, something went wrong while loading this feature.
      </p>
      <div className="space-x-2">
        <Button
          variant="default"
          onClick={resetErrorBoundary}
          className="flex items-center gap-2 bg-carbon-600 hover:bg-carbon-700 text-white"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 border-carbon-300 dark:border-carbon-700 dark:text-carbon-200"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Button>
      </div>
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-md max-w-lg overflow-auto text-left">
        <p className="text-sm font-medium text-gray-700 dark:text-carbon-300 mb-2">
          Error details (for developers):
        </p>
        <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap break-all">
          {error.message}
        </pre>
      </div>
    </div>
  );
};

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
  feature: string;
}

const ErrorBoundaryWrapper = ({ children, feature }: ErrorBoundaryWrapperProps) => {
  return (
    <ErrorBoundary 
      feature={feature}
      fallback={({ error, resetErrorBoundary }) => (
        <ErrorFallback 
          error={error} 
          resetErrorBoundary={resetErrorBoundary} 
          feature={feature} 
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
