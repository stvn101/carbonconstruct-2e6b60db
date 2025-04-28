
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundaryWrapper from './error/ErrorBoundaryWrapper';
import RouteChangeTracker from './RouteChangeTracker';
import SkipToContent from './SkipToContent';
import { Toaster } from './ui/sonner';
import { useAccessibility } from '../hooks/useAccessibility';
import ErrorTrackingService from '../services/errorTrackingService';
import performanceMonitoringService from '../services/performanceMonitoringService';
import { lazyLoad } from '../utils/lazyLoad';
import { authRoutes } from '../routes/authRoutes';
import { marketingRoutes } from '../routes/marketingRoutes';
import { projectRoutes } from '../routes/projectRoutes';
import { protectedRoutes } from '../routes/protectedRoutes';

// Import critical pages directly to avoid dynamic import failures
import Index from '../pages/Index';
const NotFound = lazyLoad(() => import('../pages/NotFound'));

export const AppContent: React.FC = () => {
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
