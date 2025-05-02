
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
  
  // Use the cached materials with pagination when search is active
  const usePagination = debouncedSearchTerm.length > 0;
  
  // Use the cached materials
  const { 
    materials: allMaterials, 
    loading, 
    error, 
    pagination, 
    updatePagination,
    totalCount,
    refreshCache,
    cacheStats
  } = useMaterialCache({
    usePagination,
    initialPagination: {
      page: 1,
      pageSize: 50,
      search: debouncedSearchTerm,
      sortBy: 'name',
      sortDirection: 'asc'
    }
  });

  // Load material categories
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const cats = await fetchMaterialCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load material categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  // Update search term in pagination when debounced value changes
  useEffect(() => {
    if (usePagination) {
      updatePagination({ search: debouncedSearchTerm, page: 1 });
    }
  }, [debouncedSearchTerm, usePagination, updatePagination]);

  // Memoized filter function for client-side filtering when not using pagination
  const filterPredicate = useCallback((material: ExtendedMaterialData) => {
    // If we're using server-side pagination with search, don't filter by search term here
    const matchesSearch = usePagination || material.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    // Updated comparison to handle the fixed Australia region correctly
    // Since selectedRegion is always "Australia" from the context, we're checking if the material's region includes Australia
    const matchesRegion = material.region && material.region.includes(selectedRegion);
    
    const matchesAlternative = selectedAlternative === "none" || 
      material.alternativeTo === selectedAlternative;
    const matchesTag = selectedTag === "all" ||
      (material.tags && material.tags.includes(selectedTag));
    
    return matchesSearch && matchesRegion && matchesAlternative && matchesTag;
  }, [debouncedSearchTerm, selectedRegion, selectedAlternative, selectedTag, usePagination]);

  // Memoized filtered materials
  const filteredMaterials = useMemo(() => 
    usePagination ? allMaterials : allMaterials.filter(filterPredicate),
    [allMaterials, filterPredicate, usePagination]
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
      totalCount: usePagination ? totalCount : filteredMaterials.length,
      categories
    };
  }, [allMaterials, filteredMaterials, usePagination, totalCount, categories]);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedAlternative("none");
    setSelectedTag("all");
    updatePagination({ page: 1, search: "" });
  }, [updatePagination]);

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

  // Handle pagination changes
  const handlePaginationChange = useCallback((page: number) => {
    updatePagination({ page });
  }, [updatePagination]);

  return {
    // Filter states
    searchTerm,
    setSearchTerm,
    selectedRegion,
    selectedAlternative,
    setSelectedAlternative,
    selectedTag,
    setSelectedTag,
    
    // Pagination
    pagination,
    handlePaginationChange,
    
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
    totalMaterials: totalCount,
    loading,
    error,
    isCategoriesLoading,
    cacheStats
  };
};
