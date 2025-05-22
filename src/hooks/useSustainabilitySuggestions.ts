
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCalculator } from '@/contexts/calculator';
import { toast } from 'sonner';
import { retryWithRecovery } from '@/utils/errorHandling/connectionRecovery';
import { CalculationInput } from '@/lib/carbonExports';

export interface SustainabilitySuggestion {
  id: string;
  title: string;
  description: string;
  details?: string;
  category?: string;
  priority?: number;
  impact?: string;
  action?: string;
}

export interface SuggestionMetadata {
  generatedTimestamp?: string;
  analysisVersion?: string;
  source?: string;
  confidence?: number;
}

export function useSustainabilitySuggestions() {
  const calculatorContext = useCalculator();
  const [suggestions, setSuggestions] = useState<SustainabilitySuggestion[]>([]);
  const [prioritySuggestions, setPrioritySuggestions] = useState<SustainabilitySuggestion[]>([]);
  const [report, setReport] = useState<any>(null);
  const [metadata, setMetadata] = useState<SuggestionMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Extract required properties from calculationInput
  const materials = calculatorContext.calculationInput?.materials || [];
  const transport = calculatorContext.calculationInput?.transport || [];
  const energy = calculatorContext.calculationInput?.energy || [];
  const calculationResult = calculatorContext.calculationResult;
  
  // Fetch sustainability suggestions when materials or energy data changes
  useEffect(() => {
    // Only fetch suggestions if we have materials data
    if (materials && materials.length > 0 && calculationResult) {
      getSustainabilitySuggestions();
    }
  }, [materials, energy, calculationResult]);
  
  const getSustainabilitySuggestions = async () => {
    // Don't fetch if no materials or already loading
    if (!materials || materials.length === 0 || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the recovery utility for network resilience
      // Fix: Pass correct parameters to retryWithRecovery
      const result = await retryWithRecovery(
        async () => {
          const { data, error } = await supabase.functions.invoke('get-sustainability-suggestions', {
            body: {
              materials: materials,
              transport: transport || [],
              energy: energy || [],
              options: { 
                format: 'detailed',
                includeComplianceDetails: true
              }
            }
          });
          
          if (error) throw error;
          return data;
        },
        2, // Max retries
        5000, // Initial delay
        (attempt, delay) => {
          console.log(`Retry attempt ${attempt} for sustainability suggestions`);
        }
      );
      
      if (result) {
        setSuggestions(result.suggestions || []);
        setPrioritySuggestions(result.prioritySuggestions || []);
        setReport(result.report || null);
        setMetadata(result.metadata || null);
      }
    } catch (err) {
      console.error("Error fetching sustainability suggestions:", err);
      setError(err instanceof Error ? err.message : String(err));
      
      // Show error toast only for non-network errors (network errors handled by retryWithRecovery)
      if (!(err instanceof Error && err.message.toLowerCase().includes('network'))) {
        toast.error("Failed to fetch sustainability suggestions", {
          description: err instanceof Error ? err.message : "An unexpected error occurred"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSuggestions = async (
    materials: any[], 
    transport: any[], 
    energy: any[], 
    options: any = {}
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fix: Pass correct parameters to retryWithRecovery
      const result = await retryWithRecovery(
        async () => {
          const { data, error } = await supabase.functions.invoke('get-sustainability-suggestions', {
            body: {
              materials,
              transport,
              energy,
              options
            }
          });
          
          if (error) throw error;
          return data;
        },
        2, // Max retries
        5000, // Initial delay
        (attempt, delay) => {
          console.log(`Retry attempt ${attempt} for sustainability suggestions`);
        }
      );
      
      if (result) {
        setSuggestions(result.suggestions || []);
        setPrioritySuggestions(result.prioritySuggestions || []);
        setReport(result.report || null);
        setMetadata(result.metadata || null);
      }
      
      return result;
    } catch (err) {
      console.error("Error fetching sustainability suggestions:", err);
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    suggestions,
    prioritySuggestions,
    report,
    metadata,
    isLoading,
    error,
    refreshSuggestions: getSustainabilitySuggestions,
    getSuggestions
  };
}
