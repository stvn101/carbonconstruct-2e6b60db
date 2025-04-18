
import React from "react";
import { motion } from "framer-motion";
import { CalculationInput, CalculationResult } from "@/lib/carbonCalculations";
import { CarbonReduction } from "./recommendations/CarbonReduction";
import { AreasOfConcern } from "./recommendations/AreasOfConcern";

interface RecommendationsSectionProps {
  calculationInput: CalculationInput;
  calculationResult: CalculationResult | null;
  suggestions?: string[];
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  calculationInput,
  calculationResult,
  suggestions = []
}) => {
  if (!calculationResult) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <CarbonReduction
          calculationInput={calculationInput}
          calculationResult={calculationResult}
          suggestions={suggestions}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <AreasOfConcern calculationResult={calculationResult} />
      </motion.div>
    </motion.div>
  );
};

export default RecommendationsSection;
