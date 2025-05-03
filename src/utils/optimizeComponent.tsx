
import React from 'react';
import { isEqual } from 'lodash-es';

/**
 * HOC to optimize component rendering with deep comparison
 * Prevents unnecessary re-renders for components with complex props
 */
export function optimizeComponent<P extends object>(
  Component: React.ComponentType<P>, 
  customCompare?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): React.MemoExoticComponent<React.ComponentType<P>> {
  const compareFunction = customCompare || isEqual;
  
  return React.memo(Component, compareFunction);
}

/**
 * Type for props with children that need additional optimization
 */
export interface OptimizedProps {
  // Add optimized props marker for documentation
  _optimized?: boolean;
}

/**
 * HOC specifically for optimizing components with children
 * Uses a specialized comparison that handles React children properly
 */
export function optimizeWithChildren<P extends { children?: React.ReactNode }>(
  Component: React.ComponentType<P>
): React.MemoExoticComponent<React.ComponentType<P>> {
  return React.memo(Component, (prevProps, nextProps) => {
    const prevKeys = Object.keys(prevProps) as Array<keyof P>;
    const nextKeys = Object.keys(nextProps) as Array<keyof P>;
    
    // Compare number of props
    if (prevKeys.length !== nextKeys.length) {
      return false;
    }
    
    // Special handling for children
    const prevChildren = prevProps.children;
    const nextChildren = nextProps.children;
    
    // Handle children comparison separately
    if (prevChildren !== nextChildren && 
        !isEqual(React.Children.toArray(prevChildren), React.Children.toArray(nextChildren))) {
      return false;
    }
    
    // Compare all other props with deep equality
    for (const key of prevKeys) {
      if (key === 'children') continue;
      if (!isEqual(prevProps[key], nextProps[key])) {
        return false;
      }
    }
    
    return true;
  });
}
