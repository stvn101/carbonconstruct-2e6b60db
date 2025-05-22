
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Loader2, Leaf } from 'lucide-react';
import { MaterialAnalysisProps } from './types';
import { useAnalysis } from './useAnalysis';
import MaterialAnalysisProgress from './MaterialAnalysisProgress';
import MaterialAnalysisResultsDisplay from './MaterialAnalysisResults';
import MaterialAnalysisEmpty from './MaterialAnalysisEmpty';
import MaterialAnalysisError from './MaterialAnalysisError';

const MaterialAnalysis: React.FC<MaterialAnalysisProps> = ({ 
  materials, 
  onAnalysisComplete 
}) => {
  const {
    analysisResults,
    isAnalyzing,
    analysisProgress,
    currentInsights,
    error,
    runAnalysis,
    resetError,
    isProcessing,
    isConfigured
  } = useAnalysis(materials, onAnalysisComplete);

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
        {error ? (
          <MaterialAnalysisError 
            error={error} 
            onDismiss={resetError} 
            onRetry={runAnalysis} 
          />
        ) : isAnalyzing ? (
          <MaterialAnalysisProgress 
            analysisProgress={analysisProgress} 
            currentInsights={currentInsights} 
          />
        ) : analysisResults ? (
          <MaterialAnalysisResultsDisplay analysisResults={analysisResults} />
        ) : (
          <MaterialAnalysisEmpty />
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
