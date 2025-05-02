
// jest-setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window properties not available in test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Custom IntersectionObserver mock for testing
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  
  constructor(private callback: IntersectionObserverCallback) {}
  
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

// Assign our custom mock to global
global.IntersectionObserver = MockIntersectionObserver;

// Ignore errors related to Recharts and SVG rendering
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /Warning: ReactDOM.render is no longer supported in React 18/.test(args[0]) ||
    /Warning: useLayoutEffect does nothing on the server/.test(args[0]) ||
    /Warning: Failed prop type/.test(args[0]) && args[0].includes('recharts')
  ) {
    return;
  }
  originalConsoleError(...args);
};
