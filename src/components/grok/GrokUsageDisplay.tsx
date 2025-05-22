
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info, BarChart, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UsageData {
  totalTokens: number;
  usageByFeature: Record<string, number>;
  requestCount: number;
  lastUsed: string;
  monthlyQuota: number;
}

interface GrokUsageDisplayProps {
  compact?: boolean;
  className?: string;
}

const GrokUsageDisplay: React.FC<GrokUsageDisplayProps> = ({ 
  compact = false,
  className = '' 
}) => {
  const { user } = useAuth();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch usage data from database
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    const fetchUsageData = async () => {
      try {
        setIsLoading(true);
        
        // Get the current month's first and last day
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
        
        // Query the grok_usage table
        const { data, error } = await supabase
          .from('grok_usage')
          .select('*')
          .eq('user_id', user.id)
          .gte('timestamp', firstDay)
          .lte('timestamp', lastDay)
          .order('timestamp', { ascending: false });
          
        if (error) throw error;
        
        // Format the usage data
        const usageByFeature: Record<string, number> = {};
        let totalTokens = 0;
        
        data.forEach(record => {
          const feature = record.feature || 'unknown';
          usageByFeature[feature] = (usageByFeature[feature] || 0) + (record.tokens_used || 0);
          totalTokens += (record.tokens_used || 0);
        });
        
        // Set default monthly quota based on user's tier
        // This would ideally come from a subscription table or user profile
        const monthlyQuota = 100000; // Default quota, should be adjusted based on user tier
        
        setUsageData({
          totalTokens,
          usageByFeature,
          requestCount: data.length,
          lastUsed: data.length > 0 ? data[0].timestamp : 'Never',
          monthlyQuota
        });
      } catch (e) {
        console.error('Error fetching Grok usage:', e);
        setError('Failed to load usage data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsageData();
  }, [user]);
  
  // Format usage percentage
  const getUsagePercentage = () => {
    if (!usageData || usageData.monthlyQuota === 0) return 0;
    return Math.min(100, (usageData.totalTokens / usageData.monthlyQuota) * 100);
  };
  
  // Determine progress color based on usage percentage
  const getProgressColor = () => {
    const percentage = getUsagePercentage();
    if (percentage > 90) return 'bg-red-600';
    if (percentage > 75) return 'bg-amber-500';
    return 'bg-carbon-600';
  };
  
  if (!user) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-carbon-600" />
            Grok AI Usage
          </CardTitle>
          <CardDescription>
            Sign in to view your Grok AI usage statistics
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Grok AI Usage</CardTitle>
          <CardDescription>Loading usage data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24">
            <div className="animate-pulse bg-carbon-100 dark:bg-carbon-700 rounded-md w-full h-6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Grok AI Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center">
            <BarChart className="h-4 w-4 mr-2 text-carbon-600" />
            Grok AI Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress 
              value={getUsagePercentage()} 
              className="h-2"
              indicatorClassName={getProgressColor()}
            />
            <div className="flex justify-between text-xs text-carbon-600 dark:text-carbon-300">
              <span>{usageData?.totalTokens.toLocaleString()} used</span>
              <span>{getUsagePercentage().toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart className="h-5 w-5 mr-2 text-carbon-600" />
          Grok AI Usage
        </CardTitle>
        <CardDescription>
          Your current Grok AI usage for this billing period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Usage Progress */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Token Usage</span>
              <span className="text-sm text-carbon-600 dark:text-carbon-300">
                {usageData?.totalTokens.toLocaleString()} / {usageData?.monthlyQuota.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={getUsagePercentage()} 
              className="h-2"
              indicatorClassName={getProgressColor()}
            />
            <div className="flex justify-end">
              <span className="text-xs text-carbon-600 dark:text-carbon-300">
                {getUsagePercentage().toFixed(1)}% used
              </span>
            </div>
          </div>
          
          {/* Feature Breakdown */}
          <div>
            <h4 className="text-sm font-medium mb-2">Usage by Feature</h4>
            <div className="space-y-1.5">
              {Object.entries(usageData?.usageByFeature || {}).map(([feature, tokens]) => (
                <div key={feature} className="flex justify-between">
                  <span className="text-xs capitalize">
                    {feature.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-carbon-600 dark:text-carbon-300">
                    {tokens.toLocaleString()} tokens
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-carbon-50 dark:bg-carbon-800 p-3 rounded-md">
              <div className="text-xs text-carbon-500 dark:text-carbon-400">Total Requests</div>
              <div className="text-lg font-semibold">{usageData?.requestCount || 0}</div>
            </div>
            <div className="bg-carbon-50 dark:bg-carbon-800 p-3 rounded-md">
              <div className="text-xs text-carbon-500 dark:text-carbon-400">Last Used</div>
              <div className="text-sm font-semibold">
                {usageData?.lastUsed !== 'Never' ? 
                  new Date(usageData?.lastUsed || '').toLocaleDateString() : 
                  'Never'}
              </div>
            </div>
          </div>
          
          {/* Warning for high usage */}
          {getUsagePercentage() > 80 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>High Usage Alert</AlertTitle>
              <AlertDescription>
                You've used {getUsagePercentage().toFixed(0)}% of your monthly quota. 
                Consider upgrading your plan for additional capacity.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GrokUsageDisplay;
