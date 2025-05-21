
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaterialAnalysisResult, SustainableMaterial } from "@/lib/materialCategories";
import AlternativesComparisonChart from "./AlternativesComparisonChart";
import { MaterialInput } from "@/lib/carbonExports";
import { AlertTriangle, ThumbsUp, BarChart3, Database, Filter, Recycle } from "lucide-react";

interface MaterialAlternativesProps {
  materialAnalysis: MaterialAnalysisResult | null;
  materials?: MaterialInput[];
  className?: string;
}

const MaterialAlternatives: React.FC<MaterialAlternativesProps> = ({
  materialAnalysis,
  materials,
  className
}) => {
  if (!materialAnalysis || !materialAnalysis.alternatives) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Material Alternatives</CardTitle>
          <CardDescription>Explore sustainable alternatives for your materials</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="text-center">
            <Database className="h-10 w-10 mb-3 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No material alternatives data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get original materials from high impact list
  const originalMaterials = materialAnalysis.highImpactMaterials || [];
  
  // Prepare data for rendering alternatives
  const alternativesData = Object.entries(materialAnalysis.alternatives)
    .map(([materialId, alternatives]) => {
      const originalMaterial = originalMaterials.find(m => m.id === materialId);
      if (!originalMaterial || !alternatives.length) return null;
      
      return {
        originalMaterial,
        alternatives: alternatives as SustainableMaterial[],
        hasSavings: alternatives.some((alt: SustainableMaterial) => alt.carbonReduction > 0)
      };
    })
    .filter(Boolean) as unknown as {
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
          </TabsContent>
          
          {alternativesData.map(data => (
            <TabsContent key={data.originalMaterial.id} value={data.originalMaterial.id}>
              <AlternativesComparisonChart 
                originalMaterial={data.originalMaterial}
                alternatives={data.alternatives}
              />
              
              <div className="mt-4 border-t pt-4">
                <h3 className="font-medium mb-2">Alternative Details</h3>
                <div className="space-y-3">
                  {data.alternatives.map((alt, index) => (
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
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MaterialAlternatives;
