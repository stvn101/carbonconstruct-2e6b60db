import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CachedCalculationsProvider } from './contexts/CachedCalculationsContext';
import { ErrorBoundaryProvider } from './components/error/ErrorBoundaryContext';
import { initializeAppServices } from './services/app-services';
import logger from './services/logging/loggingService';
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
  logger.fatal('React root error', 'app', error);
  
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

// Initialize application services
initializeAppServices().catch(error => {
  console.error('Failed to initialize application services:', error);
});

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
      <ErrorBoundaryProvider>
        <CachedCalculationsProvider>
          <App />
        </CachedCalculationsProvider>
      </ErrorBoundaryProvider>
    </React.StrictMode>
  );

  // Use page visibility API instead of beforeunload for cleanup
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      logger.flush();
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
