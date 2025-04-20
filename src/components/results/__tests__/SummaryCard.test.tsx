
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import SummaryCard from '../SummaryCard';

describe('SummaryCard', () => {
  const mockResult = {
    materialEmissions: 100,
    transportEmissions: 50,
    energyEmissions: 25,
    totalEmissions: 175,
    breakdownByMaterial: {},
    breakdownByTransport: {},
    breakdownByEnergy: {}
  };

  it('renders the total emissions correctly', () => {
    render(<SummaryCard result={mockResult} />);
    expect(screen.getByText('175.00')).toBeInTheDocument();
    expect(screen.getByText('kg CO2e')).toBeInTheDocument();
  });

  it('shows correct intensity category for moderate emissions', () => {
    render(<SummaryCard result={mockResult} />);
    expect(screen.getByText('Moderate Carbon Intensity')).toBeInTheDocument();
  });

  it('shows correct intensity category for low emissions', () => {
    const lowResult = { ...mockResult, totalEmissions: 50 };
    render(<SummaryCard result={lowResult} />);
    expect(screen.getByText('Low Carbon Intensity')).toBeInTheDocument();
  });

  it('shows correct intensity category for high emissions', () => {
    const highResult = { ...mockResult, totalEmissions: 600 };
    render(<SummaryCard result={highResult} />);
    expect(screen.getByText('High Carbon Intensity')).toBeInTheDocument();
  });
});
