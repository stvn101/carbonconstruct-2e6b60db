
import { describe, it, expect } from 'vitest';
import { 
  processMaterialsInBatches as calculateMaterialEmissions,
  processTransportInBatches as calculateTransportEmissions,
  calculateEnergyEmissions,
  calculateTotalEmissions,
  Material,
  Transport,
  Energy,
  MaterialInput,
  TransportInput,
  EnergyInput,
  CalculationInput
} from '../carbonExports';

describe('Carbon Calculations', () => {
  describe('calculateMaterialEmissions', () => {
    it('should correctly calculate emissions for single material', () => {
      const materials: MaterialInput[] = [
        { type: "concrete" as Material, quantity: 1000 }
      ];
      const result = calculateMaterialEmissions(materials);
      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('object');
      expect(typeof result.total).toBe('number');
    });

    it('should return 0 for empty materials array', () => {
      const result = calculateMaterialEmissions([]);
      expect(result.total).toBe(0);
    });
  });

  describe('calculateTransportEmissions', () => {
    it('should correctly calculate emissions for single transport', () => {
      const transport: TransportInput[] = [
        { type: "truck" as Transport, distance: 100, weight: 1000 }
      ];
      const result = calculateTransportEmissions(transport);
      expect(result.total).toBeGreaterThan(0);
      expect(typeof result.total).toBe('number');
    });
  });

  describe('calculateTotalEmissions', () => {
    it('should combine all emission types correctly', () => {
      const input: CalculationInput = {
        materials: [{ type: "concrete" as Material, quantity: 1000 }],
        transport: [{ type: "truck" as Transport, distance: 100, weight: 1000 }],
        energy: [{ type: "electricity" as Energy, amount: 500 }]
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
