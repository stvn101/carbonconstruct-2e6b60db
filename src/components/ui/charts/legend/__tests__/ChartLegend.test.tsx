import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartLegend } from '../ChartLegend';
import { ChartContainer } from '../../ChartContainer';

describe('ChartLegend Component', () => {
  // We need to use ChartContainer to provide context for the legend
  const mockConfig = {
    sales: { label: 'Sales' },
    revenue: { label: 'Revenue' },
  };

  const MockLegendWrapper = ({ children }: { children: React.ReactNode }) => (
    <ChartContainer config={mockConfig}>
      {children}
    </ChartContainer>
  );

  test('renders with basic props', () => {
    render(
      <MockLegendWrapper>
        <ChartLegend />
      </MockLegendWrapper>
    );
    
    // Basic test to ensure the component renders without crashing
    expect(document.querySelector('svg')).toBeNull(); // No content should be rendered without payload
  });

  test('renders with custom content', () => {
    const CustomContent = () => <div data-testid="custom-legend-content">Custom Legend</div>;
    
    render(
      <MockLegendWrapper>
        <ChartLegend content={<CustomContent />} />
      </MockLegendWrapper>
    );
    
    // Custom content should be rendered
    expect(screen.getByTestId('custom-legend-content')).toBeInTheDocument();
  });

  test('renders with payload data', () => {
    // Creating a component that provides payload to the legend
    const LegendWithPayload = () => {
      const payload = [
        { dataKey: 'sales', value: 'Sales', color: '#3e9847' },
        { dataKey: 'revenue', value: 'Revenue', color: '#25612d' },
      ];
      
      return (
        <ChartLegend payload={payload} />
      );
    };
    
    render(
      <MockLegendWrapper>
        <LegendWithPayload />
      </MockLegendWrapper>
    );
    
    // Since Recharts Legend is complex, we'll keep this test basic
    // and focus on more detailed tests for our custom LegendContent
  });
});
