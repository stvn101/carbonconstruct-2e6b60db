
import React, { lazy, Suspense, useState, useEffect } from "react";
import SkeletonHero from "./hero/SkeletonHero";
import { LazyMotion, domAnimation } from "framer-motion";

// Use React.lazy for code splitting at the component level
const HeroContent = lazy(() => import("./hero/HeroContent"));
const DashboardPreview = lazy(() => 
  import("./hero/DashboardPreview")
    .catch(err => {
      console.error("Failed to load DashboardPreview:", err);
      // Return a minimal component to prevent the entire app from crashing
      return { 
        default: () => <div className="md:w-1/2 bg-secondary/20 rounded-lg p-6">Dashboard preview unavailable</div> 
      };
    })
);

const HeroSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [resourcesLoaded, setResourcesLoaded] = useState(0);
  const totalResources = 1; // Increase this number if loading more assets

  // Function to track when resources are loaded
  const handleResourceLoad = useCallback(() => {
    setResourcesLoaded(prev => {
      const newCount = prev + 1;
      if (newCount >= totalResources) {
        setIsLoading(false);
      }
      return newCount;
    });
  }, []);

  // Only run the timer effect once on mount
  useEffect(() => {
    // Fallback to ensure we don't show the skeleton forever
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Max loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {isLoading ? (
          <SkeletonHero />
        ) : (
          <LazyMotion features={domAnimation}>
            <div className="flex flex-col md:flex-row items-center">
              <Suspense fallback={<div className="md:w-1/2 animate-pulse h-64 bg-secondary/20 rounded-lg" />}>
                <HeroContent />
              </Suspense>
              <Suspense fallback={<div className="md:w-1/2 animate-pulse h-64 bg-secondary/20 rounded-lg" />}>
                <DashboardPreview onLoad={handleResourceLoad} />
              </Suspense>
            </div>
          </LazyMotion>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
