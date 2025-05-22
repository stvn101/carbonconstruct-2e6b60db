
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface MaterialAnalysisProgressProps {
  analysisProgress: number;
  currentInsights: string;
}

const MaterialAnalysisProgress: React.FC<MaterialAnalysisProgressProps> = ({ 
  analysisProgress, 
  currentInsights 
}) => {
  return (
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
  );
};

export default MaterialAnalysisProgress;
