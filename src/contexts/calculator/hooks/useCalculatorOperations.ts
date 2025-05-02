
import { useCallback } from "react";
import { toast } from "sonner";
import { calculateTotalEmissions, CalculationInput, CalculationResult } from "@/lib/carbonCalculations";
import { validateCalculationInput } from "@/utils/calculatorValidation";
import { showErrorToast } from "@/utils/errorHandling/simpleToastHandler";
import { useCalculatorValidation } from "./useCalculatorValidation";

type CalculatorOperationsProps = {
  calculationInput: CalculationInput;
  setCalculationResult: (result: CalculationResult | null) => void;
  setCalculationError: (error: Error | null) => void;
  setValidationErrors: (errors: Array<{field: string, message: string}>) => void;
  setIsCalculating: (isCalculating: boolean) => void;
  setActiveTab: (tab: 'materials' | 'transport' | 'energy' | 'results') => void;
};

export function useCalculatorOperations({
  calculationInput,
  setCalculationResult,
  setCalculationError,
  setValidationErrors,
  setIsCalculating,
  setActiveTab,
}: CalculatorOperationsProps) {
  const { hasValidInputs, checkForExtremeValues } = useCalculatorValidation(calculationInput);

  const resetCalculationErrors = useCallback(() => {
    setCalculationError(null);
    setValidationErrors([]);
  }, [setCalculationError, setValidationErrors]);

  const handleCalculate = useCallback(() => {
    try {
      console.log("Starting calculation with input:", calculationInput);
      setCalculationError(null);
      setIsCalculating(true);
      
      // Network connectivity check
      if (!navigator.onLine) {
        const offlineError = new Error("You're offline. Cannot perform calculations.");
        setCalculationError(offlineError);
        toast.error(offlineError.message);
        setIsCalculating(false);
        return;
      }
      
      // Input validation check
      const inputStatus = hasValidInputs();
      if (!inputStatus.valid) {
        const inputError = new Error(inputStatus.reason);
        setCalculationError(inputError);
        toast.error(inputError.message);
        setIsCalculating(false);
        return;
      }
      
      // Check for extreme values
      const extremeValueCheck = checkForExtremeValues();
      if (!extremeValueCheck.valid) {
        const valueError = new Error(extremeValueCheck.reason);
        setCalculationError(valueError);
        toast.error(valueError.message);
        setIsCalculating(false);
        return;
      }
      
      // Structure validation
      const errors = validateCalculationInput(calculationInput);
      if (errors.length > 0) {
        const validationError = new Error(errors[0].message);
        setValidationErrors(errors);
        setCalculationError(validationError);
        toast.error(validationError.message);
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
          // Guard against missing sections
          const safeInput = {
            materials: calculationInput.materials || [],
            transport: calculationInput.transport || [],
            energy: calculationInput.energy || []
          };
          
          const result = calculateTotalEmissions(safeInput);
          console.log('Calculation completed with result:', result);
          
          // Validate the result
          if (result.totalEmissions === undefined || result.totalEmissions === null) {
            throw new Error("Calculation produced invalid emissions total");
          }
          
          if (result.totalEmissions === 0 && 
              Object.keys(result.breakdownByMaterial || {}).length === 0 &&
              Object.keys(result.breakdownByTransport || {}).length === 0 &&
              Object.keys(result.breakdownByEnergy || {}).length === 0) {
            const emptyResultWarning = new Error("Calculation produced no emissions data. Please check your inputs.");
            console.warn(emptyResultWarning.message);
            showErrorToast(emptyResultWarning.message);
            // Still set the result - empty is valid, just warn
            setCalculationResult(result);
          } else {
            toast.success("Calculation completed successfully!");
            setCalculationResult(result);
          }
          setActiveTab("results");
        } catch (error) {
          console.error("Error during calculation:", error);
          
          // Classify and handle specific calculation errors
          let errorMessage = "Failed to calculate emissions.";
          
          if (error instanceof Error) {
            if (error.message.includes("type") || error.message.includes("undefined")) {
              errorMessage = "Invalid input types in calculation. Please check your data.";
            } else if (error.message.includes("overflow") || error.message.includes("infinity")) {
              errorMessage = "Calculation overflow. Values are too large.";
            } else {
              errorMessage = `Calculation error: ${error.message}`;
            }
            setCalculationError(error);
          } else {
            setCalculationError(new Error(errorMessage));
          }
          
          toast.error(errorMessage);
        } finally {
          setIsCalculating(false);
        }
      }, 500);
    } catch (error) {
      // Handle any unexpected errors in the outer try/catch
      console.error("Unexpected error in calculation process:", error);
      
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = `Unexpected error: ${error.message}`;
        setCalculationError(error);
      } else {
        setCalculationError(new Error(errorMessage));
      }
      
      toast.error(errorMessage);
      setIsCalculating(false);
    }
  }, [calculationInput, hasValidInputs, checkForExtremeValues, setCalculationError, setCalculationResult, setIsCalculating, setValidationErrors, setActiveTab]);

  return {
    handleCalculate,
    resetCalculationErrors
  };
}
