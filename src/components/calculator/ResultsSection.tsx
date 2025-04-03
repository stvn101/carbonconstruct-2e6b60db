
import { motion } from "framer-motion";
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
  
  // Check if we have valid input data
  const hasValidInputs = materials.some(m => m.quantity > 0) || 
                        transport.some(t => t.distance > 0 && t.weight > 0) ||
                        energy.some(e => e.amount > 0);
  
  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      {calculationResult && calculationResult.totalEmissions > 0 ? (
        <CalculatorResults 
          result={calculationResult} 
          materials={materials}
          transport={transport}
          energy={energy}
          onRecalculate={onCalculate}
        />
      ) : (
        <motion.div 
          className="space-y-4 md:space-y-6 text-center py-6 md:py-10"
          variants={containerVariants}
        >
          <motion.div 
            className="flex justify-center"
            variants={itemVariants}
          >
            <Calculator className="h-12 w-12 md:h-16 md:w-16 text-carbon-500 mb-2 md:mb-4" />
          </motion.div>
          <motion.p 
            className="text-md md:text-lg"
            variants={itemVariants}
          >
            {!hasValidInputs ? 
              "Please add some input data in the previous tabs before calculating." : 
              "Click the calculate button to see results."}
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button 
              type="button" 
              size={isMobile ? "default" : "lg"} 
              onClick={onCalculate} 
              className="bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm animate-pulse"
              disabled={!hasValidInputs}
            >
              Calculate Now
            </Button>
          </motion.div>
        </motion.div>
      )}
      
      <motion.div 
        className="flex flex-col sm:flex-row justify-between gap-2 mt-6"
        variants={itemVariants}
      >
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
          disabled={!hasValidInputs}
        >
          {calculationResult ? "Recalculate" : "Calculate"}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ResultsSection;
