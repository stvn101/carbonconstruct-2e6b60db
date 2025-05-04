
/**
 * Utility to add timeout to async operations
 * @param promise The promise to add timeout to
 * @param ms Timeout in milliseconds
 * @param timeoutMessage Optional message for timeout error
 * @param fallbackValue Optional fallback value to return on timeout
 */
export async function withTimeout<T>(
  promise: Promise<T> | { then: (onfulfilled: any) => Promise<T> } | any,
  ms: number,
  timeoutMessage: string = 'Operation timed out',
  fallbackValue?: T
): Promise<T> {
  // Check if the promise is a Supabase query object (has then method)
  const isThenable = promise && typeof promise === 'object' && typeof promise.then === 'function';
  
  // Handle both regular Promises and Supabase query objects which are "thenable"
  const promiseToUse = isThenable
    ? promise
    : Promise.reject(new Error('Invalid promise'));

  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (fallbackValue !== undefined) {
        console.warn(timeoutMessage);
        resolve(fallbackValue as T);
      } else {
        reject(new Error(timeoutMessage));
      }
    }, ms);

    Promise.resolve(promiseToUse)
      .then((result) => {
        clearTimeout(timeout);
        resolve(result as T);
      })
      .catch((error) => {
        clearTimeout(timeout);
        reject(error);
      });
  });
}
