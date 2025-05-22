
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';

interface UsageData {
  totalTokens: number;
  usageByFeature: Record<string, number>;
  requestCount: number;
  lastUsed: string;
  monthlyQuota: number;
}

export function useGrokUsage() {
  const { user } = useAuth();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load usage data from localStorage
  useEffect(() => {
    const loadUsageData = () => {
      setIsLoading(true);
      try {
        // Get stored usage data
        const storedData = localStorage.getItem('grok_usage');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUsageData(parsedData);
        } else {
          // Initialize with default values
          setUsageData({
            totalTokens: 0,
            usageByFeature: {},
            requestCount: 0,
            lastUsed: 'Never',
            monthlyQuota: 100000 // Default quota
          });
        }
      } catch (error) {
        console.error('Error loading usage data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      loadUsageData();
    } else {
      setUsageData(null);
      setIsLoading(false);
    }
  }, [user]);
  
  // Function to record new usage
  const recordUsage = (feature: string, tokensUsed: number) => {
    if (!user) return;
    
    setUsageData(prev => {
      if (!prev) {
        const newData: UsageData = {
          totalTokens: tokensUsed,
          usageByFeature: { [feature]: tokensUsed },
          requestCount: 1,
          lastUsed: new Date().toISOString(),
          monthlyQuota: 100000 // Default quota
        };
        
        // Save to localStorage
        localStorage.setItem('grok_usage', JSON.stringify(newData));
        return newData;
      }
      
      // Update existing data
      const updatedUsageByFeature = { ...prev.usageByFeature };
      updatedUsageByFeature[feature] = (updatedUsageByFeature[feature] || 0) + tokensUsed;
      
      const updatedData: UsageData = {
        totalTokens: prev.totalTokens + tokensUsed,
        usageByFeature: updatedUsageByFeature,
        requestCount: prev.requestCount + 1,
        lastUsed: new Date().toISOString(),
        monthlyQuota: prev.monthlyQuota
      };
      
      // Save to localStorage
      localStorage.setItem('grok_usage', JSON.stringify(updatedData));
      return updatedData;
    });
  };
  
  // Function to reset usage data
  const resetUsage = () => {
    if (!user) return;
    
    const emptyData: UsageData = {
      totalTokens: 0,
      usageByFeature: {},
      requestCount: 0,
      lastUsed: 'Never',
      monthlyQuota: 100000 // Default quota
    };
    
    setUsageData(emptyData);
    localStorage.setItem('grok_usage', JSON.stringify(emptyData));
  };
  
  return {
    usageData,
    isLoading,
    recordUsage,
    resetUsage
  };
}
