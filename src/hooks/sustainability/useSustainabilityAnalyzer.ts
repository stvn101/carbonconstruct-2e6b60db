
import React, { useState, useEffect } from "react";
import { SustainabilityAnalyzerProps } from "@/components/sustainability/types";
import { MaterialAnalysisResult } from "@/types/materialAnalysis";
import { useSustainabilitySuggestions } from "@/hooks/useSustainabilitySuggestions";
import { useMaterialAnalysis } from "@/hooks/sustainability/useMaterialAnalysis";
import { useComplianceChecks } from "@/hooks/sustainability/useComplianceChecks";
import { MaterialInput } from "@/lib/carbonExports";

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
      const defaultMaterial: MaterialInput = {
        type: calculationInput.materials[0]?.type || 'unknown',
        quantity: calculationInput.materials[0]?.quantity || 0,
        unit: calculationInput.materials[0]?.unit || 'kg',
        name: calculationInput.materials[0]?.name || 'Unknown Material',
        carbonFootprint: calculationInput.materials[0]?.carbonFootprint || 0
      };
      
      const defaultAnalysis: MaterialAnalysisResult = {
        material: defaultMaterial,
        sustainabilityScore: 0,
        alternatives: {},
        recommendations: []
      };
      
      setMaterialAnalysis({
        ...defaultAnalysis,
        ...report.materialAnalysis
      });
    }
  }, [report, setMaterialAnalysis, calculationInput.materials]);
  
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
  const completeAnalysis: MaterialAnalysisResult = materialAnalysis || {
    material: {
      type: calculationInput.materials[0]?.type || 'unknown',
      quantity: calculationInput.materials[0]?.quantity || 0,
      unit: calculationInput.materials[0]?.unit || 'kg',
      name: calculationInput.materials[0]?.name || 'Unknown Material',
      carbonFootprint: calculationInput.materials[0]?.carbonFootprint || 0
    },
    sustainabilityScore: 0,
    alternatives: {},
    recommendations: [],
    materialScores: {},
    impactSummary: '',
    highImpactMaterials: [],
    sustainabilityPercentage: 0,
    sustainabilityIssues: [],
    categories: {},
    materialCount: 0,
    sustainabilityStrengths: [],
    averageCarbonFootprint: 0,
    materialWithHighestFootprint: null
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
