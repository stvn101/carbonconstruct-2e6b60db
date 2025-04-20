
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import errorTrackingService from './services/errorTrackingService';
import performanceMonitoringService from './services/performanceMonitoringService';
import { CachedCalculationsProvider } from './contexts/CachedCalculationsContext';
import './index.css';

// Initialize error tracking service - this is critical and should run immediately
errorTrackingService.initialize();

// Mount React app with priority
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <CachedCalculationsProvider>
      <App />
    </CachedCalculationsProvider>
  </React.StrictMode>
);

// Initialize non-critical services after main render using requestIdleCallback
if ('requestIdleCallback' in window) {
  (window as any).requestIdleCallback(() => {
    performanceMonitoringService.initialize();
  });
} else {
  // Fallback for browsers without requestIdleCallback
  setTimeout(() => {
    performanceMonitoringService.initialize();
  }, 0);
}
