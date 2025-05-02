import React, { lazy, ComponentType, LazyExoticComponent } from 'react';

// Keep track of which components have already been preloaded to avoid redundant loads
const preloadedModules = new Set<string>();

// Improved lazyLoad with fallback and better error handling
export function lazyLoad<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallback: React.ReactNode = null
): LazyExoticComponent<T> {
  // Get a unique identifier for this component import (for deduping purposes)
  const moduleId = factory.toString();

  // Check for browser environment
  if (typeof window !== 'undefined') {
    // Add to preloaded set immediately to avoid redundant loads
    preloadedModules.add(moduleId);
    
    // Add error recovery logic
    const safeFactory = async () => {
      try {
        return await factory();
      } catch (error) {
        console.error('Error loading module:', error);
        
        // Try one more time after a short delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          return await factory();
        } catch (secondError) {
          console.error('Failed to load module after retry:', secondError);
          throw secondError;
        }
      }
    };
    
    const LazyComponent = lazy(safeFactory);
    
    // Attach the original factory to the component for preloading
    (LazyComponent as any).__factory = factory;
    
    return LazyComponent;
  }
  
  // Server side or no window object, just use regular lazy
  return lazy(factory);
}

// Improved preloadComponent that handles errors gracefully
export function preloadComponent<T extends ComponentType<any>>(
  componentFactory: () => Promise<{ default: T }>
): void {
  // Return early if not in browser
  if (typeof window === 'undefined') return;
  
  // Get a unique identifier for this component import
  const moduleId = componentFactory.toString();
  
  // If already preloaded, skip
  if (preloadedModules.has(moduleId)) return;
  
  // Mark as preloaded right away to prevent duplicate requests
  preloadedModules.add(moduleId);
  
  // Trigger the preload with error handling
  try {
    componentFactory()
      .then(() => {
        console.debug(`Successfully preloaded module: ${moduleId.substring(0, 40)}...`);
      })
      .catch(error => {
        console.warn(`Failed to preload module: ${error.message}`);
        // Remove from preloaded set so we can try again next time
        preloadedModules.delete(moduleId);
      });
  } catch (error) {
    console.warn(`Error initiating module preload: ${error}`);
    preloadedModules.delete(moduleId);
  }
}
