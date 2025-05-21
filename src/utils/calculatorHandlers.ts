
import { CalculationInput, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonExports";

/**
 * Adds a new material to the calculation input
 */
export function handleAddMaterial(calculationInput: CalculationInput): CalculationInput {
  return {
    ...calculationInput,
    materials: [
      ...calculationInput.materials,
      { type: "concrete", quantity: "" }
    ]
  };
}

/**
 * Updates a material in the calculation input
 */
export function handleUpdateMaterial(
  calculationInput: CalculationInput, 
  index: number, 
  field: keyof MaterialInput, 
  value: any
): CalculationInput {
  const updatedMaterials = [...calculationInput.materials];
  updatedMaterials[index] = {
    ...updatedMaterials[index],
    [field]: value
  };
  
  return {
    ...calculationInput,
    materials: updatedMaterials
  };
}

/**
 * Removes a material from the calculation input
 */
export function handleRemoveMaterial(
  calculationInput: CalculationInput, 
  index: number
): CalculationInput {
  const updatedMaterials = calculationInput.materials.filter((_, i) => i !== index);
  
  return {
    ...calculationInput,
    materials: updatedMaterials
  };
}

/**
 * Adds a new transport item to the calculation input
 */
export function handleAddTransport(calculationInput: CalculationInput): CalculationInput {
  return {
    ...calculationInput,
    transport: [
      ...calculationInput.transport,
      { type: "truck", distance: "", weight: "" }
    ]
  };
}

/**
 * Updates a transport item in the calculation input
 */
export function handleUpdateTransport(
  calculationInput: CalculationInput,
  index: number,
  field: keyof TransportInput,
  value: any
): CalculationInput {
  const updatedTransport = [...calculationInput.transport];
  updatedTransport[index] = {
    ...updatedTransport[index],
    [field]: value
  };
  
  return {
    ...calculationInput,
    transport: updatedTransport
  };
}

/**
 * Removes a transport item from the calculation input
 */
export function handleRemoveTransport(
  calculationInput: CalculationInput,
  index: number
): CalculationInput {
  const updatedTransport = calculationInput.transport.filter((_, i) => i !== index);
  
  return {
    ...calculationInput,
    transport: updatedTransport
  };
}

/**
 * Adds a new energy item to the calculation input
 */
export function handleAddEnergy(calculationInput: CalculationInput): CalculationInput {
  return {
    ...calculationInput,
    energy: [
      ...calculationInput.energy,
      { type: "electricity", amount: "" }
    ]
  };
}

/**
 * Updates an energy item in the calculation input
 */
export function handleUpdateEnergy(
  calculationInput: CalculationInput,
  index: number,
  field: keyof EnergyInput,
  value: any
): CalculationInput {
  const updatedEnergy = [...calculationInput.energy];
  updatedEnergy[index] = {
    ...updatedEnergy[index],
    [field]: value
  };
  
  return {
    ...calculationInput,
    energy: updatedEnergy
  };
}

/**
 * Removes an energy item from the calculation input
 */
export function handleRemoveEnergy(
  calculationInput: CalculationInput,
  index: number
): CalculationInput {
  const updatedEnergy = calculationInput.energy.filter((_, i) => i !== index);
  
  return {
    ...calculationInput,
    energy: updatedEnergy
  };
}
