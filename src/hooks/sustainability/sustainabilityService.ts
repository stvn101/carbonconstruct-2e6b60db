
import { supabase } from '@/integrations/supabase/client';
import { MaterialInput, TransportInput, EnergyInput } from '@/lib/carbonExports';
import { 
  ExtendedMaterialInput, 
  ExtendedTransportInput, 
  ExtendedEnergyInput,
  SuggestionsResponse,
  SustainabilityAnalysisOptions
} from './types';

export const fetchSustainabilitySuggestions = async (
  materials: MaterialInput[],
  transport: TransportInput[],
  energy: EnergyInput[],
  options?: SustainabilityAnalysisOptions
): Promise<SuggestionsResponse> => {
  console.log('Fetching sustainability suggestions from API...');
  
  // Cast the inputs to the extended types for the API request
  const extendedMaterials = materials as ExtendedMaterialInput[];
  const extendedTransport = transport as ExtendedTransportInput[];
  const extendedEnergy = energy as ExtendedEnergyInput[];
  
  const { data, error } = await supabase.functions.invoke('get-sustainability-suggestions', {
    body: { 
      materials: extendedMaterials.map(m => ({
        id: `material-${m.id || Math.random().toString(36).substring(7)}`,
        name: m.type,
        carbonFootprint: m.factor || 1,
        quantity: Number(m.quantity) || 0,
        recyclable: m.recyclable,
        recycledContent: m.recycledContent,
        locallySourced: m.locallySourced
      })),
      transport: extendedTransport.map(t => ({
        id: `transport-${t.id || Math.random().toString(36).substring(7)}`,
        type: t.type,
        distance: Number(t.distance) || 0,
        weight: Number(t.weight) || 1,
        fuelType: t.fuelType,
        emissionsFactor: t.factor || 0.1
      })),
      energy: extendedEnergy.map(e => ({
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
  
  return result;
};
