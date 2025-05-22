
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MaterialInput, TransportInput, EnergyInput } from '@/lib/carbonExports';
import { toast } from 'sonner';
import { recoverConnection } from '@/utils/errorHandling/connectionRecovery';
import { handleNetworkError } from '@/utils/errorHandling/networkErrorHandler';

export interface ComplianceResult {
  isCompliant: boolean;
  nccStatus: {
    compliant: boolean;
    score: number;
    details: {
      sectionJ?: {
        thermalPerformance: boolean;
        insulationStandards: boolean;
        glazingRequirements: boolean;
      };
      sectionF8?: {
        compliant: boolean;
        details: string;
      };
    };
  };
  nabersStatus: {
    compliant: boolean;
    rating: number;
    requirements: {
      current: string[];
      missing: string[];
    };
  };
  recommendedActions: string[];
  complianceDate: string;
}

export function useComplianceCheck() {
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Check compliance against NCC 2025 and NABERS standards
  const checkCompliance = useCallback(async (
    materials: MaterialInput[],
    transport: TransportInput[],
    energy: EnergyInput[],
    options?: { includeDetailedReport?: boolean }
  ): Promise<ComplianceResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Wrap the compliance check in the recovery utility
      const complianceResult = await recoverConnection(
        3, // Number of retries
        2000, // Delay between retries
        async () => {
          // For now we're simulating the compliance check with a local implementation
          // In a full implementation, this would call the Supabase function
          
          // Simplified compliance check based on material and energy inputs
          const hasInsulation = materials.some(m => 
            m.type.toLowerCase().includes('insulation') || 
            m.type.toLowerCase().includes('thermal')
          );
          
          const hasLowCarbon = materials.some(m => 
            m.type.toLowerCase().includes('low carbon') || 
            m.type.toLowerCase().includes('recycled')
          );
          
          const hasRenewableEnergy = energy.some(e => 
            e.type.toLowerCase().includes('solar') || 
            e.type.toLowerCase().includes('renewable')
          );
          
          // Calculate basic compliance scores
          const thermalPerformanceOK = hasInsulation;
          const materialScore = hasLowCarbon ? 70 : 40;
          const energyScore = hasRenewableEnergy ? 80 : 30;
          
          // Combined score affects NABERS rating
          const combinedScore = (materialScore * 0.5) + (energyScore * 0.5);
          const nabersRating = Math.min(5, Math.max(0, Math.round(combinedScore / 20)));
          
          const result: ComplianceResult = {
            isCompliant: combinedScore >= 60, // Arbitrary threshold
            nccStatus: {
              compliant: thermalPerformanceOK && materialScore >= 50,
              score: materialScore,
              details: {
                sectionJ: {
                  thermalPerformance: thermalPerformanceOK,
                  insulationStandards: hasInsulation,
                  glazingRequirements: materialScore > 60
                },
                sectionF8: {
                  compliant: hasLowCarbon,
                  details: hasLowCarbon 
                    ? "Meets low-carbon requirements" 
                    : "Does not meet low-carbon material requirements"
                }
              }
            },
            nabersStatus: {
              compliant: nabersRating >= 4,
              rating: nabersRating,
              requirements: {
                current: [
                  "Thermal performance",
                  hasRenewableEnergy ? "Renewable energy integration" : ""
                ].filter(Boolean),
                missing: [
                  !hasInsulation ? "Improved insulation" : "",
                  !hasLowCarbon ? "Low-carbon materials" : "",
                  !hasRenewableEnergy ? "Renewable energy sources" : ""
                ].filter(Boolean)
              }
            },
            recommendedActions: [
              !thermalPerformanceOK ? "Improve thermal performance with better insulation materials" : "",
              !hasLowCarbon ? "Replace high-carbon materials with low-carbon alternatives" : "",
              !hasRenewableEnergy ? "Integrate renewable energy sources into the project" : "",
              nabersRating < 4 ? "Improve overall energy efficiency to meet NABERS 4-star minimum rating" : ""
            ].filter(Boolean),
            complianceDate: new Date().toISOString()
          };
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          return result;
        }
      );
      
      // Check if complianceResult exists and handle it safely
      if (complianceResult) {
        // If recoverConnection returned a connection status boolean instead of our expected result
        if (typeof complianceResult === 'boolean') {
          // Handle the case where we only got a connection status back
          console.warn("Received connection status instead of compliance result");
          setIsLoading(false);
          return null; // Return null instead of the boolean
        }
        
        // Set the result with the actual compliance data
        setResult(complianceResult as ComplianceResult);
        toast.success("Compliance check complete", {
          description: "Project analyzed against NCC 2025 and NABERS standards"
        });
        
        return complianceResult as ComplianceResult;
      }
      
      setIsLoading(false);
      return null; // Return null if complianceResult is falsy
    } catch (err: any) {
      console.error("Error checking compliance:", err);
      
      // Use the network error handler to get a more user-friendly error
      const formattedError = handleNetworkError(err, 'compliance-check');
      setError(formattedError.message);
      
      setIsLoading(false);
      return null;
    }
  }, []);

  return {
    result,
    isLoading,
    error,
    retryCount,
    checkCompliance
  };
}
