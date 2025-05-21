
/**
 * Component for showing material cache status
 * Provides visual feedback about the cache status to users
 */
import React from 'react';
import { Clock, Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { CacheStats } from '@/hooks/materialCache';

interface MaterialCacheStatusProps {
  cacheStats: CacheStats;
  onRefresh: () => Promise<void>;
  isRefreshing?: boolean;
}

const MaterialCacheStatus: React.FC<MaterialCacheStatusProps> = ({
  cacheStats,
  onRefresh,
  isRefreshing = false
}) => {
  // Helper function to format the cache status message
  const getCacheStatusMessage = () => {
    if (!cacheStats.lastUpdated) {
      return "No cached data available";
    }
    
    const timeAgo = formatDistanceToNow(cacheStats.lastUpdated, { addSuffix: true });
    const itemCount = cacheStats.itemCount || 0;
    
    return `${itemCount} materials cached ${timeAgo}`;
  };
  
  // Get appropriate status indicator color
  const getStatusColor = () => {
    if (!cacheStats.lastUpdated) return "text-gray-400";
    
    switch (cacheStats.status) {
      case 'fresh': return "text-green-500";
      case 'stale': return "text-amber-500";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
      <div className="flex items-center gap-2">
        <Database className={`h-4 w-4 ${getStatusColor()}`} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-muted-foreground">
                {getCacheStatusMessage()}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <div className="text-xs">
                <div>Status: {cacheStats.status}</div>
                {cacheStats.lastUpdated && (
                  <div>Last updated: {cacheStats.lastUpdated.toLocaleString()}</div>
                )}
                {cacheStats.ageInMinutes !== null && (
                  <div>Cache age: {cacheStats.ageInMinutes} minutes</div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onRefresh()} 
        disabled={isRefreshing}
        className="h-7 px-2"
      >
        <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span>Refresh</span>
      </Button>
    </div>
  );
};

export default MaterialCacheStatus;
