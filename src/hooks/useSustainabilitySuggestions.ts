
import { useState } from 'react';
import { MaterialInput, TransportInput, EnergyInput } from '@/lib/carbonExports';
import { 
  SuggestionsResponse, 
  SuggestionMetadata,
  SustainabilityAnalysisOptions
} from './sustainability/types';
import { generateLocalFallbackSuggestions } from './sustainability/fallbackSuggestions';
import { createCacheKey, getCachedSuggestion, setCachedSuggestion } from './sustainability/suggestionCache';
import { fetchSustainabilitySuggestions } from './sustainability/sustainabilityService';

export type { SuggestionMetadata, SuggestionsResponse } from './sustainability/types';

export function useSustainabilitySuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [prioritySuggestions, setPrioritySuggestions] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<SuggestionMetadata | null>(null);
  const [report, setReport] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCachedResult, setHasCachedResult] = useState(false);

  const getSuggestions = async (
    materials: MaterialInput[],
    transport: TransportInput[],
    energy: EnergyInput[],
    options?: SustainabilityAnalysisOptions
  ): Promise<SuggestionsResponse> => {
    setIsLoading(true);
    setError(null);
    
    // Generate cache key for this specific input combination
    const cacheKey = createCacheKey(materials, transport, energy, options);
    
    // Check if we have a cached result
    const cachedResult = getCachedSuggestion(cacheKey);
    if (cachedResult) {
      setHasCachedResult(true);
      setSuggestions(cachedResult.suggestions);
      setPrioritySuggestions(cachedResult.prioritySuggestions || []);
      setMetadata(cachedResult.metadata || null);
      setReport(cachedResult.report || null);
      setIsLoading(false);
      return cachedResult;
    }
    
    try {
      const result = await fetchSustainabilitySuggestions(materials, transport, energy, options);
      
      // Update state with the result
      setSuggestions(result.suggestions);
      setPrioritySuggestions(result.prioritySuggestions || []);
      setMetadata(result.metadata || null);
      setReport(result.report || null);
      
      // Cache the result
      setCachedSuggestion(cacheKey, result);
      
      return result;
    } catch (err: any) {
      console.error('Error getting sustainability suggestions:', err);
      const errorMsg = err.message || 'Failed to get sustainability suggestions';
      setError(errorMsg);
      
      // Generate local fallback suggestions as a last resort
      const fallbackResult = generateLocalFallbackSuggestions(
        materials as any[], 
        transport as any[], 
        energy as any[]
      );
      setSuggestions(fallbackResult.suggestions);
      setPrioritySuggestions(fallbackResult.prioritySuggestions || []);
      setMetadata(fallbackResult.metadata);
      setReport(null);
      
      return fallbackResult;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    suggestions,
    prioritySuggestions,
    metadata,
    report,
    isLoading,
    error,
    hasCachedResult,
    getSuggestions
  };
}
