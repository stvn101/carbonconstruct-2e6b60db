
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonHero = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      {/* Left side - Hero content skeleton */}
      <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8 space-y-4">
        <Skeleton className="h-12 w-3/4 mb-2" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-24 w-full mt-4" />
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-8">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-40" />
        </div>
      </div>
      
      {/* Right side - Dashboard preview skeleton */}
      <div className="md:w-1/2">
        <div className="relative">
          <Skeleton className="h-80 md:h-96 w-full rounded-2xl transform -rotate-1" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonHero;
