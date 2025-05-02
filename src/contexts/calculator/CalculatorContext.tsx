
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
import { validateCalculationInput } from "@/utils/calculatorValidation";
import { toast } from "sonner";
import { MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonTypes";

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
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
  }, [activeTab]);

  const handleCalculate = useCallback(() => {
    try {
      console.log("Starting calculation with input:", calculationInput);
      setIsCalculating(true);
      
      if (!navigator.onLine) {
        toast.error("You're offline. Cannot perform calculations.");
        setIsCalculating(false);
        return;
      }
      
      const errors = validateCalculationInput(calculationInput);
      if (errors.length > 0) {
        toast.error(errors[0].message);
        setIsCalculating(false);
        return;
      }
      
      // Debug logs to track the calculation flow
      console.log("Materials for calculation:", calculationInput.materials);
      console.log("Transport for calculation:", calculationInput.transport);
      console.log("Energy for calculation:", calculationInput.energy);
      
      const result = calculateTotalEmissions(calculationInput);
      console.log('Calculation completed with result:', result);
      setCalculationResult(result);
      setIsCalculating(false);
      
      // Show success toast
      toast.success("Calculation completed successfully!");
    } catch (error) {
      console.error("Error calculating emissions:", error);
      toast.error("Error calculating emissions. Please check your inputs.");
      setIsCalculating(false);
    }
  }, [calculationInput]);

  const handleNextTab = useCallback(() => {
    if (activeTab === "materials") {
      setActiveTab("transport");
    }
    else if (activeTab === "transport") {
      setActiveTab("energy");
    }
    else if (activeTab === "energy") {
      setIsCalculating(true);
      
      // Slight delay to allow UI to update before heavy calculation
      setTimeout(() => {
        const result = calculateTotalEmissions(calculationInput);
        setCalculationResult(result);
        setActiveTab("results");
        setIsCalculating(false);
      }, 100);
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

  const contextValue = useMemo(() => ({
    calculationInput,
    setCalculationInput,
    calculationResult,
    setCalculationResult,
    activeTab,
    setActiveTab,
    validationErrors: [],
    isCalculating,
    setIsCalculating,
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
  }), [calculationInput, calculationResult, activeTab, isCalculating, handleCalculate, handleNextTab, handlePrevTab]);

  return (
    <CalculatorContext.Provider value={contextValue}>
      {children}
    </CalculatorContext.Provider>
  );
};
