
import { useState, useEffect, useCallback } from 'react';
import { fetchMaterials, fetchMaterialCategories } from '@/services/materialService';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { showErrorToast } from '@/utils/errorHandling/simpleToastHandler';

/**
 * Simplified hook for material data management
 */
export const useSimpleMaterialData = () => {
  const [materials, setMaterials] = useState<ExtendedMaterialData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load materials
  const loadMaterials = useCallback(async () => {
    setLoading(true);
    
    try {
      const [materialsData, categoriesData] = await Promise.all([
        fetchMaterials(),
        fetchMaterialCategories()
      ]);
      
      setMaterials(materialsData || []);
      setCategories(categoriesData || []);
      setError(null);
    } catch (err) {
      console.error('Error loading material data:', err);
      setError(err instanceof Error ? err : new Error('Failed to load materials'));
      showErrorToast('Failed to load materials. Using default data.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Load data on mount
  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);
  
  return {
    materials,
    categories,
    loading,
    error,
    refreshData: loadMaterials
  };
};
