
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, RefreshCw, X } from 'lucide-react';

interface ComplianceAnalysisSectionProps {
  title: string;
  compliant: boolean | undefined;
  badgeText?: string;
  analysis: string | null;
  analysisStream: string;
  isAnalyzing: boolean;
}

const ComplianceAnalysisSection: React.FC<ComplianceAnalysisSectionProps> = ({
  title,
  compliant,
  badgeText,
  analysis,
  analysisStream,
  isAnalyzing
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{title}</h3>
        <Badge 
          variant={compliant ? "default" : "destructive"}
          className="flex items-center"
        >
          {compliant ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              {badgeText || 'Compliant'}
            </>
          ) : (
            <>
              <X className="h-3 w-3 mr-1" />
              {badgeText || 'Non-Compliant'}
            </>
          )}
        </Badge>
      </div>
      
      {analysis ? (
        <div className="text-sm text-carbon-700 dark:text-carbon-300 bg-carbon-50 dark:bg-carbon-800 p-3 rounded-md border border-carbon-100 dark:border-carbon-700">
          {analysis}
        </div>
      ) : isAnalyzing && analysisStream ? (
        <div className="text-sm text-carbon-700 dark:text-carbon-300 bg-carbon-50 dark:bg-carbon-800 p-3 rounded-md border border-carbon-100 dark:border-carbon-700">
          {analysisStream}
          <span className="inline-block animate-pulse">▋</span>
        </div>
      ) : isAnalyzing ? (
        <div className="h-24 flex items-center justify-center text-sm text-muted-foreground">
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Analyzing {title} compliance...
        </div>
      ) : (
        <div className="text-sm text-muted-foreground italic">
          Click "Analyze" to get AI insights on {title} compliance
        </div>
      )}
    </div>
  );
};

export default ComplianceAnalysisSection;
