
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalculationResult, CalculationInput } from "@/lib/carbonCalculations";
import CalculatorResults from "../../CalculatorResults";
import RecommendationsSection from "../../RecommendationsSection";
import { generateSuggestions } from "@/lib/sustainabilitySuggestions";

interface ResultsTabsProps {
  calculationResult: CalculationResult;
  materials: any[];
  transport: any[];
  energy: any[];
  onCalculate: () => void;
  onPrev: () => void;
}

const ResultsTabs = ({ 
  calculationResult, 
  materials, 
  transport, 
  energy, 
  onCalculate, 
  onPrev 
}: ResultsTabsProps) => {
  // Generate suggestions based on the result
  const suggestions = generateSuggestions(calculationResult);
  
  // Combine all inputs for the calculation
  const calculationInput: CalculationInput = { materials, transport, energy };
  
  return (
    <div>
      <Tabs defaultValue="results" className="mt-16 sm:mt-20 md:mt-16"> 
        <TabsList className="mb-8 bg-muted/70 px-2 sm:px-4 rounded-md"> 
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
  );
};

export default ResultsTabs;
