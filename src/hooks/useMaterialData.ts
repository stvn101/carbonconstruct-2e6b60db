
import { useState, useEffect, useMemo, useCallback } from 'react';
import { MATERIAL_FACTORS, REGIONS } from '@/lib/materials';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MaterialOption } from '@/lib/materialTypes';

interface UseMaterialDataProps {
  searchTerm: string;
  selectedRegion: string;
  selectedAlternative: string;
  selectedTag: string;
  materials?: ExtendedMaterialData[]; // Accept materials as a prop
}

export const useMaterialData = ({
  searchTerm,
  selectedRegion,
  selectedAlternative,
  selectedTag,
  materials = [] // Default to empty array
}: UseMaterialDataProps) => {
  // No need to use the cache hook again, accept materials directly
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Safely create base options
  const baseOptions = useMemo(() => {
    try {
      if (!MATERIAL_FACTORS) {
        console.warn('MATERIAL_FACTORS is undefined, returning empty array');
        return [];
      }
      
      return Object.entries(MATERIAL_FACTORS).map(([key, value]) => ({
        id: key,
        name: value?.name || key
      }));
    } catch (error) {
      console.error('Error creating base options:', error);
      return [];
    }
  }, []);
  
  // Extract all unique tags from materials
  const allTags = useMemo(() => {
    try {
      if (!materials || materials.length === 0) {
        return [];
      }
      
      return Array.from(
        new Set(
          materials.flatMap(material => material?.tags || [])
            .filter(Boolean)
        )
      ).sort();
    } catch (error) {
      console.error('Error extracting tags:', error);
      return [];
    }
  }, [materials]);

  // Get material count safely
  const materialCount = useMemo(() => {
    return materials ? materials.length : 0;
  }, [materials]);
  
  // Compute materials by region
  const materialsByRegion = useMemo(() => {
    try {
      if (!materials || materials.length === 0) {
        return {};
      }
      
      const result: Record<string, number> = {};
      
      materials.forEach(material => {
        if (material?.region) {
          const regions = material.region.split(", ");
          regions.forEach(region => {
            if (region) {
              result[region] = (result[region] || 0) + 1;
            }
          });
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error computing materials by region:', error);
      return {};
    }
  }, [materials]);

  // Filter materials based on search and selections
  const filteredMaterials = useMemo(() => {
    try {
      if (!materials || materials.length === 0) {
        return [];
      }
      
      const lowerSearchTerm = searchTerm?.toLowerCase() || '';
      
      return materials.filter(material => {
        if (!material) return false;
        
        const materialName = material.name || '';
        const materialRegion = material.region || '';
        const materialAltTo = material.alternativeTo || '';
        const materialTags = material.tags || [];
        
        const matchesSearch = !lowerSearchTerm || 
          materialName.toLowerCase().includes(lowerSearchTerm);
        
        const matchesRegion = selectedRegion === "all" || 
          materialRegion.includes(selectedRegion);
        
        const matchesAlternative = selectedAlternative === "none" || 
          materialAltTo === selectedAlternative;
        
        const matchesTag = selectedTag === "all" ||
          materialTags.includes(selectedTag);
        
        return matchesSearch && matchesRegion && matchesAlternative && matchesTag;
      });
    } catch (error) {
      console.error('Error filtering materials:', error);
      return [];
    }
  }, [materials, searchTerm, selectedRegion, selectedAlternative, selectedTag]);

  // Get all regions
  const allRegions = useMemo(() => {
    try {
      return REGIONS ? Array.from(REGIONS) : [];
    } catch (error) {
      console.error('Error getting regions:', error);
      return [];
    }
  }, []);

  return {
    filteredMaterials,
    materials,
    materialsByRegion,
    allTags,
    baseOptions,
    allRegions,
    materialCount,
    loading,
    error
  };
};
