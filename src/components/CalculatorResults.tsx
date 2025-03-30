
import React from "react";
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
import ExportOptions from "./results/ExportOptions";

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
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Carbon Footprint Results</h2>
        <p className="text-muted-foreground">
          Here's a breakdown of the carbon emissions for your construction project.
        </p>
      </div>
      
      {/* Summary Card */}
      <SummaryCard result={result} />

      {/* Export Options */}
      <ExportOptions result={result} materials={materials} transport={transport} energy={energy} />

      {/* Main Breakdown Chart */}
      <EmissionsBreakdownChart result={result} />

      {/* Category Breakdown Charts */}
      <CategoryBreakdownChart result={result} category="material" />
      <CategoryBreakdownChart result={result} category="transport" />
      <CategoryBreakdownChart result={result} category="energy" />

      {/* Suggestions */}
      <SuggestionsSection suggestions={suggestions} onRecalculate={onRecalculate} />
    </div>
  );
};

export default CalculatorResults;
