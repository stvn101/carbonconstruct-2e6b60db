
import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-red-600 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
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
          className="bg-carbon-600 hover:bg-carbon-700 text-white"
        >
          Try Again
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="border-carbon-300 dark:border-carbon-700 dark:text-carbon-200"
        >
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
      fallback={
        <ErrorFallback 
          error={new Error("An error occurred")} 
          resetErrorBoundary={() => {}} 
          feature={feature} 
        />
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
