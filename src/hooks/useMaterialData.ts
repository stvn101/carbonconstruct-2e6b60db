
import { useMemo } from 'react';
import { MATERIAL_FACTORS, EXTENDED_MATERIALS, REGIONS } from '@/lib/materials';
import { MaterialOption } from '@/lib/materialTypes';

interface UseMaterialDataProps {
  searchTerm: string;
  selectedRegion: string;
  selectedAlternative: string;
  selectedTag: string;
}

export const useMaterialData = ({
  searchTerm,
  selectedRegion,
  selectedAlternative,
  selectedTag
}: UseMaterialDataProps) => {
  
  // Safely create base options
  const baseOptions = useMemo(() => 
    Object.entries(MATERIAL_FACTORS || {}).map(([key, value]) => ({
      id: key,
      name: value.name || key
    })), 
  []);
  
  // Safely extract all unique tags
  const allTags = useMemo(() => {
    if (!EXTENDED_MATERIALS) return [];
    
    return Array.from(
      new Set(
        Object.values(EXTENDED_MATERIALS)
          .flatMap(material => material.tags || [])
      )
    ).sort();
  }, []);

  // Get material count safely
  const materialCount = useMemo(() => 
    EXTENDED_MATERIALS ? Object.keys(EXTENDED_MATERIALS).length : 0, 
  []);
  
  // Compute materials by region safely
  const materialsByRegion = useMemo(() => {
    if (!EXTENDED_MATERIALS) return {};
    
    const result: Record<string, number> = {};
    
    Object.values(EXTENDED_MATERIALS).forEach(material => {
      if (material?.region) {
        const regions = material.region.split(", ");
        regions.forEach(region => {
          result[region] = (result[region] || 0) + 1;
        });
      }
    });
    
    return result;
  }, []);

  // Filter materials safely
  const filteredMaterials = useMemo(() => {
    if (!EXTENDED_MATERIALS) return [];
    
    return Object.entries(EXTENDED_MATERIALS).filter(([key, material]) => {
      if (!material) return false;
      
      const matchesSearch = !searchTerm || 
        material.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRegion = selectedRegion === "all" || 
        (material.region && material.region.includes(selectedRegion));
      
      const matchesAlternative = selectedAlternative === "none" || 
        material.alternativeTo === selectedAlternative;
      
      const matchesTag = selectedTag === "all" ||
        (material.tags && material.tags.includes(selectedTag));
      
      return matchesSearch && matchesRegion && matchesAlternative && matchesTag;
    });
  }, [searchTerm, selectedRegion, selectedAlternative, selectedTag]);

  return {
    filteredMaterials,
    materialsByRegion,
    allTags,
    baseOptions,
    allRegions: REGIONS ? Array.from(REGIONS) : [],
    materialCount
  };
};
