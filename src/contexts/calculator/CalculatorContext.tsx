
import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { CalculationResult, CalculationInput, MaterialInput, TransportInput, EnergyInput, calculateTotalEmissions } from "@/lib/carbonExports";
import { CalculatorContextType } from "./types";
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
import { validateCalculationInput } from "@/utils/calculatorValidation";
import { toast } from "sonner";

const DEFAULT_CALCULATION_INPUT: CalculationInput = {
  materials: [{ name: "Concrete", type: "concrete", quantity: 1000, unit: "kg", carbonFootprint: 0.12 }],
  transport: [{ mode: "truck", distance: 100, weight: 1000, carbonFootprint: 0.1 }],
  energy: [{ type: "electricity", amount: 500, unit: "kWh", carbonFootprint: 0.5 }]
};

export const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [calculationInput, setCalculationInput] = useState<CalculationInput>(DEFAULT_CALCULATION_INPUT);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'materials' | 'transport' | 'energy' | 'results'>('materials');
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Array<{field: string, message: string}>>([]);

  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
    
    // When switching to results tab, preemptively validate inputs
    if (activeTab === 'results' && !calculationResult) {
      const errors = validateCalculationInput(calculationInput);
      setValidationErrors(errors);
    }
  }, [activeTab, calculationInput, calculationResult]);

  // Helper function to check if inputs have valid values
  const hasValidInputs = useCallback(() => {
    const hasValidMaterials = calculationInput.materials?.some(m => Number(m.quantity) > 0) || false;
    const hasValidTransport = calculationInput.transport?.some(t => Number(t.distance) > 0 && Number(t.weight) > 0) || false;
    const hasValidEnergy = calculationInput.energy?.some(e => Number(e.amount) > 0) || false;
    
    return hasValidMaterials || hasValidTransport || hasValidEnergy;
  }, [calculationInput]);

  const handleCalculate = useCallback(() => {
    try {
      console.log("Starting calculation with input:", calculationInput);
      setIsCalculating(true);
      
      if (!navigator.onLine) {
        toast.error("You're offline. Cannot perform calculations.");
        setIsCalculating(false);
        return;
      }
      
      // Basic validation to ensure we have some data to calculate with
      if (!hasValidInputs()) {
        toast.error("You need to add at least one material, transport, or energy input with values greater than zero.");
        setIsCalculating(false);
        return;
      }
      
      const errors = validateCalculationInput(calculationInput);
      if (errors.length > 0) {
        toast.error(errors[0].message);
        setValidationErrors(errors);
        setIsCalculating(false);
        return;
      }
      
      // Clear previous errors
      setValidationErrors([]);
      
      // Debug logs to track the calculation flow
      console.log("Materials for calculation:", calculationInput.materials);
      console.log("Transport for calculation:", calculationInput.transport);
      console.log("Energy for calculation:", calculationInput.energy);
      
      // Perform the calculation with a small delay to allow UI to update
      setTimeout(() => {
        try {
          // Convert input types to ensure compatibility
          const calculationInputModified = {
            ...calculationInput,
            transport: calculationInput.transport.map(t => ({
              ...t,
              type: t.mode // Ensure we have a type property for compatibility
            }))
          };
          
          // Perform the calculation
          const result = calculateTotalEmissions(calculationInputModified);
          console.log('Calculation completed with result:', result);
          
          // Add required fields to match the CalculationResult type
          const resultWithFormattedData: CalculationResult = {
            ...result,
            totalCO2: result.totalEmissions,
            breakdownByCategory: {
              materials: result.breakdown.materials,
              transport: result.breakdown.transport,
              energy: result.breakdown.energy
            },
            sustainabilityScore: 50, // Default score
            timestamp: new Date().toISOString()
          };
          
          // Validate the result
          if (result.totalEmissions === 0 && 
              Object.keys(result.breakdownByMaterial || {}).length === 0 &&
              Object.keys(result.breakdownByTransport || {}).length === 0 &&
              Object.keys(result.breakdownByEnergy || {}).length === 0) {
            console.warn("Calculation produced empty result");
            toast.warning("Calculation produced no emissions data. Please check your inputs.");
          } else {
            toast.success("Calculation completed successfully!");
          }
          
          setCalculationResult(resultWithFormattedData);
          setActiveTab("results");
        } catch (error) {
          console.error("Error during calculation:", error);
          toast.error("Failed to calculate emissions. Please try again.");
        } finally {
          setIsCalculating(false);
        }
      }, 500);
    } catch (error) {
      console.error("Error calculating emissions:", error);
      toast.error("Error calculating emissions. Please check your inputs.");
      setIsCalculating(false);
    }
  }, [calculationInput, hasValidInputs]);

  const handleNextTab = useCallback(() => {
    if (activeTab === "materials") {
      setActiveTab("transport");
    }
    else if (activeTab === "transport") {
      setActiveTab("energy");
    }
    else if (activeTab === "energy") {
      // When moving from energy to results, trigger calculation
      setIsCalculating(true);
      
      // Slight delay to allow UI to update before heavy calculation
      setTimeout(() => {
        try {
          // Convert input types to ensure compatibility
          const calculationInputModified = {
            ...calculationInput,
            transport: calculationInput.transport.map(t => ({
              ...t,
              type: t.mode // Ensure we have a type property for compatibility
            }))
          };
          
          const result = calculateTotalEmissions(calculationInputModified);
          
          // Add required fields to match the CalculationResult type
          const resultWithFormattedData: CalculationResult = {
            ...result,
            totalCO2: result.totalEmissions,
            breakdownByCategory: {
              materials: result.breakdown.materials,
              transport: result.breakdown.transport,
              energy: result.breakdown.energy
            },
            sustainabilityScore: 50, // Default score
            timestamp: new Date().toISOString()
          };
          
          setCalculationResult(resultWithFormattedData);
          setActiveTab("results");
        } catch (error) {
          console.error("Error during calculation:", error);
          toast.error("Failed to calculate emissions. Please try again.");
        } finally {
          setIsCalculating(false);
        }
      }, 500);
    }
  }, [activeTab, calculationInput]);

  const handlePrevTab = useCallback(() => {
    if (activeTab === "transport") {
      setActiveTab("materials");
    }
    else if (activeTab === "energy") {
      setActiveTab("transport");
    }
    else if (activeTab === "results") {
      setActiveTab("energy");
    }
  }, [activeTab]);

  // Update the contextValue creation to work with our types
  const contextValue = useMemo(() => ({
    calculationInput,
    setCalculationInput,
    calculationResult,
    setCalculationResult,
    activeTab,
    setActiveTab,
    validationErrors,
    isCalculating,
    setIsCalculating,
    handleAddMaterial: () => {
      const newInput = handleAddMaterial(calculationInput);
      setCalculationInput(newInput);
    },
    handleUpdateMaterial: (index: number, field: keyof MaterialInput, value: any) => {
      const newInput = handleUpdateMaterial(calculationInput, index, field, value);
      setCalculationInput(newInput);
    },
    handleRemoveMaterial: (index: number) => {
      const newInput = handleRemoveMaterial(calculationInput, index);
      setCalculationInput(newInput);
    },
    handleAddTransport: () => {
      const newInput = handleAddTransport(calculationInput);
      setCalculationInput(newInput);
    },
    handleUpdateTransport: (index: number, field: keyof TransportInput, value: any) => {
      const newInput = handleUpdateTransport(calculationInput, index, field, value);
      setCalculationInput(newInput);
    },
    handleRemoveTransport: (index: number) => {
      const newInput = handleRemoveTransport(calculationInput, index);
      setCalculationInput(newInput);
    },
    handleAddEnergy: () => {
      const newInput = handleAddEnergy(calculationInput);
      setCalculationInput(newInput);
    },
    handleUpdateEnergy: (index: number, field: keyof EnergyInput, value: any) => {
      const newInput = handleUpdateEnergy(calculationInput, index, field, value);
      setCalculationInput(newInput);
    },
    handleRemoveEnergy: (index: number) => {
      const newInput = handleRemoveEnergy(calculationInput, index);
      setCalculationInput(newInput);
    },
    handleCalculate,
    handleNextTab,
    handlePrevTab
  }), [calculationInput, calculationResult, activeTab, isCalculating, validationErrors, handleCalculate, handleNextTab, handlePrevTab]);

  return (
    <CalculatorContext.Provider value={contextValue}>
      {children}
    </CalculatorContext.Provider>
  );
};
