
import { useMemo } from "react";
import { 
  Material, 
  Transport, 
  Energy, 
  MATERIAL_FACTORS, 
  TRANSPORT_FACTORS, 
  ENERGY_FACTORS 
} from "@/lib/carbonCalculations";

interface ChartDataHandlerProps {
  result: any;
  category: 'material' | 'transport' | 'energy';
}

export const useChartData = ({ result, category }: ChartDataHandlerProps) => {
  return useMemo(() => {
    console.log(`Preparing chart data for ${category} category`);
    console.log(`Result for ${category}:`, category === 'material' ? result.breakdownByMaterial : 
                                        category === 'transport' ? result.breakdownByTransport : 
                                        result.breakdownByEnergy);
    
    let chartData: Array<{name: string, value: number}> = [];
    let categoryTitle = "";
    let categoryDescription = "";
    let fillColor = "";
    let totalCategoryEmissions = 0;

    try {
      switch (category) {
        case 'material':
          if (!result.breakdownByMaterial || Object.keys(result.breakdownByMaterial).length === 0) {
            console.warn("Empty or invalid breakdownByMaterial data:", result.breakdownByMaterial);
          } else {
            console.log("Material factors available:", Object.keys(MATERIAL_FACTORS).length);
            
            chartData = Object.entries(result.breakdownByMaterial)
              .map(([key, value]) => {
                const materialName = MATERIAL_FACTORS[key as Material]?.name || key;
                console.log(`Material ${key} -> ${materialName}: ${value}`);
                return {
                  name: materialName,
                  value: Number(Number(value).toFixed(2))
                };
              })
              .filter(item => item.value > 0)
              .sort((a, b) => b.value - a.value);
          }
          categoryTitle = "Material Emissions";
          categoryDescription = "Carbon footprint by material type";
          fillColor = "#3e9847";
          totalCategoryEmissions = result.materialEmissions;
          break;
          
        case 'transport':
          chartData = Object.entries(result.breakdownByTransport)
            .map(([key, value]) => ({
              name: TRANSPORT_FACTORS[key as Transport]?.name || key,
              value: Number(Number(value).toFixed(2))
            }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);
          categoryTitle = "Transport Emissions";
          categoryDescription = "Carbon footprint by transport method";
          fillColor = "#25612d";
          totalCategoryEmissions = result.transportEmissions;
          break;
          
        case 'energy':
          chartData = Object.entries(result.breakdownByEnergy)
            .map(([key, value]) => ({
              name: ENERGY_FACTORS[key as Energy]?.name || key,
              value: Number(Number(value).toFixed(2))
            }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);
          categoryTitle = "Energy Emissions";
          categoryDescription = "Carbon footprint by energy source";
          fillColor = "#214d28";
          totalCategoryEmissions = result.energyEmissions;
          break;
      }
      
      console.log(`Generated ${chartData.length} chart items for ${category}`);
    } catch (error) {
      console.error(`Error generating chart data for ${category}:`, error);
      chartData = [];
    }

    // Filter out any items with zero or extremely small values
    const filteredChartData = chartData.filter(item => item.value > 0.01);
    
    return { 
      chartData: filteredChartData, 
      categoryTitle, 
      categoryDescription, 
      fillColor, 
      totalCategoryEmissions 
    };
  }, [result, category]);
};
