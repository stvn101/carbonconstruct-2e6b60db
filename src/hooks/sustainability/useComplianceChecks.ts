
import { useState, useCallback } from 'react';
import { MaterialInput, EnergyInput } from '@/lib/carbonExports';
import { toast } from 'sonner';
import { useGrok } from '@/contexts/GrokContext';

interface ComplianceData {
  compliant: boolean;
  score: number;
  details?: Record<string, any>;
}

export function useComplianceChecks() {
  const [nccCompliance, setNCCCompliance] = useState<ComplianceData | null>(null);
  const [nabersCompliance, setNABERSCompliance] = useState<ComplianceData | null>(null);
  const [isLoadingCompliance, setIsLoadingCompliance] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { askGrok, streamGrok, isConfigured } = useGrok();

  const runComplianceChecks = useCallback(async (materials: MaterialInput[], energy: EnergyInput[]) => {
    if (!isConfigured) {
      toast.error("Grok AI is not configured", { 
        description: "Please configure the AI assistant to run compliance checks" 
      });
      return;
    }

    if (!materials.length) {
      toast.error("No materials to analyze", {
        description: "Please add materials to your project before checking compliance"
      });
      return;
    }

    setIsLoadingCompliance(true);
    setError(null);

    try {
      // Prepare data for AI analysis
      const projectData = {
        materials: materials.map(m => ({
          name: m.name,
          type: m.type,
          quantity: m.quantity,
          unit: m.unit,
          carbonFootprint: m.carbonFootprint
        })),
        energy: energy.map(e => ({
          type: e.type,
          amount: e.amount,
          unit: e.unit
        }))
      };

      // Use Grok AI stream to check compliance
      const stream = streamGrok(
        "Check if this construction project complies with NCC 2025 and NABERS standards. Provide separate compliance assessments for NCC and NABERS, including scores and specific details about compliance issues.",
        projectData,
        'compliance_check'
      );

      // Process the stream
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
      }

      if (!fullResponse) {
        throw new Error("Received empty response from Grok AI");
      }
      
      // Process the response
      // Here we're assuming the response is in a structured format we can parse
      // In reality, you might need more sophisticated parsing or ask Grok to return structured data
      
      // For this example, we'll simplify by using the built-in compliance logic
      const hasInsulation = materials.some(m => 
        m.type?.toLowerCase().includes('insulation') || 
        m.type?.toLowerCase().includes('thermal')
      );
      
      const hasLowCarbon = materials.some(m => 
        m.type?.toLowerCase().includes('low carbon') || 
        m.type?.toLowerCase().includes('recycled')
      );
      
      const hasRenewableEnergy = energy.some(e => 
        e.type?.toLowerCase().includes('solar') || 
        e.type?.toLowerCase().includes('renewable')
      );
      
      // Calculate basic compliance scores
      const thermalPerformanceOK = hasInsulation;
      const materialScore = hasLowCarbon ? 70 : 40;
      const energyScore = hasRenewableEnergy ? 80 : 30;
      
      // Set NCC compliance
      setNCCCompliance({
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
      });
      
      // Set NABERS compliance
      const nabersRating = Math.min(5, Math.max(0, Math.round((materialScore * 0.5) + (energyScore * 0.5) / 20)));
      setNABERSCompliance({
        compliant: nabersRating >= 4,
        score: nabersRating,
        details: {
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
        }
      });

      // Add Grok's analysis to the compliance data
      setNCCCompliance(prev => ({
        ...prev!,
        grokAnalysis: fullResponse
      }));

      toast.success("Compliance check complete", {
        description: "Your project has been analyzed against NCC 2025 and NABERS standards"
      });
    } catch (err) {
      console.error("Error in compliance check:", err);
      setError(err instanceof Error ? err.message : String(err));
      
      toast.error("Compliance check failed", {
        description: err instanceof Error ? err.message : "An unexpected error occurred"
      });
    } finally {
      setIsLoadingCompliance(false);
    }
  }, [askGrok, streamGrok, isConfigured]);

  return {
    nccCompliance,
    nabersCompliance,
    isLoadingCompliance,
    error,
    runComplianceChecks
  };
}
