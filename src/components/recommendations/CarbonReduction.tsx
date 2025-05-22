
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CalculationInput, CalculationResult } from "@/lib/carbonExports";
import { PotentialSavings } from "./PotentialSavings";
import { calculatePotentialSavings } from "@/lib/sustainabilitySuggestions";

interface CarbonReductionProps {
  calculationInput: CalculationInput;
  calculationResult: CalculationResult;
  suggestions: string[];
}

export const CarbonReduction: React.FC<CarbonReductionProps> = ({
  calculationInput,
  calculationResult,
  suggestions
}) => {
  // Safely calculate potential savings
  let potentialSavings = [];
  let totalPotentialSavings = 0;
  let percentageSaving = 0;
  
  try {
    potentialSavings = calculatePotentialSavings(calculationInput);
    totalPotentialSavings = potentialSavings.reduce(
      (total, item) => total + item.savings, 
      0
    );
    
    const totalEmissions = calculationResult?.totalEmissions || calculationResult?.totalCO2 || 0;
    percentageSaving = totalEmissions > 0
      ? (totalPotentialSavings / totalEmissions) * 100
      : 0;
  } catch (error) {
    console.error("Error calculating potential savings:", error);
    // Use default values defined above
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl text-carbon-800 dark:text-carbon-100">
          <Leaf className="h-5 w-5 mr-2 text-carbon-600 dark:text-carbon-400" />
          Carbon Reduction Opportunities
        </CardTitle>
        <CardDescription className="dark:text-carbon-300">
          Recommendations based on your specific project inputs and Australian construction practices
        </CardDescription>
      </CardHeader>
      <CardContent>
        {percentageSaving > 0 && (
          <div className="mb-4 p-4 bg-carbon-50 rounded-lg border border-carbon-100 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-carbon-800 dark:text-carbon-100">Potential Carbon Reduction</h3>
              <Badge className="bg-carbon-600 dark:bg-carbon-500">
                Save up to {percentageSaving.toFixed(1)}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2 dark:text-carbon-300">
              By implementing our recommendations, you could reduce emissions by approximately&nbsp;
              <strong className="dark:text-carbon-100">{totalPotentialSavings.toLocaleString(undefined, { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} kg CO2e</strong>, 
              which is {percentageSaving.toFixed(1)}% of your current footprint.
            </p>
          </div>
        )}

        {potentialSavings.length > 0 && (
          <div className="space-y-4">
            {potentialSavings.map((item, index) => (
              <PotentialSavings
                key={index}
                originalEmissions={item.originalEmissions}
                potentialEmissions={item.potentialEmissions}
                savings={item.savings}
                savingsPercentage={item.savingsPercentage}
                material={item.material}
                alternative={item.alternative}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
