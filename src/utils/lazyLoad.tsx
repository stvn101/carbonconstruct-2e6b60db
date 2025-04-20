
import { Suspense, lazy, ComponentType, memo } from 'react';
import PageLoading from '@/components/ui/page-loading';

/**
 * Enhanced lazy loading utility with performance optimizations
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
              throw new Error(`Failed to load component after retry: ${innerError}`);
            });
        }, 500);
      });
    })
  );
  
  // Wrap with memo to prevent unnecessary re-renders
  const MemoizedLazyComponent = memo((props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  ));
  
  // Add displayName for better debugging
  const componentName = importFunc.toString().match(/[\/\\]([^\/\\]+)\.tsx/)?.[1];
  if (componentName) {
    MemoizedLazyComponent.displayName = `Lazy(${componentName})`;
  }
  
  return MemoizedLazyComponent;
}

/**
 * Preloads a component without rendering it
 * Useful for preloading routes the user is likely to visit next
 */
export function preloadComponent(importFunc: () => Promise<{ default: any }>) {
  // Only preload in production to avoid affecting development experience
  if (import.meta.env.PROD) {
    // Use requestIdleCallback for better performance
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        importFunc();
      }, { timeout: 2000 }); // Set a timeout to ensure it happens even if the browser is busy
    } else {
      // Fallback to setTimeout for browsers without requestIdleCallback
      setTimeout(() => {
        importFunc();
      }, 300);
    }
  }
}

/**
 * Preload multiple components at once
 * Useful for related components that are likely to be needed together
 */
export function preloadComponents(importFunctions: Array<() => Promise<{ default: any }>>) {
  importFunctions.forEach(importFunc => preloadComponent(importFunc));
}
