
import { useState } from 'react';
import { useGrok } from '@/contexts/GrokContext';
import { toast } from 'sonner';
import { MaterialInput } from '@/lib/carbonExports';
import { MaterialAnalysisResults } from './types';

export function useAnalysis(
  materials: MaterialInput[],
  onAnalysisComplete?: (results: any) => void
) {
  const { streamGrok, isConfigured, isProcessing } = useGrok();
  const [analysisResults, setAnalysisResults] = useState<MaterialAnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentInsights, setCurrentInsights] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    if (!isConfigured) {
      toast.error("Grok AI is not configured", {
        description: "Please configure the AI assistant in the settings page"
      });
      return;
    }

    if (!materials || materials.length === 0) {
      toast.error("No materials to analyze", {
        description: "Please add materials to your project first"
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisProgress(10);
    setCurrentInsights('');

    try {
      // Create a simplified material list for analysis
      const materialData = materials.map(m => ({
        name: m.name,
        type: m.type,
        quantity: m.quantity,
        unit: m.unit,
        carbonFootprint: m.carbonFootprint,
        recycledContent: m.recycledContent || 'Unknown',
        origin: m.origin || 'Not specified'
      }));

      setAnalysisProgress(30);

      // Using the stream functionality for real-time updates
      const stream = streamGrok(
        "Analyze these construction materials for sustainability. Provide insights on their carbon footprint, recyclability, and suggest sustainable alternatives where applicable.",
        { materials: materialData },
        'material_analysis'
      );

      // Process the stream
      let fullResponse = '';
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setCurrentInsights(fullResponse);
        
        // Increase progress as we receive chunks
        setAnalysisProgress(prev => Math.min(80, prev + 1));
      }

      // Finalize when stream complete
      setAnalysisProgress(95);

      // Parse the response
      const results = {
        insights: fullResponse,
        materials: materialData,
        timestamp: new Date().toISOString()
      };

      setAnalysisResults(results);
      setAnalysisProgress(100);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(results);
      }

      toast.success("Material analysis complete", {
        description: "Grok AI has analyzed your materials for sustainability insights"
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze materials");
      
      toast.error("Analysis failed", {
        description: "There was an error analyzing your materials. Please try again."
      });
    } finally {
      // Small delay to show 100% progress before resetting
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisProgress(0);
      }, 1000);
    }
  };

  return {
    analysisResults,
    isAnalyzing,
    analysisProgress,
    currentInsights,
    error,
    runAnalysis,
    resetError: () => setError(null),
    isProcessing,
    isConfigured
  };
}
