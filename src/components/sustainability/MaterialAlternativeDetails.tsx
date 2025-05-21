
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Recycle } from "lucide-react";
import { SustainableMaterial } from "@/lib/materialCategories";
import AlternativesComparisonChart from "./AlternativesComparisonChart";

interface MaterialAlternativeDetailsProps {
  originalMaterial: {
    id: string;
    name: string;
    carbonFootprint: number;
    quantity?: number;
  };
  alternatives: SustainableMaterial[];
}

const MaterialAlternativeDetails: React.FC<MaterialAlternativeDetailsProps> = ({
  originalMaterial,
  alternatives
}) => {
  return (
    <>
      <AlternativesComparisonChart 
        originalMaterial={originalMaterial}
        alternatives={alternatives}
      />
      
      <div className="mt-4 border-t pt-4">
        <h3 className="font-medium mb-2">Alternative Details</h3>
        <div className="space-y-3">
          {alternatives.map((alt, index) => (
            <div key={index} className="border rounded-md p-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{alt.name}</h4>
                <Badge className={alt.carbonReduction > 50 ? "bg-green-600" : "bg-green-500"}>
                  {alt.carbonReduction}% Reduction
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Carbon Footprint:</p>
                  <p>{alt.carbonFootprint.toFixed(2)} kg CO2e/{alt.unit || 'kg'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sustainability Score:</p>
                  <p>{alt.sustainabilityScore}/100</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cost Difference:</p>
                  <p>{alt.costDifference ? `${alt.costDifference > 0 ? '+' : ''}${alt.costDifference}%` : 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Availability:</p>
                  <p className="capitalize">{alt.availability || 'Unknown'}</p>
                </div>
              </div>
              {alt.recyclable !== undefined && (
                <div className="mt-2 text-sm flex items-center">
                  <Recycle className="h-3.5 w-3.5 mr-1.5 text-carbon-600" />
                  <span>{alt.recyclable ? 'Recyclable' : 'Not recyclable'}</span>
                  {alt.recycledContent !== undefined && (
                    <span className="ml-2">• {alt.recycledContent}% recycled content</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MaterialAlternativeDetails;
