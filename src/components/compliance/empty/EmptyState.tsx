
import React from "react";
import { Shield } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onRunCheck: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRunCheck }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Shield className="h-5 w-5 text-carbon-600" />
          Compliance Check
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Verify if your project meets NCC 2025 and NABERS requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center py-4 sm:py-6">
          <Button onClick={onRunCheck} className="w-full sm:w-auto">
            Run Compliance Check
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
