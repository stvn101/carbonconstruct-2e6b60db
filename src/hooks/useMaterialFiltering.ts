import { useState, useCallback, useMemo } from 'react';
import { useRegion } from '@/contexts/RegionContext';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { useDebounce } from './useDebounce';
import { useMaterialCache } from './useMaterialCache';

export interface MaterialFilterOptions {
  searchTerm: string;
  selectedRegion: string;
  selectedAlternative: string;
  selectedTag: string;
}

export const useMaterialFiltering = (initialOptions: Partial<MaterialFilterOptions> = {}) => {
  const [searchTerm, setSearchTerm] = useState(initialOptions.searchTerm || "");
  const [selectedAlternative, setSelectedAlternative] = useState<string>(initialOptions.selectedAlternative || "none");
  const [selectedTag, setSelectedTag] = useState<string>(initialOptions.selectedTag || "all");
  const { selectedRegion } = useRegion();
  
  // Debounce the search term to prevent excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Use the cached materials
  const { materials: allMaterials, loading, error } = useMaterialCache();

  // Memoized filter function
  const filterPredicate = useCallback((material: ExtendedMaterialData) => {
    const matchesSearch = material.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    // Updated comparison to handle the fixed Australia region correctly
    // Since selectedRegion is always "Australia" from the context, we're checking if the material's region includes Australia
    const matchesRegion = material.region && material.region.includes(selectedRegion);
    
    const matchesAlternative = selectedAlternative === "none" || 
      material.alternativeTo === selectedAlternative;
    const matchesTag = selectedTag === "all" ||
      (material.tags && material.tags.includes(selectedTag));
    
    return matchesSearch && matchesRegion && matchesAlternative && matchesTag;
  }, [debouncedSearchTerm, selectedRegion, selectedAlternative, selectedTag]);

  // Memoized filtered materials
  const filteredMaterials = useMemo(() => 
    allMaterials.filter(filterPredicate),
    [allMaterials, filterPredicate]
  );

  // Memoized statistics
  const stats = useMemo(() => {
    const materialsByRegion: Record<string, number> = {};
    const allRegions = new Set<string>();
    const allTags = new Set<string>();
    
    allMaterials.forEach(material => {
      if (material.region) {
        const regions = material.region.split(", ");
        regions.forEach(region => {
          materialsByRegion[region] = (materialsByRegion[region] || 0) + 1;
          allRegions.add(region);
        });
      }
      material.tags?.forEach(tag => allTags.add(tag));
    });

    return {
      materialsByRegion,
      allRegions: Array.from(allRegions).sort(),
      allTags: Array.from(allTags).sort(),
      totalCount: filteredMaterials.length
    };
  }, [allMaterials, filteredMaterials]);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedAlternative("none");
    setSelectedTag("all");
  }, []);

  // Extract base material options for the dropdown
  const baseOptions = useMemo(() => {
    const options = new Set<string>();
    allMaterials.forEach(material => {
      if (material.alternativeTo) {
        options.add(material.alternativeTo);
      }
    });
    
    return Array.from(options).map(id => {
      const material = allMaterials.find(m => m.name.toLowerCase() === id.toLowerCase());
      return {
        id,
        name: material ? material.name : id
      };
    });
  }, [allMaterials]);

  // Get total materials count for displaying stats - compute only once
  const totalMaterials = useMemo(() => 
    allMaterials.length,
    [allMaterials]
  );

  return {
    // Filter states
    searchTerm,
    setSearchTerm,
    selectedRegion,
    selectedAlternative,
    setSelectedAlternative,
    selectedTag,
    setSelectedTag,
    
    // Results and stats
    filteredMaterials,
    materialsByRegion: stats.materialsByRegion,
    allTags: stats.allTags,
    allRegions: stats.allRegions,
    baseOptions,
    resetFilters,
    materialCount: stats.totalCount,
    totalMaterials,
    loading,
    error
  };
};
