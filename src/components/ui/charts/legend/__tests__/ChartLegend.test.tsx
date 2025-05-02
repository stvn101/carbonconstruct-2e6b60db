
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartLegend } from '../ChartLegend';
import { ChartContainer } from '../../ChartContainer';
import { describe, test, expect } from 'vitest';

describe('ChartLegend Component', () => {
  const MockContextWrapper = ({ children }: { children: React.ReactElement }) => (
    <ChartContainer config={{
      sales: { label: 'Sales', color: '#3e9847' },
      revenue: { label: 'Revenue', color: '#25612d' }
    }}>
      {children}
    </ChartContainer>
  );

  test('renders legend with default position', () => {
    render(
      <MockContextWrapper>
        <ChartLegend 
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

  test('renders legend horizontally when vertical is false', () => {
    render(
      <MockContextWrapper>
        <ChartLegend 
          payload={[
            { value: 'Sales', dataKey: 'sales', color: '#3e9847' },
            { value: 'Revenue', dataKey: 'revenue', color: '#25612d' }
          ]} 
          layout="horizontal"
        />
      </MockContextWrapper>
    );
    
    const legendContainer = screen.getByRole('list');
    expect(legendContainer).toHaveClass('flex-row');
  });

  test('renders legend vertically when vertical is true', () => {
    render(
      <MockContextWrapper>
        <ChartLegend 
          payload={[
            { value: 'Sales', dataKey: 'sales', color: '#3e9847' },
            { value: 'Revenue', dataKey: 'revenue', color: '#25612d' }
          ]} 
          layout="vertical"
        />
      </MockContextWrapper>
    );
    
    const legendContainer = screen.getByRole('list');
    expect(legendContainer).toHaveClass('flex-col');
  });

  test('applies custom className to the legend container', () => {
    render(
      <MockContextWrapper>
        <ChartLegend 
          payload={[
            { value: 'Sales', dataKey: 'sales', color: '#3e9847' }
          ]} 
          className="custom-legend-class"
        />
      </MockContextWrapper>
    );
    
    const legendContainer = screen.getByRole('list');
    expect(legendContainer).toHaveClass('custom-legend-class');
  });
});
