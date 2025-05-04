
/**
 * Utility to add timeout to async operations
 * @param promise The promise to add timeout to
 * @param ms Timeout in milliseconds
 * @param timeoutMessage Optional message for timeout error
 * @param fallbackValue Optional fallback value to return on timeout
 */
export async function withTimeout<T>(
  promise: Promise<T> | { then: (onfulfilled: any) => Promise<T> },
  ms: number,
  timeoutMessage: string = 'Operation timed out',
  fallbackValue?: T
): Promise<T> {
  // Handle both regular Promises and Supabase query objects which are "thenable"
  const promiseToUse = 'then' in promise && typeof promise.then === 'function'
    ? promise
    : Promise.reject(new Error('Invalid promise'));

  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (fallbackValue !== undefined) {
        console.warn(timeoutMessage);
        resolve(fallbackValue);
      } else {
        reject(new Error(timeoutMessage));
      }
    }, ms);

    Promise.resolve(promiseToUse)
      .then((result) => {
        clearTimeout(timeout);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeout);
        reject(error);
      });
  });
}
