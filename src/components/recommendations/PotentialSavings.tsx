
import React from "react";
import { ArrowRight, TrendingDown } from "lucide-react";
import { 
  ExtendedMaterial, 
  getMaterialName
} from "@/lib/sustainabilitySuggestions";
import { MATERIAL_FACTORS } from "@/lib/carbonData";
import { Material } from "@/lib/carbonTypes";

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
  // Get material names safely using our helper function
  const originalMaterialName = MATERIAL_FACTORS[material]?.name || String(material);
  const alternativeMaterialName = getMaterialName(alternative);

  return (
    <div className="p-3 rounded-lg border border-carbon-100 bg-carbon-50/50">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="font-medium text-carbon-800">{originalMaterialName}</span>
          <ArrowRight className="h-4 w-4 mx-2 text-carbon-400" />
          <span className="font-medium text-carbon-700">{alternativeMaterialName}</span>
        </div>
        <div className="flex items-center bg-carbon-100 px-2 py-0.5 rounded-full">
          <TrendingDown className="h-3.5 w-3.5 mr-1 text-carbon-600" />
          <span className="text-xs font-medium text-carbon-700">
            {savingsPercentage.toFixed(1)}% reduction
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
        <div className="text-center">
          <p className="text-carbon-500 mb-0.5">Original</p>
          <p className="font-medium text-carbon-700">{originalEmissions.toFixed(2)} kg</p>
        </div>
        <div className="text-center">
          <p className="text-carbon-500 mb-0.5">Alternative</p>
          <p className="font-medium text-carbon-700">{potentialEmissions.toFixed(2)} kg</p>
        </div>
        <div className="text-center">
          <p className="text-carbon-500 mb-0.5">Savings</p>
          <p className="font-medium text-green-600">{savings.toFixed(2)} kg</p>
        </div>
      </div>
    </div>
  );
};
