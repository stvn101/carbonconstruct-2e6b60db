
import { ErrorMetadata } from './types';

export const getElementPath = (element: HTMLElement): string => {
  const path: string[] = [];
  let currentElem: HTMLElement | null = element;
  
  while (currentElem && currentElem !== document.body) {
    let selector = currentElem.tagName.toLowerCase();
    
    if (currentElem.id) {
      selector += `#${currentElem.id}`;
    } else if (currentElem.className) {
      selector += `.${currentElem.className.split(' ')[0]}`;
    }
    
    path.unshift(selector);
    currentElem = currentElem.parentElement;
    
    if (path.length > 5) break;
  }
  
  return path.join(' > ');
};

export const formatError = (error: Error, metadata: ErrorMetadata = {}) => {
  return {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    metadata: {
      ...metadata,
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  };
};

export const getSessionDuration = (): number => {
  const navigationStart = performance?.timing?.navigationStart || 0;
  if (navigationStart === 0) return 0;
  return Date.now() - navigationStart;
};
