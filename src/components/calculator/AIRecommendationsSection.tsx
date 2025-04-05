
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import aiService, { AIDataAnalysisParams } from "@/services/AIService";
import { useAIService } from "@/components/ai/AIServiceProvider";
import AIConfigModal from "@/components/ai/AIConfigModal";

interface AIRecommendationsSectionProps {
  projectData: any; // Replace with your actual project data type
}

export function AIRecommendationsSection({ projectData }: AIRecommendationsSectionProps) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const { isConfigured } = useAIService();
  
  const analyzeProject = async () => {
    // No need to check if configured since we're auto-configuring
    setLoading(true);
    
    try {
      const params: AIDataAnalysisParams = {
        data: projectData.materials.concat(projectData.transport || [], projectData.energy || []),
        analysisType: 'carbon_optimization',
        options: {
          projectType: projectData.projectType || 'general',
          region: projectData.location?.region || 'unknown'
        }
      };
      
      const results = await aiService.analyzeData(params);
      
      setInsights(results.insights || []);
      setRecommendations(results.recommendations || []);
      
      toast.success("Analysis completed successfully");
    } catch (error) {
      console.error("Project analysis failed:", error);
      toast.error("Failed to analyze project data");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-carbon-500" /> 
          AI Carbon Optimization
        </CardTitle>
        <CardDescription>
          Get AI-powered insights and recommendations to reduce your carbon footprint
        </CardDescription>
      </CardHeader>
      <CardContent>
        {insights.length > 0 ? (
          <div className="space-y-6">
            {/* Insights Section */}
            <div>
              <h3 className="text-lg font-medium mb-3">Carbon Insights</h3>
              <div className="space-y-2">
                {insights.map((insight, index) => (
                  <div key={index} className="bg-carbon-50 dark:bg-carbon-900 p-3 rounded-md border border-carbon-100 dark:border-carbon-800">
                    <div className="flex">
                      <Lightbulb className="h-5 w-5 text-carbon-600 dark:text-carbon-400 mr-2 flex-shrink-0" />
                      <p className="text-sm">{insight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recommendations Section */}
            <div>
              <h3 className="text-lg font-medium mb-3">Recommendations</h3>
              <div className="space-y-2">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="bg-carbon-50 dark:bg-carbon-900 p-3 rounded-md border border-carbon-100 dark:border-carbon-800">
                    <div className="flex">
                      <Sparkles className="h-5 w-5 text-carbon-600 dark:text-carbon-400 mr-2 flex-shrink-0" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <Button
                variant="outline"
                onClick={analyzeProject}
                disabled={loading}
              >
                Refresh Analysis
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 mx-auto text-carbon-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">AI Carbon Analysis</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Our AI can analyze your project data to identify carbon reduction opportunities and provide targeted recommendations.
            </p>
            <Button
              onClick={analyzeProject}
              disabled={loading}
              className="bg-carbon-600 hover:bg-carbon-700 text-white"
            >
              {loading ? (
                <>Analyzing Project Data...</>
              ) : (
                <>Analyze Project Data <Sparkles className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>
        )}
      </CardContent>
      <AIConfigModal open={configModalOpen} onOpenChange={setConfigModalOpen} />
    </Card>
  );
}

export default AIRecommendationsSection;
