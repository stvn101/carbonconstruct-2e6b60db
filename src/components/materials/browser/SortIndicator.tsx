
import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface SortIndicatorProps {
  active: boolean;
  direction: "asc" | "desc";
}

const SortIndicator: React.FC<SortIndicatorProps> = ({ active, direction }) => {
  if (!active) {
    return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />;
  }
  
  return direction === "asc" 
    ? <ArrowUp className="ml-1 h-4 w-4 text-carbon-600 dark:text-carbon-400 animate-pulse" />
    : <ArrowDown className="ml-1 h-4 w-4 text-carbon-600 dark:text-carbon-400 animate-pulse" />;
};

export default SortIndicator;
