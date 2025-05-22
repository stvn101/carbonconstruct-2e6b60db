
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database } from "lucide-react";

interface DatabaseHeaderProps {
  itemCount: number | null;
  loading: boolean;
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
}

const DatabaseHeader: React.FC<DatabaseHeaderProps> = ({
  itemCount,
  loading,
  isRefreshing,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          <Database className="h-6 w-6 mr-2 text-carbon-600" />
          Materials Database
        </h1>
        <p className="text-muted-foreground mt-1">
          Explore our database of sustainable construction materials
        </p>
      </div>

      <div className="mt-4 md:mt-0 flex items-center">
        <Badge variant="outline" className="mr-4">
          {itemCount || 0} materials
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading || isRefreshing}
          className="flex items-center"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
          {loading || isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
    </div>
  );
};

export default DatabaseHeader;
