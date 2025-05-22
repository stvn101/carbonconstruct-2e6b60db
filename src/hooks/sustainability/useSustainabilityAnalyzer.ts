
import React, { useState, useEffect } from "react";
import { SustainabilityAnalyzerProps, MaterialAnalysisResult } from "@/components/sustainability/types";
import { useSustainabilitySuggestions } from "@/hooks/useSustainabilitySuggestions";
import { useMaterialAnalysis } from "@/hooks/sustainability/useMaterialAnalysis";
import { useComplianceChecks } from "@/hooks/sustainability/useComplianceChecks";

export function useSustainabilityAnalyzer({
  calculationInput,
  calculationResult
}: SustainabilityAnalyzerProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const { 
    suggestions,
    prioritySuggestions, 
    report,
    isLoading,
    error
  } = useSustainabilitySuggestions();
  
  // Use extracted hooks
  const { 
    materialAnalysis,
    setMaterialAnalysis
  } = useMaterialAnalysis(
    calculationInput.materials, 
    calculationResult.breakdownByMaterial
  );
  
  const {
    nccCompliance,
    nabersCompliance,
    isLoadingCompliance,
    runComplianceChecks
  } = useComplianceChecks();

  // Convert suggestion objects to strings when needed
  const convertSuggestionsToStrings = (suggestions: any[] | undefined): string[] => {
    if (!suggestions || suggestions.length === 0) return [];
    return suggestions.map(s => typeof s === 'string' ? s : (s.description || s.title || ''));
  };

  // Use material analysis data from report if available
  useEffect(() => {
    if (report?.materialAnalysis) {
      const defaultAnalysis: MaterialAnalysisResult = {
        materialScores: {},
        impactSummary: "",
        highImpactMaterials: [],
        sustainabilityScore: 0,
        sustainabilityPercentage: 0,
        recommendations: [],
        alternatives: {},
        sustainabilityIssues: []
      };
      
      setMaterialAnalysis({
        ...defaultAnalysis,
        ...report.materialAnalysis
      });
    }
  }, [report, setMaterialAnalysis]);
  
  // Navigate between tabs with animations
  const navigateTab = (direction: "next" | "prev") => {
    const tabs = ["dashboard", "compliance", "materials", "performance", "report"];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (direction === "next" && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  // Run compliance checks when needed
  const handleRunComplianceChecks = () => {
    runComplianceChecks(calculationInput.materials, calculationInput.energy);
  };

  // Ensure we have complete material analysis data with all required fields
  const completeAnalysis: MaterialAnalysisResult = {
    materialScores: materialAnalysis?.materialScores || {},
    impactSummary: materialAnalysis?.impactSummary || "",
    highImpactMaterials: materialAnalysis?.highImpactMaterials || [],
    sustainabilityScore: materialAnalysis?.sustainabilityScore || 0,
    sustainabilityPercentage: materialAnalysis?.sustainabilityPercentage || 0,
    recommendations: materialAnalysis?.recommendations || [],
    alternatives: materialAnalysis?.alternatives || {},
    sustainabilityIssues: materialAnalysis?.sustainabilityIssues || [],
    categories: materialAnalysis?.categories || {},
    materialCount: materialAnalysis?.materialCount || 0,
    sustainabilityStrengths: materialAnalysis?.sustainabilityStrengths || [],
    averageCarbonFootprint: materialAnalysis?.averageCarbonFootprint || 0,
    materialWithHighestFootprint: materialAnalysis?.materialWithHighestFootprint || null
  };
  
  const suggestionStrings = convertSuggestionsToStrings(suggestions);
  const priorityStrings = convertSuggestionsToStrings(prioritySuggestions);
  
  return {
    activeTab,
    setActiveTab,
    navigateTab,
    completeAnalysis,
    handleRunComplianceChecks,
    isLoadingCompliance,
    nccCompliance,
    nabersCompliance,
    priorityStrings,
    suggestionStrings,
    report,
    calculationInput,
    calculationResult
  };
}
