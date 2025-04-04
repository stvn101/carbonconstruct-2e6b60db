
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Info } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";

interface MaterialsCompareTabProps {
  materialComparisonData: Array<{
    name: string;
    emissionFactor: number;
    sustainabilityScore: number;
  }>;
}

const MaterialsCompareTab: React.FC<MaterialsCompareTabProps> = ({ materialComparisonData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Comparison</CardTitle>
        <CardDescription>
          Compare average emission factors and sustainability scores across material categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Average Emission Factors</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={materialComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'kg CO₂e/kg', angle: -90, position: 'insideLeft' }} />
                  <RechartsTooltip />
                  <Bar dataKey="emissionFactor" name="Emission Factor" fill="#9b87f5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Lower values indicate less carbon impact per kg of material
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Average Sustainability Scores</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={materialComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                  <RechartsTooltip />
                  <Bar dataKey="sustainabilityScore" name="Sustainability Score" fill="#7E69AB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Higher scores indicate more sustainable materials
            </p>
          </div>
        </div>

        <div className="mt-8 bg-carbon-50 dark:bg-carbon-900 p-4 rounded-lg">
          <div className="flex items-start">
            <Info className="h-5 w-5 mr-2 text-carbon-600 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Material Selection Tips</h4>
              <p className="text-sm text-muted-foreground">
                Materials with lower emission factors and higher sustainability scores are generally better for the environment. 
                Consider these metrics alongside material performance, cost, and availability when making selection decisions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialsCompareTab;
