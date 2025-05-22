
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCalculator } from '@/contexts/CalculatorContext';
import { toast } from 'sonner';
import { retryWithRecovery } from '@/utils/errorHandling/connectionRecovery';

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

export function useSustainabilitySuggestions() {
  const { materials, transport, energy, calculationResult } = useCalculator();
  const [suggestions, setSuggestions] = useState<SustainabilitySuggestion[]>([]);
  const [prioritySuggestions, setPrioritySuggestions] = useState<SustainabilitySuggestion[]>([]);
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
        {
          onRetry: (attempt) => {
            console.log(`Retry attempt ${attempt} for sustainability suggestions`);
          },
          onFailure: (err) => {
            console.error("Failed to get sustainability suggestions after retries:", err);
            setError(err.message || "Failed to fetch sustainability suggestions");
          }
        }
      );
      
      if (result) {
        setSuggestions(result.suggestions || []);
        setPrioritySuggestions(result.prioritySuggestions || []);
        setReport(result.report || null);
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
  
  return {
    suggestions,
    prioritySuggestions,
    report,
    isLoading,
    error,
    refreshSuggestions: getSustainabilitySuggestions
  };
}
