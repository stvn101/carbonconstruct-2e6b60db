
import { useState, useEffect } from 'react';
import { useRegion } from '@/contexts/RegionContext';
import { EXTENDED_MATERIALS } from '@/lib/materialData';

export interface ExtendedMaterialData {
  name: string;
  factor: number;
  unit: string;
  region?: string;
  alternativeTo?: string;
  notes?: string;
  tags?: string[];
}

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

  // Extract all unique tags from materials
  const allTags = Array.from(
    new Set(
      Object.values(EXTENDED_MATERIALS)
        .flatMap(material => material.tags || [])
    )
  ).sort();

  // Extract all unique regions from materials
  const allRegions = Array.from(
    new Set(
      Object.values(EXTENDED_MATERIALS)
        .flatMap(material => material.region ? material.region.split(", ") : [])
    )
  ).sort();

  // Get base materials for alternative dropdown
  const baseOptions = Object.entries(EXTENDED_MATERIALS)
    .filter(([, material]) => !material.alternativeTo)
    .map(([key, value]) => ({
      id: key,
      name: value.name
    }));

  // Apply filters to materials
  const filteredMaterials = Object.entries(EXTENDED_MATERIALS).filter(([key, material]) => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || 
      (material.region && material.region.includes(selectedRegion));
    const matchesAlternative = selectedAlternative === "none" || 
      material.alternativeTo === selectedAlternative;
    const matchesTag = selectedTag === "all" ||
      (material.tags && material.tags.includes(selectedTag));
    
    return matchesSearch && matchesRegion && matchesAlternative && matchesTag;
  });

  // Count materials by region
  const materialsByRegion: Record<string, number> = {};
  Object.values(EXTENDED_MATERIALS).forEach(material => {
    if (material.region) {
      const regions = material.region.split(", ");
      regions.forEach(region => {
        materialsByRegion[region] = (materialsByRegion[region] || 0) + 1;
      });
    }
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRegion(globalRegion !== "National" ? globalRegion : "all");
    setSelectedAlternative("none");
    setSelectedTag("all");
  };

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
    
    // Results
    filteredMaterials,
    materialsByRegion,
    allTags,
    allRegions,
    baseOptions,
    resetFilters,
    materialCount: filteredMaterials.length,
    totalMaterials: Object.keys(EXTENDED_MATERIALS).length
  };
};
