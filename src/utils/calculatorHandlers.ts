
import {
  CalculationInput,
  MaterialInput,
  TransportInput,
  EnergyInput
} from "@/lib/carbonExports";

// Material Handlers
export const handleAddMaterial = (calculationInput: CalculationInput): CalculationInput => {
  const newMaterial: MaterialInput = {
    name: "New Material",
    type: "concrete",
    quantity: 0,
    unit: "kg",
    carbonFootprint: 0.12
  };
  return {
    ...calculationInput,
    materials: [...calculationInput.materials, newMaterial]
  };
};

export const handleUpdateMaterial = (
  calculationInput: CalculationInput,
  index: number,
  field: keyof MaterialInput,
  value: any
): CalculationInput => {
  const updatedMaterials = [...calculationInput.materials];
  updatedMaterials[index] = {
    ...updatedMaterials[index],
    [field]: field === 'quantity' || field === 'carbonFootprint' || field === 'recycledContent' 
      ? Number(value) 
      : value
  };
  return {
    ...calculationInput,
    materials: updatedMaterials
  };
};

export const handleRemoveMaterial = (
  calculationInput: CalculationInput,
  index: number
): CalculationInput => {
  const updatedMaterials = [...calculationInput.materials];
  updatedMaterials.splice(index, 1);
  return {
    ...calculationInput,
    materials: updatedMaterials
  };
};

// Transport Handlers
export const handleAddTransport = (calculationInput: CalculationInput): CalculationInput => {
  const newTransport: TransportInput = {
    mode: "truck",
    distance: 0,
    weight: 0,
    carbonFootprint: 0.1
  };
  return {
    ...calculationInput,
    transport: [...calculationInput.transport, newTransport]
  };
};

export const handleUpdateTransport = (
  calculationInput: CalculationInput,
  index: number,
  field: keyof TransportInput,
  value: any
): CalculationInput => {
  const updatedTransport = [...calculationInput.transport];
  updatedTransport[index] = {
    ...updatedTransport[index],
    [field]: field === 'distance' || field === 'weight' || field === 'carbonFootprint'
      ? Number(value)
      : value
  };
  
  // For backward compatibility, sync type with mode if updating mode
  if (field === 'mode') {
    updatedTransport[index].type = value;
  }
  
  return {
    ...calculationInput,
    transport: updatedTransport
  };
};

export const handleRemoveTransport = (
  calculationInput: CalculationInput,
  index: number
): CalculationInput => {
  const updatedTransport = [...calculationInput.transport];
  updatedTransport.splice(index, 1);
  return {
    ...calculationInput,
    transport: updatedTransport
  };
};

// Energy Handlers
export const handleAddEnergy = (calculationInput: CalculationInput): CalculationInput => {
  const newEnergy: EnergyInput = {
    type: "electricity",
    amount: 0,
    unit: "kWh",
    carbonFootprint: 0.5
  };
  return {
    ...calculationInput,
    energy: [...calculationInput.energy, newEnergy]
  };
};

export const handleUpdateEnergy = (
  calculationInput: CalculationInput,
  index: number,
  field: keyof EnergyInput,
  value: any
): CalculationInput => {
  const updatedEnergy = [...calculationInput.energy];
  updatedEnergy[index] = {
    ...updatedEnergy[index],
    [field]: field === 'amount' || field === 'carbonFootprint'
      ? Number(value)
      : value
  };
  
  // For backward compatibility, sync quantity with amount if updating amount
  if (field === 'amount') {
    updatedEnergy[index].quantity = Number(value);
  }
  
  return {
    ...calculationInput,
    energy: updatedEnergy
  };
};

export const handleRemoveEnergy = (
  calculationInput: CalculationInput,
  index: number
): CalculationInput => {
  const updatedEnergy = [...calculationInput.energy];
  updatedEnergy.splice(index, 1);
  return {
    ...calculationInput,
    energy: updatedEnergy
  };
};
