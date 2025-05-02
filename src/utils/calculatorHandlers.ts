
import { CalculationInput, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonCalculations";

export const handleUpdateMaterial = (
  calculationInput: CalculationInput,
  index: number,
  field: keyof MaterialInput,
  value: string | number
): CalculationInput => {
  const updatedMaterials = [...calculationInput.materials];
  
  // Ensure materials array exists
  if (!updatedMaterials || !Array.isArray(updatedMaterials)) {
    return {
      ...calculationInput,
      materials: [{ type: "concrete", quantity: field === 'quantity' ? Number(value) : 0 }]
    };
  }
  
  // Convert numeric strings to numbers for quantity field
  if (field === 'quantity' && typeof value === 'string') {
    value = Number(value) || 0;
  }
  
  // Ensure the target item exists
  if (!updatedMaterials[index]) {
    updatedMaterials[index] = { type: "concrete", quantity: 0 };
  }
  
  updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
  return { ...calculationInput, materials: updatedMaterials };
};

export const handleAddMaterial = (calculationInput: CalculationInput): CalculationInput => {
  const materials = calculationInput.materials || [];
  return {
    ...calculationInput,
    materials: [...materials, { type: "concrete", quantity: 0 }]
  };
};

export const handleRemoveMaterial = (calculationInput: CalculationInput, index: number): CalculationInput => {
  const materials = calculationInput.materials || [];
  const updatedMaterials = materials.filter((_, i) => i !== index);
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
  const updatedTransport = [...(calculationInput.transport || [])];
  
  // Convert numeric strings to numbers for numeric fields
  if ((field === 'distance' || field === 'weight') && typeof value === 'string') {
    value = Number(value) || 0;
  }
  
  // Ensure the target item exists
  if (!updatedTransport[index]) {
    updatedTransport[index] = { type: "truck", distance: 0, weight: 0 };
  }
  
  updatedTransport[index] = { ...updatedTransport[index], [field]: value };
  return { ...calculationInput, transport: updatedTransport };
};

export const handleAddTransport = (calculationInput: CalculationInput): CalculationInput => {
  const transport = calculationInput.transport || [];
  return {
    ...calculationInput,
    transport: [...transport, { type: "truck", distance: 0, weight: 0 }]
  };
};

export const handleRemoveTransport = (calculationInput: CalculationInput, index: number): CalculationInput => {
  const transport = calculationInput.transport || [];
  const updatedTransport = transport.filter((_, i) => i !== index);
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
  const updatedEnergy = [...(calculationInput.energy || [])];
  
  // Convert numeric strings to numbers for amount field
  if (field === 'amount' && typeof value === 'string') {
    value = Number(value) || 0;
  }
  
  // Ensure the target item exists
  if (!updatedEnergy[index]) {
    updatedEnergy[index] = { type: "electricity", amount: 0 };
  }
  
  updatedEnergy[index] = { ...updatedEnergy[index], [field]: value };
  return { ...calculationInput, energy: updatedEnergy };
};

export const handleAddEnergy = (calculationInput: CalculationInput): CalculationInput => {
  const energy = calculationInput.energy || [];
  return {
    ...calculationInput,
    energy: [...energy, { type: "electricity", amount: 0 }]
  };
};

export const handleRemoveEnergy = (calculationInput: CalculationInput, index: number): CalculationInput => {
  const energy = calculationInput.energy || [];
  const updatedEnergy = energy.filter((_, i) => i !== index);
  return {
    ...calculationInput,
    energy: updatedEnergy.length ? updatedEnergy : [{ type: "electricity", amount: 0 }]
  };
};
