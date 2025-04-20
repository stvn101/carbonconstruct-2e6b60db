
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import errorTrackingService from './services/errorTrackingService';
import performanceMonitoringService from './services/performanceMonitoringService';
import { CachedCalculationsProvider } from './contexts/CachedCalculationsContext';
import './index.css';

// Initialize services - defer performance monitoring to not block initial render
errorTrackingService.initialize();

// Mount React app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CachedCalculationsProvider>
      <App />
    </CachedCalculationsProvider>
  </React.StrictMode>
);

// Initialize performance monitoring after the app has loaded
setTimeout(() => {
  performanceMonitoringService.initialize();
}, 0);
