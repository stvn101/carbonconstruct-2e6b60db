import React from "react";
import { motion } from "framer-motion";
import { 
  Material, 
  Transport, 
  Energy, 
  MATERIAL_FACTORS, 
  TRANSPORT_FACTORS, 
  ENERGY_FACTORS,
  CalculationResult,
  MaterialInput,
  TransportInput,
  EnergyInput
} from "@/lib/carbonCalculations";
import SummaryCard from "./results/SummaryCard";
import EmissionsBreakdownChart from "./results/EmissionsBreakdownChart";
import CategoryBreakdownChart from "./results/CategoryBreakdownChart";
import SuggestionsSection from "./results/SuggestionsSection";
import ExportOptions from "./results/export/ExportOptions";

interface CalculatorResultsProps {
  result: CalculationResult;
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  suggestions?: string[];
  onRecalculate?: () => void;
}

const CalculatorResults: React.FC<CalculatorResultsProps> = ({ 
  result, 
  materials,
  transport,
  energy,
  suggestions = [
    "Consider using low-carbon alternatives for concrete and steel",
    "Source materials locally to reduce transportation emissions",
    "Implement renewable energy sources on-site during construction",
    "Optimize equipment usage to reduce idle time and fuel consumption",
    "Use recycled and reclaimed materials where possible"
  ],
  onRecalculate = () => {}
}) => {
  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1
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
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="text-center" variants={itemVariants}>
        <h2 className="text-2xl font-bold mb-2">Carbon Footprint Results</h2>
        <p className="text-muted-foreground">
          Here's a breakdown of the carbon emissions for your construction project.
        </p>
      </motion.div>
      
      {/* Summary Card */}
      <motion.div variants={itemVariants}>
        <SummaryCard result={result} />
      </motion.div>

      {/* Export Options */}
      <motion.div variants={itemVariants}>
        <ExportOptions result={result} materials={materials} transport={transport} energy={energy} />
      </motion.div>

      {/* Main Breakdown Chart */}
      <motion.div variants={itemVariants}>
        <EmissionsBreakdownChart result={result} />
      </motion.div>

      {/* Category Breakdown Charts */}
      <motion.div variants={itemVariants}>
        <CategoryBreakdownChart result={result} category="material" />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <CategoryBreakdownChart result={result} category="transport" />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <CategoryBreakdownChart result={result} category="energy" />
      </motion.div>

      {/* Suggestions */}
      <motion.div variants={itemVariants}>
        <SuggestionsSection suggestions={suggestions} onRecalculate={onRecalculate} />
      </motion.div>
    </motion.div>
  );
};

export default CalculatorResults;
