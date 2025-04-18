
import { CalculationInput, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonCalculations";

export const handleUpdateMaterial = (
  calculationInput: CalculationInput,
  index: number,
  field: keyof MaterialInput,
  value: string | number
): CalculationInput => {
  const updatedMaterials = [...calculationInput.materials];
  updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
  return { ...calculationInput, materials: updatedMaterials };
};

export const handleAddMaterial = (calculationInput: CalculationInput): CalculationInput => {
  return {
    ...calculationInput,
    materials: [...calculationInput.materials, { type: "concrete", quantity: 0 }]
  };
};

export const handleRemoveMaterial = (calculationInput: CalculationInput, index: number): CalculationInput => {
  const updatedMaterials = calculationInput.materials.filter((_, i) => i !== index);
  return {
    ...calculationInput,
    materials: updatedMaterials.length ? updatedMaterials : [{ type: "concrete", quantity: 0 }]
  };
};

export const handleUpdateTransport = (
  calculationInput: CalculationInput,
  index: number,
  field: keyof TransportInput,
  value: string | number
): CalculationInput => {
  const updatedTransport = [...calculationInput.transport];
  updatedTransport[index] = { ...updatedTransport[index], [field]: value };
  return { ...calculationInput, transport: updatedTransport };
};

export const handleAddTransport = (calculationInput: CalculationInput): CalculationInput => {
  return {
    ...calculationInput,
    transport: [...calculationInput.transport, { type: "truck", distance: 0, weight: 0 }]
  };
};

export const handleRemoveTransport = (calculationInput: CalculationInput, index: number): CalculationInput => {
  const updatedTransport = calculationInput.transport.filter((_, i) => i !== index);
  return {
    ...calculationInput,
    transport: updatedTransport.length ? updatedTransport : [{ type: "truck", distance: 0, weight: 0 }]
  };
};

export const handleUpdateEnergy = (
  calculationInput: CalculationInput,
  index: number,
  field: keyof EnergyInput,
  value: string | number
): CalculationInput => {
  const updatedEnergy = [...calculationInput.energy];
  updatedEnergy[index] = { ...updatedEnergy[index], [field]: value };
  return { ...calculationInput, energy: updatedEnergy };
};

export const handleAddEnergy = (calculationInput: CalculationInput): CalculationInput => {
  return {
    ...calculationInput,
    energy: [...calculationInput.energy, { type: "electricity", amount: 0 }]
  };
};

export const handleRemoveEnergy = (calculationInput: CalculationInput, index: number): CalculationInput => {
  const updatedEnergy = calculationInput.energy.filter((_, i) => i !== index);
  return {
    ...calculationInput,
    energy: updatedEnergy.length ? updatedEnergy : [{ type: "electricity", amount: 0 }]
  };
};
