
import { Button } from "@/components/ui/button";
import CalculatorResults from "../CalculatorResults";
import { CalculationResult, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonCalculations";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator } from "lucide-react";

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
        <div className="space-y-6 text-center py-10">
          <div className="flex justify-center">
            <Calculator className="h-16 w-16 text-carbon-500 mb-4" />
          </div>
          <p className="text-lg">Click the calculate button to see results.</p>
          <Button 
            type="button" 
            size="lg" 
            onClick={onCalculate} 
            className="bg-carbon-600 hover:bg-carbon-700 text-white"
          >
            Calculate Now
          </Button>
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrev} 
          className="hover:bg-carbon-100 hover:text-carbon-800 border-carbon-300"
        >
          Previous: Energy
        </Button>
        <Button 
          type="button" 
          onClick={onCalculate} 
          className="bg-carbon-600 hover:bg-carbon-700 text-white"
        >
          Recalculate
        </Button>
      </div>
    </div>
  );
};

export default ResultsSection;
