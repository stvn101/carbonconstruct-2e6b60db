
import { CalculationInput } from "@/lib/carbonTypes";

export const MAX_QUANTITY = 10000;
export const MAX_DISTANCE = 10000;
export const MAX_WEIGHT = 10000;
export const MAX_ENERGY = 10000;

export interface ValidationError {
  field: string;
  message: string;
}

export const validateCalculationInput = (input: CalculationInput): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate materials
  input.materials.forEach((material, index) => {
    if (material.quantity < 0) {
      errors.push({
        field: `materials[${index}].quantity`,
        message: "Quantity cannot be negative"
      });
    }
    if (material.quantity > MAX_QUANTITY) {
      errors.push({
        field: `materials[${index}].quantity`,
        message: `Maximum quantity is ${MAX_QUANTITY} kg`
      });
    }
  });

  // Validate transport
  input.transport.forEach((transport, index) => {
    if (transport.distance < 0) {
      errors.push({
        field: `transport[${index}].distance`,
        message: "Distance cannot be negative"
      });
    }
    if (transport.distance > MAX_DISTANCE) {
      errors.push({
        field: `transport[${index}].distance`,
        message: `Maximum distance is ${MAX_DISTANCE} km`
      });
    }
    if (transport.weight < 0) {
      errors.push({
        field: `transport[${index}].weight`,
        message: "Weight cannot be negative"
      });
    }
    if (transport.weight > MAX_WEIGHT) {
      errors.push({
        field: `transport[${index}].weight`,
        message: `Maximum weight is ${MAX_WEIGHT} kg`
      });
    }
  });

  // Validate energy
  input.energy.forEach((energy, index) => {
    if (energy.amount < 0) {
      errors.push({
        field: `energy[${index}].amount`,
        message: "Amount cannot be negative"
      });
    }
    if (energy.amount > MAX_ENERGY) {
      errors.push({
        field: `energy[${index}].amount`,
        message: `Maximum amount is ${MAX_ENERGY} units`
      });
    }
  });

  return errors;
};
