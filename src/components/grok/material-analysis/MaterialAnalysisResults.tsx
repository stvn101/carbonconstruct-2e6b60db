
import React from 'react';
import { MaterialAnalysisResults } from './types';

interface MaterialAnalysisResultsDisplayProps {
  analysisResults: MaterialAnalysisResults;
}

const MaterialAnalysisResultsDisplay: React.FC<MaterialAnalysisResultsDisplayProps> = ({ analysisResults }) => {
  return (
    <div className="space-y-4">
      <div className="bg-carbon-50 dark:bg-carbon-900 p-4 rounded-md border">
        <h3 className="text-sm font-medium mb-2">Sustainability Insights</h3>
        <div className="text-sm whitespace-pre-line">
          {analysisResults.insights}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Analyzed Materials</h3>
        <div className="grid gap-2">
          {analysisResults.materials.map((material: any, index: number) => (
            <div key={index} className="flex justify-between items-center p-2 border rounded-md text-xs">
              <span className="font-medium">{material.name}</span>
              <span className="text-muted-foreground">
                {material.quantity} {material.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground text-right">
        Analysis completed: {new Date(analysisResults.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default MaterialAnalysisResultsDisplay;
