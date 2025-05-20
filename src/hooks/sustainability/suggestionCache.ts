
import { SuggestionsResponse } from './types';
import { MaterialInput, TransportInput, EnergyInput } from '@/lib/carbonExports';
import { SustainabilityAnalysisOptions } from './types';

// In-memory cache for suggestions (will be cleared on page refresh)
const suggestionsCache = new Map<string, SuggestionsResponse>();

// Create a simple cache key based on inputs
export const createCacheKey = (
  materials: MaterialInput[], 
  transport: TransportInput[], 
  energy: EnergyInput[], 
  options?: SustainabilityAnalysisOptions
): string => {
  const materialsKey = materials.map(m => `${m.type}-${m.quantity}`).join('|');
  const transportKey = transport.map(t => `${t.type}-${t.distance}`).join('|');
  const energyKey = energy.map(e => `${e.type}-${e.amount}`).join('|');
  const optionsKey = options ? JSON.stringify(options) : '';
  return `${materialsKey}_${transportKey}_${energyKey}_${optionsKey}`;
};

export const getCachedSuggestion = (cacheKey: string): SuggestionsResponse | undefined => {
  return suggestionsCache.get(cacheKey);
};

export const setCachedSuggestion = (cacheKey: string, result: SuggestionsResponse): void => {
  suggestionsCache.set(cacheKey, result);
};
