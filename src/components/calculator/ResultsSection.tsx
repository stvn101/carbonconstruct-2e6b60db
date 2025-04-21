
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
import { generateSuggestions, calculatePotentialSavings } from "@/lib/sustainabilitySuggestions";

interface ResultsSectionProps {
  calculationResult: CalculationResult | null;
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  onCalculate: () => void;
  onPrev: () => void;
}

const ResultsSection = ({ 
  calculationResult, 
  materials, 
  transport, 
  energy,
  onCalculate, 
  onPrev 
}: ResultsSectionProps) => {
  // Combine all inputs for the calculation
  const calculationInput: CalculationInput = {
    materials,
    transport,
    energy
  };
  
  // Generate suggestions based on the result
  const suggestions = calculationResult ? generateSuggestions(calculationResult) : [];
  
  return (
    <div className="space-y-6">
      {!calculationResult && (
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
            <Button onClick={onCalculate}>
              Calculate Now
            </Button>
          </div>
        </div>
      )}
      
      {calculationResult && (
        <div>
          {/* Added responsive margin top to avoid clash on mobile */}
          <Tabs defaultValue="results" className="mt-3 md:mt-0 sm:mt-6">
            <TabsList className="mb-4 bg-muted/70">
              <TabsTrigger value="results" className="text-sm">Results</TabsTrigger>
              <TabsTrigger value="recommendations" className="text-sm">Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="results" className="pt-4">
              <CalculatorResults 
                result={calculationResult}
                materials={materials}
                transport={transport}
                energy={energy}
                suggestions={suggestions}
                onRecalculate={onCalculate}
              />
            </TabsContent>
            
            <TabsContent value="recommendations" className="pt-4">
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
            <Button onClick={onCalculate}>
              Recalculate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
