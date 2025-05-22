
import React from 'react';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface GrokAnalysisStatusProps {
  isConfigured: boolean;
  error: string | null;
  isAnalyzing: boolean;
}

const GrokAnalysisStatus: React.FC<GrokAnalysisStatusProps> = ({
  isConfigured,
  error,
  isAnalyzing
}) => {
  const { isMobile } = useIsMobile();
  
  if (!isConfigured) {
    return (
      <div className={`p-3 sm:p-4 text-center`}>
        <div className="text-amber-500 mb-1 sm:mb-2 text-sm sm:text-base">Grok AI is not configured</div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Configure Grok AI in settings to enable AI-powered compliance insights.
        </p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-2 sm:p-4 border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 rounded-md">
        <div className="flex items-start">
          <X className="h-4 w-4 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
          <p className="text-xs sm:text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }
  
  return null;
};

export default GrokAnalysisStatus;
