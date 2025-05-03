
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
    const quantity = Number(material.quantity);
    if (isNaN(quantity)) {
      errors.push({
        field: `materials[${index}].quantity`,
        message: "Quantity must be a number"
      });
    } else if (quantity < 0) {
      errors.push({
        field: `materials[${index}].quantity`,
        message: "Quantity cannot be negative"
      });
    } else if (quantity > MAX_QUANTITY) {
      errors.push({
        field: `materials[${index}].quantity`,
        message: `Maximum quantity is ${MAX_QUANTITY} kg`
      });
    }
  });

  // Validate transport
  input.transport.forEach((transport, index) => {
    const distance = Number(transport.distance);
    if (isNaN(distance)) {
      errors.push({
        field: `transport[${index}].distance`,
        message: "Distance must be a number"
      });
    } else if (distance < 0) {
      errors.push({
        field: `transport[${index}].distance`,
        message: "Distance cannot be negative"
      });
    } else if (distance > MAX_DISTANCE) {
      errors.push({
        field: `transport[${index}].distance`,
        message: `Maximum distance is ${MAX_DISTANCE} km`
      });
    }

    const weight = Number(transport.weight);
    if (transport.weight !== undefined && isNaN(weight)) {
      errors.push({
        field: `transport[${index}].weight`,
        message: "Weight must be a number"
      });
    } else if (transport.weight !== undefined && weight < 0) {
      errors.push({
        field: `transport[${index}].weight`,
        message: "Weight cannot be negative"
      });
    } else if (transport.weight !== undefined && weight > MAX_WEIGHT) {
      errors.push({
        field: `transport[${index}].weight`,
        message: `Maximum weight is ${MAX_WEIGHT} kg`
      });
    }
  });

  // Validate energy
  input.energy.forEach((energy, index) => {
    const amount = Number(energy.amount);
    if (isNaN(amount)) {
      errors.push({
        field: `energy[${index}].amount`,
        message: "Amount must be a number"
      });
    } else if (amount < 0) {
      errors.push({
        field: `energy[${index}].amount`,
        message: "Amount cannot be negative"
      });
    } else if (amount > MAX_ENERGY) {
      errors.push({
        field: `energy[${index}].amount`,
        message: `Maximum amount is ${MAX_ENERGY} units`
      });
    }
  });

  return errors;
};
