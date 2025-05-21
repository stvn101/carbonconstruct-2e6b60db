
import { CalculationResult as CalculationResultType } from "./carbonCalculations";
import { MaterialInput as MaterialInputType, TransportInput as TransportInputType, EnergyInput as EnergyInputType } from "./carbonTypes";

// Re-export types from carbonTypes.ts
export type MaterialInput = MaterialInputType;
export type TransportInput = TransportInputType;
export type EnergyInput = EnergyInputType;

// Export Material, Transport and Energy types
export type { Material, Transport, Energy } from "./carbonTypes";

// Export the calculation types
export interface CalculationInput {
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  project?: {
    name: string;
    location: string;
    area: string;
    type: string;
  };
}

// Extend the CalculationResult to include timestamp
export interface CalculationResult extends CalculationResultType {
  timestamp: string;
}

// Export the factor maps
export { MATERIAL_FACTORS, TRANSPORT_FACTORS, ENERGY_FACTORS } from "./carbonData";
