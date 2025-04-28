
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { RegionProvider } from './contexts/RegionContext';
import { AuthProvider } from './contexts/auth';
import { ProjectProvider } from './contexts/ProjectContext';
import { CalculatorProvider } from './contexts/calculator';
import { NetworkProvider } from './contexts/network/NetworkContext';
import ErrorBoundaryWrapper from './components/error/ErrorBoundaryWrapper';
import PageLoading from './components/ui/page-loading';
import SkipToContent from './components/SkipToContent';
import { AppContent } from './components/AppContent';
import ErrorTrackingService from './services/errorTrackingService';
import performanceMonitoringService from './services/performanceMonitoringService';

// Loading fallback for Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <PageLoading isLoading={true} text="Loading application..." />
  </div>
);

const App: React.FC = () => {
  useEffect(() => {
    // Initialize error tracking on app mount
    ErrorTrackingService.initialize();
    
    // Initialize performance monitoring
    performanceMonitoringService.initialize();
    
    // Use page visibility API instead of unload event
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        ErrorTrackingService.flush();
        performanceMonitoringService.cleanup();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  return (
    <ErrorBoundaryWrapper 
      feature="Application" 
      className="min-h-screen flex flex-col overflow-x-hidden"
      onReset={() => {
        // Force page reload on critical error
        window.location.reload();
      }}
    >
      <HelmetProvider>
        <ThemeProvider defaultTheme="light" storageKey="carbon-construct-theme">
          <BrowserRouter>
            <NetworkProvider>
              <RegionProvider>
                <AuthProvider>
                  <ErrorBoundaryWrapper feature="Project Data">
                    <ProjectProvider>
                      <CalculatorProvider>
                        <Suspense fallback={<LoadingFallback />}>
                          <AppContent />
                        </Suspense>
                      </CalculatorProvider>
                    </ProjectProvider>
                  </ErrorBoundaryWrapper>
                </AuthProvider>
              </RegionProvider>
            </NetworkProvider>
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundaryWrapper>
  );
};

export default App;
