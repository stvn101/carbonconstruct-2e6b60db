
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Progress value={45} className="mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          
          {/* Tabs skeleton */}
          <div className="flex gap-2 border-b pb-1">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>
          
          {/* Content skeleton */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="p-3 border rounded-md">
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
              
              <div className="p-3 border rounded-md">
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-2 w-2 rounded-full" />
                    ))}
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            
            <Skeleton className="h-24 w-full rounded-md" />
            
            <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-3">
              <Skeleton className="h-9 w-full sm:w-40" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
