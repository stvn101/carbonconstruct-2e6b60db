
import { useMemo, useCallback } from 'react';
import { MATERIAL_FACTORS, EXTENDED_MATERIALS, REGIONS } from '@/lib/materials';
import { MaterialOption } from '@/lib/materialTypes';
import ErrorTrackingService from '@/services/errorTrackingService';

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
      ErrorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'useMaterialData', action: 'baseOptions' }
      );
      return [];
    }
  }, []);
  
  // Safely extract all unique tags
  const allTags = useMemo(() => {
    try {
      if (!EXTENDED_MATERIALS) {
        console.warn('EXTENDED_MATERIALS is undefined, returning empty array');
        return [];
      }
      
      return Array.from(
        new Set(
          Object.values(EXTENDED_MATERIALS)
            .flatMap(material => material?.tags || [])
            .filter(Boolean) // Filter out undefined/null tags
        )
      ).sort();
    } catch (error) {
      console.error('Error extracting tags:', error);
      ErrorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'useMaterialData', action: 'allTags' }
      );
      return [];
    }
  }, []);

  // Get material count safely
  const materialCount = useMemo(() => {
    try {
      return EXTENDED_MATERIALS ? Object.keys(EXTENDED_MATERIALS).length : 0;
    } catch (error) {
      console.error('Error getting material count:', error);
      ErrorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'useMaterialData', action: 'materialCount' }
      );
      return 0;
    }
  }, []);
  
  // Compute materials by region safely
  const materialsByRegion = useMemo(() => {
    try {
      if (!EXTENDED_MATERIALS) {
        console.warn('EXTENDED_MATERIALS is undefined, returning empty object');
        return {};
      }
      
      const result: Record<string, number> = {};
      
      Object.values(EXTENDED_MATERIALS).forEach(material => {
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
      ErrorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'useMaterialData', action: 'materialsByRegion' }
      );
      return {};
    }
  }, []);

  // Filter materials safely with error handling and memoization
  const filteredMaterials = useMemo(() => {
    try {
      if (!EXTENDED_MATERIALS) {
        console.warn('EXTENDED_MATERIALS is undefined, returning empty array');
        return [];
      }
      
      const lowerSearchTerm = searchTerm?.toLowerCase() || '';
      
      return Object.entries(EXTENDED_MATERIALS).filter(([key, material]) => {
        if (!material) return false;
        
        // Safe string checks
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
      ErrorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'useMaterialData', action: 'filteredMaterials' }
      );
      return [];
    }
  }, [searchTerm, selectedRegion, selectedAlternative, selectedTag]);

  // Safely get all regions
  const allRegions = useMemo(() => {
    try {
      return REGIONS ? Array.from(REGIONS) : [];
    } catch (error) {
      console.error('Error getting regions:', error);
      ErrorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'useMaterialData', action: 'allRegions' }
      );
      return [];
    }
  }, []);

  return {
    filteredMaterials,
    materialsByRegion,
    allTags,
    baseOptions,
    allRegions,
    materialCount
  };
};
