
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface ImprovementBadgeProps {
  isImproving: boolean;
  value: number;
}

export const ImprovementBadge: React.FC<ImprovementBadgeProps> = ({
  isImproving,
  value
}) => {
  return (
    <Badge 
      variant={isImproving ? "default" : "destructive"}
      className="flex items-center gap-1"
    >
      {isImproving ? 
        <ArrowDownIcon className="h-3 w-3" /> : 
        <ArrowUpIcon className="h-3 w-3" />
      }
      {value.toFixed(1)}% {isImproving ? "Reduction" : "Increase"}
    </Badge>
  );
};
