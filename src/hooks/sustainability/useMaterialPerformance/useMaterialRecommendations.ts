
import { useState } from 'react';
import { MaterialInput } from '@/lib/carbonExports';
import { 
  getMaterialRecommendations,
  MaterialRecommendation 
} from '@/services/sustainability/performance';

export function useMaterialRecommendations(materials: MaterialInput[]) {
  const [recommendations, setRecommendations] = useState<MaterialRecommendation[]>([]);
  
  const fetchRecommendations = async (): Promise<MaterialRecommendation[]> => {
    try {
      const recs = await getMaterialRecommendations(materials);
      setRecommendations(recs);
      return recs;
    } catch (err) {
      console.error("Failed to get recommendations:", err);
      return [];
    }
  };
  
  return {
    recommendations,
    fetchRecommendations,
    getRecommendations: fetchRecommendations // Alias for backward compatibility
  };
}
