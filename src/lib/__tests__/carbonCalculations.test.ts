
import { describe, it, expect } from 'vitest';
import { 
  calculateMaterialEmissions,
  calculateTransportEmissions,
  calculateEnergyEmissions,
  calculateTotalEmissions 
} from '../carbonCalculations';
import { MaterialInput, TransportInput, EnergyInput } from '../carbonTypes';

describe('Carbon Calculations', () => {
  describe('calculateMaterialEmissions', () => {
    it('should correctly calculate emissions for single material', () => {
      const materials: MaterialInput[] = [
        { type: 'concrete', quantity: 1000 }
      ];
      const result = calculateMaterialEmissions(materials);
      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('number');
    });

    it('should return 0 for empty materials array', () => {
      const result = calculateMaterialEmissions([]);
      expect(result).toBe(0);
    });
  });

  describe('calculateTransportEmissions', () => {
    it('should correctly calculate emissions for single transport', () => {
      const transport: TransportInput[] = [
        { type: 'truck', distance: 100, weight: 1000 }
      ];
      const result = calculateTransportEmissions(transport);
      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('number');
    });
  });

  describe('calculateTotalEmissions', () => {
    it('should combine all emission types correctly', () => {
      const input = {
        materials: [{ type: 'concrete', quantity: 1000 }],
        transport: [{ type: 'truck', distance: 100, weight: 1000 }],
        energy: [{ type: 'electricity', amount: 500 }]
      };

      const result = calculateTotalEmissions(input);
      
      expect(result.materialEmissions).toBeGreaterThan(0);
      expect(result.transportEmissions).toBeGreaterThan(0);
      expect(result.energyEmissions).toBeGreaterThan(0);
      expect(result.totalEmissions).toBe(
        result.materialEmissions + 
        result.transportEmissions + 
        result.energyEmissions
      );
    });
  });
});
