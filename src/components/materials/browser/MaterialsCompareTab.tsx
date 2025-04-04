
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Info } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from "recharts";

interface MaterialsCompareTabProps {
  materialComparisonData: Array<{
    name: string;
    emissionFactor: number;
    sustainabilityScore: number;
  }>;
}

const MaterialsCompareTab: React.FC<MaterialsCompareTabProps> = ({ materialComparisonData }) => {
  // Sort data by emission factor for better visualization
  const sortedByEmissionData = [...materialComparisonData].sort((a, b) => a.emissionFactor - b.emissionFactor);
  const sortedByScoreData = [...materialComparisonData].sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
  
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-carbon-800 p-3 shadow-lg rounded-md border border-carbon-100 dark:border-carbon-700">
          <p className="font-medium">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ color: item.fill }}>
              {item.name}: {item.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
                <BarChart data={sortedByEmissionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" label={{ value: 'kg CO₂e/kg', position: 'insideBottom', offset: -5 }} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <RechartsTooltip content={customTooltip} />
                  <Legend />
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
                <BarChart data={sortedByScoreData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} label={{ value: 'Score', position: 'insideBottom', offset: -5 }} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <RechartsTooltip content={customTooltip} />
                  <Legend />
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
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                <li>Look for locally sourced materials to reduce transport emissions</li>
                <li>Consider recycled alternatives when available</li>
                <li>Balance embodied carbon with operational performance</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialsCompareTab;
