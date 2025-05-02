
import React from 'react';
import { render } from '@testing-library/react';
import { LegendItem } from '../LegendItem';
import { ChartContainer } from '../../../ChartContainer';

// Mock the chart context
jest.mock('../../../ChartContainer', () => {
  const actual = jest.requireActual('../../../ChartContainer');
  return {
    ...actual,
    useChart: () => ({
      config: {
        sales: { label: 'Sales', icon: () => <svg data-testid="sales-icon" /> },
        revenue: { label: 'Revenue' },
      }
    })
  };
});

describe('LegendItem Component', () => {
  const MockContextWrapper = ({ children }: { children: React.ReactNode }) => (
    <ChartContainer config={{}}>
      {children}
    </ChartContainer>
  );

  test('renders color indicator when no icon is provided', () => {
    const mockItem = { value: 'Revenue', dataKey: 'revenue', color: '#25612d' };
    
    const { container } = render(
      <MockContextWrapper>
        <LegendItem item={mockItem} />
      </MockContextWrapper>
    );
    
    const colorIndicator = container.querySelector('.rounded-\\[2px\\]');
    expect(colorIndicator).toBeInTheDocument();
    expect(colorIndicator).toHaveStyle('background-color: #25612d');
  });

  test('renders icon when available and hideIcon is false', () => {
    const mockItem = { value: 'Sales', dataKey: 'sales', color: '#3e9847' };
    
    const { container } = render(
      <MockContextWrapper>
        <LegendItem item={mockItem} />
      </MockContextWrapper>
    );
    
    const icon = container.querySelector('[data-testid="sales-icon"]');
    expect(icon).toBeInTheDocument();
    
    const colorIndicator = container.querySelector('.rounded-\\[2px\\]');
    expect(colorIndicator).not.toBeInTheDocument();
  });

  test('hides icon when hideIcon is true', () => {
    const mockItem = { value: 'Sales', dataKey: 'sales', color: '#3e9847' };
    
    const { container } = render(
      <MockContextWrapper>
        <LegendItem item={mockItem} hideIcon={true} />
      </MockContextWrapper>
    );
    
    const icon = container.querySelector('[data-testid="sales-icon"]');
    expect(icon).not.toBeInTheDocument();
    
    const colorIndicator = container.querySelector('.rounded-\\[2px\\]');
    expect(colorIndicator).toBeInTheDocument();
  });

  test('uses nameKey to get config when provided', () => {
    const mockItem = { value: 'Custom Sales', customKey: 'sales', color: '#3e9847' };
    
    const { container } = render(
      <MockContextWrapper>
        <LegendItem item={mockItem} nameKey="customKey" />
      </MockContextWrapper>
    );
    
    const icon = container.querySelector('[data-testid="sales-icon"]');
    expect(icon).toBeInTheDocument();
  });

  test('renders without crashing when item has no config', () => {
    const mockItem = { value: 'Unknown', dataKey: 'unknown', color: '#cccccc' };
    
    const { container } = render(
      <MockContextWrapper>
        <LegendItem item={mockItem} />
      </MockContextWrapper>
    );
    
    const colorIndicator = container.querySelector('.rounded-\\[2px\\]');
    expect(colorIndicator).toBeInTheDocument();
    expect(colorIndicator).toHaveStyle('background-color: #cccccc');
  });
});
