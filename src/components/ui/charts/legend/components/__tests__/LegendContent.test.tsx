
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LegendContent } from '../LegendContent';
import { ChartContainer } from '../../../ChartContainer';
import { describe, test, expect, vi } from 'vitest';

describe('LegendContent Component', () => {
  // Setup test chart config context
  const MockContextWrapper = ({ children }: { children: React.ReactNode }) => (
    <ChartContainer config={{
      sales: { label: 'Sales', color: '#3e9847' },
      revenue: { label: 'Revenue', color: '#25612d' },
      profit: { label: 'Profit', color: '#1a803b' }
    }}>
      {children}
    </ChartContainer>
  );

  test('renders legend items from payload', () => {
    render(
      <MockContextWrapper>
        <LegendContent 
          payload={[
            { value: 'Sales', dataKey: 'sales', color: '#3e9847' },
            { value: 'Revenue', dataKey: 'revenue', color: '#25612d' }
          ]}
        />
      </MockContextWrapper>
    );
    
    expect(screen.getByText('Sales')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  test('renders items horizontally by default', () => {
    render(
      <MockContextWrapper>
        <LegendContent 
          payload={[
            { value: 'Sales', dataKey: 'sales', color: '#3e9847' },
            { value: 'Revenue', dataKey: 'revenue', color: '#25612d' }
          ]}
        />
      </MockContextWrapper>
    );
    
    const container = screen.getByRole('list');
    expect(container).toHaveClass('flex-row');
    expect(container).not.toHaveClass('flex-col');
  });

  test('renders items vertically when specified', () => {
    render(
      <MockContextWrapper>
        <LegendContent 
          payload={[
            { value: 'Sales', dataKey: 'sales', color: '#3e9847' },
            { value: 'Revenue', dataKey: 'revenue', color: '#25612d' }
          ]}
          layout="vertical"
        />
      </MockContextWrapper>
    );
    
    const container = screen.getByRole('list');
    expect(container).toHaveClass('flex-col');
    expect(container).not.toHaveClass('flex-row');
  });

  test('applies custom className', () => {
    render(
      <MockContextWrapper>
        <LegendContent 
          payload={[
            { value: 'Sales', dataKey: 'sales', color: '#3e9847' }
          ]}
          className="custom-legend"
        />
      </MockContextWrapper>
    );
    
    const container = screen.getByRole('list');
    expect(container).toHaveClass('custom-legend');
  });
});
