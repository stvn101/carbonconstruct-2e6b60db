
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import SustainabilityImpactChart from "../SustainabilityImpactChart";
import { MaterialAnalysisResult } from "@/lib/materialCategories";

interface DashboardTabContentProps {
  materialAnalysis: MaterialAnalysisResult | null;
  prioritySuggestions?: string[];
}

const DashboardTabContent: React.FC<DashboardTabContentProps> = ({
  materialAnalysis,
  prioritySuggestions = []
}) => {
  return (
    <div className="mt-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SustainabilityImpactChart data={materialAnalysis} chartType="bar" />
        <SustainabilityImpactChart data={materialAnalysis} chartType="radar" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Key Recommendations</CardTitle>
            <CardDescription>
              Priority actions to improve sustainability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {prioritySuggestions && prioritySuggestions.length > 0 ? (
                prioritySuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <Leaf className="h-5 w-5 text-carbon-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">No priority recommendations available</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardTabContent;
