
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
  report?: any; // Full report object
}

export function useSustainabilitySuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [prioritySuggestions, setPrioritySuggestions] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<SuggestionMetadata | null>(null);
  const [report, setReport] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCachedResult, setHasCachedResult] = useState(false);

  // Create a simple cache key based on inputs
  const createCacheKey = (materials: MaterialInput[], transport: TransportInput[], energy: EnergyInput[], options?: any) => {
    const materialsKey = materials.map(m => `${m.type}-${m.quantity}`).join('|');
    const transportKey = transport.map(t => `${t.type}-${t.distance}`).join('|');
    const energyKey = energy.map(e => `${e.type}-${e.amount}`).join('|');
    const optionsKey = options ? JSON.stringify(options) : '';
    return `${materialsKey}_${transportKey}_${energyKey}_${optionsKey}`;
  };

  // In-memory cache for suggestions (will be cleared on page refresh)
  const suggestionsCache = new Map<string, SuggestionsResponse>();

  const getSuggestions = async (
    materials: MaterialInput[],
    transport: TransportInput[],
    energy: EnergyInput[],
    options?: { format?: 'basic' | 'detailed' | 'comprehensive', includeLifecycleAnalysis?: boolean }
  ): Promise<SuggestionsResponse> => {
    setIsLoading(true);
    setError(null);
    
    // Generate cache key for this specific input combination
    const cacheKey = createCacheKey(materials, transport, energy, options);
    
    // Check if we have a cached result
    if (suggestionsCache.has(cacheKey)) {
      const cachedResult = suggestionsCache.get(cacheKey)!;
      setHasCachedResult(true);
      setSuggestions(cachedResult.suggestions);
      setPrioritySuggestions(cachedResult.prioritySuggestions || []);
      setMetadata(cachedResult.metadata || null);
      setReport(cachedResult.report || null);
      setIsLoading(false);
      return cachedResult;
    }
    
    try {
      console.log('Fetching sustainability suggestions from API...');
      const { data, error } = await supabase.functions.invoke('get-sustainability-suggestions', {
        body: { 
          materials: materials.map(m => ({
            id: `material-${m.id || Math.random().toString(36).substring(7)}`,
            name: m.type,
            carbonFootprint: m.factor || 1,
            quantity: Number(m.quantity) || 0,
            recyclable: m.recyclable,
            recycledContent: m.recycledContent,
            locallySourced: m.locallySourced
          })),
          transport: transport.map(t => ({
            id: `transport-${t.id || Math.random().toString(36).substring(7)}`,
            type: t.type,
            distance: Number(t.distance) || 0,
            weight: Number(t.weight) || 1,
            fuelType: t.fuelType,
            emissionsFactor: t.factor || 0.1
          })),
          energy: energy.map(e => ({
            id: `energy-${e.id || Math.random().toString(36).substring(7)}`,
            source: e.type,
            quantity: Number(e.amount) || 0,
            unit: e.unit || 'kWh',
            emissionsFactor: e.factor || 0.5
          })),
          options: options || { format: 'basic' }
        }
      });
      
      if (error) throw new Error(error.message);
      
      // Extract report data
      const report = data.report || {};
      
      // Process the response
      const result: SuggestionsResponse = {
        suggestions: report.suggestions || [],
        prioritySuggestions: report.prioritySuggestions || [],
        report: report,
        metadata: {
          source: 'api',
          count: report.suggestions?.length || 0,
          categories: {
            material: report.materialRecommendations?.length || 0,
            transport: report.transportRecommendations?.length || 0,
            energy: report.energyRecommendations?.length || 0,
            general: report.suggestions?.filter((s: string) => !s.startsWith('Priority:')).length || 0,
            priority: report.prioritySuggestions?.length || 0
          },
          generatedAt: report.generatedAt || new Date().toISOString()
        }
      };
      
      // Update state with the result
      setSuggestions(result.suggestions);
      setPrioritySuggestions(result.prioritySuggestions || []);
      setMetadata(result.metadata || null);
      setReport(report || null);
      
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
      setReport(null);
      
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
    const concreteInputs = materials.filter(m => m.type.toLowerCase().includes('concrete'));
    if (concreteInputs.some(m => {
      const quantity = typeof m.quantity === 'string' ? parseFloat(m.quantity) : m.quantity;
      return !isNaN(Number(quantity)) && Number(quantity) > 100;
    })) {
      priorities.push('Priority: Replace traditional concrete with lower-carbon alternatives');
    }
    
    // Check if there's long-distance transport
    if (transport.some(t => {
      const distance = typeof t.distance === 'string' ? parseFloat(t.distance) : t.distance;
      return !isNaN(Number(distance)) && Number(distance) > 200;
    })) {
      priorities.push('Priority: Source materials locally to reduce transportation emissions');
    }
    
    // Check if there's high energy use
    if (energy.some(e => {
      const amount = typeof e.amount === 'string' ? parseFloat(e.amount) : e.amount;
      return !isNaN(Number(amount)) && Number(amount) > 1000;
    })) {
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
          general: generalSuggestions.length,
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
    report,
    isLoading,
    error,
    hasCachedResult,
    getSuggestions
  };
}
