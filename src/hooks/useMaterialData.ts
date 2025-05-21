
/**
 * Hook for working with material data
 */
import { useMemo } from 'react';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MaterialsByRegion, MaterialOption } from '@/lib/materialTypes';

interface UseMaterialDataProps {
  materials: ExtendedMaterialData[];
  searchTerm: string;
  selectedRegion: string;
  selectedAlternative: string;
  selectedTag: string;
}

export function useMaterialData({
  materials,
  searchTerm,
  selectedRegion,
  selectedAlternative,
  selectedTag
}: UseMaterialDataProps) {
  // Filter materials based on search term, region, alternative, and tag
  const filteredMaterials = useMemo(() => {
    if (!materials || materials.length === 0) return [];
    
    return materials.filter((material) => {
      // Filter by search term
      const matchesSearch = !searchTerm || 
        material.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by region
      const matchesRegion = selectedRegion === 'all' || 
        !material.region || 
        material.region.toLowerCase() === selectedRegion.toLowerCase();
      
      // Filter by alternative
      const matchesAlternative = selectedAlternative === 'none' || 
        (selectedAlternative === 'alternatives' && material.alternativeTo) || 
        (selectedAlternative !== 'alternatives' && material.alternativeTo === selectedAlternative);
      
      // Filter by tag
      const matchesTag = selectedTag === 'all' || 
        (material.tags && material.tags.some(tag => 
          tag.toLowerCase() === selectedTag.toLowerCase()
        ));
      
      return matchesSearch && matchesRegion && matchesAlternative && matchesTag;
    });
  }, [materials, searchTerm, selectedRegion, selectedAlternative, selectedTag]);

  // Generate material statistics by region
  const materialsByRegion = useMemo(() => {
    if (!materials || materials.length === 0) return {};
    
    return materials.reduce((acc: MaterialsByRegion, material) => {
      const region = material.region || 'Unknown';
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {});
  }, [materials]);

  // Extract all unique tags from materials
  const allTags = useMemo(() => {
    if (!materials || materials.length === 0) return [];
    
    const tagSet = new Set<string>();
    
    materials.forEach((material) => {
      if (material.tags && Array.isArray(material.tags)) {
        material.tags.forEach((tag) => {
          if (tag) tagSet.add(tag);
        });
      }
      
      // Also add material categories as tags if they're not already there
      if (material.category) {
        tagSet.add(material.category);
      }
    });
    
    return Array.from(tagSet).sort();
  }, [materials]);

  // Generate base options for selectors
  const baseOptions = useMemo(() => {
    if (!materials || materials.length === 0) return [];
    
    const uniqueMaterials = new Map<string, ExtendedMaterialData>();
    
    materials.forEach((material) => {
      if (material.name && !uniqueMaterials.has(material.name.toLowerCase())) {
        uniqueMaterials.set(material.name.toLowerCase(), material);
      }
    });
    
    const options: MaterialOption[] = Array.from(uniqueMaterials.values())
      .filter(m => !m.alternativeTo)
      .map(m => ({
        id: m.id || '',
        name: m.name || ''
      }));
    
    return options;
  }, [materials]);

  // Count total unique materials
  const materialCount = useMemo(() => {
    return filteredMaterials.length;
  }, [filteredMaterials]);

  // Extract all regions
  const allRegions = useMemo(() => {
    return Object.keys(materialsByRegion).sort();
  }, [materialsByRegion]);

  return {
    filteredMaterials,
    materialsByRegion,
    allTags,
    baseOptions,
    materialCount,
    allRegions
  };
}
