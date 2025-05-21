
import React from 'react';
import { AlertCircle, CheckCircle2, Clock, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CacheStats } from '@/hooks/materialCache';
import { formatDistanceToNow } from 'date-fns';

interface MaterialCacheIndicatorProps {
  cacheStats: CacheStats;
  isLoading?: boolean;
  onRefresh?: () => Promise<void>;
  className?: string;
}

export function MaterialCacheIndicator({ 
  cacheStats, 
  isLoading = false,
  onRefresh,
  className = ''
}: MaterialCacheIndicatorProps) {
  const { lastUpdated, itemCount, status, ageInMinutes } = cacheStats;
  
  // Format the last updated time
  const formattedTime = lastUpdated 
    ? formatDistanceToNow(lastUpdated, { addSuffix: true }) 
    : 'unknown';
  
  // Determine the icon and color based on status
  const getStatusIcon = () => {
    switch (status) {
      case 'fresh':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'stale':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'unknown':
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };
  
  // Build tooltip content
  const tooltipContent = () => {
    if (!lastUpdated) {
      return 'Material data status unknown';
    }
    
    return (
      <div className="space-y-1 text-xs">
        <p>Last updated: {formattedTime}</p>
        {itemCount !== null && <p>Materials in cache: {itemCount}</p>}
        {status === 'fresh' && <p>Cache is up-to-date</p>}
        {status === 'stale' && <p>Cache may be outdated</p>}
      </div>
    );
  };

  return (
    <div className={`flex items-center space-x-2 text-xs text-muted-foreground ${className}`}>
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-1">
              {getStatusIcon()}
              <span>
                {status === 'fresh' && 'Data is current'}
                {status === 'stale' && 'Data may be outdated'}
                {status === 'unknown' && 'Data status unknown'}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            {tooltipContent()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {onRefresh && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => onRefresh()}
          disabled={isLoading}
        >
          <RefreshCcw className="h-3 w-3" />
          <span className="sr-only">Refresh material data</span>
        </Button>
      )}
    </div>
  );
}
