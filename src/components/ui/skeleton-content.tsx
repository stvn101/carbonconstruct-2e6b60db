
import React from "react";
import { Skeleton } from "./skeleton";

interface SkeletonContentProps {
  lines?: number;
  height?: number;
  className?: string;
  withTitle?: boolean;
}

export const SkeletonContent: React.FC<SkeletonContentProps> = ({
  lines = 3,
  height = 20,
  className = "",
  withTitle = false
}) => {
  return (
    <div className={`space-y-2 w-full ${className}`}>
      {withTitle && (
        <Skeleton className="h-7 w-3/4 mb-4" />
      )}
      {Array(lines)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            className={`h-${height} w-${i % 2 === 0 ? "full" : "4/5"}`}
            style={{ height: `${height}px` }}
          />
        ))}
    </div>
  );
};
