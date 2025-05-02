
import React from "react";
import { 
  CalculationResult,
  MaterialInput, 
  TransportInput, 
  EnergyInput,
  CalculationInput
} from "@/lib/carbonCalculations";
import { useCalculator } from "@/contexts/calculator";
import DemoNotice from "./results/DemoNotice";
import LoadingState from "./results/LoadingState";
import ErrorDisplay from "./results/ErrorDisplay";
import ReadyToCalculate from "./results/ReadyToCalculate";
import EmptyResultState from "./results/EmptyResultState";
import ResultsTabs from "./results/ResultsTabs";

interface ResultsSectionProps {
  calculationResult: CalculationResult | null;
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  onCalculate: () => void;
  onPrev: () => void;
  demoMode?: boolean;
}

const ResultsSection = ({ 
  calculationResult, 
  materials, 
  transport, 
  energy,
  onCalculate, 
  onPrev,
  demoMode = false
}: ResultsSectionProps) => {
  // Access calculator context to get isCalculating status and error state
  const { isCalculating, calculationError, resetCalculationErrors } = useCalculator();
  
  // Check if data is valid for results
  const hasValidInputs = 
    materials?.some(m => Number(m.quantity) > 0) || 
    transport?.some(t => Number(t.distance) > 0 && Number(t.weight) > 0) || 
    energy?.some(e => Number(e.amount) > 0);
  
  // Check if calculation result has any data
  const hasEmptyResult = calculationResult && 
    calculationResult.totalEmissions === 0 &&
    Object.keys(calculationResult.breakdownByMaterial || {}).length === 0 &&
    Object.keys(calculationResult.breakdownByTransport || {}).length === 0 &&
    Object.keys(calculationResult.breakdownByEnergy || {}).length === 0;

  console.log("ResultsSection rendering:");
  console.log("- isCalculating:", isCalculating);
  console.log("- calculationResult:", calculationResult);
  console.log("- calculationError:", calculationError);
  console.log("- hasValidInputs:", hasValidInputs);
  
  // Handler to retry calculation
  const handleRetryCalculation = () => {
    resetCalculationErrors();
    onCalculate();
  };
  
  return (
    <div className="space-y-12 sm:space-y-16">
      <DemoNotice demoMode={demoMode} />
      
      {isCalculating && <LoadingState />}
      
      {!isCalculating && calculationError && (
        <ErrorDisplay error={calculationError} onRetry={handleRetryCalculation} />
      )}
      
      {!isCalculating && !calculationError && !calculationResult && (
        <ReadyToCalculate 
          hasValidInputs={hasValidInputs} 
          onCalculate={onCalculate} 
          onPrev={onPrev} 
        />
      )}
      
      {!isCalculating && !calculationError && hasEmptyResult && (
        <EmptyResultState onPrev={onPrev} onCalculate={onCalculate} />
      )}
      
      {!isCalculating && !calculationError && calculationResult && !hasEmptyResult && (
        <ResultsTabs 
          calculationResult={calculationResult}
          materials={materials}
          transport={transport}
          energy={energy}
          onCalculate={onCalculate}
          onPrev={onPrev}
        />
      )}
    </div>
  );
};

export default ResultsSection;
