
import { useState } from 'react';
import { 
  getMaterialTrends,
  SustainabilityTrendData 
} from '@/services/sustainability/performance';
import { MaterialInput } from '@/lib/carbonExports';

export function useMaterialTrends(materials: MaterialInput[]) {
  const [trends, setTrends] = useState<Record<string, SustainabilityTrendData | null>>({});
  
  const fetchTrends = async () => {
    const newTrends: Record<string, SustainabilityTrendData | null> = { ...trends };
    
    for (const material of materials) {
      if (!newTrends[material.type]) {
        const trend = await getMaterialTrends(material.type);
        newTrends[material.type] = trend;
      }
    }
    
    setTrends(newTrends);
    return newTrends;
  };
  
  const getTrendForMaterial = async (materialType: string): Promise<SustainabilityTrendData | null> => {
    try {
      // If we have already fetched this trend, return from cache
      if (trends[materialType]) return trends[materialType];
      
      const trend = await getMaterialTrends(materialType);
      
      // Update trends cache
      setTrends(prev => ({
        ...prev,
        [materialType]: trend
      }));
      
      return trend;
    } catch (err) {
      console.error(`Failed to get trend for ${materialType}:`, err);
      return null;
    }
  };
  
  return {
    trends,
    fetchTrends,
    getTrendForMaterial
  };
}
