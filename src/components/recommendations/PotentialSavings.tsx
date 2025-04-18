
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { MATERIAL_FACTORS } from "@/lib/carbonData";

interface PotentialSavingsProps {
  originalEmissions: number;
  potentialEmissions: number;
  savings: number;
  savingsPercentage: number;
  material: string;
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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="p-3 border border-carbon-100 rounded-lg">
      <div className="flex flex-wrap justify-between items-center mb-2">
        <div className="font-medium text-carbon-800">
          Replace {MATERIAL_FACTORS[material].name} with {MATERIAL_FACTORS[alternative].name}
        </div>
        <Badge className="bg-carbon-600">
          Save {savingsPercentage.toFixed(1)}%
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm">
        <div className="flex flex-col p-2 bg-carbon-50 rounded">
          <span className="text-muted-foreground mb-1">Original Emissions</span>
          <span className="font-medium">{formatNumber(originalEmissions)} kg CO2e</span>
        </div>
        
        <div className="flex flex-col p-2 bg-carbon-50 rounded">
          <span className="text-muted-foreground mb-1">With Alternative</span>
          <span className="font-medium">{formatNumber(potentialEmissions)} kg CO2e</span>
        </div>
        
        <div className="flex flex-col p-2 bg-green-50 rounded">
          <span className="text-muted-foreground mb-1">Potential Savings</span>
          <span className="font-medium text-green-700">{formatNumber(savings)} kg CO2e</span>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-muted-foreground flex items-center">
        <Info className="h-3 w-3 mr-1" />
        <span>
          Based on the Australian National Carbon Offset Standard (NCOS)
        </span>
      </div>
    </div>
  );
};
