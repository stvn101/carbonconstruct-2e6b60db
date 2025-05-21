
import { useState, useEffect } from "react";
import { MaterialInput } from "@/lib/carbonExports";
import { MaterialAnalysisResult, generateMaterialAnalysis } from "@/lib/materialCategories";
import { fetchMaterialAlternatives } from "@/hooks/sustainability/sustainabilityService";

export const useMaterialAnalysis = (
  materials: MaterialInput[],
  breakdownByMaterial: Record<string, number>
) => {
  const [materialAnalysis, setMaterialAnalysis] = useState<MaterialAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterialsData = async () => {
      if (!materialAnalysis && materials && materials.length > 0) {
        setIsLoading(true);
        setError(null);
        
        try {
          // Generate material analysis using our utility function
          const analysis = generateMaterialAnalysis(
            materials.map(m => ({
              id: `material-${Math.random().toString(36).substring(7)}`,
              name: m.type,
              carbon_footprint_kgco2e_kg: 
                m.type in breakdownByMaterial 
                  ? breakdownByMaterial[m.type as keyof typeof breakdownByMaterial] || 1 
                  : 1,
              quantity: Number(m.quantity) || 0
            }))
          );
          
          // Get alternatives for each high impact material
          for (const material of analysis.highImpactMaterials) {
            const alternatives = await fetchMaterialAlternatives(material.name, material.quantity);
            if (alternatives && alternatives.length > 0) {
              analysis.alternatives[material.id] = alternatives;
            }
          }
          
          setMaterialAnalysis(analysis);
        } catch (err) {
          console.error("Failed to fetch material analysis:", err);
          setError("Failed to analyze materials");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchMaterialsData();
  }, [materials, materialAnalysis, breakdownByMaterial]);

  return {
    materialAnalysis,
    isLoading,
    error,
    setMaterialAnalysis
  };
};
