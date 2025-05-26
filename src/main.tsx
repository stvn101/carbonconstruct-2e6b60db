import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import errorTrackingService from './services/errorTrackingService';
import performanceMonitoringService from './services/performanceMonitoringService';
import { CachedCalculationsProvider } from './contexts/CachedCalculationsContext';
import './index.css';

// Prevent theme flickering by setting initial theme before render
const setInitialTheme = () => {
  const storedTheme = localStorage.getItem('carbon-construct-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = storedTheme === 'dark' || (storedTheme === 'system' && prefersDark) || (!storedTheme && prefersDark);
  
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = 'hsl(220, 14%, 10%)';
    document.body.style.color = 'hsl(123, 30%, 92%)';
  }
};

// Execute immediately
setInitialTheme();

// Error handler for React 18+ root errors
const handleRootError = (error: Error) => {
  console.error('React root error:', error);
  errorTrackingService.captureException(error, { source: 'ReactRoot' });
  
  // Display a user-friendly error message
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; margin: 30px auto; max-width: 600px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; font-family: system-ui, sans-serif;">
        <h2 style="color: #e11d48; margin-top: 0;">Application Error</h2>
        <p style="color: #9f1239;">We're sorry, but the application failed to load properly.</p>
        <p style="color: #9f1239;">Please try reloading the page. If the problem persists, contact support.</p>
        <button onclick="window.location.reload()" style="background: #e11d48; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px;">
          Reload Page
        </button>
      </div>
    `;
  }
};

// Initialize error tracking service - this is critical and should run immediately
errorTrackingService.initialize();

// Create a root with error handling
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = ReactDOM.createRoot(rootElement);
  
  // Mount React app with priority
  root.render(
    <React.StrictMode>
      <CachedCalculationsProvider>
        <App />
      </CachedCalculationsProvider>
    </React.StrictMode>
  );

  // Initialize non-critical services after main render
  // Use requestIdleCallback only if it's available
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      performanceMonitoringService.initialize();
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      performanceMonitoringService.initialize();
    }, 0);
  }

  // Use page visibility API instead of beforeunload for cleanup
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      errorTrackingService.flush();
      performanceMonitoringService.cleanup();
    }
  });
} catch (error) {
  console.error('Failed to initialize application:', error);
  
  if (error instanceof Error) {
    handleRootError(error);
  } else {
    handleRootError(new Error('Unknown initialization error'));
  }
}

// Add console log to verify app is mounting correctly
console.log('Application initialized and mounting...');
