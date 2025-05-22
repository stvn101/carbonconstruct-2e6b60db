
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

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <LoggingProvider>
                <AuthProvider>
                  <AppContent />
                  <Toaster position="top-right" richColors closeButton />
                </AuthProvider>
              </LoggingProvider>
            </QueryClientProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
