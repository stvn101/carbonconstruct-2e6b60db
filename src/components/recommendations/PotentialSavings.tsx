
import React from "react";
import { ArrowDownIcon } from "lucide-react";
import { Material } from "@/lib/carbonCalculations";
import { ExtendedMaterial, getMaterialName } from "@/lib/sustainabilitySuggestions";
import { Badge } from "@/components/ui/badge";

interface PotentialSavingsProps {
  material: Material;
  alternative: ExtendedMaterial;
  originalEmissions: number;
  potentialEmissions: number;
  savings: number;
  savingsPercentage: number;
}

export const PotentialSavings: React.FC<PotentialSavingsProps> = ({
  material,
  alternative,
  originalEmissions,
  potentialEmissions,
  savings,
  savingsPercentage
}) => {
  const originalMaterialName = getMaterialName(material);
  const alternativeMaterialName = getMaterialName(alternative);
  
  return (
    <div className="p-4 border border-carbon-100 dark:border-carbon-700 rounded-lg bg-white dark:bg-carbon-800">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-carbon-800 dark:text-carbon-200">
          {originalMaterialName} → {alternativeMaterialName}
        </h4>
        <Badge className="bg-carbon-600">
          {savingsPercentage.toFixed(1)}% less CO₂e
        </Badge>
      </div>
      
      <div className="flex items-center space-x-2 text-sm">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-carbon-600 dark:text-carbon-400">Current:</span>
            <span className="font-medium">{originalEmissions.toLocaleString(undefined, {maximumFractionDigits: 2})} kg CO₂e</span>
          </div>
          <div className="w-full bg-carbon-100 dark:bg-carbon-700 h-2 rounded-full">
            <div className="bg-carbon-500 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
        
        <ArrowDownIcon className="h-5 w-5 text-carbon-500 transform rotate-90" />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-carbon-600 dark:text-carbon-400">With {alternativeMaterialName}:</span>
            <span className="font-medium">{potentialEmissions.toLocaleString(undefined, {maximumFractionDigits: 2})} kg CO₂e</span>
          </div>
          <div className="w-full bg-carbon-100 dark:bg-carbon-700 h-2 rounded-full">
            <div className="bg-carbon-400 h-2 rounded-full" style={{ width: `${100 - savingsPercentage}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-sm text-carbon-600 dark:text-carbon-400">
        <p>Potential savings: <span className="font-medium text-carbon-800 dark:text-carbon-200">{savings.toLocaleString(undefined, {maximumFractionDigits: 2})} kg CO₂e</span></p>
      </div>
    </div>
  );
};
