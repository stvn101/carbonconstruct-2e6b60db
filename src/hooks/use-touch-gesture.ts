
import { useState, useEffect, useCallback } from 'react';

type Direction = 'left' | 'right' | 'up' | 'down' | null;
type GestureHandler = (direction: Direction) => void;

interface TouchOptions {
  threshold?: number; // Minimum distance required for swipe detection
  preventScrollOnHorizontal?: boolean; // Prevent page scroll on horizontal swipes
}

interface SwipeGesture {
  startX: number;
  startY: number;
  direction: Direction;
  distance: {
    x: number;
    y: number;
  };
}

export function useTouchGesture(onSwipe: GestureHandler, options: TouchOptions = {}) {
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
  const [swipeState, setSwipeState] = useState<SwipeGesture | null>(null);
  
  const threshold = options.threshold || 50;
  const preventScrollOnHorizontal = options.preventScrollOnHorizontal || false;
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY
    });
    
    setSwipeState({
      startX: touch.clientX,
      startY: touch.clientY,
      direction: null,
      distance: {
        x: 0,
        y: 0
      }
    });
  }, []);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart || !swipeState) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Update swipe state
    setSwipeState(prev => {
      if (!prev) return null;
      
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      
      // Determine direction
      let direction: Direction = null;
      if (absX > absY) {
        direction = deltaX > 0 ? 'right' : 'left';
        
        // Prevent scroll on horizontal swipes if enabled
        if (preventScrollOnHorizontal && absX > threshold) {
          e.preventDefault();
        }
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }
      
      return {
        ...prev,
        direction,
        distance: {
          x: deltaX,
          y: deltaY
        }
      };
    });
  }, [touchStart, swipeState, threshold, preventScrollOnHorizontal]);
  
  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !swipeState) return;
    
    const { direction, distance } = swipeState;
    
    // Check if swipe distance exceeds threshold
    if (direction && 
        ((direction === 'left' || direction === 'right') && Math.abs(distance.x) >= threshold) ||
        ((direction === 'up' || direction === 'down') && Math.abs(distance.y) >= threshold)) {
      // Call the swipe handler
      onSwipe(direction);
    }
    
    // Reset state
    setTouchStart(null);
    setSwipeState(null);
  }, [touchStart, swipeState, threshold, onSwipe]);
  
  useEffect(() => {
    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove, { passive: !preventScrollOnHorizontal });
    document.addEventListener('touchend', handleTouchEnd);
    
    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventScrollOnHorizontal]);
  
  return swipeState;
}
