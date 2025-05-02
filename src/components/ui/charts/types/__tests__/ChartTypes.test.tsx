
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartContainer } from '../../ChartContainer';
import { 
  BarChartComponent, 
  LineChartComponent, 
  AreaChartComponent, 
  PieChartComponent 
} from '../index';

// Mock Recharts ResponsiveContainer to avoid dimension issues in tests
jest.mock('recharts', () => {
  const OriginalRechartsModule = jest.requireActual('recharts');
  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    Bar: () => <div data-testid="bar" />,
    Line: () => <div data-testid="line" />,
    Area: () => <div data-testid="area" />,
    Pie: () => <div data-testid="pie" />,
  };
});

describe('Chart Type Components', () => {
  const mockConfig = {
    value: { label: 'Value', color: '#3e9847' },
  };
  
  const mockData = [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 200 },
    { name: 'Mar', value: 300 },
  ];
  
  const mockProps = {
    data: mockData,
    categories: ['value'],
    index: 'name',
    colors: ['#3e9847'],
    showLegend: true,
  };

  const MockWrapper = ({ children }: { children: React.ReactNode }) => (
    <ChartContainer config={mockConfig}>
      {children}
    </ChartContainer>
  );

  test('BarChartComponent renders properly', () => {
    render(
      <MockWrapper>
        <BarChartComponent {...mockProps} />
      </MockWrapper>
    );
    
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
  });

  test('LineChartComponent renders properly', () => {
    render(
      <MockWrapper>
        <LineChartComponent {...mockProps} />
      </MockWrapper>
    );
    
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('line')).toBeInTheDocument();
  });

  test('AreaChartComponent renders properly', () => {
    render(
      <MockWrapper>
        <AreaChartComponent {...mockProps} />
      </MockWrapper>
    );
    
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('area')).toBeInTheDocument();
  });

  test('PieChartComponent renders properly', () => {
    render(
      <MockWrapper>
        <PieChartComponent {...mockProps} />
      </MockWrapper>
    );
    
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  test('components render with valueFormatter', () => {
    const valueFormatter = (value: number) => `$${value}`;
    
    render(
      <MockWrapper>
        <BarChartComponent {...mockProps} valueFormatter={valueFormatter} />
      </MockWrapper>
    );
    
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    // The formatter is passed to the tooltip content, which we've already tested separately
  });
});
