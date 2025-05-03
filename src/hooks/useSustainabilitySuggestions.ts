
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MaterialInput, TransportInput, EnergyInput } from '@/lib/carbonExports';

export function useSustainabilitySuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestions = async (
    materials: MaterialInput[],
    transport: TransportInput[],
    energy: EnergyInput[]
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-sustainability-suggestions', {
        body: { materials, transport, energy }
      });
      
      if (error) throw new Error(error.message);
      
      setSuggestions(data.suggestions || []);
      return data.suggestions;
    } catch (err: any) {
      console.error('Error getting sustainability suggestions:', err);
      setError(err.message || 'Failed to get sustainability suggestions');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    suggestions,
    isLoading,
    error,
    getSuggestions
  };
}
