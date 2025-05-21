
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const LoadingState: React.FC = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <CardTitle>Checking Compliance</CardTitle>
        <CardDescription>Verifying against NCC 2025 and NABERS standards</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={45} className="mb-4" />
        <p className="text-sm text-muted-foreground">
          Processing project inputs to determine compliance status...
        </p>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
