
import { useState, useCallback, useMemo } from 'react';
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
  isFiltering: boolean;
}

/**
 * Custom hook for handling advanced material search functionality
 * 
 * @param materials - The full list of materials to filter
 * @param onResetFilters - Function to reset all filters
 * @returns Object containing search state and functions
 */
export const useAdvancedMaterialSearch = ({
  materials,
  onResetFilters
}: UseAdvancedMaterialSearchProps): UseAdvancedMaterialSearchResult => {
  // State management
  const [useAdvancedSearch, setUseAdvancedSearch] = useState(false);
  const [advancedFilteredMaterials, setAdvancedFilteredMaterials] = useState<ExtendedMaterialData[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // Toggle between simple and advanced search
  const toggleAdvancedSearch = useCallback(() => {
    setUseAdvancedSearch(prevState => {
      // When turning off advanced search, reset filters
      if (prevState) {
        resetAdvancedSearch();
      }
      return !prevState;
    });
  }, []);

  // Handle advanced search with performance optimizations
  const handleAdvancedSearch = useCallback((searchParams: SearchParams) => {
    if (!materials) return;
    
    setIsFiltering(true);
    
    try {
      // Use a requestAnimationFrame to prevent UI blocking during filtering
      requestAnimationFrame(() => {
        // Apply advanced search filters
        const filteredMaterials = materials.filter(material => {
          // Text search across multiple fields
          const matchesTerm = !searchParams.term || 
            (material.name?.toLowerCase().includes(searchParams.term.toLowerCase()) ||
            material.description?.toLowerCase().includes(searchParams.term.toLowerCase()) ||
            material.category?.toLowerCase().includes(searchParams.term.toLowerCase()));
          
          // Category filter (only apply if categories selected)
          const matchesCategory = searchParams.categories.length === 0 || 
            (material.category && searchParams.categories.includes(material.category));
          
          // Region filter (only apply if regions selected)
          const matchesRegion = searchParams.regions.length === 0 || 
            (material.region && searchParams.regions.includes(material.region));
          
          // Tag filter (only apply if tags selected)
          const matchesTags = searchParams.tags.length === 0 || 
            (material.tags && material.tags.some(tag => searchParams.tags.includes(tag)));
          
          // Carbon range filter
          const carbonFootprint = material.carbon_footprint_kgco2e_kg || 0;
          const matchesCarbon = carbonFootprint >= searchParams.carbonRange[0] && 
                              carbonFootprint <= searchParams.carbonRange[1];
          
          // Sustainability score filter
          const sustainabilityScore = material.sustainabilityScore || 0;
          const matchesSustainability = sustainabilityScore >= searchParams.sustainabilityScore[0] && 
                                      sustainabilityScore <= searchParams.sustainabilityScore[1];
          
          // Recyclability filter (only apply if recyclability levels selected)
          const matchesRecyclability = searchParams.recyclability.length === 0 || 
            (material.recyclability && searchParams.recyclability.includes(material.recyclability));
          
          // Alternatives filter
          const matchesAlternatives = !searchParams.showOnlyAlternatives || 
            (material.alternativeTo && material.alternativeTo.length > 0);
          
          // All conditions must match for material to be included
          return matchesTerm && matchesCategory && matchesRegion && matchesTags && 
                matchesCarbon && matchesSustainability && matchesRecyclability &&
                matchesAlternatives;
        });
        
        setAdvancedFilteredMaterials(filteredMaterials);
        setIsFiltering(false);
      });
    } catch (error) {
      console.error('Error during advanced material filtering:', error);
      setIsFiltering(false);
    }
  }, [materials]);

  // Reset advanced search state
  const resetAdvancedSearch = useCallback(() => {
    setAdvancedFilteredMaterials([]);
    onResetFilters();
    setIsFiltering(false);
  }, [onResetFilters]);

  return {
    useAdvancedSearch,
    advancedFilteredMaterials,
    toggleAdvancedSearch,
    handleAdvancedSearch,
    resetAdvancedSearch,
    isFiltering
  };
};
