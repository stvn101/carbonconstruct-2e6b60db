
import React, { useState } from 'react';
import { useGrok } from '@/contexts/GrokContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { MaterialInput } from '@/lib/carbonExports';
import { Upload, Search, BarChart3, Loader2, Leaf, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface MaterialAnalysisProps {
  materials: MaterialInput[];
  onAnalysisComplete?: (results: any) => void;
}

const MaterialAnalysis: React.FC<MaterialAnalysisProps> = ({ 
  materials, 
  onAnalysisComplete 
}) => {
  const { askGrok, streamGrok, isConfigured, isProcessing } = useGrok();
  const [analysisResults, setAnalysisResults] = useState<any>(null);
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

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error analyzing materials</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={() => setError(null)} className="mr-2">
              Dismiss
            </Button>
            <Button variant="default" size="sm" onClick={runAnalysis}>
              Try Again
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-carbon-600" />
              Material Sustainability Analysis
            </CardTitle>
            <CardDescription>
              Analyze your construction materials for sustainability insights and recommendations
            </CardDescription>
          </div>
          <Badge variant={isConfigured ? "outline" : "destructive"} className="mt-1">
            {isConfigured ? "AI Ready" : "Not Configured"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {isAnalyzing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Analyzing materials...</span>
              <span className="text-sm">{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} className="h-2" />
            
            {currentInsights && (
              <div className="bg-carbon-50 dark:bg-carbon-900 p-4 rounded-md border mt-4 overflow-y-auto max-h-[300px]">
                <h3 className="text-sm font-medium mb-2">Insights (Live)</h3>
                <div className="text-sm whitespace-pre-line">
                  {currentInsights}
                </div>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground">
              Grok AI is analyzing your materials for sustainability assessment. This may take a moment...
            </p>
          </div>
        ) : analysisResults ? (
          <div className="space-y-4">
            <div className="bg-carbon-50 dark:bg-carbon-900 p-4 rounded-md border">
              <h3 className="text-sm font-medium mb-2">Sustainability Insights</h3>
              <div className="text-sm whitespace-pre-line">
                {analysisResults.insights}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Analyzed Materials</h3>
              <div className="grid gap-2">
                {analysisResults.materials.map((material: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded-md text-xs">
                    <span className="font-medium">{material.name}</span>
                    <span className="text-muted-foreground">
                      {material.quantity} {material.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground text-right">
              Analysis completed: {new Date(analysisResults.timestamp).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="h-16 w-16 rounded-full bg-carbon-100 dark:bg-carbon-800 flex items-center justify-center">
              <Search className="h-8 w-8 text-carbon-500" />
            </div>
            <div className="text-center">
              <h3 className="font-medium mb-1">No Analysis Available</h3>
              <p className="text-sm text-muted-foreground">
                Run an analysis to get sustainability insights for your materials
              </p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={runAnalysis} 
          disabled={isAnalyzing || isProcessing || !materials || materials.length === 0 || !isConfigured}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <BarChart3 className="h-4 w-4 mr-2" />
              {analysisResults ? 'Re-analyze Materials' : 'Analyze Materials'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MaterialAnalysis;
