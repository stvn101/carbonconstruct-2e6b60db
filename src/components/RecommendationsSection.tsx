
import React from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Leaf, 
  AlertTriangle, 
  ThumbsUp,
  ArrowUpRight,
  BarChart4
} from "lucide-react";
import { 
  CalculationInput, 
  CalculationResult, 
  calculatePotentialSavings,
  MATERIAL_FACTORS
} from "@/lib/carbonCalculations";

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
  
  // Get potential material savings
  const potentialSavings = calculatePotentialSavings(calculationInput);
  
  // Calculate total potential savings
  const totalPotentialSavings = potentialSavings.reduce(
    (total, item) => total + item.savings, 
    0
  );
  
  // Calculate percentage of total emissions that could be saved
  const percentageSaving = calculationResult.totalEmissions > 0
    ? (totalPotentialSavings / calculationResult.totalEmissions) * 100
    : 0;
  
  // Animation variants
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
  
  // Format number with commas and fixed decimals
  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl text-carbon-800">
              <Leaf className="h-5 w-5 mr-2 text-carbon-600" />
              Carbon Reduction Opportunities
            </CardTitle>
            <CardDescription>
              Recommendations based on your specific project inputs and Australian construction practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {percentageSaving > 0 && (
              <div className="mb-4 p-4 bg-carbon-50 rounded-lg border border-carbon-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-carbon-800">Potential Carbon Reduction</h3>
                  <Badge className="bg-carbon-600">
                    Save up to {percentageSaving.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  By implementing our recommendations, you could reduce emissions by approximately 
                  <strong> {formatNumber(totalPotentialSavings)} kg CO2e</strong>, 
                  which is {percentageSaving.toFixed(1)}% of your current footprint.
                </p>
              </div>
            )}
            
            <h3 className="font-medium mb-3 text-carbon-800">Specific Recommendations</h3>
            <ul className="space-y-2.5">
              {suggestions.map((suggestion, index) => (
                <motion.li 
                  key={`suggestion-${index}`} 
                  className="flex items-start"
                  variants={itemVariants}
                >
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-carbon-500 flex-shrink-0" />
                  <p className="text-sm">{suggestion}</p>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
      
      {potentialSavings.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-xl text-carbon-800">
                <BarChart4 className="h-5 w-5 mr-2 text-carbon-600" />
                Material Alternatives Analysis
              </CardTitle>
              <CardDescription>
                Australian low-carbon alternatives for your specified materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {potentialSavings.map((item, index) => (
                  <div key={`saving-${index}`} className="p-3 border border-carbon-100 rounded-lg">
                    <div className="flex flex-wrap justify-between items-center mb-2">
                      <div className="font-medium text-carbon-800">
                        Replace {MATERIAL_FACTORS[item.material].name} with {MATERIAL_FACTORS[item.alternative].name}
                      </div>
                      <Badge className="bg-carbon-600">
                        Save {item.savingsPercentage.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm">
                      <div className="flex flex-col p-2 bg-carbon-50 rounded">
                        <span className="text-muted-foreground mb-1">Original Emissions</span>
                        <span className="font-medium">{formatNumber(item.originalEmissions)} kg CO2e</span>
                      </div>
                      
                      <div className="flex flex-col p-2 bg-carbon-50 rounded">
                        <span className="text-muted-foreground mb-1">With Alternative</span>
                        <span className="font-medium">{formatNumber(item.potentialEmissions)} kg CO2e</span>
                      </div>
                      
                      <div className="flex flex-col p-2 bg-green-50 rounded">
                        <span className="text-muted-foreground mb-1">Potential Savings</span>
                        <span className="font-medium text-green-700">{formatNumber(item.savings)} kg CO2e</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-muted-foreground flex items-center">
                      <Info className="h-3 w-3 mr-1" />
                      <span>
                        Based on the Australian National Carbon Offset Standard (NCOS)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2 mt-6 p-3 bg-carbon-50 rounded border border-carbon-100">
                <ThumbsUp className="h-5 w-5 text-carbon-600" />
                <p className="text-sm">
                  Using Australian materials can reduce transportation emissions while supporting local industries.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-xl text-carbon-800">
              <AlertTriangle className="h-5 w-5 mr-2 text-carbon-600" />
              Areas of Concern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {calculationResult.materialEmissions > calculationResult.totalEmissions * 0.7 && (
                <div className="p-3 border-l-4 border-l-amber-500 bg-amber-50 rounded-r-lg">
                  <h4 className="font-medium mb-1">High Material Emissions</h4>
                  <p className="text-sm">
                    Your project's material emissions account for over 70% of your total carbon footprint.
                    Consider low-carbon Australian alternatives to significantly reduce your impact.
                  </p>
                </div>
              )}
              
              {calculationResult.transportEmissions > calculationResult.totalEmissions * 0.3 && (
                <div className="p-3 border-l-4 border-l-amber-500 bg-amber-50 rounded-r-lg">
                  <h4 className="font-medium mb-1">High Transport Emissions</h4>
                  <p className="text-sm">
                    Your transport emissions are unusually high. Consider sourcing materials locally in Australia
                    to minimize shipping distances and associated carbon emissions.
                  </p>
                </div>
              )}
              
              {calculationResult.energyEmissions > calculationResult.totalEmissions * 0.25 && (
                <div className="p-3 border-l-4 border-l-amber-500 bg-amber-50 rounded-r-lg">
                  <h4 className="font-medium mb-1">High Energy Emissions</h4>
                  <p className="text-sm">
                    Your energy use contributes significantly to your carbon footprint. Australia has abundant
                    renewable energy options - consider solar power for your construction site.
                  </p>
                </div>
              )}
              
              {calculationResult.totalEmissions > 10000 && (
                <div className="p-3 border-l-4 border-l-amber-500 bg-amber-50 rounded-r-lg">
                  <h4 className="font-medium mb-1">High Overall Emissions</h4>
                  <p className="text-sm">
                    Your project's total emissions exceed 10,000 kg CO2e, which may impact compliance with
                    Australian building sustainability standards. Consider a holistic redesign approach.
                  </p>
                </div>
              )}
              
              {/* If no concerns were triggered */}
              {calculationResult.materialEmissions <= calculationResult.totalEmissions * 0.7 &&
               calculationResult.transportEmissions <= calculationResult.totalEmissions * 0.3 &&
               calculationResult.energyEmissions <= calculationResult.totalEmissions * 0.25 &&
               calculationResult.totalEmissions <= 10000 && (
                <div className="p-3 border-l-4 border-l-green-500 bg-green-50 rounded-r-lg">
                  <h4 className="font-medium mb-1">Good Carbon Performance</h4>
                  <p className="text-sm">
                    Your project is performing well on key carbon metrics. Continue to monitor and look for
                    additional improvements as new materials and technologies become available in Australia.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-6 p-3 bg-carbon-50 rounded border border-carbon-100">
              <ArrowUpRight className="h-5 w-5 text-carbon-600" />
              <p className="text-sm">
                For more detailed guidance, consult the Green Building Council of Australia's resources
                and the Infrastructure Sustainability Council's materials guidelines.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default RecommendationsSection;
