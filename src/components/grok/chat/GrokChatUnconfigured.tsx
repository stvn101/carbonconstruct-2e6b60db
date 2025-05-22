
import React from 'react';
import { AlertCircle } from 'lucide-react';

const GrokChatUnconfigured: React.FC = () => {
  return (
    <div className="w-full px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Grok AI is not configured. Please go to Settings to configure your API key.
        </p>
      </div>
    </div>
  );
};

export default GrokChatUnconfigured;
