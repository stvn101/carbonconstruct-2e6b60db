import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { RegionProvider } from './contexts/RegionContext';
import { AuthProvider } from './contexts/auth';
import { ProjectProvider } from './contexts/ProjectContext';
import { CalculatorProvider } from './contexts/calculator';
import { NetworkProvider } from './contexts/network/NetworkContext';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorBoundaryWrapper from './components/error/ErrorBoundaryWrapper';
import PageLoading from './components/ui/page-loading';
import RouteChangeTracker from './components/RouteChangeTracker';
import SkipToContent from './components/SkipToContent';
import { lazyLoad } from './utils/lazyLoad';
import { authRoutes } from './routes/authRoutes';
import { marketingRoutes } from './routes/marketingRoutes';
import { projectRoutes } from './routes/projectRoutes';
import { protectedRoutes } from './routes/protectedRoutes';
import { useAccessibility } from './hooks/useAccessibility';
import ErrorTrackingService from './services/errorTrackingService';
import performanceMonitoringService from './services/performanceMonitoringService';

// Import critical pages directly to avoid dynamic import failures
import Index from './pages/Index';
const NotFound = lazyLoad(() => import('./pages/NotFound'));

// Loading fallback for Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <PageLoading isLoading={true} text="Loading application..." />
  </div>
);

const AppContent = () => {
  // Apply app-wide accessibility improvements
  useAccessibility();
  
  // Log route change performance
  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitoringService.trackRouteChange(window.location.pathname);
    
    // Use a cleanup function to handle component unmount
    return () => {
      ErrorTrackingService.flush();
    };
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <SkipToContent />
      <RouteChangeTracker />
      <ErrorBoundaryWrapper 
        feature="Application Routes"
        onReset={() => {
          // Force page reload on critical error
          window.location.reload();
        }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Auth routes */}
          {authRoutes}

          {/* Marketing routes */}
          {marketingRoutes}

          {/* Protected routes */}
          {protectedRoutes}

          {/* Project routes including calculator */}
          {projectRoutes}

          <Route path="/case-studies" element={<Navigate to="/" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundaryWrapper>
      <Toaster richColors position="top-right" />
    </div>
  );
};

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
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundaryWrapper>
  );
};

export default App;
