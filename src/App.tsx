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
import { GrokProvider } from "./contexts/GrokContext";
import { SuspenseBoundary } from "./components/SuspenseBoundary";
import errorTrackingService from "./services/errorTrackingService";

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

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  // Log error to tracking service
  React.useEffect(() => {
    errorTrackingService.captureException(error, {
      source: 'ErrorBoundary',
      component: 'App',
    });
  }, [error]);

  return (
    <div style={{ padding: '20px', margin: '30px auto', maxWidth: '600px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '6px', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ color: '#e11d48', marginTop: 0 }}>Application Error</h2>
      <p style={{ color: '#9f1239' }}>We're sorry, but something went wrong.</p>
      <p style={{ color: '#9f1239' }}>Please try reloading the page. If the problem persists, contact support.</p>
      <button 
        onClick={resetErrorBoundary}
        style={{ background: '#e11d48', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
      >
        Reload Page
      </button>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ErrorBoundary 
          FallbackComponent={ErrorFallback}
          onReset={() => {
            // Reset the state of your app here
            window.location.reload();
          }}
        >
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <LoggingProvider>
                <AuthProvider>
                  <RegionProvider>
                    <GrokProvider>
                      <SuspenseBoundary>
                        <AppContent />
                      </SuspenseBoundary>
                      <Toaster position="top-right" richColors closeButton />
                    </GrokProvider>
                  </RegionProvider>
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
