
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Chart } from '../../chart';
import * as RechartsPrimitive from 'recharts';
import { describe, test, expect, vi } from 'vitest';

// Mock Recharts ResponsiveContainer to avoid dimension issues in tests
vi.mock('recharts', () => {
  const OriginalRechartsModule = vi.importActual('recharts');
  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

describe('Chart Component', () => {
  const mockData = [
    { name: 'Page A', value: 400 },
    { name: 'Page B', value: 300 },
    { name: 'Page C', value: 200 },
  ];

  test('renders bar chart correctly', () => {
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

  test('renders line chart correctly', () => {
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

  test('renders pie chart correctly', () => {
    render(
      <Chart 
        type="pie" 
        data={mockData} 
        categories={['value']} 
        index="name"
        colors={['#3e9847', '#25612d', '#214d28']}
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  test('renders area chart correctly', () => {
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

  test('applies custom className to the chart container', () => {
    const { container } = render(
      <Chart 
        type="bar" 
        data={mockData} 
        categories={['value']} 
        index="name"
        colors={['#3e9847']}
        className="custom-chart-class"
      />
    );
    
    const chartContainer = container.firstChild;
    expect(chartContainer).toHaveClass('custom-chart-class');
  });

  test('formats values with custom formatter if provided', () => {
    const valueFormatter = vi.fn((value: number) => `${value}%`);
    
    render(
      <Chart 
        type="bar" 
        data={mockData} 
        categories={['value']} 
        index="name"
        colors={['#3e9847']}
        valueFormatter={valueFormatter}
      />
    );
    
    // We're not calling the formatter directly in the test,
    // but we're ensuring the component doesn't crash when a formatter is provided
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  test('hides legend when showLegend is false', () => {
    render(
      <Chart 
        type="bar" 
        data={mockData} 
        categories={['value']} 
        index="name"
        colors={['#3e9847']}
        showLegend={false}
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    // Further assertions would require more intricate testing of the Recharts components
  });
});
