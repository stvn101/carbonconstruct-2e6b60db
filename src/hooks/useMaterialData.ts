
import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchMaterials, SupabaseMaterial } from '@/services/materialService';
import { MATERIAL_FACTORS, REGIONS } from '@/lib/materials';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MaterialOption } from '@/lib/materialTypes';
import errorTrackingService from '@/services/error/errorTrackingService';

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
  const [materials, setMaterials] = useState<ExtendedMaterialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch materials from Supabase
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoading(true);
        const fetchedMaterials = await fetchMaterials();
        setMaterials(fetchedMaterials);
        setError(null);
      } catch (err) {
        console.error('Error loading materials:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        errorTrackingService.captureException(
          err instanceof Error ? err : new Error(String(err)),
          { component: 'useMaterialData', action: 'fetchMaterials' }
        );
      } finally {
        setLoading(false);
      }
    };
    
    loadMaterials();
  }, []);
  
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
      errorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'useMaterialData', action: 'baseOptions' }
      );
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
      errorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'useMaterialData', action: 'allTags' }
      );
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
      errorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'useMaterialData', action: 'materialsByRegion' }
      );
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
      errorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'useMaterialData', action: 'filteredMaterials' }
      );
      return [];
    }
  }, [materials, searchTerm, selectedRegion, selectedAlternative, selectedTag]);

  // Get all regions
  const allRegions = useMemo(() => {
    try {
      return REGIONS ? Array.from(REGIONS) : [];
    } catch (error) {
      console.error('Error getting regions:', error);
      errorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'useMaterialData', action: 'allRegions' }
      );
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
