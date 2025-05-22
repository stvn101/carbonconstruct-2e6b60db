
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
  
  // Convert numeric fields to numbers
  let processedValue = value;
  if (field === 'quantity' || field === 'carbonFootprint' || field === 'recycledContent') {
    processedValue = Number(value);
  }
  
  updatedMaterials[index] = {
    ...updatedMaterials[index],
    [field]: processedValue
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
    carbonFootprint: 0.1,
    type: "truck" // Set type to match mode for compatibility
  };
  
  console.log("Adding new transport item:", newTransport);
  console.log("Current transport items:", calculationInput.transport);
  
  return {
    ...calculationInput,
    transport: [...(calculationInput.transport || []), newTransport]
  };
};

export const handleUpdateTransport = (
  calculationInput: CalculationInput,
  index: number,
  field: keyof TransportInput,
  value: any
): CalculationInput => {
  const updatedTransport = [...(calculationInput.transport || [])];
  
  // Convert numeric fields to numbers
  let processedValue = value;
  if (field === 'distance' || field === 'weight' || field === 'carbonFootprint') {
    processedValue = Number(value);
  }
  
  console.log(`Updating transport item ${index}, field ${String(field)} to:`, processedValue);
  
  updatedTransport[index] = {
    ...updatedTransport[index],
    [field]: processedValue
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
  const updatedTransport = [...(calculationInput.transport || [])];
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
    carbonFootprint: 0.5,
    quantity: 0 // For backward compatibility
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
  
  // Convert numeric fields to numbers
  let processedValue = value;
  if (field === 'amount' || field === 'carbonFootprint' || field === 'quantity') {
    processedValue = Number(value);
  }
  
  updatedEnergy[index] = {
    ...updatedEnergy[index],
    [field]: processedValue
  };
  
  // For backward compatibility, sync quantity with amount if updating amount
  if (field === 'amount') {
    updatedEnergy[index].quantity = Number(value);
  } else if (field === 'quantity') {
    updatedEnergy[index].amount = Number(value);
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
