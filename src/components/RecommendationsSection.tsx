
import React, { memo } from "react";
import { motion } from "framer-motion";
import { CalculationInput, CalculationResult } from "@/lib/carbonExports";
import { CarbonReduction } from "./recommendations/CarbonReduction";
import { AreasOfConcern } from "./recommendations/AreasOfConcern";

interface RecommendationsSectionProps {
  calculationInput: CalculationInput;
  calculationResult: CalculationResult | null;
  suggestions?: string[];
}

// Memoize the component to prevent unnecessary re-renders
const RecommendationsSection: React.FC<RecommendationsSectionProps> = memo(({
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
      className="space-y-6 dark:bg-gray-800 dark:bg-opacity-40 dark:border dark:border-gray-700 dark:rounded-lg dark:p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="dark:text-carbon-200">
        <CarbonReduction
          calculationInput={calculationInput}
          calculationResult={calculationResult}
          suggestions={suggestions}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="dark:text-carbon-200">
        <AreasOfConcern calculationResult={calculationResult} />
      </motion.div>
    </motion.div>
  );
});

// Add display name for better debugging
RecommendationsSection.displayName = 'RecommendationsSection';

export default RecommendationsSection;
