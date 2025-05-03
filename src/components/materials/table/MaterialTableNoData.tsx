
import React from "react";
import { Database } from "lucide-react";

export const MaterialTableNoData: React.FC = () => {
  return (
    <div className="text-center py-6">
      <Database className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
      <p className="text-muted-foreground mt-2">No materials data available.</p>
    </div>
  );
};
