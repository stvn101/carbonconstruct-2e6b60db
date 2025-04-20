
import { useState, useCallback, useMemo } from 'react';
import { useRegion } from '@/contexts/RegionContext';
import { filterMaterials, ExtendedMaterialData, MATERIAL_TYPES } from '@/lib/materials';

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
  
  // Set the default filter to the global region when component mounts
  useEffect(() => {
    if (globalRegion !== "National" && selectedRegion === "all") {
      setSelectedRegion(globalRegion);
    }
  }, [globalRegion]);

  // Memoized filter function
  const filterPredicate = useCallback((material: ExtendedMaterialData) => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || 
      (material.region && material.region.includes(selectedRegion));
    const matchesAlternative = selectedAlternative === "none" || 
      material.alternativeTo === selectedAlternative;
    const matchesTag = selectedTag === "all" ||
      (material.tags && material.tags.includes(selectedTag));
    
    return matchesSearch && matchesRegion && matchesAlternative && matchesTag;
  }, [searchTerm, selectedRegion, selectedAlternative, selectedTag]);

  // Memoized filtered materials
  const filteredMaterials = useMemo(() => 
    filterMaterials(filterPredicate),
    [filterPredicate]
  );

  // Memoized statistics
  const stats = useMemo(() => {
    const materialsByRegion: Record<string, number> = {};
    const allTags = new Set<string>();
    
    filteredMaterials.forEach(material => {
      if (material.region) {
        const regions = material.region.split(", ");
        regions.forEach(region => {
          materialsByRegion[region] = (materialsByRegion[region] || 0) + 1;
        });
      }
      material.tags?.forEach(tag => allTags.add(tag));
    });

    return {
      materialsByRegion,
      allTags: Array.from(allTags).sort(),
      totalCount: filteredMaterials.length
    };
  }, [filteredMaterials]);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedRegion(globalRegion !== "National" ? globalRegion : "all");
    setSelectedAlternative("none");
    setSelectedTag("all");
  }, [globalRegion]);

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
    resetFilters,
    materialCount: stats.totalCount,
  };
};

