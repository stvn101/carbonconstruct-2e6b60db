
export type ErrorMetadata = Record<string, any>;
export type ErrorCallback = (error: Error) => void;

export interface PerformanceEntryWithTiming extends PerformanceEntry {
  processingStart?: number;
  startTime: number;
  value?: number;
  hadRecentInput?: boolean;
}

export interface ErrorTracker {
  captureException: (error: Error, metadata?: ErrorMetadata) => void;
  captureMessage: (message: string, metadata?: ErrorMetadata) => void;
  setUser: (userId: string, email?: string) => void;
  clearUser: () => void;
  captureAccessibilityIssue: (element: HTMLElement, issue: string) => void;
  flush: () => void;
}
