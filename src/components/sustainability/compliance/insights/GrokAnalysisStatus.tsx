
import React from 'react';
import { AlertTriangle, Brain, RefreshCw } from 'lucide-react';

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
  if (!isConfigured) {
    return (
      <div className="p-4 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-2" />
        <h3 className="font-medium text-lg mb-1">Grok AI Not Configured</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure Grok AI in settings to enable AI-powered compliance insights.
        </p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 rounded-md">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }
  
  return null;
};

export default GrokAnalysisStatus;
