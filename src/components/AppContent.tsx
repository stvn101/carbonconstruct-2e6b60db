
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundaryWrapper from './error/ErrorBoundaryWrapper';
import RouteChangeTracker from './RouteChangeTracker';
import SkipToContent from './SkipToContent';
import { useAccessibility } from '../hooks/useAccessibility';
import ErrorTrackingService from '../services/errorTrackingService';
import performanceMonitoringService from '../services/performanceMonitoringService';
import HomePage from '../pages/Home';
import AboutPage from '../pages/About';
import CalculatorPage from '../pages/Calculator';
import MaterialDatabasePage from '../pages/MaterialDatabase';
import GrokAIAssistant from '../pages/GrokAIAssistant';
import ThemeTestRoute from '../routes/ThemeTestRoute';
import { authRoutes } from '../routes/authRoutes';
import { marketingRoutes } from '../routes/marketingRoutes';
import { projectRoutes } from '../routes/projectRoutes';
import { protectedRoutes } from '../routes/protectedRoutes';
import { CalculatorProvider } from '../contexts/CalculatorContext';
import MobileNavigation from './MobileNavigation';
import { useDevice } from '../hooks/use-device';
import { useOfflineState } from '../hooks/use-offline-state';
import { OfflineStatusIndicator } from './OfflineStatusIndicator';

export const AppContent: React.FC = () => {
  console.log("Rendering AppContent component");
  const { isIOS } = useDevice();
  const { isOffline } = useOfflineState();
  
  // Apply app-wide accessibility improvements
  useEffect(() => {
    try {
      // Initialize performance monitoring
      performanceMonitoringService.trackRouteChange(window.location.pathname);
      console.log("Performance monitoring initialized for path:", window.location.pathname);
      
      // Use a cleanup function to handle component unmount
      return () => {
        ErrorTrackingService.flush();
      };
    } catch (error) {
      console.error("Error in AppContent effect:", error);
    }
  }, []);
  
  return (
    <ErrorBoundaryWrapper 
      feature="App Container"
      onReset={() => {
        console.log("App container error boundary reset");
      }}
    >
      <CalculatorProvider>
        <div className={`flex flex-col min-h-screen ${isOffline ? 'offline-mode' : ''}`}>
          <SkipToContent />
          <RouteChangeTracker />
          
          <ErrorBoundaryWrapper 
            feature="Navigation"
            onReset={() => {
              console.log("Navigation error boundary reset");
            }}
          >
            {/* Navbar would typically be here */}
          </ErrorBoundaryWrapper>
          
          <ErrorBoundaryWrapper 
            feature="Application Routes"
            onReset={() => {
              // Force page reload on critical error
              console.log("Forcing page reload due to routes error");
              window.location.reload();
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/materials" element={<MaterialDatabasePage />} />
              <Route path="/grok-ai" element={<GrokAIAssistant />} />
              <Route path="/theme-test" element={<ThemeTestRoute />} />
              
              {/* Auth routes */}
              {authRoutes}

              {/* Marketing routes */}
              {marketingRoutes}

              {/* Protected routes */}
              {protectedRoutes}

              {/* Project routes */}
              {projectRoutes}

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundaryWrapper>
          
          {/* Offline status indicator */}
          <OfflineStatusIndicator />
          
          {/* Add mobile navigation for small screens */}
          <MobileNavigation />
          
          {/* Add bottom padding on mobile to account for navigation */}
          <div className={`pb-16 sm:pb-0 ${isIOS ? 'pb-[env(safe-area-inset-bottom,0)]' : ''}`}></div>
        </div>
      </CalculatorProvider>
    </ErrorBoundaryWrapper>
  );
};
