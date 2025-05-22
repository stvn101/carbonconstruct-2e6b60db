
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, RefreshCw } from 'lucide-react';
import { useGrok } from '@/contexts/GrokContext';
import { ComplianceData } from '../types';
import { withNetworkErrorHandling } from '@/utils/errorHandling';
import GrokAnalysisStatus from './GrokAnalysisStatus';
import ComplianceAnalysisSection from './ComplianceAnalysisSection';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const { askGrok, streamGrok, isConfigured, isProcessing } = useGrok();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nccAnalysis, setNccAnalysis] = useState<string | null>(nccData?.grokAnalysis || null);
  const [nabersAnalysis, setNabersAnalysis] = useState<string | null>(nabersData?.grokAnalysis || null);
  const [nccAnalysisStream, setNccAnalysisStream] = useState<string>('');
  const [nabersAnalysisStream, setNabersAnalysisStream] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { isMobile } = useIsMobile();
  
  // Check if we have both compliance data sets
  const hasComplianceData = nccData && nabersData && 
    (typeof nccData.compliant !== 'undefined' || typeof nabersData.compliant !== 'undefined');
  
  // Function to analyze compliance data with Grok using streaming
  const analyzeComplianceData = async () => {
    if (!hasComplianceData || !isConfigured || isProcessing) return;
    
    setIsAnalyzing(true);
    setError(null);
    setNccAnalysisStream('');
    setNabersAnalysisStream('');
    
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
      
      await processComplianceAnalysis(complianceContext);
      
    } catch (error) {
      setError("Failed to analyze compliance data. Please check your connection and try again.");
      console.error("Grok compliance analysis error:", error);
      setIsAnalyzing(false);
    }
  };

  // Process both NCC and NABERS compliance analysis
  const processComplianceAnalysis = async (complianceContext: any) => {
    try {
      // Use streamGrok for NCC analysis
      const nccStream = streamGrok(
        "Analyze this NCC 2025 compliance data and provide insights on compliance issues, suggest improvements, and explain implications. Focus on practical suggestions that would help improve compliance.", 
        { compliance: complianceContext.ncc, type: 'NCC 2025' },
        'compliance_check'
      );
      
      // Use streamGrok for NABERS analysis
      const nabersStream = streamGrok(
        "Analyze this NABERS compliance data and provide insights on the rating, suggest improvements to achieve higher ratings, and explain implications. Focus on practical energy efficiency measures.", 
        { compliance: complianceContext.nabers, type: 'NABERS' },
        'compliance_check'
      );
      
      // Process the NCC stream
      handleNccStream(nccStream);
      
      // Process the NABERS stream
      handleNabersStream(nabersStream);
      
      // When both streams are processed, we'll be done analyzing
      Promise.all([
        processStreamToCompletion(nccStream),
        processStreamToCompletion(nabersStream)
      ]).then(() => {
        setIsAnalyzing(false);
      }).catch((err) => {
        console.error("Error processing streams:", err);
        setIsAnalyzing(false);
      });
    } catch (error) {
      setError("Analysis failed. Please try again.");
      console.error("Error starting analysis:", error);
      setIsAnalyzing(false);
    }
  };
  
  // Process NCC stream with state updates
  const handleNccStream = async (nccStream: AsyncIterable<string>) => {
    try {
      let nccFullResponse = '';
      for await (const chunk of nccStream) {
        nccFullResponse += chunk;
        setNccAnalysisStream(nccFullResponse);
      }
      
      // When stream completes, set the final analysis
      setNccAnalysis(nccFullResponse);
      
      // Check if both analyses are complete for callback
      if (nabersAnalysis && onGrokAnalysisComplete) {
        onGrokAnalysisComplete(nccFullResponse, nabersAnalysis);
      }
    } catch (err) {
      console.error("Error in NCC stream:", err);
      setError("NCC analysis failed. Please try again.");
    }
  };
  
  // Process NABERS stream with state updates
  const handleNabersStream = async (nabersStream: AsyncIterable<string>) => {
    try {
      let nabersFullResponse = '';
      for await (const chunk of nabersStream) {
        nabersFullResponse += chunk;
        setNabersAnalysisStream(nabersFullResponse);
      }
      
      // When stream completes, set the final analysis
      setNabersAnalysis(nabersFullResponse);
      
      // Check if both analyses are complete for callback
      if (nccAnalysis && onGrokAnalysisComplete) {
        onGrokAnalysisComplete(nccAnalysis, nabersFullResponse);
      }
    } catch (err) {
      console.error("Error in NABERS stream:", err);
      setError("NABERS analysis failed. Please try again.");
    }
  };
  
  // Helper function to process a stream without returning content (just for completion)
  async function processStreamToCompletion(stream: AsyncIterable<string>): Promise<void> {
    for await (const _ of stream) {
      // Just exhaust the stream to completion
    }
  }
  
  if (!hasComplianceData) {
    return null;
  }
  
  return (
    <Card className={`mt-3 sm:mt-4 ${className}`}>
      <CardHeader className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-start sm:items-center ${isMobile ? 'space-y-2 pb-2' : 'justify-between pb-4'}`}>
        <div>
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Brain className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-carbon-600" />
            AI Compliance Insights
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            AI-powered analysis and recommendations for improving compliance
          </CardDescription>
        </div>
        {isConfigured && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={analyzeComplianceData}
            disabled={isAnalyzing || isProcessing}
            className={isMobile ? "w-full mt-2" : ""}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Analyze
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0 px-3 sm:px-6">
        <GrokAnalysisStatus 
          isConfigured={isConfigured}
          error={error}
          isAnalyzing={isAnalyzing}
        />
        
        {isConfigured && !error && (
          <div className="space-y-4 sm:space-y-6">
            {/* NCC 2025 Analysis */}
            <ComplianceAnalysisSection
              title="NCC 2025"
              compliant={nccData?.compliant}
              analysis={nccAnalysis}
              analysisStream={nccAnalysisStream}
              isAnalyzing={isAnalyzing}
              isMobile={isMobile}
            />
            
            {/* NABERS Analysis */}
            <ComplianceAnalysisSection
              title="NABERS"
              compliant={nabersData?.compliant}
              badgeText={nabersData?.compliant ? `${nabersData?.details?.rating || 0}-Star` : 'Below Target'}
              analysis={nabersAnalysis}
              analysisStream={nabersAnalysisStream}
              isAnalyzing={isAnalyzing}
              isMobile={isMobile}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GrokComplianceInsights;
