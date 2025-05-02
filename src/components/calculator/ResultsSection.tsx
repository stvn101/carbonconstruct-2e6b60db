
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  CalculationResult,
  MaterialInput, 
  TransportInput, 
  EnergyInput,
  CalculationInput
} from "@/lib/carbonCalculations";
import CalculatorResults from "../CalculatorResults";
import RecommendationsSection from "../RecommendationsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateSuggestions } from "@/lib/sustainabilitySuggestions";
import { Loader, Info, AlertCircle, RefreshCw } from "lucide-react";
import { useCalculator } from "@/contexts/calculator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  
  // Combine all inputs for the calculation
  const calculationInput: CalculationInput = {
    materials,
    transport,
    energy
  };
  
  // Check if data is valid for results
  const hasValidMaterials = materials?.some(m => Number(m.quantity) > 0) || false;
  const hasValidTransport = transport?.some(t => Number(t.distance) > 0 && Number(t.weight) > 0) || false;
  const hasValidEnergy = energy?.some(e => Number(e.amount) > 0) || false;
  
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
  console.log("- hasValidMaterials:", hasValidMaterials);
  console.log("- hasValidTransport:", hasValidTransport);
  console.log("- hasValidEnergy:", hasValidEnergy);
  console.log("- materials breakdown:", calculationResult?.breakdownByMaterial);
  
  // Generate suggestions based on the result
  const suggestions = calculationResult ? generateSuggestions(calculationResult) : [];
  
  // Handler to retry calculation
  const handleRetryCalculation = () => {
    resetCalculationErrors();
    onCalculate();
  };
  
  return (
    <div className="space-y-12 sm:space-y-16"> {/* increased overall vertical spacing */}
      {demoMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
          <h3 className="font-medium text-yellow-800">Demo Mode</h3>
          <p className="text-yellow-700 text-sm">
            This is a demonstration of the calculator's results section. In a full account, you'll be able to save these results and access advanced analysis features.
          </p>
        </div>
      )}
      
      {isCalculating && (
        <div className="text-center py-12">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-carbon-600" />
          <h3 className="text-xl font-medium mb-2">Calculating Results</h3>
          <p className="text-muted-foreground">
            Processing your materials, transport, and energy data...
          </p>
        </div>
      )}
      
      {/* Display calculation errors */}
      {!isCalculating && calculationError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Calculation Error</AlertTitle>
          <AlertDescription>
            {calculationError.message}
            <div className="mt-4">
              <Button 
                onClick={handleRetryCalculation} 
                variant="outline" 
                size="sm"
                className="bg-destructive/10 border-destructive/30 hover:bg-destructive/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {!isCalculating && !calculationError && !calculationResult && (
        <div className="text-center p-8">
          <h3 className="text-xl font-medium mb-4">Ready to Calculate Results</h3>
          <p className="mb-6 text-muted-foreground">
            Click the button below to calculate the carbon footprint of your project based on the materials, 
            transport, and energy inputs you've provided.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <Button variant="outline" onClick={onPrev}>
              Previous Step
            </Button>
            <Button 
              onClick={onCalculate} 
              className="bg-carbon-600 hover:bg-carbon-700 text-white"
              disabled={!hasValidMaterials && !hasValidTransport && !hasValidEnergy}
            >
              Calculate Now
            </Button>
          </div>
          
          {!hasValidMaterials && !hasValidTransport && !hasValidEnergy && (
            <Alert className="mt-6 max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need to add at least one material, transport, or energy input with values greater than zero.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
      
      {!isCalculating && !calculationError && hasEmptyResult && (
        <div className="text-center p-8">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-xl font-medium mb-2">No Results Found</h3>
          <p className="mb-6 text-muted-foreground">
            Your calculation didn't produce any emissions data. Please check your inputs and try again.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <Button variant="outline" onClick={onPrev}>
              Check Inputs
            </Button>
            <Button 
              onClick={onCalculate} 
              className="bg-carbon-600 hover:bg-carbon-700 text-white"
            >
              Recalculate
            </Button>
          </div>
          
          <Alert className="mt-8 max-w-lg mx-auto bg-amber-50 border-amber-200">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Make sure your materials, transport, and energy inputs have appropriate quantities and valid types.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {!isCalculating && !calculationError && calculationResult && !hasEmptyResult && (
        <div>
          {/* Added space on top to separate tabs from previous content */}
          <Tabs defaultValue="results" className="mt-16 sm:mt-20 md:mt-16"> 
            <TabsList className="mb-8 bg-muted/70 px-2 sm:px-4 rounded-md"> {/* more bottom margin + horizontal padding on TabsList */}
              <TabsTrigger value="results" className="text-sm">Results</TabsTrigger>
              <TabsTrigger value="recommendations" className="text-sm">Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="results" className="pt-6">
              <CalculatorResults 
                result={calculationResult}
                materials={materials}
                transport={transport}
                energy={energy}
                suggestions={suggestions}
                onRecalculate={onCalculate}
              />
            </TabsContent>
            
            <TabsContent value="recommendations" className="pt-6">
              <RecommendationsSection 
                calculationResult={calculationResult}
                calculationInput={calculationInput}
                suggestions={suggestions}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-center mt-8">
            <Button variant="outline" onClick={onPrev} className="mr-2">
              Previous Step
            </Button>
            <Button onClick={onCalculate} className="bg-carbon-600 hover:bg-carbon-700 text-white">
              Recalculate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
