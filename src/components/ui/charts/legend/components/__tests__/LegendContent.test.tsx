
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LegendContent } from '../LegendContent';
import { ChartContainer } from '../../../ChartContainer';

describe('LegendContent Component', () => {
  const mockConfig = {
    sales: { label: 'Sales', color: '#3e9847' },
    revenue: { label: 'Revenue', color: '#25612d' },
  };
  
  const mockPayload = [
    { value: 'Sales', dataKey: 'sales', color: '#3e9847' },
    { value: 'Revenue', dataKey: 'revenue', color: '#25612d' },
  ];

  const MockContextWrapper = ({ children }: { children: React.ReactNode }) => (
    <ChartContainer config={mockConfig}>
      {children}
    </ChartContainer>
  );

  test('renders null when payload is empty', () => {
    const { container } = render(
      <MockContextWrapper>
        <LegendContent payload={[]} />
      </MockContextWrapper>
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('renders legend items for each payload entry', () => {
    render(
      <MockContextWrapper>
        <LegendContent payload={mockPayload} />
      </MockContextWrapper>
    );
    
    // We should have color indicators for each legend item
    const colorIndicators = document.querySelectorAll('.rounded-\\[2px\\]');
    expect(colorIndicators.length).toBe(2);
    
    // The legend should contain both labels
    expect(document.body.textContent).toContain('Sales');
    expect(document.body.textContent).toContain('Revenue');
  });

  test('applies top padding when verticalAlign is top', () => {
    const { container } = render(
      <MockContextWrapper>
        <LegendContent payload={mockPayload} verticalAlign="top" />
      </MockContextWrapper>
    );
    
    const legendContainer = container.firstChild as HTMLElement;
    expect(legendContainer).toHaveClass('pb-3');
    expect(legendContainer).not.toHaveClass('pt-3');
  });

  test('applies bottom padding when verticalAlign is bottom', () => {
    const { container } = render(
      <MockContextWrapper>
        <LegendContent payload={mockPayload} verticalAlign="bottom" />
      </MockContextWrapper>
    );
    
    const legendContainer = container.firstChild as HTMLElement;
    expect(legendContainer).toHaveClass('pt-3');
    expect(legendContainer).not.toHaveClass('pb-3');
  });

  test('applies custom className', () => {
    const { container } = render(
      <MockContextWrapper>
        <LegendContent payload={mockPayload} className="custom-legend-class" />
      </MockContextWrapper>
    );
    
    const legendContainer = container.firstChild as HTMLElement;
    expect(legendContainer).toHaveClass('custom-legend-class');
  });
});
