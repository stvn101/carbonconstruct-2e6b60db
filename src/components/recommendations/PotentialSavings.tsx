
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Material } from "@/lib/carbonTypes";
import { ArrowRightIcon, TrendingDown, Leaf, FileCheck } from "lucide-react";

interface PotentialSavingsProps {
  originalEmissions: number;
  potentialEmissions: number;
  savings: number;
  savingsPercentage: number;
  material: Material;
  alternative: string;
}

export const PotentialSavings: React.FC<PotentialSavingsProps> = ({
  originalEmissions,
  potentialEmissions,
  savings,
  savingsPercentage,
  material,
  alternative
}) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, {
      maximumFractionDigits: 2
    });
  };
  
  return (
    <div className="p-3 bg-green-50 border border-green-100 rounded-lg dark:bg-green-900/20 dark:border-green-800/50">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Leaf className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
          <h3 className="font-medium text-carbon-800 dark:text-carbon-100">
            {material} Replacement
          </h3>
        </div>
        <span className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center">
          <TrendingDown className="h-4 w-4 mr-1" />
          {savingsPercentage}% reduction
        </span>
      </div>
      
      <div className="flex items-center mb-2 text-sm">
        <span className="text-carbon-700 dark:text-carbon-300">{material}</span>
        <ArrowRightIcon className="h-4 w-4 mx-2 text-carbon-400" />
        <span className="font-medium text-green-700 dark:text-green-400 flex items-center">
          <FileCheck className="h-4 w-4 mr-1" />
          {alternative}
        </span>
      </div>
      
      <div className="mt-3 space-y-2 text-sm text-carbon-700 dark:text-carbon-300">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="flex justify-between mb-1">
              <span>Original</span>
              <span>{formatNumber(originalEmissions)} kg CO₂e</span>
            </div>
            <Progress value={100} className="h-2 bg-carbon-200" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span>After</span>
              <span>{formatNumber(potentialEmissions)} kg CO₂e</span>
            </div>
            <Progress 
              value={(potentialEmissions / originalEmissions) * 100} 
              className="h-2 bg-carbon-200" 
              indicatorClassName="bg-green-500"
            />
          </div>
        </div>
        
        <div className="pt-1 border-t border-green-200 dark:border-green-800/50 flex justify-between text-xs">
          <span>Potential savings</span>
          <span className="font-medium text-green-700 dark:text-green-400">
            {formatNumber(savings)} kg CO₂e
          </span>
        </div>
      </div>
    </div>
  );
};
