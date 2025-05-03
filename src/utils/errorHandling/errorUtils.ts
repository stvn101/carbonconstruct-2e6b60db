
export const shouldIgnoreError = (error: Error): boolean => {
  if (!error.message) return false;
  
  return (
    error.message.includes("duplicate key") || 
    error.message.includes("23505") ||
    error.message.includes("Failed to fetch") ||
    error.message.includes("timed out") ||
    error.message.includes("timeout") ||
    error.message.includes("Network request failed") ||
    error.message.includes("NetworkError") ||
    error.message.includes("AbortError") ||
    error.message.includes("network") ||
    error.message.includes("Network Error") ||
    error.message.includes("offline") ||
    error.message.includes("connection") ||
    error.message.includes("database connection") ||
    error.message.includes("connection refused") ||
    error.message.includes("pool timeout") ||
    error.message.includes("connection terminated")
  );
};
