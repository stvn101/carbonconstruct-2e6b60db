
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { ThemeProvider } from "./components/ThemeProvider";
import { AppContent } from "./components/AppContent";
import { AuthProvider } from "./contexts/auth";
import { Toaster } from "./components/ui/sonner";
import { LoggingProvider } from "./contexts/logging";
import { RegionProvider } from "./contexts/RegionContext";
import { toast } from "sonner";

import "./App.css";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Global error fallback to be shown when app fails
const GlobalErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-red-200 dark:border-red-900">
      <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
        Application Error
      </h2>
      <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-800">
        <p className="text-sm text-gray-800 dark:text-gray-200">
          {error.message || "Something went wrong loading the application."}
        </p>
      </div>
      <div className="flex flex-col space-y-2">
        <button
          onClick={resetErrorBoundary}
          className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded"
        >
          Refresh Page
        </button>
      </div>
    </div>
  </div>
);

// Log errors from the error boundary
const onErrorHandler = (error: Error, info: { componentStack: string }) => {
  console.error("Error caught by App ErrorBoundary:", error);
  console.error("Component stack:", info.componentStack);
  
  // Show toast notification
  toast.error("An unexpected error occurred", {
    description: "The application encountered a problem. Please try again.",
  });
};

function App() {
  console.log("Rendering App component");
  
  return (
    <ErrorBoundary 
      FallbackComponent={GlobalErrorFallback}
      onError={onErrorHandler}
    >
      <HelmetProvider>
        <ThemeProvider>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <LoggingProvider>
                <AuthProvider>
                  <RegionProvider>
                    <AppContent />
                    <Toaster position="top-right" richColors closeButton />
                  </RegionProvider>
                </AuthProvider>
              </LoggingProvider>
            </QueryClientProvider>
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
