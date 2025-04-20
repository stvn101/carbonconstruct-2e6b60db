
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface SkeletonContentProps {
  className?: string;
  lines?: number;
}

export function SkeletonContent({ className, lines = 3 }: SkeletonContentProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <Skeleton className="h-4 w-full" />
        </motion.div>
      ))}
    </div>
  );
}

