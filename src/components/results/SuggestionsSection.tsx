
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { SuggestionMetadata } from "@/hooks/useSustainabilitySuggestions";

interface SuggestionsSectionProps {
  suggestions: string[];
  prioritySuggestions?: string[];
  metadata?: SuggestionMetadata;
  isLoading?: boolean;
  error?: string | null;
  onRecalculate: () => void;
}

const SuggestionsSection = ({ 
  suggestions, 
  prioritySuggestions = [],
  metadata,
  isLoading = false,
  error = null,
  onRecalculate 
}: SuggestionsSectionProps) => {
  const navigate = useNavigate();
  
  // Filter out priority suggestions from the main list to avoid duplication
  const regularSuggestions = suggestions.filter(s => !s.startsWith('Priority:'));
  
  // Process priority suggestions to remove the prefix if needed
  const processedPrioritySuggestions = prioritySuggestions.map(s => 
    s.startsWith('Priority:') ? s.substring('Priority:'.length).trim() : s
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-carbon-500" />
          Improvement Suggestions
        </CardTitle>
        <CardDescription>
          Recommendations to reduce your project's carbon footprint
          {metadata?.source === 'api' && (
            <Badge variant="outline" className="ml-2 bg-carbon-50">
              API
            </Badge>
          )}
          {metadata?.source === 'local' && (
            <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-300">
              Local
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-carbon-700 mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading suggestions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800">Failed to load suggestions: {error}</p>
              <p className="text-xs text-red-600 mt-1">Showing fallback recommendations.</p>
            </div>
          </div>
        ) : (
          <>
            {processedPrioritySuggestions.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-carbon-800 mb-2 flex items-center gap-1">
                  <Badge className="bg-carbon-500 text-white">Priority</Badge>
                  High Impact Recommendations
                </h3>
                <ul className="space-y-2 border-l-2 border-carbon-500 pl-3">
                  {processedPrioritySuggestions.map((suggestion, index) => (
                    <li key={`priority-${index}`} className="flex items-start gap-2">
                      <Leaf className="h-5 w-5 text-carbon-600 mt-0.5 flex-shrink-0" />
                      <span className="font-medium text-carbon-800">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ul className="space-y-2">
              {regularSuggestions.map((suggestion, index) => (
                <li key={`regular-${index}`} className="flex items-start gap-2">
                  <Leaf className="h-5 w-5 text-carbon-500 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
            
            {metadata && (
              <div className="mt-4 pt-2 border-t text-xs text-muted-foreground">
                <p>Based on {metadata.categories.material} material, {metadata.categories.transport} transport, and {metadata.categories.energy} energy recommendations.</p>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between flex-wrap gap-2">
        <Button onClick={onRecalculate} variant="outline" className="hover:bg-carbon-100 hover:text-carbon-800 border-carbon-300">
          Recalculate
        </Button>
        <Button onClick={() => navigate("/calculator")} className="bg-carbon-600 hover:bg-carbon-700 text-white">
          New Calculation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SuggestionsSection;
