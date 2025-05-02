
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Chart } from '../../../chart';

// Mock window resize for responsive testing
const mockMatchMedia = () => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
});

// Mock Recharts ResponsiveContainer to avoid dimension issues in tests
jest.mock('recharts', () => {
  const OriginalRechartsModule = jest.requireActual('recharts');
  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

// Mock for window.matchMedia
window.matchMedia = window.matchMedia || (query => mockMatchMedia());

describe('Chart Cross-Browser Integration', () => {
  const mockData = [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 200 },
    { name: 'Mar', value: 300 },
    { name: 'Apr', value: 400 },
  ];

  beforeEach(() => {
    // Reset viewport size before each test
    window.innerWidth = 1024;
    window.innerHeight = 768;
    window.dispatchEvent(new Event('resize'));
  });

  test('renders correctly on desktop viewports', () => {
    window.innerWidth = 1200;
    window.dispatchEvent(new Event('resize'));
    
    render(
      <Chart 
        type="bar" 
        data={mockData} 
        categories={['value']} 
        index="name"
        colors={['#3e9847']}
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  test('renders correctly on tablet viewports', () => {
    window.innerWidth = 768;
    window.dispatchEvent(new Event('resize'));
    
    render(
      <Chart 
        type="line" 
        data={mockData} 
        categories={['value']} 
        index="name"
        colors={['#3e9847']}
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  test('renders correctly on mobile viewports', () => {
    window.innerWidth = 375;
    window.dispatchEvent(new Event('resize'));
    
    render(
      <Chart 
        type="area" 
        data={mockData} 
        categories={['value']} 
        index="name"
        colors={['#3e9847']}
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  test('handles different browser environments', () => {
    // Mock different user agent
    const originalUserAgent = navigator.userAgent;
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
      configurable: true
    });
    
    render(
      <Chart 
        type="pie" 
        data={mockData} 
        categories={['value']} 
        index="name"
        colors={['#3e9847', '#25612d', '#214d28', '#8acd91']}
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    
    // Reset user agent
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true
    });
  });
});
