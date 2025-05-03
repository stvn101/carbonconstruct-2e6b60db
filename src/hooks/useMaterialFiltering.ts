
import { useState, useCallback, useMemo } from 'react';
import { Material } from '@/lib/materialTypes';

interface FilterState {
  searchTerm: string;
  categoryFilter: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  regionFilter: string;
}

interface UseFilterResult {
  filters: FilterState;
  filteredMaterials: Material[];
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (category: string) => void;
  setSortBy: (field: string) => void;
  toggleSortDirection: () => void;
  resetFilters: () => void;
  setRegionFilter: (region: string) => void;
}

const defaultFilterState: FilterState = {
  searchTerm: '',
  categoryFilter: 'all',
  sortBy: 'name',
  sortDirection: 'asc',
  regionFilter: 'all'
};

export const useMaterialFiltering = (materials: Material[]): UseFilterResult => {
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

  const filteredMaterials = useMemo(() => {
    return materials
      .filter(material => {
        const matchesSearch = !filters.searchTerm || 
          material.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
        
        const matchesCategory = filters.categoryFilter === 'all' || 
          material.category === filters.categoryFilter;
        
        // Fix the comparison here to use === for string comparison
        const matchesRegion = filters.regionFilter === 'all' || 
          material.region === filters.regionFilter;
          
        return matchesSearch && matchesCategory && matchesRegion;
      })
      .sort((a, b) => {
        const field = filters.sortBy;
        let valueA = a[field as keyof Material];
        let valueB = b[field as keyof Material];
        
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
