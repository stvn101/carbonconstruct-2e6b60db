
import React, { lazy, Suspense, useState, useEffect, useCallback } from "react";
import SkeletonHero from "./hero/SkeletonHero";
import { LazyMotion, domAnimation } from "framer-motion";
import ErrorBoundary from "./ErrorBoundary";

// Lazily load non-critical components
const HeroContent = lazy(() => 
  import("./hero/HeroContent").catch(() => {
    console.error("Failed to load HeroContent");
    return { 
      default: () => <div className="md:w-1/2 p-6 bg-white dark:bg-gray-900">
        <h1 className="text-3xl font-bold">Build Greener, Measure Smarter</h1>
        <p className="mt-4">Track, manage, and reduce your construction project's carbon footprint.</p>
      </div> 
    };
  })
);

const DashboardPreview = lazy(() => 
  import("./hero/DashboardPreview").catch(() => {
    console.error("Failed to load DashboardPreview");
    return { 
      default: (props: any) => {
        if (props.onLoad) {
          // Make sure to call onLoad to prevent loading indicator from showing indefinitely
          setTimeout(props.onLoad, 0);
        }
        return <div className="md:w-1/2 bg-secondary/20 rounded-lg p-6">Dashboard preview unavailable</div>;
      }
    };
  })
);

const HeroSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [resourcesLoaded, setResourcesLoaded] = useState(0);
  const totalResources = 1;
  const [loadAttempts, setLoadAttempts] = useState(0);

  const handleResourceLoad = useCallback(() => {
    setResourcesLoaded(prev => {
      const newCount = prev + 1;
      if (newCount >= totalResources) {
        setIsLoading(false);
      }
      return newCount;
    });
  }, []);

  useEffect(() => {
    // Fallback timeout in case load events don't fire
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLoadAttempts(prevAttempts => prevAttempts + 1);
    }, 2000);
    
    // For repeated failures, force content to show
    if (loadAttempts > 1) {
      setIsLoading(false);
    }
    
    return () => clearTimeout(timer);
  }, [loadAttempts]);
  
  // Backup timer to force content to show after 5 seconds regardless of loading state
  useEffect(() => {
    const backupTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); 
    
    return () => clearTimeout(backupTimer);
  }, []);

  // Component to render as a fallback if lazy loading fails
  const FallbackHero = () => (
    <div className="flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 p-6 bg-white dark:bg-gray-900">
        <h1 className="text-3xl font-bold">Build Greener, Measure Smarter</h1>
        <p className="mt-4">Track, manage, and reduce your construction project's carbon footprint.</p>
        <div className="mt-6">
          <a href="/calculator" className="bg-carbon-600 hover:bg-carbon-700 text-white px-6 py-3 rounded-md">
            Try Our Calculator
          </a>
        </div>
      </div>
      <div className="md:w-1/2 flex justify-center p-6">
        <div className="rounded-lg bg-carbon-100 dark:bg-carbon-800 p-6 w-full max-w-md">
          <div className="h-48 bg-carbon-200 dark:bg-carbon-700 rounded mb-4"></div>
          <div className="h-6 w-3/4 bg-carbon-200 dark:bg-carbon-700 rounded mb-3"></div>
          <div className="h-4 bg-carbon-200 dark:bg-carbon-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-carbon-200 dark:bg-carbon-700 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {isLoading ? (
          <SkeletonHero />
        ) : (
          <ErrorBoundary feature="Hero Section" fallbackComponent={FallbackHero}>
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
          </ErrorBoundary>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
