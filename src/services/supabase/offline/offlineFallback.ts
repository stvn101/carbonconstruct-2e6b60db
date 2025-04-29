
import { performDbOperation } from '../db/dbOperationExecutor';

/**
 * Wrapper for database operations with offline fallback
 */
export const withOfflineFallback = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  fallbackData: T
): Promise<T> => {
  return performDbOperation(operation, operationName, {
    fallbackData,
    silentFail: true
  });
};
