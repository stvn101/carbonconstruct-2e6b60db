
import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for debouncing values with optimized performance
 * @param value The value to debounce
 * @param delay The delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Skip debounce for initial value or when delay is 0
    if (delay === 0) {
      setDebouncedValue(value);
      return;
    }
    
    // Update debounced value after delay
    timerRef.current = window.setTimeout(() => {
      setDebouncedValue(value);
      timerRef.current = null;
    }, delay);

    // Cleanup function to prevent memory leaks
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttling values - useful for high-frequency events
 * @param value The value to throttle
 * @param limit The time limit in milliseconds (default: 200ms)
 * @returns The throttled value
 */
export function useThrottle<T>(value: T, limit = 200): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = window.setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}
