
import { Button } from "@/components/ui/button";
import CalculatorResults from "../CalculatorResults";
import { CalculationResult, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonCalculations";
import { Calculator } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <div>
      {calculationResult ? (
        <CalculatorResults 
          result={calculationResult} 
          materials={materials}
          transport={transport}
          energy={energy}
          onRecalculate={onCalculate}
        />
      ) : (
        <div className="space-y-4 md:space-y-6 text-center py-6 md:py-10">
          <div className="flex justify-center">
            <Calculator className="h-12 w-12 md:h-16 md:w-16 text-carbon-500 mb-2 md:mb-4" />
          </div>
          <p className="text-md md:text-lg">Click the calculate button to see results.</p>
          <Button 
            type="button" 
            size={isMobile ? "default" : "lg"} 
            onClick={onCalculate} 
            className="bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm"
          >
            Calculate Now
          </Button>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between gap-2 mt-6">
        <Button 
          type="button" 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          onClick={onPrev} 
          className="hover:bg-carbon-100 hover:text-carbon-800 border-carbon-300 text-xs md:text-sm"
        >
          Previous: Energy
        </Button>
        <Button 
          type="button" 
          size={isMobile ? "sm" : "default"}
          onClick={onCalculate} 
          className="bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm mt-2 sm:mt-0"
        >
          Recalculate
        </Button>
      </div>
    </div>
  );
};

export default ResultsSection;
