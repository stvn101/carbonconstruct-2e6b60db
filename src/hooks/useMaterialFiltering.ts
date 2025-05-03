
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRegion } from '@/contexts/RegionContext';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { useDebounce } from './useDebounce';
import { useMaterialCache } from './useMaterialCache';
import { fetchMaterialCategories } from '@/services/materialService';

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
  const [categories, setCategories] = useState<string[]>([]);
  const [isCategoriesLoading, setCategoriesLoading] = useState(false);
  const { selectedRegion } = useRegion();
  
  // Debounce the search term to prevent excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Use the cached materials
  const { 
    materials: allMaterials, 
    loading, 
    error, 
    refreshCache,
    cacheStats
  } = useMaterialCache();

  // Load material categories
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const cats = await fetchMaterialCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load material categories:", err);
        // Set to empty array on error to prevent undefined issues
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  // Memoized filter function for client-side filtering with added safety checks
  const filterPredicate = useCallback((material: ExtendedMaterialData) => {
    // Safely access properties with defaults if they don't exist
    const materialName = material.name?.toLowerCase() || '';
    const materialRegion = material.region || 'Australia'; // Default to Australia if not specified
    const materialAltTo = material.alternativeTo || '';
    const materialTags = material.tags || []; // Default to empty array if tags don't exist
    
    const matchesSearch = debouncedSearchTerm.trim() === '' || 
      materialName.includes(debouncedSearchTerm.toLowerCase());
    
    // Fix the type comparison error - convert selectedRegion to string before comparison
    const matchesRegion = selectedRegion === "all" || selectedRegion === materialRegion;
    
    const matchesAlternative = selectedAlternative === "none" || materialAltTo === selectedAlternative;
    
    // Handle tag filtering safely
    const matchesTag = selectedTag === "all" || materialTags.includes(selectedTag);
    
    return matchesSearch && matchesRegion && matchesAlternative && matchesTag;
  }, [debouncedSearchTerm, selectedRegion, selectedAlternative, selectedTag]);

  // Memoized filtered materials with safety check
  const filteredMaterials = useMemo(() => 
    Array.isArray(allMaterials) ? allMaterials.filter(filterPredicate) : [],
    [allMaterials, filterPredicate]
  );

  // Memoized statistics with safety checks
  const stats = useMemo(() => {
    const materialsByRegion: Record<string, number> = {};
    const allRegions = new Set<string>();
    const allTags = new Set<string>();
    
    if (Array.isArray(allMaterials)) {
      allMaterials.forEach(material => {
        // Handle region safely
        if (material?.region) {
          const regions = material.region.split(", ");
          regions.forEach(region => {
            materialsByRegion[region] = (materialsByRegion[region] || 0) + 1;
            allRegions.add(region);
          });
        } else {
          // Default region if not specified
          const defaultRegion = 'Australia';
          materialsByRegion[defaultRegion] = (materialsByRegion[defaultRegion] || 0) + 1;
          allRegions.add(defaultRegion);
        }
        
        // Handle tags safely
        if (Array.isArray(material?.tags)) {
          material.tags.forEach(tag => tag && allTags.add(tag));
        }
        
        // Fix for accessing category - don't access it directly from ExtendedMaterialData
        // This information should come from separate categories fetch API call
      });
    }

    return {
      materialsByRegion,
      allRegions: Array.from(allRegions).sort(),
      allTags: Array.from(allTags).sort(),
      totalCount: filteredMaterials.length,
      categories: categories || []
    };
  }, [allMaterials, filteredMaterials, categories]);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedAlternative("none");
    setSelectedTag("all");
  }, []);

  // Extract base material options for the dropdown with safety checks
  const baseOptions = useMemo(() => {
    const options = new Set<string>();
    
    if (Array.isArray(allMaterials)) {
      allMaterials.forEach(material => {
        if (material?.alternativeTo) {
          options.add(material.alternativeTo);
        }
      });
    }
    
    return Array.from(options).map(id => {
      const material = allMaterials?.find(m => m?.name?.toLowerCase() === id.toLowerCase());
      return {
        id,
        name: material?.name || id
      };
    });
  }, [allMaterials]);

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
    categories: stats.categories,
    baseOptions,
    resetFilters,
    refreshCache,
    
    // Status
    materialCount: stats.totalCount,
    totalMaterials: Array.isArray(allMaterials) ? allMaterials.length : 0,
    loading,
    error,
    isCategoriesLoading,
    cacheStats
  };
};
