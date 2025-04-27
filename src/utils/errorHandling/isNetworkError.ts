
export function isNetworkError(error: Error): boolean {
  return error?.message?.toLowerCase().includes('network') ||
    error?.message?.toLowerCase().includes('failed to fetch') ||
    error?.message?.toLowerCase().includes('offline') ||
    error?.message?.toLowerCase().includes('connection') ||
    error?.message?.toLowerCase().includes('timed out');
}
