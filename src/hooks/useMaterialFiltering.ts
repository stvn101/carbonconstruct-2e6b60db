
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRegion } from '@/contexts/RegionContext';
import { MATERIAL_FACTORS, ExtendedMaterialData, MATERIAL_TYPES } from '@/lib/materials';
import { useDebounce } from './useDebounce';

export interface MaterialFilterOptions {
  searchTerm: string;
  selectedRegion: string;
  selectedAlternative: string;
  selectedTag: string;
}

export const useMaterialFiltering = (initialOptions: Partial<MaterialFilterOptions> = {}) => {
  const [searchTerm, setSearchTerm] = useState(initialOptions.searchTerm || "");
  const [selectedRegion, setSelectedRegion] = useState<string>(initialOptions.selectedRegion || "all");
  const [selectedAlternative, setSelectedAlternative] = useState<string>(initialOptions.selectedAlternative || "none");
  const [selectedTag, setSelectedTag] = useState<string>(initialOptions.selectedTag || "all");
  const { selectedRegion: globalRegion } = useRegion();
  
  // Debounce the search term to prevent excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Set the default filter to the global region when component mounts
  useEffect(() => {
    if (globalRegion !== "National" && selectedRegion === "all") {
      setSelectedRegion(globalRegion);
    }
  }, [globalRegion]);

  // Convert MATERIAL_FACTORS to array format for filtering
  const allMaterials = useMemo(() => {
    return Object.entries(MATERIAL_FACTORS).map(([key, value]) => {
      // Enriching the material data with additional properties
      const materialWithMetadata: ExtendedMaterialData = {
        name: value.name || key,
        factor: value.factor,
        unit: value.unit || 'kg',
        region: 'Australia',
        tags: ['construction'],
        notes: '',
        alternativeTo: undefined,
        sustainabilityScore: Math.floor(Math.random() * 40) + 60, // Example data
        recyclability: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as 'High' | 'Medium' | 'Low' // Example data
      };
      
      return materialWithMetadata;
    });
  }, []);

  // Memoized filter function
  const filterPredicate = useCallback((material: ExtendedMaterialData) => {
    const matchesSearch = material.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || 
      (material.region && material.region.includes(selectedRegion));
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
    setSelectedRegion(globalRegion !== "National" ? globalRegion : "all");
    setSelectedAlternative("none");
    setSelectedTag("all");
  }, [globalRegion]);

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
    setSelectedRegion,
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
  };
};
