
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CalculationInput, CalculationResult, calculateTotalEmissions } from '@/lib/carbonCalculations';

interface CalculationCacheEntry {
  input: CalculationInput;
  result: CalculationResult;
  timestamp: number;
}

interface CachedCalculationsContextType {
  getCachedResult: (input: CalculationInput) => CalculationResult | null;
  calculateWithCache: (input: CalculationInput) => CalculationResult;
  clearCache: () => void;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 50;

// Create context
const CachedCalculationsContext = createContext<CachedCalculationsContextType | undefined>(undefined);

// Input comparison function
function areInputsEqual(a: CalculationInput, b: CalculationInput): boolean {
  // Compare materials
  if (a.materials.length !== b.materials.length) return false;
  for (let i = 0; i < a.materials.length; i++) {
    if (a.materials[i].type !== b.materials[i].type ||
        a.materials[i].quantity !== b.materials[i].quantity) {
      return false;
    }
  }
  
  // Compare transport
  if (a.transport.length !== b.transport.length) return false;
  for (let i = 0; i < a.transport.length; i++) {
    if (a.transport[i].type !== b.transport[i].type ||
        a.transport[i].distance !== b.transport[i].distance ||
        a.transport[i].weight !== b.transport[i].weight) {
      return false;
    }
  }
  
  // Compare energy
  if (a.energy.length !== b.energy.length) return false;
  for (let i = 0; i < a.energy.length; i++) {
    if (a.energy[i].type !== b.energy[i].type ||
        a.energy[i].amount !== b.energy[i].amount) {
      return false;
    }
  }
  
  return true;
}

export const CachedCalculationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cache, setCache] = useState<CalculationCacheEntry[]>([]);
  
  const clearExpiredCache = useCallback(() => {
    const now = Date.now();
    setCache(currentCache => 
      currentCache.filter(entry => now - entry.timestamp < CACHE_TTL)
    );
  }, []);
  
  const getCachedResult = useCallback((input: CalculationInput): CalculationResult | null => {
    clearExpiredCache();
    
    const cacheHit = cache.find(entry => areInputsEqual(entry.input, input));
    return cacheHit ? cacheHit.result : null;
  }, [cache, clearExpiredCache]);
  
  const calculateWithCache = useCallback((input: CalculationInput): CalculationResult => {
    // Try to get from cache first
    const cachedResult = getCachedResult(input);
    if (cachedResult) {
      return cachedResult;
    }
    
    // Calculate new result
    const result = calculateTotalEmissions(input);
    
    // Add to cache
    setCache(currentCache => {
      // Limit cache size
      const updatedCache = currentCache.length >= MAX_CACHE_SIZE 
        ? currentCache.slice(1) 
        : [...currentCache];
        
      return [...updatedCache, { 
        input, 
        result,
        timestamp: Date.now()
      }];
    });
    
    return result;
  }, [getCachedResult]);
  
  const clearCache = useCallback(() => {
    setCache([]);
  }, []);
  
  return (
    <CachedCalculationsContext.Provider value={{ 
      getCachedResult,
      calculateWithCache,
      clearCache
    }}>
      {children}
    </CachedCalculationsContext.Provider>
  );
};

export const useCachedCalculations = (): CachedCalculationsContextType => {
  const context = useContext(CachedCalculationsContext);
  if (context === undefined) {
    throw new Error('useCachedCalculations must be used within a CachedCalculationsProvider');
  }
  return context;
};
