
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MaterialRecommendation } from "@/services/sustainability/sustainabilityApiService";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle, RefreshCw, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MaterialRecommendationsProps {
  recommendations: MaterialRecommendation[];
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

const MaterialRecommendations: React.FC<MaterialRecommendationsProps> = ({
  recommendations,
  isLoading = false,
  onRefresh,
  className = ""
}) => {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Material Recommendations</CardTitle>
          <CardDescription>Loading sustainable material recommendations...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex flex-col gap-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Material Recommendations</CardTitle>
          <CardDescription>Sustainable alternatives for your materials</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
          <h3 className="text-lg font-medium">No recommendations available</h3>
          <p className="text-sm text-muted-foreground max-w-xs mt-2">
            We couldn't find any recommendations for your current material selection.
          </p>
          {onRefresh && (
            <Button 
              onClick={onRefresh} 
              variant="outline" 
              className="mt-4"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Recommendations
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Helper for cost impact
  const getCostBadge = (costImpact: 'lower' | 'similar' | 'higher') => {
    switch (costImpact) {
      case 'lower':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Lower Cost</Badge>;
      case 'higher':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Higher Cost</Badge>;
      default:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Similar Cost</Badge>;
    }
  };

  // Helper for availability
  const getAvailabilityIndicator = (availability: 'low' | 'medium' | 'high') => {
    switch (availability) {
      case 'low':
        return (
          <div className="flex items-center text-red-600 text-xs">
            <X className="h-3 w-3 mr-1" />
            Low Availability
          </div>
        );
      case 'high':
        return (
          <div className="flex items-center text-green-600 text-xs">
            <Check className="h-3 w-3 mr-1" />
            High Availability
          </div>
        );
      default:
        return (
          <div className="flex items-center text-amber-600 text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Medium Availability
          </div>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Material Recommendations</CardTitle>
          {onRefresh && (
            <Button 
              onClick={onRefresh} 
              variant="ghost" 
              size="sm"
              className="h-8 px-2"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription>
          Sustainable alternatives for your current materials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <div 
            key={index} 
            className="border border-gray-100 dark:border-gray-800 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium flex items-center">
                <Leaf className="h-4 w-4 text-green-500 mr-2" />
                {recommendation.recommendedMaterial}
              </div>
              <Badge className="bg-green-600">
                {recommendation.potentialReduction}% Reduction
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground mb-2">
              Alternative for: <span className="font-medium text-foreground">{recommendation.originalMaterial}</span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {recommendation.details}
            </p>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex gap-2">
                {getCostBadge(recommendation.costImpact)}
              </div>
              {getAvailabilityIndicator(recommendation.availability)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MaterialRecommendations;
