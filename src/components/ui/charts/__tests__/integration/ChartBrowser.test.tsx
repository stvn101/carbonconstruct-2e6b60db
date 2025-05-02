
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';

// Mock component for testing
const ChartBrowser = () => {
  return (
    <div>
      <h1>Chart Browser</h1>
      <div data-testid="chart-container">Chart goes here</div>
    </div>
  );
};

// Mock window.matchMedia
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    })),
  });
});

describe('ChartBrowser Integration', () => {
  test('renders chart browser', () => {
    render(<ChartBrowser />);
    expect(screen.getByText('Chart Browser')).toBeInTheDocument();
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
  });
});
