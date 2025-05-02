
import React from 'react';
import { render } from '@testing-library/react';
import { TooltipContent } from '../TooltipContent';
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

describe('TooltipContent Component', () => {
  const MockContextWrapper = ({ children }: { children: React.ReactNode }) => (
    <ChartContainer config={{}}>
      {children}
    </ChartContainer>
  );
  
  const mockPayload = [
    { 
      dataKey: 'sales', 
      name: 'Sales', 
      value: 1000, 
      payload: { sales: 1000, date: '2023-01' },
      color: '#3e9847'
    },
    { 
      dataKey: 'revenue', 
      name: 'Revenue', 
      value: 2000,
      payload: { revenue: 2000, date: '2023-01' },
      color: '#25612d'
    }
  ];

  test('renders null when active is false', () => {
    const { container } = render(
      <MockContextWrapper>
        <TooltipContent active={false} payload={mockPayload} />
      </MockContextWrapper>
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('renders null when payload is empty', () => {
    const { container } = render(
      <MockContextWrapper>
        <TooltipContent active={true} payload={[]} />
      </MockContextWrapper>
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('renders tooltip items for each payload entry', () => {
    const { container } = render(
      <MockContextWrapper>
        <TooltipContent active={true} payload={mockPayload} />
      </MockContextWrapper>
    );
    
    // Should render a tooltip container
    expect(container.firstChild).toHaveClass('rounded-lg', 'border');
    
    // Should contain both values formatted with toLocaleString
    expect(container.textContent).toContain('Sales');
    expect(container.textContent).toContain('1,000');
    expect(container.textContent).toContain('Revenue');
    expect(container.textContent).toContain('2,000');
  });

  test('applies custom className', () => {
    const { container } = render(
      <MockContextWrapper>
        <TooltipContent active={true} payload={mockPayload} className="custom-tooltip-class" />
      </MockContextWrapper>
    );
    
    expect(container.firstChild).toHaveClass('custom-tooltip-class');
  });

  test('uses custom formatter when provided', () => {
    const customFormatter = jest.fn((value, name) => (
      <div data-testid="custom-format">{name}: ${value}</div>
    ));
    
    render(
      <MockContextWrapper>
        <TooltipContent 
          active={true} 
          payload={mockPayload} 
          formatter={customFormatter} 
        />
      </MockContextWrapper>
    );
    
    expect(customFormatter).toHaveBeenCalledTimes(2);
    expect(customFormatter).toHaveBeenCalledWith(1000, 'Sales', expect.anything(), 0, expect.anything());
    expect(customFormatter).toHaveBeenCalledWith(2000, 'Revenue', expect.anything(), 1, expect.anything());
  });
});
