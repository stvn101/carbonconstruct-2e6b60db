
import { 
  SustainabilityReport, 
  SustainabilityMetrics,
  Suggestion,
  ImpactLevel,
  Timeframe,
  ComplexityLevel,
  ComplianceStatus,
  SuggestionCategory,
  ReportRequestOptions,
  ReportFormat,
  CircularEconomyRecommendation,
  LifecycleCostAnalysis
} from './Report.ts';

import { Material } from './Material.ts';
import { TransportItem } from './Transport.ts';
import { EnergyItem } from './Energy.ts';

import { 
  calculateSustainableMaterialPercentage,
  identifyHighImpactMaterials,
  generateMaterialAlternatives 
} from './material-helpers.ts';

import {
  calculateTotalDistance,
  calculateAverageEmissionsFactor,
  calculateSustainableTransportPercentage,
  identifyHighEmissionRoutes,
  calculateRouteOptimizationPotential
} from './transport-helpers.ts';

import {
  calculateTotalEnergyConsumption,
  calculateRenewablePercentage,
  calculatePeakDemandReductionPotential,
  identifyEnergyEfficiencyOpportunities
} from './energy-helpers.ts';

/**
 * Generate a basic sustainability report with key metrics and suggestions
 */
export function generateBasicSustainabilityReport(
  materials: Material[],
  transportItems: TransportItem[],
  energyItems: EnergyItem[]
): SustainabilityReport {
  // Calculate basic metrics
  const materialPercentage = calculateSustainableMaterialPercentage(materials);
  const transportPercentage = calculateSustainableTransportPercentage(transportItems);
  const renewablePercentage = calculateRenewablePercentage(energyItems);
  
  // Calculate overall sustainability score (weighted average)
  const sustainabilityScore = (
    materialPercentage * 0.5 +
    transportPercentage * 0.3 +
    renewablePercentage * 0.2
  );
  
  // Calculate total emissions
  const materialEmissions = materials.reduce((total, m) => 
    total + (m.carbonFootprint * (m.quantity || 1)), 0);
  
  const transportEmissions = transportItems.reduce((total, t) => 
    total + (t.emissionsFactor * t.distance * t.weight), 0);
  
  const energyEmissions = energyItems.reduce((total, e) => 
    total + (e.emissionsFactor * e.quantity), 0);
  
  const totalEmissions = materialEmissions + transportEmissions + energyEmissions;
  
  // Generate metrics
  const metrics: SustainabilityMetrics = {
    totalEmissions,
    emissionsBreakdown: {
      materials: materialEmissions,
      transport: transportEmissions,
      energy: energyEmissions
    },
    sustainabilityScore,
    complianceStatus: {
      ncc: sustainabilityScore >= 70 ? ComplianceStatus.COMPLIANT : ComplianceStatus.PARTIAL,
      nabers: sustainabilityScore >= 80 ? ComplianceStatus.COMPLIANT : ComplianceStatus.PARTIAL
    }
  };
  
  // Generate suggestions
  const suggestions: Suggestion[] = [];
  
  // Add material suggestions
  const highImpactMaterials = identifyHighImpactMaterials(materials);
  highImpactMaterials.forEach((material, index) => {
    const alternatives = generateMaterialAlternatives(material);
    
    if (alternatives.length > 0) {
      const alt = alternatives[0]; // Take first alternative
      
      suggestions.push({
        id: `suggestion-material-${index}`,
        category: SuggestionCategory.MATERIAL,
        title: `Replace ${material.name} with ${alt.name}`,
        description: `Substituting ${material.name} with ${alt.name} can reduce carbon footprint by approximately ${alt.carbonReduction}%.`,
        impactLevel: alt.carbonReduction > 30 ? ImpactLevel.HIGH : ImpactLevel.MEDIUM,
        carbonReduction: alt.carbonReduction || 0,
        costImplication: alt.costDifference || 0,
        timeframe: Timeframe.SHORT_TERM,
        complexity: ComplexityLevel.MODERATE,
        nccCompliant: true,
        nabersCompliant: true
      });
    }
  });
  
  // Add transport suggestions
  const optimization = calculateRouteOptimizationPotential(transportItems);
  if (optimization.optimizedRoutes.length > 0) {
    suggestions.push({
      id: 'suggestion-transport-1',
      category: SuggestionCategory.TRANSPORT,
      title: 'Optimize transport routes and methods',
      description: `Optimizing transport can reduce related emissions by approximately ${Math.round(optimization.potentialReduction)}%.`,
      impactLevel: optimization.potentialReduction > 20 ? ImpactLevel.HIGH : ImpactLevel.MEDIUM,
      carbonReduction: optimization.potentialReduction,
      costImplication: -5, // Assume 5% cost saving
      timeframe: Timeframe.IMMEDIATE,
      complexity: ComplexityLevel.SIMPLE,
      nccCompliant: true,
      nabersCompliant: true
    });
  }
  
  // Add energy suggestions
  const energyOpportunities = identifyEnergyEfficiencyOpportunities(energyItems);
  if (energyOpportunities.length > 0) {
    suggestions.push({
      id: 'suggestion-energy-1',
      category: SuggestionCategory.ENERGY,
      title: 'Implement renewable energy sources',
      description: 'Incorporating solar power and battery storage can significantly reduce emissions from energy consumption.',
      impactLevel: ImpactLevel.HIGH,
      carbonReduction: 70, // Approximate percentage
      costImplication: 15, // Higher upfront cost
      timeframe: Timeframe.MEDIUM_TERM,
      complexity: ComplexityLevel.MODERATE,
      nccCompliant: true,
      nabersCompliant: true
    });
    
    const peakReduction = calculatePeakDemandReductionPotential(energyItems);
    if (peakReduction > 10) {
      suggestions.push({
        id: 'suggestion-energy-2',
        category: SuggestionCategory.ENERGY,
        title: 'Implement peak demand management',
        description: `Battery storage and smart energy management can reduce peak demand by approximately ${Math.round(peakReduction)}%.`,
        impactLevel: peakReduction > 20 ? ImpactLevel.HIGH : ImpactLevel.MEDIUM,
        carbonReduction: peakReduction / 2, // Approximate carbon reduction
        costImplication: -10, // Cost savings
        timeframe: Timeframe.SHORT_TERM,
        complexity: ComplexityLevel.MODERATE,
        nccCompliant: true,
        nabersCompliant: true
      });
    }
  }
  
  // Add general design suggestion
  suggestions.push({
    id: 'suggestion-design-1',
    category: SuggestionCategory.DESIGN,
    title: 'Optimize building orientation and envelope',
    description: 'Improving building orientation, insulation, and glazing can reduce operational energy requirements.',
    impactLevel: ImpactLevel.HIGH,
    carbonReduction: 25,
    costImplication: 5,
    timeframe: Timeframe.MEDIUM_TERM,
    complexity: ComplexityLevel.COMPLEX,
    nccCompliant: true,
    nabersCompliant: true
  });
  
  return {
    createdAt: new Date(),
    metrics,
    suggestions
  };
}

/**
 * Generate a detailed sustainability report with additional analysis
 */
export function generateDetailedSustainabilityReport(
  materials: Material[],
  transportItems: TransportItem[],
  energyItems: EnergyItem[],
  options: ReportRequestOptions
): SustainabilityReport {
  // Start with a basic report
  const baseReport = generateBasicSustainabilityReport(
    materials, 
    transportItems, 
    energyItems
  );
  
  // Add circular economy recommendations if requested
  let circularEconomyRecommendations: CircularEconomyRecommendation[] | undefined;
  
  if (options.includeCircularEconomy) {
    circularEconomyRecommendations = [
      {
        title: 'Design for Disassembly',
        description: 'Implement design principles that allow for easy separation of components at end-of-life.',
        potentialBenefits: [
          'Facilitates material recovery and recycling',
          'Reduces waste sent to landfill',
          'Enables component reuse in future projects'
        ],
        implementationSteps: [
          'Use mechanical fasteners instead of adhesives',
          'Document assembly details for future reference',
          'Select materials with recycling pathways'
        ],
        caseStudies: [
          'Olympic Village London 2012',
          'Circle House Denmark'
        ]
      },
      {
        title: 'Material Passport Implementation',
        description: 'Create digital documentation of materials used in the building to track resources.',
        potentialBenefits: [
          'Enables future material recovery',
          'Enhances building value through documented material quality',
          'Supports future circular economy efforts'
        ],
        implementationSteps: [
          'Document all materials with specifications',
          'Implement digital tracking system',
          'Register with materials databases'
        ]
      }
    ];
  }
  
  // Add lifecycle cost analysis if requested
  let lifecycleCostAnalysis: LifecycleCostAnalysis | undefined;
  
  if (options.includeLifecycleAnalysis) {
    // This is a simplified placeholder calculation
    // Real implementation would require more detailed inputs
    const totalInitialCost = 1000000; // Placeholder value
    
    lifecycleCostAnalysis = {
      initialCost: totalInitialCost,
      operationalCost: totalInitialCost * 2.5, // Estimated over 25 years
      maintenanceCost: totalInitialCost * 0.5, // Estimated over 25 years
      endOfLifeCost: totalInitialCost * 0.1,
      totalLifecycleCost: totalInitialCost * 4.1,
      paybackPeriod: 8.5, // years
      roi: 12 // percentage
    };
  }
  
  // Add compliance details if requested
  let complianceDetails = undefined;
  
  if (options.includeComplianceDetails) {
    complianceDetails = {
      ncc: {
        status: baseReport.metrics.complianceStatus.ncc,
        details: baseReport.metrics.complianceStatus.ncc === ComplianceStatus.COMPLIANT 
          ? "The project meets NCC 2025 requirements for energy efficiency and embodied carbon."
          : "Some aspects of the project need improvement to fully comply with NCC 2025 requirements.",
        requiredActions: baseReport.metrics.complianceStatus.ncc === ComplianceStatus.COMPLIANT 
          ? []
          : ["Improve thermal performance of building envelope", 
             "Reduce embodied carbon in structural elements"]
      },
      nabers: {
        status: baseReport.metrics.complianceStatus.nabers,
        rating: baseReport.metrics.sustainabilityScore >= 90 ? 6 :
                baseReport.metrics.sustainabilityScore >= 80 ? 5 :
                baseReport.metrics.sustainabilityScore >= 70 ? 4 :
                baseReport.metrics.sustainabilityScore >= 60 ? 3 : 2,
        details: baseReport.metrics.complianceStatus.nabers === ComplianceStatus.COMPLIANT 
          ? "The project is on track to achieve the target NABERS rating."
          : "Improvements are needed to achieve the desired NABERS rating.",
        requiredActions: baseReport.metrics.complianceStatus.nabers === ComplianceStatus.COMPLIANT 
          ? []
          : ["Increase renewable energy proportion", 
             "Improve HVAC system efficiency"]
      }
    };
  }
  
  // Add implementation roadmap if requested
  let implementationRoadmap = undefined;
  
  if (options.includeImplementationRoadmap) {
    implementationRoadmap = {
      immediate: baseReport.suggestions.filter(s => s.timeframe === Timeframe.IMMEDIATE),
      shortTerm: baseReport.suggestions.filter(s => s.timeframe === Timeframe.SHORT_TERM),
      mediumTerm: baseReport.suggestions.filter(s => s.timeframe === Timeframe.MEDIUM_TERM),
      longTerm: baseReport.suggestions.filter(s => s.timeframe === Timeframe.LONG_TERM)
    };
  }
  
  // Return the enhanced report
  return {
    ...baseReport,
    circularEconomyRecommendations,
    lifecycleCostAnalysis,
    complianceDetails,
    implementationRoadmap
  };
}

/**
 * Calculate data completeness to determine if report can be generated
 */
export function calculateDataCompleteness(
  materials: Material[],
  transportItems: TransportItem[],
  energyItems: EnergyItem[]
): number {
  let score = 0;
  let requiredFields = 0;
  
  // Check if we have at least some materials
  if (materials && materials.length > 0) {
    score += 30;
    
    // Check material data quality
    let materialDataQuality = 0;
    materials.forEach(m => {
      if (m.carbonFootprint) materialDataQuality++;
      if (m.quantity) materialDataQuality++;
      if (m.category) materialDataQuality++;
    });
    
    score += 10 * (materialDataQuality / (materials.length * 3));
  }
  
  // Check if we have transport data
  if (transportItems && transportItems.length > 0) {
    score += 20;
    
    // Check transport data quality
    let transportDataQuality = 0;
    transportItems.forEach(t => {
      if (t.distance) transportDataQuality++;
      if (t.weight) transportDataQuality++;
      if (t.emissionsFactor) transportDataQuality++;
    });
    
    score += 10 * (transportDataQuality / (transportItems.length * 3));
  }
  
  // Check if we have energy data
  if (energyItems && energyItems.length > 0) {
    score += 20;
    
    // Check energy data quality
    let energyDataQuality = 0;
    energyItems.forEach(e => {
      if (e.quantity) energyDataQuality++;
      if (e.emissionsFactor) energyDataQuality++;
      if (e.source) energyDataQuality++;
    });
    
    score += 10 * (energyDataQuality / (energyItems.length * 3));
  }
  
  return Math.min(100, Math.max(0, score));
}
