
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MaterialInput, TransportInput, EnergyInput } from '@/lib/carbonExports';

export interface SuggestionMetadata {
  source: 'api' | 'local';
  count: number;
  categories: {
    material: number;
    transport: number;
    energy: number;
    general: number;
    priority: number;
  };
  generatedAt: string;
}

export interface SuggestionsResponse {
  suggestions: string[];
  prioritySuggestions?: string[];
  metadata?: SuggestionMetadata;
}

export function useSustainabilitySuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [prioritySuggestions, setPrioritySuggestions] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<SuggestionMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCachedResult, setHasCachedResult] = useState(false);

  // Create a simple cache key based on inputs
  const createCacheKey = (materials: MaterialInput[], transport: TransportInput[], energy: EnergyInput[]) => {
    const materialsKey = materials.map(m => `${m.type}-${m.quantity}`).join('|');
    const transportKey = transport.map(t => `${t.type}-${t.distance}`).join('|');
    const energyKey = energy.map(e => `${e.type}-${e.amount}`).join('|');
    return `${materialsKey}_${transportKey}_${energyKey}`;
  };

  // In-memory cache for suggestions (will be cleared on page refresh)
  const suggestionsCache = new Map<string, SuggestionsResponse>();

  const getSuggestions = async (
    materials: MaterialInput[],
    transport: TransportInput[],
    energy: EnergyInput[]
  ): Promise<SuggestionsResponse> => {
    setIsLoading(true);
    setError(null);
    
    // Generate cache key for this specific input combination
    const cacheKey = createCacheKey(materials, transport, energy);
    
    // Check if we have a cached result
    if (suggestionsCache.has(cacheKey)) {
      const cachedResult = suggestionsCache.get(cacheKey)!;
      setHasCachedResult(true);
      setSuggestions(cachedResult.suggestions);
      setPrioritySuggestions(cachedResult.prioritySuggestions || []);
      setMetadata(cachedResult.metadata || null);
      setIsLoading(false);
      return cachedResult;
    }
    
    try {
      console.log('Fetching sustainability suggestions from API...');
      const { data, error } = await supabase.functions.invoke('get-sustainability-suggestions', {
        body: { materials, transport, energy }
      });
      
      if (error) throw new Error(error.message);
      
      // Process the response
      const result: SuggestionsResponse = {
        suggestions: data.suggestions || [],
        prioritySuggestions: data.prioritySuggestions || 
          // Extract priority suggestions if they're not separately provided
          data.suggestions?.filter((s: string) => s.startsWith('Priority:')) || [],
        metadata: data.metadata || {
          source: 'api',
          count: data.suggestions?.length || 0,
          categories: data.categories || {
            material: 0,
            transport: 0,
            energy: 0,
            general: 0,
            priority: 0
          },
          generatedAt: new Date().toISOString()
        }
      };
      
      // Update state with the result
      setSuggestions(result.suggestions);
      setPrioritySuggestions(result.prioritySuggestions);
      setMetadata(result.metadata || null);
      
      // Cache the result
      suggestionsCache.set(cacheKey, result);
      
      return result;
    } catch (err: any) {
      console.error('Error getting sustainability suggestions:', err);
      const errorMsg = err.message || 'Failed to get sustainability suggestions';
      setError(errorMsg);
      
      // Generate local fallback suggestions as a last resort
      const fallbackResult = generateLocalFallbackSuggestions(materials, transport, energy);
      setSuggestions(fallbackResult.suggestions);
      setPrioritySuggestions(fallbackResult.prioritySuggestions || []);
      setMetadata(fallbackResult.metadata);
      
      return fallbackResult;
    } finally {
      setIsLoading(false);
    }
  };

  // Generate local fallback suggestions when API fails
  const generateLocalFallbackSuggestions = (
    materials: MaterialInput[],
    transport: TransportInput[],
    energy: EnergyInput[]
  ): SuggestionsResponse => {
    // Basic generic suggestions
    const generalSuggestions = [
      'Consider using low-carbon alternatives for high-emission materials',
      'Source materials locally to reduce embodied carbon',
      'Optimize transport routes to minimize distances',
      'Consider using lower-emission transport options',
      'Use renewable energy sources for construction operations',
      'Implement energy-efficient practices on construction sites',
      'Plan for material reuse and recycling at the end of the building lifecycle',
      'Consider lifecycle assessment in material selection'
    ];
    
    // Identify priority areas
    const priorities: string[] = [];
    
    // Check if concrete is used in large quantities
    const concreteInputs = materials.filter(m => m.type.includes('concrete'));
    if (concreteInputs.some(m => m.quantity > 100)) {
      priorities.push('Priority: Replace traditional concrete with lower-carbon alternatives');
    }
    
    // Check if there's long-distance transport
    if (transport.some(t => t.distance > 200)) {
      priorities.push('Priority: Source materials locally to reduce transportation emissions');
    }
    
    // Check if there's high energy use
    if (energy.some(e => e.amount > 1000)) {
      priorities.push('Priority: Implement on-site renewable energy generation');
    }
    
    // Combine suggestions, prioritizing the priority ones
    const allSuggestions = [...priorities, ...generalSuggestions];
    
    return {
      suggestions: allSuggestions,
      prioritySuggestions: priorities,
      metadata: {
        source: 'local',
        count: allSuggestions.length,
        categories: {
          material: materials.length > 0 ? 2 : 0,
          transport: transport.length > 0 ? 2 : 0,
          energy: energy.length > 0 ? 2 : 0,
          general: 2,
          priority: priorities.length
        },
        generatedAt: new Date().toISOString()
      }
    };
  };

  return {
    suggestions,
    prioritySuggestions,
    metadata,
    isLoading,
    error,
    hasCachedResult,
    getSuggestions
  };
}
