
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
import { Loader } from "lucide-react";
import { useCalculator } from "@/contexts/calculator";

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
  // Access calculator context to get isCalculating status
  const { isCalculating } = useCalculator();
  
  // Combine all inputs for the calculation
  const calculationInput: CalculationInput = {
    materials,
    transport,
    energy
  };
  
  // Generate suggestions based on the result
  const suggestions = calculationResult ? generateSuggestions(calculationResult) : [];
  
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
      
      {!isCalculating && !calculationResult && (
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
            <Button onClick={onCalculate} className="bg-carbon-600 hover:bg-carbon-700 text-white">
              Calculate Now
            </Button>
          </div>
        </div>
      )}
      
      {!isCalculating && calculationResult && (
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
