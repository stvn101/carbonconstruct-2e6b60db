
import { CalculationInput } from "@/lib/carbonExports";

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates the calculation input for required fields and valid values
 */
export function validateCalculationInput(input: CalculationInput): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Validate materials
  input.materials.forEach((material, index) => {
    if (!material.type) {
      errors.push({
        field: `materials[${index}].type`,
        message: `Material ${index + 1} must have a type selected.`
      });
    }
    
    if (!material.quantity) {
      errors.push({
        field: `materials[${index}].quantity`,
        message: `Material ${index + 1} must have a quantity specified.`
      });
    } else if (Number(material.quantity) <= 0) {
      errors.push({
        field: `materials[${index}].quantity`,
        message: `Material ${index + 1} must have a positive quantity.`
      });
    }
  });
  
  // Validate transport
  input.transport.forEach((transport, index) => {
    if (!transport.type) {
      errors.push({
        field: `transport[${index}].type`,
        message: `Transport ${index + 1} must have a type selected.`
      });
    }
    
    if (!transport.distance) {
      errors.push({
        field: `transport[${index}].distance`,
        message: `Transport ${index + 1} must have a distance specified.`
      });
    } else if (Number(transport.distance) <= 0) {
      errors.push({
        field: `transport[${index}].distance`,
        message: `Transport ${index + 1} must have a positive distance.`
      });
    }
    
    if (!transport.weight) {
      errors.push({
        field: `transport[${index}].weight`,
        message: `Transport ${index + 1} must have a weight specified.`
      });
    } else if (Number(transport.weight) <= 0) {
      errors.push({
        field: `transport[${index}].weight`,
        message: `Transport ${index + 1} must have a positive weight.`
      });
    }
  });
  
  // Validate energy
  input.energy.forEach((energy, index) => {
    if (!energy.type) {
      errors.push({
        field: `energy[${index}].type`,
        message: `Energy ${index + 1} must have a type selected.`
      });
    }
    
    // Check either amount or quantity is specified and valid
    const hasAmount = energy.amount !== undefined && energy.amount !== '';
    const hasQuantity = energy.quantity !== undefined && energy.quantity !== '';
    
    if (!hasAmount && !hasQuantity) {
      errors.push({
        field: `energy[${index}].amount`,
        message: `Energy ${index + 1} must have an amount specified.`
      });
    } else if ((hasAmount && Number(energy.amount) <= 0) && 
               (hasQuantity && Number(energy.quantity) <= 0)) {
      errors.push({
        field: `energy[${index}].amount`,
        message: `Energy ${index + 1} must have a positive amount.`
      });
    }
  });
  
  return errors;
}
