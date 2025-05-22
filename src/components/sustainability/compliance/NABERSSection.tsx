
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Check, AlertCircle, Star } from "lucide-react";
import { ComplianceData, NABERSSectionProps } from "./types";

const NABERSSection: React.FC<NABERSSectionProps> = ({ nabersData }) => {
  if (!nabersData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Star className="h-5 w-5 mr-2" />
            NABERS Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No NABERS data available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (nabersData.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Star className="h-5 w-5 mr-2" />
            NABERS Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {nabersData.error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  const getBadgeVariant = (score?: number) => {
    if (typeof score !== 'number') return 'secondary';
    if (score >= 5) return 'success';
    if (score >= 3.5) return 'warning';
    return 'destructive';
  };
  
  const getStarRating = (score?: number) => {
    if (typeof score !== 'number') return 'Not Rated';
    return `${score.toFixed(1)} Star`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-lg">
          <Star className="h-5 w-5 mr-2" />
          NABERS Rating
        </CardTitle>
        <Badge variant={getBadgeVariant(nabersData.score)}>
          {getStarRating(nabersData.score)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Energy Efficiency:</span>
          <span className="font-medium">{nabersData.compliant ? 'Passes Standard' : 'Below Standard'}</span>
        </div>

        {/* Show details if available */}
        {nabersData.details && (
          <div>
            <h4 className="font-medium mb-2">Rating Details</h4>
            <div className="text-sm space-y-2">
              {typeof nabersData.details === 'string' ? (
                <p>{nabersData.details}</p>
              ) : (
                <pre className="p-2 bg-muted rounded-md overflow-x-auto text-xs">
                  {JSON.stringify(nabersData.details, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NABERSSection;
