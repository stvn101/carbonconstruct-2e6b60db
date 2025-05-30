
import { 
  CalculationInput, 
  CalculationResult,
  MaterialInput,
  TransportInput,
  EnergyInput
} from "@/lib/carbonExports";
import { ValidationError } from "@/utils/calculatorValidation";

export interface CalculatorContextType {
  calculationInput: CalculationInput;
  setCalculationInput: (input: CalculationInput) => void;
  calculationResult: CalculationResult | null;
  setCalculationResult: (result: CalculationResult | null) => void;
  activeTab: 'materials' | 'transport' | 'energy' | 'results';
  setActiveTab: (tab: 'materials' | 'transport' | 'energy' | 'results') => void;
  validationErrors: ValidationError[];
  isCalculating: boolean;
  setIsCalculating: (isCalculating: boolean) => void;
  handleAddMaterial: () => void;
  handleUpdateMaterial: (index: number, field: keyof MaterialInput, value: any) => void;
  handleRemoveMaterial: (index: number) => void;
  handleAddTransport: () => void;
  handleUpdateTransport: (index: number, field: keyof TransportInput, value: any) => void;
  handleRemoveTransport: (index: number) => void;
  handleAddEnergy: () => void;
  handleUpdateEnergy: (index: number, field: keyof EnergyInput, value: any) => void;
  handleRemoveEnergy: (index: number) => void;
  handleCalculate: () => void;
  handleNextTab: () => void;
  handlePrevTab: () => void;
}
