
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { ArrowDownIcon } from "lucide-react";

interface PotentialSavingsProps {
  originalEmissions: number;
  potentialEmissions: number;
  savings: number;
  savingsPercentage: number;
  material: string;
  alternative: {
    name: string;
    description: string;
  };
}

export const PotentialSavings: React.FC<PotentialSavingsProps> = ({
  originalEmissions,
  potentialEmissions,
  savings,
  savingsPercentage,
  material,
  alternative
}) => {
  return (
    <div className="p-4 border border-carbon-100 rounded-lg bg-carbon-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-carbon-800 dark:text-carbon-100">{material}</h4>
        <span className="text-sm text-carbon-600 dark:text-carbon-300">
          -{savingsPercentage.toFixed(1)}% emissions
        </span>
      </div>
      
      <div className="mb-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div>
          <div className="text-xs text-muted-foreground">Original</div>
          <div className="font-medium">{originalEmissions.toFixed(2)} kg CO2e</div>
        </div>
        
        <ArrowDownIcon className="h-4 w-4 text-carbon-600" />
        
        <div>
          <div className="text-xs text-muted-foreground">Potential</div>
          <div className="font-medium">{potentialEmissions.toFixed(2)} kg CO2e</div>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span>Current</span>
          <span>Potential savings: {savings.toFixed(2)} kg CO2e</span>
        </div>
        
        <div className="h-2 relative bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-carbon-600"
            style={{ width: '100%' }}
          ></div>
          <div 
            className="absolute top-0 left-0 h-full bg-green-600"
            style={{ width: `${100 - savingsPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-3 bg-white rounded-md p-2 dark:bg-gray-700">
        <div className="font-medium text-sm text-carbon-800 dark:text-carbon-200">
          <span className="text-carbon-600 dark:text-carbon-400">Alternative: </span>{alternative.name}
        </div>
        <div className="text-xs text-muted-foreground dark:text-carbon-300 mt-1">
          {alternative.description}
        </div>
      </div>
    </div>
  );
};
