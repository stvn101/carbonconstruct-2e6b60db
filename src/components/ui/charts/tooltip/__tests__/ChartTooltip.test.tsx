
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartTooltip } from '../ChartTooltip';
import { describe, test, expect, vi } from 'vitest';

describe('ChartTooltip Component', () => {
  // Setup test chart config context
  const MockContextWrapper = ({ children }: { children: React.ReactNode }) => (
    <div>
      {children}
    </div>
  );

  const mockPayload = [
    { name: 'Sales', value: 1000, dataKey: 'sales', color: '#3e9847' },
    { name: 'Revenue', value: 2000, dataKey: 'revenue', color: '#25612d' }
  ];

  test('renders tooltip with label and values', () => {
    render(
      <MockContextWrapper>
        <ChartTooltip 
          active={true}
          payload={mockPayload}
          label="Q1 2025"
        />
      </MockContextWrapper>
    );
    
    expect(screen.getByText('Q1 2025')).toBeInTheDocument();
    expect(screen.getByText('Sales')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('2000')).toBeInTheDocument();
  });

  test('returns null when not active', () => {
    const { container } = render(
      <MockContextWrapper>
        <ChartTooltip 
          active={false}
          payload={mockPayload}
          label="Q1 2025"
        />
      </MockContextWrapper>
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('returns null with empty payload', () => {
    const { container } = render(
      <MockContextWrapper>
        <ChartTooltip 
          active={true}
          payload={[]}
          label="Q1 2025"
        />
      </MockContextWrapper>
    );
    
    expect(container.firstChild).toBeNull();
  });
});
