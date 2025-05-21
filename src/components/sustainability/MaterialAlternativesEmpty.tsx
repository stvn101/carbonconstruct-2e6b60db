
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

interface MaterialAlternativesEmptyProps {
  className?: string;
}

const MaterialAlternativesEmpty: React.FC<MaterialAlternativesEmptyProps> = ({ className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Material Alternatives</CardTitle>
        <CardDescription>Explore sustainable alternatives for your materials</CardDescription>
      </CardHeader>
      <CardContent className="h-64 flex items-center justify-center">
        <div className="text-center">
          <Database className="h-10 w-10 mb-3 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">No material alternatives data available</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialAlternativesEmpty;
