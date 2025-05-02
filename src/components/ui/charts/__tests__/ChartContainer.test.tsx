
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartContainer, ChartConfig } from '../ChartContainer';
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

describe('ChartContainer Component', () => {
  const mockConfig: ChartConfig = {
    sales: { color: '#3e9847', label: 'Sales' },
    revenue: { color: '#25612d', label: 'Revenue' },
  };

  test('renders children within responsive container', () => {
    render(
      <ChartContainer config={mockConfig}>
        <div data-testid="chart-child">Chart content</div>
      </ChartContainer>
    );
    
    expect(screen.getByTestId('chart-child')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  test('applies custom className to the chart container', () => {
    const { container } = render(
      <ChartContainer config={mockConfig} className="custom-container-class">
        <div>Chart content</div>
      </ChartContainer>
    );
    
    const chartContainer = container.querySelector('[data-chart]');
    expect(chartContainer).toHaveClass('custom-container-class');
  });

  test('generates unique chart ID if not provided', () => {
    const { container } = render(
      <ChartContainer config={mockConfig}>
        <div>Chart content</div>
      </ChartContainer>
    );
    
    const chartContainer = container.firstChild as HTMLElement;
    expect(chartContainer.getAttribute('data-chart')).toMatch(/^chart-/);
  });

  test('uses provided chart ID if available', () => {
    const { container } = render(
      <ChartContainer id="custom-chart-id" config={mockConfig}>
        <div>Chart content</div>
      </ChartContainer>
    );
    
    const chartContainer = container.firstChild as HTMLElement;
    expect(chartContainer.getAttribute('data-chart')).toBe('chart-custom-chart-id');
  });

  test('applies chart styles based on config', () => {
    render(
      <ChartContainer id="styled-chart" config={mockConfig}>
        <div>Chart content</div>
      </ChartContainer>
    );
    
    // Check if style element is created with the correct CSS variables
    const styleElement = document.querySelector('style');
    expect(styleElement).toBeInTheDocument();
    expect(styleElement?.innerHTML).toContain('--color-sales:');
    expect(styleElement?.innerHTML).toContain('--color-revenue:');
  });

  test('handles empty config object gracefully', () => {
    render(
      <ChartContainer config={{}}>
        <div data-testid="chart-child">Chart content</div>
      </ChartContainer>
    );
    
    expect(screen.getByTestId('chart-child')).toBeInTheDocument();
  });
});
