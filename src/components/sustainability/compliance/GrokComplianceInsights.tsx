
import React from 'react';
import { useGrok } from '@/contexts/GrokContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Check, RefreshCw, X } from 'lucide-react';
import { ComplianceData } from './types';

interface GrokComplianceInsightsProps {
  nccData?: ComplianceData;
  nabersData?: ComplianceData;
  onGrokAnalysisComplete?: (nccAnalysis: string, nabersAnalysis: string) => void;
  className?: string;
}

const GrokComplianceInsights: React.FC<GrokComplianceInsightsProps> = ({
  nccData,
  nabersData,
  onGrokAnalysisComplete,
  className
}) => {
  const { askGrok, isConfigured, isProcessing } = useGrok();
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [nccAnalysis, setNccAnalysis] = React.useState<string | null>(nccData?.grokAnalysis || null);
  const [nabersAnalysis, setNabersAnalysis] = React.useState<string | null>(nabersData?.grokAnalysis || null);
  const [error, setError] = React.useState<string | null>(null);
  
  // Check if we have both compliance data sets
  const hasComplianceData = nccData && nabersData && 
    (typeof nccData.compliant !== 'undefined' || typeof nabersData.compliant !== 'undefined');
  
  // Function to analyze compliance data with Grok
  const analyzeComplianceData = async () => {
    if (!hasComplianceData || !isConfigured || isProcessing) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Create a structured context for Grok to analyze
      const complianceContext = {
        ncc: {
          compliant: nccData?.compliant,
          score: nccData?.score,
          details: nccData?.details
        },
        nabers: {
          compliant: nabersData?.compliant,
          score: nabersData?.score,
          rating: nabersData?.details?.rating,
          details: nabersData?.details
        }
      };
      
      // First analyze NCC compliance
      const nccResponse = await askGrok(
        "Analyze this NCC 2025 compliance data and provide insights on compliance issues, suggest improvements, and explain implications. Focus on practical suggestions that would help improve compliance.",
        { compliance: complianceContext.ncc, type: 'NCC 2025' },
        'compliance_check'
      );
      
      if (nccResponse.error) {
        throw new Error(nccResponse.error);
      }
      
      // Then analyze NABERS compliance
      const nabersResponse = await askGrok(
        "Analyze this NABERS compliance data and provide insights on the rating, suggest improvements to achieve higher ratings, and explain implications. Focus on practical energy efficiency measures.",
        { compliance: complianceContext.nabers, type: 'NABERS' },
        'compliance_check'
      );
      
      if (nabersResponse.error) {
        throw new Error(nabersResponse.error);
      }
      
      // Store the analysis results
      const nccInsights = nccResponse.text || nccResponse.response;
      const nabersInsights = nabersResponse.text || nabersResponse.response;
      
      setNccAnalysis(nccInsights);
      setNabersAnalysis(nabersInsights);
      
      // Notify parent component of completion
      if (onGrokAnalysisComplete) {
        onGrokAnalysisComplete(nccInsights, nabersInsights);
      }
      
    } catch (error) {
      setError(`Analysis failed: ${error instanceof Error ? error.message : String(error)}`);
      console.error("Grok compliance analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  if (!hasComplianceData) {
    return null;
  }
  
  return (
    <Card className={`mt-4 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-carbon-600" />
            AI Compliance Insights
          </CardTitle>
          <CardDescription>
            AI-powered analysis and recommendations for improving compliance
          </CardDescription>
        </div>
        {isConfigured && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={analyzeComplianceData}
            disabled={isAnalyzing || isProcessing}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!isConfigured ? (
          <div className="p-4 text-center">
            <div className="text-amber-500 mb-2">Grok AI is not configured</div>
            <p className="text-sm text-muted-foreground">
              Configure Grok AI in settings to enable AI-powered compliance insights.
            </p>
          </div>
        ) : error ? (
          <div className="p-4 border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 rounded-md">
            <div className="flex items-start">
              <X className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* NCC 2025 Analysis */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">NCC 2025</h3>
                <Badge 
                  variant={nccData?.compliant ? "default" : "destructive"}
                  className="flex items-center"
                >
                  {nccData?.compliant ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Compliant
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3 mr-1" />
                      Non-Compliant
                    </>
                  )}
                </Badge>
              </div>
              
              {nccAnalysis ? (
                <div className="text-sm text-carbon-700 dark:text-carbon-300 bg-carbon-50 dark:bg-carbon-800 p-3 rounded-md border border-carbon-100 dark:border-carbon-700">
                  {nccAnalysis}
                </div>
              ) : isAnalyzing ? (
                <div className="h-24 flex items-center justify-center text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing NCC 2025 compliance...
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  Click "Analyze" to get AI insights on NCC 2025 compliance
                </div>
              )}
            </div>
            
            {/* NABERS Analysis */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">NABERS</h3>
                <Badge 
                  variant={nabersData?.compliant ? "default" : "destructive"}
                  className="flex items-center"
                >
                  {nabersData?.compliant ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      {nabersData?.details?.rating || 0}-Star
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3 mr-1" />
                      Below Target
                    </>
                  )}
                </Badge>
              </div>
              
              {nabersAnalysis ? (
                <div className="text-sm text-carbon-700 dark:text-carbon-300 bg-carbon-50 dark:bg-carbon-800 p-3 rounded-md border border-carbon-100 dark:border-carbon-700">
                  {nabersAnalysis}
                </div>
              ) : isAnalyzing ? (
                <div className="h-24 flex items-center justify-center text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing NABERS compliance...
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  Click "Analyze" to get AI insights on NABERS compliance
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GrokComplianceInsights;
