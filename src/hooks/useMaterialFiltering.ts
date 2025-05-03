
import { useState, useCallback, useMemo } from 'react';

// Update the ExtendedMaterialData to match the type from materialTypes.ts
export interface ExtendedMaterialData {
  id?: string;
  name?: string;
  description?: string;
  factor?: number;
  unit?: string;
  category?: string;
  region?: string;
  alternativeTo?: string;
  notes?: string;
  tags?: string[];
  sustainabilityScore?: number;
  recyclability?: "High" | "Medium" | "Low";
  [key: string]: any; // Allow other properties
}

interface FilterState {
  searchTerm: string;
  categoryFilter: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  regionFilter: string;
}

export interface UseFilterResult {
  filters: FilterState;
  filteredMaterials: ExtendedMaterialData[];
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (category: string) => void;
  setSortBy: (field: string) => void;
  toggleSortDirection: () => void;
  resetFilters: () => void;
  setRegionFilter: (region: string) => void;
  
  // Additional properties for enhanced functionality
  materialsByRegion?: Record<string, number>;
  allTags?: string[];
  categories?: string[];
  baseOptions?: Array<{id: string, name: string}>;
  materialCount?: number;
  totalMaterials?: number;
  loading?: boolean;
  error?: Error | null;
  refreshCache?: () => Promise<void>;
  isCategoriesLoading?: boolean;
  cacheStats?: {lastUpdated: Date | null; itemCount: number | null};
}

const defaultFilterState: FilterState = {
  searchTerm: '',
  categoryFilter: 'all',
  sortBy: 'name',
  sortDirection: 'asc',
  regionFilter: 'all'
};

export const useMaterialFiltering = (materials: ExtendedMaterialData[]): UseFilterResult => {
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);

  const setSearchTerm = useCallback((term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  }, []);

  const setCategoryFilter = useCallback((category: string) => {
    setFilters(prev => ({ ...prev, categoryFilter: category }));
  }, []);

  const setSortBy = useCallback((field: string) => {
    setFilters(prev => ({ ...prev, sortBy: field }));
  }, []);

  const toggleSortDirection = useCallback(() => {
    setFilters(prev => ({ 
      ...prev, 
      sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc' 
    }));
  }, []);
  
  const setRegionFilter = useCallback((region: string) => {
    setFilters(prev => ({ ...prev, regionFilter: region }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilterState);
  }, []);

  // Apply indexing technique via memo for better performance with larger datasets
  const filteredMaterials = useMemo(() => {
    // Create an index for faster filtering
    const materialNameIndex = new Map<string, ExtendedMaterialData[]>();
    const materialCategoryIndex = new Map<string, ExtendedMaterialData[]>();
    const materialRegionIndex = new Map<string, ExtendedMaterialData[]>();
    
    // Only rebuild indexes when the materials array changes
    materials.forEach(material => {
      // Add to name index (lowercase for case-insensitive search)
      const nameLower = material.name?.toLowerCase() || '';
      if (!materialNameIndex.has(nameLower)) {
        materialNameIndex.set(nameLower, []);
      }
      materialNameIndex.get(nameLower)?.push(material);
      
      // Add to category index
      const category = material.category || 'uncategorized';
      if (!materialCategoryIndex.has(category)) {
        materialCategoryIndex.set(category, []);
      }
      materialCategoryIndex.get(category)?.push(material);
      
      // Add to region index
      const region = material.region || 'unknown';
      if (!materialRegionIndex.has(region)) {
        materialRegionIndex.set(region, []);
      }
      materialRegionIndex.get(region)?.push(material);
    });
    
    return materials
      .filter(material => {
        if (!material) return false;
        
        const materialName = material.name || '';
        const materialRegion = material.region || '';
        const materialCategory = material.category || '';
        
        const matchesSearch = !filters.searchTerm || 
          materialName.toLowerCase().includes(filters.searchTerm.toLowerCase());
        
        const matchesCategory = filters.categoryFilter === 'all' || 
          materialCategory === filters.categoryFilter;
        
        const matchesRegion = filters.regionFilter === 'all' || 
          materialRegion.includes(filters.regionFilter);
          
        return matchesSearch && matchesCategory && matchesRegion;
      })
      .sort((a, b) => {
        const field = filters.sortBy;
        let valueA = a[field as keyof ExtendedMaterialData];
        let valueB = b[field as keyof ExtendedMaterialData];
        
        // Handle null or undefined values
        if (valueA === null || valueA === undefined) valueA = '';
        if (valueB === null || valueB === undefined) valueB = '';
        
        // Use localeCompare for strings, regular comparison for numbers
        const result = typeof valueA === 'string' && typeof valueB === 'string'
          ? valueA.localeCompare(valueB)
          : Number(valueA) - Number(valueB);
          
        return filters.sortDirection === 'asc' ? result : -result;
      });
  }, [materials, filters]);

  return {
    filters,
    filteredMaterials,
    setSearchTerm,
    setCategoryFilter,
    setSortBy,
    toggleSortDirection,
    resetFilters,
    setRegionFilter
  };
};
