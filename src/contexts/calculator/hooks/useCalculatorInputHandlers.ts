
import { useCallback } from "react";
import { CalculationInput, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonTypes";
import {
  handleAddMaterial,
  handleUpdateMaterial,
  handleRemoveMaterial,
  handleAddTransport,
  handleUpdateTransport,
  handleRemoveTransport,
  handleAddEnergy,
  handleUpdateEnergy,
  handleRemoveEnergy
} from "@/utils/calculatorHandlers";

type CalculatorInputHandlersProps = {
  setCalculationInput: (input: CalculationInput | ((prevInput: CalculationInput) => CalculationInput)) => void;
};

export function useCalculatorInputHandlers({ 
  setCalculationInput 
}: CalculatorInputHandlersProps) {
  
  const handleUpdateMaterialCallback = useCallback(
    (index: number, field: keyof MaterialInput, value: any) => 
      setCalculationInput(current => handleUpdateMaterial(current, index, field, value)),
    [setCalculationInput]
  );
  
  const handleAddMaterialCallback = useCallback(
    () => setCalculationInput(current => handleAddMaterial(current)),
    [setCalculationInput]
  );
  
  const handleRemoveMaterialCallback = useCallback(
    (index: number) => setCalculationInput(current => handleRemoveMaterial(current, index)),
    [setCalculationInput]
  );
  
  const handleUpdateTransportCallback = useCallback(
    (index: number, field: keyof TransportInput, value: any) => 
      setCalculationInput(current => handleUpdateTransport(current, index, field, value)),
    [setCalculationInput]
  );
  
  const handleAddTransportCallback = useCallback(
    () => setCalculationInput(current => handleAddTransport(current)),
    [setCalculationInput]
  );
  
  const handleRemoveTransportCallback = useCallback(
    (index: number) => setCalculationInput(current => handleRemoveTransport(current, index)),
    [setCalculationInput]
  );
  
  const handleUpdateEnergyCallback = useCallback(
    (index: number, field: keyof EnergyInput, value: any) => 
      setCalculationInput(current => handleUpdateEnergy(current, index, field, value)),
    [setCalculationInput]
  );
  
  const handleAddEnergyCallback = useCallback(
    () => setCalculationInput(current => handleAddEnergy(current)),
    [setCalculationInput]
  );
  
  const handleRemoveEnergyCallback = useCallback(
    (index: number) => setCalculationInput(current => handleRemoveEnergy(current, index)),
    [setCalculationInput]
  );

  return {
    handleUpdateMaterial: handleUpdateMaterialCallback,
    handleAddMaterial: handleAddMaterialCallback,
    handleRemoveMaterial: handleRemoveMaterialCallback,
    handleUpdateTransport: handleUpdateTransportCallback,
    handleAddTransport: handleAddTransportCallback,
    handleRemoveTransport: handleRemoveTransportCallback,
    handleUpdateEnergy: handleUpdateEnergyCallback,
    handleAddEnergy: handleAddEnergyCallback,
    handleRemoveEnergy: handleRemoveEnergyCallback
  };
}
