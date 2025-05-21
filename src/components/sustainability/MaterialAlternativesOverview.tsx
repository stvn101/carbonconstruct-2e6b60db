
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, BarChart3, Filter, ThumbsUp } from "lucide-react";
import { SustainableMaterial } from "@/lib/materialCategories";

interface MaterialAlternativesOverviewProps {
  alternativesData: {
    originalMaterial: { id: string; name: string; carbonFootprint: number; quantity?: number };
    alternatives: SustainableMaterial[];
    hasSavings: boolean;
  }[];
}

const MaterialAlternativesOverview: React.FC<MaterialAlternativesOverviewProps> = ({
  alternativesData
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-carbon-50 dark:bg-carbon-900 p-4 rounded-lg">
        <h3 className="font-medium mb-2 flex items-center">
          <BarChart3 className="h-4 w-4 mr-2 text-carbon-600" />
          Material Alternatives Summary
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          We've analyzed your materials and found {alternativesData.length} with sustainable alternatives. 
          Switching to these alternatives could significantly reduce your project's carbon footprint.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {alternativesData.map(data => {
            const bestAlternative = data.alternatives.reduce((best, current) => 
              current.carbonReduction > best.carbonReduction ? current : best
            , data.alternatives[0]);
            
            return (
              <div key={data.originalMaterial.id} className="border rounded-md p-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{data.originalMaterial.name}</h4>
                  <Badge variant={bestAlternative.carbonReduction > 30 ? "default" : "outline"}>
                    {bestAlternative.carbonReduction}% Saving
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Best alternative: {bestAlternative.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
      {alternativesData.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium">No Alternatives Found</h3>
            <p className="text-sm mt-1">
              We couldn't find sustainable alternatives for your materials. 
              This might be due to limited data or specialized materials in your project.
            </p>
          </div>
        </div>
      )}
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2 flex items-center">
          <Filter className="h-4 w-4 mr-2 text-carbon-600" />
          Finding the Right Alternatives
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <ThumbsUp className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
            <span>Look for alternatives with high sustainability scores and significant carbon reductions</span>
          </li>
          <li className="flex items-start">
            <ThumbsUp className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
            <span>Consider local availability to minimize transportation emissions</span>
          </li>
          <li className="flex items-start">
            <ThumbsUp className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
            <span>Balance cost differences with long-term environmental benefits</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MaterialAlternativesOverview;
