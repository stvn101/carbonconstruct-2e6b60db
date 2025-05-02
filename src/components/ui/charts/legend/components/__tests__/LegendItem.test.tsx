
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LegendItem } from '../LegendItem';
import { ChartContainer } from '../../../ChartContainer';
import { describe, test, expect, vi } from 'vitest';

// Mock icon component for testing
const MockIcon = () => <span data-testid="mock-icon">Icon</span>;

// Setup test context
const setupTest = (props = {}) => {
  return render(
    <ChartContainer 
      config={{
        sales: { label: 'Sales', color: '#3e9847', icon: MockIcon },
        revenue: { label: 'Revenue', color: '#25612d' }
      }}
    >
      <LegendItem item={{ value: 'Test', ...props }} />
    </ChartContainer>
  );
};

describe('LegendItem Component', () => {
  test('renders with basic props', () => {
    setupTest({
      value: 'Sales',
      dataKey: 'sales',
      color: '#3e9847'
    });
    
    expect(screen.getByText('Sales')).toBeInTheDocument();
    expect(document.querySelector('.rounded-\\[2px\\]')).toBeInTheDocument();
  });
  
  test('uses config label when available', () => {
    setupTest({
      value: 'Alternative Name',
      dataKey: 'sales',
      color: '#3e9847'
    });
    
    expect(screen.getByText('Sales')).toBeInTheDocument();
    expect(screen.queryByText('Alternative Name')).not.toBeInTheDocument();
  });
  
  test('falls back to item value when no config label', () => {
    setupTest({
      value: 'Unknown',
      dataKey: 'unknown',
      color: '#3e9847'
    });
    
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
  
  test('renders icon when available in config', () => {
    setupTest({
      value: 'Sales',
      dataKey: 'sales'
    });
    
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.queryByRole('color-box')).not.toBeInTheDocument();
  });
  
  test('renders color box when no icon available', () => {
    setupTest({
      value: 'Revenue',
      dataKey: 'revenue',
      color: '#25612d'
    });
    
    expect(document.querySelector('.rounded-\\[2px\\]')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
  });
});
