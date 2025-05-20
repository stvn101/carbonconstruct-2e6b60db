
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSustainabilitySuggestions } from "@/hooks/useSustainabilitySuggestions";
import { ArrowRight, FileText, HelpCircle, LeafyGreen, Leaf, AlertTriangle, CheckCircle2 } from "lucide-react";
import { MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonExports";
import { SuggestionMetadata } from "@/hooks/useSustainabilitySuggestions";

interface SustainabilityAnalyzerProps {
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  projectName?: string;
  onReportGenerated?: (report: any) => void;
}

const SustainabilityAnalyzer: React.FC<SustainabilityAnalyzerProps> = ({
  materials,
  transport,
  energy,
  projectName,
  onReportGenerated
}) => {
  const {
    suggestions,
    prioritySuggestions,
    metadata,
    report,
    isLoading,
    error,
    hasCachedResult,
    getSuggestions
  } = useSustainabilitySuggestions();

  const [analysisScore, setAnalysisScore] = useState<number>(0);
  const [analysisType, setAnalysisType] = useState<'basic' | 'detailed' | 'comprehensive'>('basic');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  useEffect(() => {
    // Initial analysis when component mounts and inputs are available
    if (materials.length > 0 || transport.length > 0 || energy.length > 0) {
      performAnalysis();
    }
  }, []);
  
  useEffect(() => {
    // Update score when report data changes
    if (report) {
      // Calculate sustainability score based on report data
      const calculatedScore = calculateSustainabilityScore(report);
      setAnalysisScore(calculatedScore);
      
      // Notify parent component about the generated report
      if (onReportGenerated) {
        onReportGenerated(report);
      }
    }
  }, [report]);

  const performAnalysis = async () => {
    try {
      await getSuggestions(materials, transport, energy, {
        format: analysisType,
        includeLifecycleAnalysis: analysisType !== 'basic',
        includeComplianceDetails: analysisType === 'comprehensive'
      });
    } catch (err) {
      console.error("Failed to perform sustainability analysis:", err);
    }
  };
  
  const calculateSustainabilityScore = (reportData: any): number => {
    // Implementation based on NCC 2025 and NABERS standards
    if (!reportData) return 0;
    
    // Extract components from the report
    const materialScore = reportData.materialScore || 0;
    const transportScore = reportData.transportScore || 0;
    const energyScore = reportData.energyScore || 0;
    
    // Apply weightings based on industry standards
    // NCC 2025 and NABERS emphasize materials and energy over transport
    const weightedScore = (materialScore * 0.45) + (energyScore * 0.35) + (transportScore * 0.2);
    
    // Return a score between 0-100
    return Math.min(100, Math.max(0, Math.round(weightedScore)));
  };
  
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };
  
  const getSustainabilityRating = (score: number): string => {
    if (score >= 90) return "Outstanding";
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Very Good";
    if (score >= 60) return "Good";
    if (score >= 50) return "Moderate";
    if (score >= 30) return "Poor";
    return "Very Poor";
  };

  const renderSuggestionCategory = (title: string, items: string[], icon: React.ReactNode) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
          {icon}
          {title}
        </h4>
        <ul className="space-y-1 text-sm pl-7">
          {items.map((item, index) => (
            <li key={index} className="list-disc text-sm text-muted-foreground">{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Leaf className="h-5 w-5 text-carbon-600" />
            Sustainability Analysis
            {projectName && <span className="text-muted-foreground text-sm ml-2">for {projectName}</span>}
          </CardTitle>
          <CardDescription>
            Analysis based on {materials.length} materials, {transport.length} transport methods, and {energy.length} energy sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <Progress value={30} className="w-2/3 mb-4" />
              <p className="text-sm text-muted-foreground">
                Analyzing sustainability factors and generating recommendations...
              </p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={performAnalysis} 
                  className="mt-2"
                >
                  Retry Analysis
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="mb-6 flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">
                      Sustainability Score: <span className={getScoreColor(analysisScore)}>{analysisScore}</span>
                    </h3>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Rating: {getSustainabilityRating(analysisScore)} 
                    {hasCachedResult && <span className="text-xs ml-2">(Cached)</span>}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  >
                    {showAdvancedOptions ? "Hide Options" : "Analysis Options"}
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={performAnalysis}
                    className="bg-carbon-600 hover:bg-carbon-700 text-white"
                  >
                    Refresh Analysis
                  </Button>
                </div>
              </div>
              
              {showAdvancedOptions && (
                <div className="mb-6 p-4 border rounded-md bg-muted/30">
                  <h4 className="text-sm font-medium mb-2">Analysis Type</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                    <Button 
                      variant={analysisType === 'basic' ? "default" : "outline"} 
                      size="sm"
                      className={analysisType === 'basic' ? "bg-carbon-600 hover:bg-carbon-700 text-white" : ""}
                      onClick={() => setAnalysisType('basic')}
                    >
                      Basic
                    </Button>
                    <Button 
                      variant={analysisType === 'detailed' ? "default" : "outline"} 
                      size="sm"
                      className={analysisType === 'detailed' ? "bg-carbon-600 hover:bg-carbon-700 text-white" : ""}
                      onClick={() => setAnalysisType('detailed')}
                    >
                      Detailed
                    </Button>
                    <Button 
                      variant={analysisType === 'comprehensive' ? "default" : "outline"} 
                      size="sm"
                      className={analysisType === 'comprehensive' ? "bg-carbon-600 hover:bg-carbon-700 text-white" : ""}
                      onClick={() => setAnalysisType('comprehensive')}
                    >
                      Comprehensive
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analysisType === 'basic' && "Basic analysis provides key sustainability suggestions based on your inputs."}
                    {analysisType === 'detailed' && "Detailed analysis includes lifecycle assessments and materiality scoring."}
                    {analysisType === 'comprehensive' && "Comprehensive analysis adds NCC 2025 and NABERS compliance details."}
                  </p>
                </div>
              )}
              
              {prioritySuggestions && prioritySuggestions.length > 0 && (
                <div className="mb-6 p-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 rounded-r-md">
                  <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Priority Improvements
                  </h4>
                  <ul className="space-y-1 pl-6">
                    {prioritySuggestions.map((suggestion, index) => (
                      <li key={index} className="list-disc text-sm">
                        {suggestion.replace('Priority: ', '')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="space-y-4">
                {renderSuggestionCategory(
                  "Material Recommendations", 
                  report?.materialRecommendations || [], 
                  <LeafyGreen className="h-4 w-4 text-green-600" />
                )}
                
                {renderSuggestionCategory(
                  "Transport Optimizations", 
                  report?.transportRecommendations || [], 
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                )}
                
                {renderSuggestionCategory(
                  "Energy Efficiency", 
                  report?.energyRecommendations || [], 
                  <Leaf className="h-4 w-4 text-amber-600" />
                )}
                
                {renderSuggestionCategory(
                  "General Sustainability Suggestions", 
                  suggestions.filter(s => !prioritySuggestions?.includes(s)), 
                  <CheckCircle2 className="h-4 w-4 text-carbon-600" />
                )}
              </div>
              
              {metadata && (
                <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
                  <p>
                    Generated {metadata.source === 'api' ? 'via API' : 'locally'} at{' '}
                    {new Date(metadata.generatedAt).toLocaleString()}. 
                    {metadata.count} suggestions across {Object.keys(metadata.categories).length} categories.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SustainabilityAnalyzer;
