
import { Dispatch, SetStateAction } from 'react';
import ErrorTrackingService from '@/services/error/errorTrackingService';

type SubscribeFunction = () => void;

/**
 * Creates a subscription status handler with retry logic
 */
export const createSubscriptionHandler = (
  retryCountRef: React.MutableRefObject<number>,
  maxRetries: number,
  mountedRef: React.MutableRefObject<boolean>,
  isSubscribingRef: React.MutableRefObject<boolean>,
  reconnectTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  subscribeToProjects: SubscribeFunction
) => {
  return (status: string): void => {
    if (status === 'SUBSCRIBED') {
      retryCountRef.current = 0;
      console.log('Realtime subscription established successfully');
    } else if (status === 'CHANNEL_ERROR') {
      retryCountRef.current += 1;
      console.warn(`Realtime subscription error (attempt ${retryCountRef.current}/${maxRetries})`);
      
      if (retryCountRef.current < maxRetries && mountedRef.current) {
        const backoffDelay = Math.min(1000 * Math.pow(2, retryCountRef.current), 10000);
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        reconnectTimeoutRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          isSubscribingRef.current = false;
          subscribeToProjects();
        }, backoffDelay);
      } else {
        // Log to error tracking service if we've reached max retries
        ErrorTrackingService.captureException(
          new Error(`Failed to establish realtime subscription after ${maxRetries} attempts`),
          { component: 'useProjectRealtime' }
        );
        isSubscribingRef.current = false;
      }
    } else if (status === 'CLOSED') {
      console.log('Realtime channel closed');
      isSubscribingRef.current = false;
    } else if (status === 'TIMED_OUT') {
      console.warn('Realtime subscription timed out');
      isSubscribingRef.current = false;
      
      // Try again if we haven't reached max retries
      if (retryCountRef.current < maxRetries && mountedRef.current) {
        retryCountRef.current += 1;
        const backoffDelay = Math.min(1000 * Math.pow(2, retryCountRef.current), 10000);
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        reconnectTimeoutRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          subscribeToProjects();
        }, backoffDelay);
      }
    }
  };
};
