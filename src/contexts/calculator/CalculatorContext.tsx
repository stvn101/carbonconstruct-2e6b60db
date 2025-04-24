
import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { CalculationInput, CalculationResult, calculateTotalEmissions } from "@/lib/carbonCalculations";
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
import { validateCalculationInput, ValidationError } from "@/utils/calculatorValidation";
import { toast } from "sonner";
import { MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonTypes";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const DEFAULT_CALCULATION_INPUT: CalculationInput = {
  materials: [{ type: "concrete", quantity: 1000 }],
  transport: [{ type: "truck", distance: 100, weight: 1000 }],
  energy: [{ type: "electricity", amount: 500 }]
};

export const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [calculationInput, setCalculationInput] = useState<CalculationInput>(DEFAULT_CALCULATION_INPUT);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'materials' | 'transport' | 'energy' | 'results'>('materials');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
  }, [activeTab]);

  const handleCalculate = useCallback(() => {
    try {
      if (!isOnline) {
        toast.error("You're offline. Cannot perform calculations.");
        return;
      }
      
      const errors = validateCalculationInput(calculationInput);
      if (errors.length > 0) {
        setValidationErrors(errors);
        const errorMessages = errors.map(e => e.message);
        toast.error(errorMessages[0]);
        return;
      }
      
      setValidationErrors([]);
      
      const result = calculateTotalEmissions(calculationInput);
      setCalculationResult(result);
      
      console.log('Calculation completed:', {
        input: calculationInput,
        result: result
      });
    } catch (error) {
      console.error("Error calculating emissions:", error);
      toast.error("Error calculating emissions. Please check your inputs.");
    }
  }, [calculationInput, isOnline]);

  const handleNextTab = useCallback(() => {
    console.log(`Current tab: ${activeTab}, moving to next tab`);
    if (activeTab === "materials") {
      setActiveTab("transport");
      console.log("Tab set to transport");
    }
    else if (activeTab === "transport") {
      setActiveTab("energy");
      console.log("Tab set to energy");
    }
    else if (activeTab === "energy") {
      handleCalculate();
      setActiveTab("results");
      console.log("Tab set to results");
    }
  }, [activeTab, handleCalculate]);

  const handlePrevTab = useCallback(() => {
    console.log(`Current tab: ${activeTab}, moving to previous tab`);
    if (activeTab === "transport") {
      setActiveTab("materials");
      console.log("Tab set to materials");
    }
    else if (activeTab === "energy") {
      setActiveTab("transport");
      console.log("Tab set to transport");
    }
    else if (activeTab === "results") {
      setActiveTab("energy");
      console.log("Tab set to energy");
    }
  }, [activeTab]);

  const contextValue = useMemo(() => ({
    calculationInput,
    setCalculationInput,
    calculationResult,
    setCalculationResult,
    activeTab,
    setActiveTab,
    validationErrors,
    handleAddMaterial: () => setCalculationInput(current => handleAddMaterial(current)),
    handleUpdateMaterial: (index: number, field: keyof MaterialInput, value: any) => 
      setCalculationInput(current => handleUpdateMaterial(current, index, field, value)),
    handleRemoveMaterial: (index: number) => 
      setCalculationInput(current => handleRemoveMaterial(current, index)),
    handleAddTransport: () => setCalculationInput(current => handleAddTransport(current)),
    handleUpdateTransport: (index: number, field: keyof TransportInput, value: any) => 
      setCalculationInput(current => handleUpdateTransport(current, index, field, value)),
    handleRemoveTransport: (index: number) => 
      setCalculationInput(current => handleRemoveTransport(current, index)),
    handleAddEnergy: () => setCalculationInput(current => handleAddEnergy(current)),
    handleUpdateEnergy: (index: number, field: keyof EnergyInput, value: any) => 
      setCalculationInput(current => handleUpdateEnergy(current, index, field, value)),
    handleRemoveEnergy: (index: number) => 
      setCalculationInput(current => handleRemoveEnergy(current, index)),
    handleCalculate,
    handleNextTab,
    handlePrevTab
  }), [calculationInput, calculationResult, activeTab, validationErrors, handleCalculate, handleNextTab, handlePrevTab]);

  return (
    <CalculatorContext.Provider value={contextValue}>
      {children}
    </CalculatorContext.Provider>
  );
};
