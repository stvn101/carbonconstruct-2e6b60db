
import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface SortIndicatorProps {
  active: boolean;
  direction: "asc" | "desc";
}

const SortIndicator: React.FC<SortIndicatorProps> = ({ active, direction }) => {
  if (!active) {
    return <ArrowUpDown className="ml-1 h-4 w-4" />;
  }
  
  return direction === "asc" 
    ? <ArrowUp className="ml-1 h-4 w-4" />
    : <ArrowDown className="ml-1 h-4 w-4" />;
};

export default SortIndicator;
