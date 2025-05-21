
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaterialAnalysisResult, SustainableMaterial } from "@/lib/materialCategories";
import { MaterialInput } from "@/lib/carbonExports";
import { Recycle, ThumbsUp } from "lucide-react";
import MaterialAlternativesEmpty from "./MaterialAlternativesEmpty";
import MaterialAlternativesOverview from "./MaterialAlternativesOverview";
import MaterialAlternativeDetails from "./MaterialAlternativeDetails";

interface MaterialAlternativesProps {
  materialAnalysis: MaterialAnalysisResult | null;
  materials?: MaterialInput[];
  className?: string;
}

const MaterialAlternatives: React.FC<MaterialAlternativesProps> = ({
  materialAnalysis,
  className
}) => {
  if (!materialAnalysis || !materialAnalysis.alternatives) {
    return <MaterialAlternativesEmpty className={className} />;
  }

  // Get original materials from high impact list
  const originalMaterials = materialAnalysis.highImpactMaterials || [];
  
  // Prepare data for rendering alternatives
  const alternativesData = Object.entries(materialAnalysis.alternatives)
    .map(([materialId, alternatives]) => {
      const originalMaterial = originalMaterials.find(m => m.id === materialId);
      if (!originalMaterial || !alternatives || alternatives.length === 0) return null;
      
      return {
        originalMaterial,
        alternatives: alternatives as SustainableMaterial[],
        hasSavings: Array.isArray(alternatives) && 
                    alternatives.some((alt: SustainableMaterial) => alt.carbonReduction > 0)
      };
    })
    .filter(Boolean) as {
      originalMaterial: {id: string; name: string; carbonFootprint: number; quantity?: number};
      alternatives: SustainableMaterial[];
      hasSavings: boolean;
    }[];
  
  // Check if we have any alternatives with savings
  const hasAlternativesWithSavings = alternativesData.some(data => data.hasSavings);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Recycle className="h-5 w-5 mr-2 text-carbon-600" />
            Material Alternatives
          </span>
          {hasAlternativesWithSavings && (
            <Badge className="bg-carbon-600">
              Savings Available
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Explore sustainable alternatives to reduce your carbon footprint
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={alternativesData.length > 0 ? alternativesData[0].originalMaterial.id : "overview"}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            {alternativesData.map(data => (
              <TabsTrigger 
                key={data.originalMaterial.id} 
                value={data.originalMaterial.id}
                className="text-xs"
              >
                {data.originalMaterial.name}
                {data.hasSavings && (
                  <ThumbsUp className="h-3 w-3 ml-1 text-green-500" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="overview">
            <MaterialAlternativesOverview alternativesData={alternativesData} />
          </TabsContent>
          
          {alternativesData.map(data => (
            <TabsContent key={data.originalMaterial.id} value={data.originalMaterial.id}>
              <MaterialAlternativeDetails 
                originalMaterial={data.originalMaterial}
                alternatives={data.alternatives}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MaterialAlternatives;
