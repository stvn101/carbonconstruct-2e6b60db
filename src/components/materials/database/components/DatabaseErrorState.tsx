
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface DatabaseErrorStateProps {
  error: Error;
  onRefresh: () => void;
}

const DatabaseErrorState: React.FC<DatabaseErrorStateProps> = ({ error, onRefresh }) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center text-red-500 mb-2">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <h3 className="text-lg font-medium">Error loading materials</h3>
        </div>
        <p className="text-muted-foreground">{error.message}</p>
        <p className="text-sm text-muted-foreground mt-2">
          This might be due to database access restrictions or connectivity issues.
        </p>
        <Button variant="outline" className="mt-4" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

export default DatabaseErrorState;
