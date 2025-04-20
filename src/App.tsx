
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
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { authRoutes } from './routes/authRoutes';
import { marketingRoutes } from './routes/marketingRoutes';
import { projectRoutes } from './routes/projectRoutes';
import { protectedRoutes } from './routes/protectedRoutes';

const Calculator = React.lazy(() => import('./pages/Calculator'));

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
                    <SkipToContent />
                    <RouteChangeTracker />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      
                      {/* Calculator route with error boundary */}
                      <Route path="/calculator" element={
                        <ErrorBoundary feature="Calculator">
                          <Suspense fallback={<PageLoading isLoading={true} text="Loading calculator..." />}>
                            <Calculator />
                          </Suspense>
                        </ErrorBoundary>
                      } />

                      {/* Auth routes */}
                      {authRoutes}

                      {/* Marketing routes */}
                      {marketingRoutes}

                      {/* Protected routes */}
                      {protectedRoutes}

                      {/* Project routes */}
                      {projectRoutes}

                      <Route path="/case-studies" element={<Navigate to="/" />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Toaster />
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
