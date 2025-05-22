
import { useState, useCallback, useMemo } from 'react';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

interface UseBasicMaterialFilteringProps {
  materials: ExtendedMaterialData[] | null;
  categoriesList: string[];
  allTags: string[];
}

interface UseBasicMaterialFilteringResult {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  filteredMaterials: ExtendedMaterialData[];
  resetFilters: () => void;
  isFiltering: boolean;
}

/**
 * Custom hook for basic material filtering functionality
 * 
 * @param materials - The full list of materials to filter
 * @param categoriesList - List of available material categories
 * @param allTags - List of available material tags
 * @returns Object containing filtering state and functions
 */
export const useBasicMaterialFiltering = ({
  materials,
  categoriesList,
  allTags
}: UseBasicMaterialFilteringProps): UseBasicMaterialFilteringResult => {
  // State for basic filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isFiltering, setIsFiltering] = useState(false);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTag('all');
    setSelectedRegion('all');
  }, []);

  // Filter materials based on basic criteria
  const filteredMaterials = useMemo(() => {
    if (!materials || materials.length === 0) return [];
    
    setIsFiltering(true);
    
    try {
      // Apply basic filters
      const filtered = materials.filter(material => {
        // Search term filter (case insensitive)
        const matchesSearch = !searchTerm || 
          (material.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.description?.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Category filter
        const matchesCategory = selectedCategory === 'all' || 
          material.category === selectedCategory;
        
        // Tag filter
        const matchesTag = selectedTag === 'all' || 
          (material.tags?.includes(selectedTag));
        
        // Region filter
        const matchesRegion = selectedRegion === 'all' || 
          material.region === selectedRegion;
        
        // All conditions must be satisfied
        return matchesSearch && matchesCategory && matchesTag && matchesRegion;
      });
      
      setIsFiltering(false);
      return filtered;
    } catch (error) {
      console.error('Error during basic material filtering:', error);
      setIsFiltering(false);
      return [];
    }
  }, [materials, searchTerm, selectedCategory, selectedTag, selectedRegion]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    selectedRegion,
    setSelectedRegion,
    filteredMaterials,
    resetFilters,
    isFiltering
  };
};
