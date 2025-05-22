
import React from "react";
import { formatDate } from "@/lib/formatters";

interface DatabaseStatsProps {
  displayedCount: number;
  totalCount: number;
  lastUpdated: Date | null;
}

const DatabaseStats: React.FC<DatabaseStatsProps> = ({
  displayedCount,
  totalCount,
  lastUpdated,
}) => {
  return (
    <p className="mb-4 text-sm text-muted-foreground">
      Showing {displayedCount} of {totalCount || 0} materials.
      {lastUpdated && (
        <span> Last updated: {formatDate(lastUpdated)}</span>
      )}
    </p>
  );
};

export default DatabaseStats;
