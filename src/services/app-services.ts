
import logger from './logging/loggingService';
import { performanceMonitoring } from './monitoring/performanceMonitoring';
import { initOfflineCache } from './offlineCache/offlineCacheService';

export async function initializeAppServices(): Promise<void> {
  try {
    logger.info('Initializing application services', 'app');
    
    // Initialize offline cache
    await initOfflineCache();
    logger.info('Offline cache initialized', 'app');
    
    // Enable performance monitoring if not in development
    if (process.env.NODE_ENV !== 'development') {
      performanceMonitoring.enable();
    } else {
      logger.info('Performance monitoring disabled in development mode', 'app');
    }
    
    logger.info('All application services initialized successfully', 'app');
  } catch (error) {
    logger.error('Failed to initialize application services', 'app', error as Error);
  }
}
