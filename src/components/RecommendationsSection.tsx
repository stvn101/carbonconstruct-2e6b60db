
import React, { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalculationInput, CalculationResult } from "@/lib/carbonExports";
import { CarbonReduction } from "./recommendations/CarbonReduction";
import { AreasOfConcern } from "./recommendations/AreasOfConcern";
import { useSustainabilitySuggestions } from "@/hooks/useSustainabilitySuggestions";
import SuggestionsSection from "./results/SuggestionsSection";
import { Loader, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SustainabilityAnalysisOptions } from "@/hooks/sustainability/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SustainabilityAnalyzer from "./sustainability/SustainabilityAnalyzer";

interface RecommendationsSectionProps {
  calculationInput: CalculationInput;
  calculationResult: CalculationResult | null;
  suggestions?: string[];
}

// Memoize the component to prevent unnecessary re-renders
const RecommendationsSection: React.FC<RecommendationsSectionProps> = memo(({
  calculationInput,
  calculationResult,
  suggestions: initialSuggestions = []
}) => {
  const { 
    suggestions,
    prioritySuggestions, 
    metadata,
    report,
    isLoading, 
    error,
    getSuggestions
  } = useSustainabilitySuggestions();
  
  const [fetchTriggered, setFetchTriggered] = useState(false);
  const [activeView, setActiveView] = useState<"basic" | "advanced">("basic");

  useEffect(() => {
    const fetchSustainabilitySuggestions = async () => {
      if (calculationResult && !fetchTriggered) {
        setFetchTriggered(true);
        try {
          const options: SustainabilityAnalysisOptions = {
            format: 'detailed',
            includeLifecycleAnalysis: true
          };
          
          await getSuggestions(
            calculationInput.materials, 
            calculationInput.transport, 
            calculationInput.energy,
            options
          );
        } catch (err) {
          console.error("Failed to fetch sustainability suggestions:", err);
          // Error is handled inside the hook
        }
      }
    };

    fetchSustainabilitySuggestions();
  }, [calculationResult, calculationInput, getSuggestions, fetchTriggered]);

  if (!calculationResult) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      className="space-y-6 dark:bg-gray-800 dark:bg-opacity-40 dark:border dark:border-gray-700 dark:rounded-lg dark:p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Sustainability Analysis</h2>
        <div className="flex gap-2">
          <Button 
            variant={activeView === "basic" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveView("basic")}
            className={activeView === "basic" ? "bg-carbon-600 hover:bg-carbon-700 text-white" : ""}
          >
            Basic
          </Button>
          <Button 
            variant={activeView === "advanced" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveView("advanced")}
            className={activeView === "advanced" ? "bg-carbon-600 hover:bg-carbon-700 text-white" : ""}
          >
            Advanced
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin mb-4 text-carbon-600" />
          <h3 className="text-lg font-medium">Generating Sustainability Analysis</h3>
          <p className="text-muted-foreground mt-2">
            Analyzing your project data to provide personalized sustainability insights...
          </p>
        </motion.div>
      ) : error ? (
        <motion.div variants={itemVariants}>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to generate sustainability analysis: {error}
              <br />
              <span className="text-sm">Showing limited recommendations based on your calculation data.</span>
            </AlertDescription>
          </Alert>
          
          <motion.div variants={itemVariants} className="dark:text-carbon-200">
            <CarbonReduction
              calculationInput={calculationInput}
              calculationResult={calculationResult}
              suggestions={initialSuggestions}
            />
          </motion.div>
        </motion.div>
      ) : activeView === "basic" ? (
        <>
          <motion.div variants={itemVariants} className="dark:text-carbon-200">
            <CarbonReduction
              calculationInput={calculationInput}
              calculationResult={calculationResult}
              suggestions={suggestions.length > 0 ? suggestions : initialSuggestions}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="dark:text-carbon-200">
            <SuggestionsSection 
              suggestions={suggestions.length > 0 ? suggestions : initialSuggestions}
              prioritySuggestions={prioritySuggestions}
              metadata={metadata}
              onRecalculate={() => setFetchTriggered(false)}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="dark:text-carbon-200">
            <AreasOfConcern calculationResult={calculationResult} />
          </motion.div>
        </>
      ) : (
        <motion.div variants={itemVariants} className="dark:text-carbon-200">
          <SustainabilityAnalyzer 
            calculationInput={calculationInput}
            calculationResult={calculationResult}
          />
        </motion.div>
      )}
    </motion.div>
  );
});

// Add display name for better debugging
RecommendationsSection.displayName = 'RecommendationsSection';

export default RecommendationsSection;
