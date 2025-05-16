
import React from "react";
import { Loader2, Database } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const MaterialLoadingState: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-carbon-100 dark:bg-carbon-800/30">
            <Database className="h-6 w-6 text-carbon-700 dark:text-carbon-300" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">
          Australian Material Database
        </h1>
        <Skeleton className="h-6 w-full max-w-md mx-auto mb-4" />
      </div>
      
      <div className="mb-8 border border-dashed p-8 rounded-lg flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-carbon-600 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Loading Material Database</h2>
        <p className="text-muted-foreground text-center max-w-md mb-4">
          We're retrieving sustainable materials data from our database. This should only take a moment.
        </p>
        <div className="w-full max-w-md bg-muted rounded-full h-2.5 mb-1 overflow-hidden">
          <div className="bg-carbon-600 h-2.5 rounded-full animate-pulse"></div>
        </div>
        <p className="text-xs text-muted-foreground">This may take a few seconds on first load</p>
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    </div>
  );
};

export default MaterialLoadingState;
