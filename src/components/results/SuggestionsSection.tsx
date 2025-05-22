
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, LightbulbIcon } from "lucide-react";
import { SuggestionMetadata } from "@/hooks/useSustainabilitySuggestions";

interface SuggestionsSectionProps {
  suggestions: string[];
  prioritySuggestions?: string[];
  metadata?: SuggestionMetadata | null;
  onRecalculate?: () => void;
}

const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({ 
  suggestions, 
  prioritySuggestions = [], 
  metadata = null,
  onRecalculate 
}) => {
  // If there are priority suggestions, show them first
  const displaySuggestions = prioritySuggestions.length > 0 
    ? [...prioritySuggestions, ...suggestions.filter(s => !prioritySuggestions.includes(s))]
    : suggestions;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <LightbulbIcon className="h-5 w-5 mr-2 text-carbon-400" />
            Sustainability Suggestions
          </CardTitle>
          
          {onRecalculate && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRecalculate} 
              className="h-8"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Recalculate</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {displaySuggestions.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {displaySuggestions.map((suggestion, index) => (
              <li key={index} className="text-carbon-700 dark:text-carbon-300">
                {suggestion}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground italic">No sustainability suggestions available.</p>
        )}
        
        {metadata && metadata.generatedTimestamp && (
          <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-muted-foreground">
              Analysis generated: {new Date(metadata.generatedTimestamp).toLocaleString()}
              {metadata.analysisVersion && ` • Version ${metadata.analysisVersion}`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestionsSection;
