
import { useMemo } from 'react';
import { MATERIAL_FACTORS, EXTENDED_MATERIALS, REGIONS } from '@/lib/materialData';

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
  
  const baseOptions = useMemo(() => Object.entries(MATERIAL_FACTORS).map(([key, value]) => ({
    id: key,
    name: value.name
  })), []);
  
  const allTags = useMemo(() => Array.from(
    new Set(
      Object.values(EXTENDED_MATERIALS)
        .flatMap(material => material.tags || [])
    )
  ).sort(), []);

  const materialCount = useMemo(() => Object.keys(EXTENDED_MATERIALS).length, []);
  
  const materialsByRegion: Record<string, number> = useMemo(() => {
    const result: Record<string, number> = {};
    Object.values(EXTENDED_MATERIALS).forEach(material => {
      if (material.region) {
        const regions = material.region.split(", ");
        regions.forEach(region => {
          result[region] = (result[region] || 0) + 1;
        });
      }
    });
    return result;
  }, []);

  const filteredMaterials = useMemo(() => {
    return Object.entries(EXTENDED_MATERIALS).filter(([key, material]) => {
      const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
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
    allRegions: REGIONS,
    materialCount
  };
};
