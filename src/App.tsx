
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { RegionProvider } from './contexts/RegionContext';
import { AuthProvider } from './contexts/auth';
import { ProjectProvider } from './contexts/ProjectContext';
import { CalculatorProvider } from './contexts/calculator';
import ErrorBoundary from './components/ErrorBoundary';
import PageLoading from './components/ui/page-loading';
import RouteChangeTracker from './components/RouteChangeTracker';
import SkipToContent from './components/SkipToContent';
import { lazyLoad } from './utils/lazyLoad';
import { authRoutes } from './routes/authRoutes';
import { marketingRoutes } from './routes/marketingRoutes';
import { projectRoutes } from './routes/projectRoutes';
import { protectedRoutes } from './routes/protectedRoutes';
import { useAccessibility } from './hooks/useAccessibility';

// Import Index directly instead of lazy loading
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
  
  return (
    <>
      <SkipToContent />
      <RouteChangeTracker />
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
      <Toaster richColors position="top-right" />
    </>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary feature="Application">
      <HelmetProvider>
        <ThemeProvider defaultTheme="light" storageKey="carbon-construct-theme">
          <RegionProvider>
            <Router>
              <AuthProvider>
                <ProjectProvider>
                  <CalculatorProvider>
                    <Suspense fallback={<LoadingFallback />}>
                      <AppContent />
                    </Suspense>
                  </CalculatorProvider>
                </ProjectProvider>
              </AuthProvider>
            </Router>
          </RegionProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
