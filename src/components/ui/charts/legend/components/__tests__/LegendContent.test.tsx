
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LegendContent } from '../LegendContent';
import { ChartContainer } from '../../../ChartContainer';
import { describe, test, expect, vi } from 'vitest';

describe('LegendContent Component', () => {
  // Setup test chart config context
  const MockContextWrapper = ({ children }: { children: React.ReactElement }) => (
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
    const { container } = render(
      <MockContextWrapper>
        <LegendContent 
          payload={[
            { value: 'Sales', dataKey: 'sales', color: '#3e9847' },
            { value: 'Revenue', dataKey: 'revenue', color: '#25612d' }
          ]}
        />
      </MockContextWrapper>
    );
    
    const flexDiv = container.firstChild;
    expect(flexDiv).toHaveClass('flex');
    expect(flexDiv).not.toHaveClass('flex-col');
  });

  test('applies custom className', () => {
    const { container } = render(
      <MockContextWrapper>
        <LegendContent 
          payload={[
            { value: 'Sales', dataKey: 'sales', color: '#3e9847' }
          ]}
          className="custom-legend"
        />
      </MockContextWrapper>
    );
    
    const flexDiv = container.firstChild;
    expect(flexDiv).toHaveClass('custom-legend');
  });
});
