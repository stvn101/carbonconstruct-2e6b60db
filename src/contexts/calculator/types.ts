
import { CalculationInput, CalculationResult, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonCalculations";

export type CalculatorContextType = {
  calculationInput: CalculationInput;
  calculationResult: CalculationResult | null;
  activeTab: 'materials' | 'transport' | 'energy' | 'results';
  setActiveTab: (value: 'materials' | 'transport' | 'energy' | 'results') => void;
  handleAddMaterial: () => void;
  handleUpdateMaterial: (index: number, field: keyof MaterialInput, value: string | number) => void;
  handleRemoveMaterial: (index: number) => void;
  handleAddTransport: () => void;
  handleUpdateTransport: (index: number, field: keyof TransportInput, value: string | number) => void;
  handleRemoveTransport: (index: number) => void;
  handleAddEnergy: () => void;
  handleUpdateEnergy: (index: number, field: keyof EnergyInput, value: string | number) => void;
  handleRemoveEnergy: (index: number) => void;
  handleCalculate: () => void;
  handleNextTab: () => void;
  handlePrevTab: () => void;
  setCalculationInput: (input: CalculationInput) => void;
  setCalculationResult: (result: CalculationResult | null) => void;
};
