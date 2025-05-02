
import { useCallback } from "react";
import { CalculationInput } from "@/lib/carbonCalculations";
import { validateCalculationInput } from "@/utils/calculatorValidation";

export function useCalculatorValidation(calculationInput: CalculationInput) {
  // Helper function to check if inputs have valid values
  const hasValidInputs = useCallback(() => {
    const hasValidMaterials = calculationInput.materials?.some(m => Number(m.quantity) > 0) || false;
    const hasValidTransport = calculationInput.transport?.some(t => Number(t.distance) > 0 && Number(t.weight) > 0) || false;
    const hasValidEnergy = calculationInput.energy?.some(e => Number(e.amount) > 0) || false;
    
    if (!hasValidMaterials && !hasValidTransport && !hasValidEnergy) {
      return {
        valid: false,
        reason: "You need to add at least one valid material, transport, or energy input with values greater than zero."
      };
    }
    
    return { valid: true, reason: "" };
  }, [calculationInput]);

  // Check for extreme values that might cause calculation issues
  const checkForExtremeValues = useCallback(() => {
    const MAX_SAFE_VALUE = 1e12; // 1 trillion as a reasonable upper limit
    
    // Check materials
    for (const material of calculationInput.materials || []) {
      if (material.quantity > MAX_SAFE_VALUE) {
        return {
          valid: false,
          reason: `Material quantity for ${material.type} is extremely large and may cause calculation issues.`
        };
      }
    }
    
    // Check transport
    for (const item of calculationInput.transport || []) {
      if (item.distance > MAX_SAFE_VALUE) {
        return {
          valid: false,
          reason: `Transport distance for ${item.type} is extremely large and may cause calculation issues.`
        };
      }
      if (item.weight > MAX_SAFE_VALUE) {
        return {
          valid: false,
          reason: `Transport weight for ${item.type} is extremely large and may cause calculation issues.`
        };
      }
    }
    
    // Check energy
    for (const item of calculationInput.energy || []) {
      if (item.amount > MAX_SAFE_VALUE) {
        return {
          valid: false,
          reason: `Energy amount for ${item.type} is extremely large and may cause calculation issues.`
        };
      }
    }
    
    return { valid: true, reason: "" };
  }, [calculationInput]);

  return {
    hasValidInputs,
    checkForExtremeValues,
  };
}
