
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import errorTrackingService from './services/errorTrackingService';
import performanceMonitoringService from './services/performanceMonitoringService';
import './index.css';

// Initialize services
errorTrackingService.initialize();
performanceMonitoringService.initialize();

// Mount React app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
