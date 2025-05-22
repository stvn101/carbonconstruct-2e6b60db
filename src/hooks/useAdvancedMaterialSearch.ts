
import { useState } from 'react';
import { ExtendedMaterialData } from "@/lib/materials/materialTypes";
import { SearchParams } from "@/components/materials/database/AdvancedMaterialSearch";

interface UseAdvancedMaterialSearchProps {
  materials: ExtendedMaterialData[] | null;
  onResetFilters: () => void;
}

interface UseAdvancedMaterialSearchResult {
  useAdvancedSearch: boolean;
  advancedFilteredMaterials: ExtendedMaterialData[];
  toggleAdvancedSearch: () => void;
  handleAdvancedSearch: (searchParams: SearchParams) => void;
  resetAdvancedSearch: () => void;
}

export const useAdvancedMaterialSearch = ({
  materials,
  onResetFilters
}: UseAdvancedMaterialSearchProps): UseAdvancedMaterialSearchResult => {
  const [useAdvancedSearch, setUseAdvancedSearch] = useState(false);
  const [advancedFilteredMaterials, setAdvancedFilteredMaterials] = useState<ExtendedMaterialData[]>([]);

  const toggleAdvancedSearch = () => {
    setUseAdvancedSearch(!useAdvancedSearch);
    if (useAdvancedSearch) {
      // Reset when switching back to simple search
      resetAdvancedSearch();
    }
  };

  const handleAdvancedSearch = (searchParams: SearchParams) => {
    if (!materials) return;
    
    // Apply advanced search filters
    const filteredMaterials = materials.filter(material => {
      // Apply text search
      const matchesTerm = !searchParams.term || 
        material.name?.toLowerCase().includes(searchParams.term.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchParams.term.toLowerCase()) ||
        material.category?.toLowerCase().includes(searchParams.term.toLowerCase());
      
      // Apply category filter
      const matchesCategory = searchParams.categories.length === 0 || 
        (material.category && searchParams.categories.includes(material.category));
      
      // Apply region filter
      const matchesRegion = searchParams.regions.length === 0 || 
        (material.region && searchParams.regions.includes(material.region));
      
      // Apply tag filter
      const matchesTags = searchParams.tags.length === 0 || 
        (material.tags && material.tags.some(tag => searchParams.tags.includes(tag)));
      
      // Apply carbon range filter
      const carbonFootprint = material.carbon_footprint_kgco2e_kg || 0;
      const matchesCarbon = carbonFootprint >= searchParams.carbonRange[0] && 
                           carbonFootprint <= searchParams.carbonRange[1];
      
      // Apply sustainability score filter
      const sustainabilityScore = material.sustainabilityScore || 0;
      const matchesSustainability = sustainabilityScore >= searchParams.sustainabilityScore[0] && 
                                   sustainabilityScore <= searchParams.sustainabilityScore[1];
      
      // Apply recyclability filter
      const matchesRecyclability = searchParams.recyclability.length === 0 || 
        (material.recyclability && searchParams.recyclability.includes(material.recyclability));
      
      // Apply alternatives filter
      const matchesAlternatives = !searchParams.showOnlyAlternatives || 
        (material.alternativeTo && material.alternativeTo.length > 0);
      
      return matchesTerm && matchesCategory && matchesRegion && matchesTags && 
             matchesCarbon && matchesSustainability && matchesRecyclability &&
             matchesAlternatives;
    });
    
    setAdvancedFilteredMaterials(filteredMaterials);
  };

  const resetAdvancedSearch = () => {
    setAdvancedFilteredMaterials([]);
    onResetFilters();
  };

  return {
    useAdvancedSearch,
    advancedFilteredMaterials,
    toggleAdvancedSearch,
    handleAdvancedSearch,
    resetAdvancedSearch
  };
};
