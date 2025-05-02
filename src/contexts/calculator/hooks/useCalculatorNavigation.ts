
import { useCallback } from "react";
import { toast } from "sonner";
import { calculateTotalEmissions, CalculationInput, CalculationResult } from "@/lib/carbonCalculations";

type CalculatorNavigationProps = {
  activeTab: 'materials' | 'transport' | 'energy' | 'results';
  setActiveTab: (tab: 'materials' | 'transport' | 'energy' | 'results') => void;
  calculationInput: CalculationInput;
  setCalculationResult: (result: CalculationResult | null) => void;
  setCalculationError: (error: Error | null) => void;
  setIsCalculating: (isCalculating: boolean) => void;
};

export function useCalculatorNavigation({
  activeTab, 
  setActiveTab,
  calculationInput,
  setCalculationResult,
  setCalculationError,
  setIsCalculating,
}: CalculatorNavigationProps) {

  const handleNextTab = useCallback(() => {
    try {
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
            // Guard against missing sections
            const safeInput = {
              materials: calculationInput.materials || [],
              transport: calculationInput.transport || [],
              energy: calculationInput.energy || []
            };
            
            const result = calculateTotalEmissions(safeInput);
            setCalculationResult(result);
            setActiveTab("results");
          } catch (error) {
            console.error("Error during calculation on tab change:", error);
            let errorMessage = "Failed to calculate emissions.";
            
            if (error instanceof Error) {
              errorMessage = `Calculation error: ${error.message}`;
              setCalculationError(error);
            } else {
              setCalculationError(new Error(errorMessage));
            }
            
            toast.error(errorMessage);
          } finally {
            setIsCalculating(false);
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error during tab navigation:", error);
      
      if (error instanceof Error) {
        toast.error(`Navigation error: ${error.message}`);
        setCalculationError(error);
      } else {
        toast.error("An unexpected error occurred during navigation.");
        setCalculationError(new Error("Navigation error"));
      }
    }
  }, [activeTab, calculationInput, setActiveTab, setCalculationError, setCalculationResult, setIsCalculating]);

  const handlePrevTab = useCallback(() => {
    try {
      if (activeTab === "transport") {
        setActiveTab("materials");
      }
      else if (activeTab === "energy") {
        setActiveTab("transport");
      }
      else if (activeTab === "results") {
        setActiveTab("energy");
      }
    } catch (error) {
      console.error("Error during tab navigation:", error);
      toast.error("An error occurred while navigating to the previous tab.");
    }
  }, [activeTab, setActiveTab]);

  return {
    handleNextTab,
    handlePrevTab
  };
}
