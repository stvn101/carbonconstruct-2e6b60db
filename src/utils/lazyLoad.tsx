
import { Suspense, lazy, ComponentType, memo } from 'react';
import PageLoading from '@/components/ui/page-loading';
import ErrorBoundaryWrapper from '@/components/error/ErrorBoundaryWrapper';

/**
 * Enhanced lazy loading utility with performance optimizations and error handling
 * - Uses React.lazy for code splitting
 * - Provides configurable loading states
 * - Adds error handling with retry capability
 * - Includes memoization for preventing unnecessary rerenders
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <PageLoading isLoading={true} />
) {
  // Create a memoized lazy component with retry logic
  const LazyComponent = lazy(() => 
    importFunc().catch(error => {
      console.error("Failed to load component:", error);
      
      // Retry once after a short delay
      return new Promise<{ default: T }>((resolve) => {
        setTimeout(() => {
          importFunc()
            .then(resolve)
            .catch(innerError => {
              console.error("Retry failed:", innerError);
              // Return a placeholder component when all attempts fail
              const ErrorComponent = () => (
                <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md text-center">
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Component Failed to Load</h3>
                  <p className="mt-2 text-red-700 dark:text-red-400">There was a problem loading this component.</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </button>
                </div>
              );
              // Use type assertion to ensure TypeScript knows this is a valid component
              return { default: ErrorComponent as unknown as T };
            });
        }, 500);
      });
    })
  );
  
  // Wrap with memo to prevent unnecessary re-renders
  const MemoizedLazyComponent = memo((props: React.ComponentProps<T>) => (
    <ErrorBoundaryWrapper feature={getComponentDisplayName(importFunc)}>
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundaryWrapper>
  ));
  
  // Add displayName for better debugging
  const componentName = getComponentDisplayName(importFunc);
  if (componentName) {
    MemoizedLazyComponent.displayName = `Lazy(${componentName})`;
  }
  
  return MemoizedLazyComponent;
}

/**
 * Extract component name from import function for better debugging
 */
function getComponentDisplayName(importFunc: () => Promise<{ default: any }>): string {
  const fnString = importFunc.toString();
  const matches = fnString.match(/[\/\\]([^\/\\]+)\.(tsx|jsx)/);
  return matches?.[1] || 'Component';
}

/**
 * Preloads a component without rendering it
 * Useful for preloading routes the user is likely to visit next
 */
export function preloadComponent(importFunc: () => Promise<{ default: any }>) {
  try {
    // Only preload in production to avoid affecting development experience
    if (import.meta.env.PROD) {
      // Use requestIdleCallback for better performance
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          importFunc().catch(err => {
            // Silent catch - no need to break the app for preloading failures
            console.warn('Preloading component failed:', err);
          });
        }, { timeout: 2000 }); // Set a timeout to ensure it happens even if the browser is busy
      } else {
        // Fallback to setTimeout for browsers without requestIdleCallback
        setTimeout(() => {
          importFunc().catch(err => {
            console.warn('Preloading component failed:', err);
          });
        }, 300);
      }
    }
  } catch (error) {
    // Silently fail preloading - it's just an optimization
    console.warn('Error in preloadComponent:', error);
  }
}

/**
 * Preload multiple components at once
 * Useful for related components that are likely to be needed together
 */
export function preloadComponents(importFunctions: Array<() => Promise<{ default: any }>>) {
  importFunctions.forEach(importFunc => {
    try {
      preloadComponent(importFunc);
    } catch (error) {
      // Silently fail - preloading is just an optimization
      console.warn('Error in preloadComponents:', error);
    }
  });
}

/**
 * Safely resolves a module import, with fallbacks for error cases
 * This is useful for ensuring that broken modules don't crash the entire app
 */
export async function safeImport<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallbackComponent?: React.ComponentType<any>
): Promise<{ default: React.ComponentType<any> }> {
  try {
    return await importFunc() as { default: React.ComponentType<any> };
  } catch (error) {
    console.error("Module import failed:", error);
    return { 
      default: fallbackComponent || (() => (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded">
          Failed to load component
        </div>
      ))
    };
  }
}
