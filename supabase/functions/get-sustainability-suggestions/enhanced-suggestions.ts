
import { Material, SustainableMaterial } from './Material.ts';
import { TransportItem, SustainableTransport } from './Transport.ts';
import { EnergyItem, SustainableEnergy } from './Energy.ts';
import { 
  Suggestion, 
  SuggestionCategory, 
  ImpactLevel, 
  Timeframe, 
  ComplexityLevel,
  SustainabilityMetrics,
  SustainabilityReport,
  ComplianceStatus} from './Report.ts';

/**
 * Generate material suggestions as simple text
 */
export function generateMaterialSuggestions({ materials }: { materials: (Material | SustainableMaterial)[]; }): string[] {
    if (!materials || materials.length === 0) return [];
    
    const suggestions: string[] = [
        "Consider replacing concrete with engineered wood products for appropriate applications.",
        "Look into low-carbon cement alternatives that can reduce emissions by up to 30%.",
        "Source locally produced materials to reduce transportation carbon footprint."
    ];
    
    // Add specific suggestions based on material properties
    const hasConcrete = materials.some(m => m.name.toLowerCase().includes('concrete'));
    const hasSteel = materials.some(m => m.name.toLowerCase().includes('steel'));
    const hasLowRecycledContent = materials.some(m => 
        'recycledContent' in m && typeof m.recycledContent === 'number' && m.recycledContent < 30
    );
    
    if (hasConcrete) {
        suggestions.push("Consider using geopolymer concrete which can reduce carbon emissions by up to 80% compared to traditional concrete.");
    }
    
    if (hasSteel) {
        suggestions.push("Specify steel with high recycled content to reduce embodied carbon.");
    }
    
    if (hasLowRecycledContent) {
        suggestions.push("Increase the recycled content in your materials to reduce virgin resource consumption.");
    }
    
    return suggestions;
}

/**
 * Generate transport suggestions as simple text
 */
export function generateTransportSuggestions(transport: (TransportItem | SustainableTransport)[]): string[] {
    if (!transport || transport.length === 0) return [];
    
    const suggestions: string[] = [
        "Optimize delivery routes to minimize fuel consumption.",
        "Consider using electric vehicles for short-distance material transport.",
        "Implement a just-in-time delivery system to reduce unnecessary trips."
    ];
    
    // Add specific suggestions based on transport properties
    const hasDieselVehicles = transport.some(t => 
        'fuel' in t && typeof t.fuel === 'string' && t.fuel.toLowerCase().includes('diesel')
    );
    const hasLongDistanceTransport = transport.some(t => 
        'distance' in t && typeof t.distance === 'number' && t.distance > 200
    );
    const hasLowEfficiency = transport.some(t => 
        'efficiency' in t && typeof t.efficiency === 'number' && t.efficiency < 0.7
    );
    
    if (hasDieselVehicles) {
        suggestions.push("Consider transitioning to biodiesel or renewable diesel to reduce emissions from your diesel fleet.");
    }
    
    if (hasLongDistanceTransport) {
        suggestions.push("For long-distance transport, consider rail or water transport which have lower emissions per ton-mile than trucks.");
    }
    
    if (hasLowEfficiency) {
        suggestions.push("Implement a vehicle maintenance program to improve fuel efficiency and reduce emissions.");
    }
    
    return suggestions;
}

/**
 * Generate energy suggestions as simple text
 */
export function generateEnergySuggestions(energy: (EnergyItem | SustainableEnergy)[]): string[] {
    if (!energy || energy.length === 0) return [];
    
    const suggestions: string[] = [
        "Install solar panels or wind turbines on-site to generate clean energy during construction.",
        "Use energy-efficient machinery and equipment during construction.",
        "Implement an energy management system to monitor and optimize energy usage."
    ];
    
    // Add specific suggestions based on energy properties
    const hasGridEnergy = energy.some(e => 
        'source' in e && typeof e.source === 'string' && e.source.toLowerCase().includes('grid')
    );
    const hasDieselGenerator = energy.some(e => 
        'source' in e && typeof e.source === 'string' && e.source.toLowerCase().includes('diesel')
    );
    const hasHighConsumption = energy.some(e => 
        'consumption' in e && typeof e.consumption === 'number' && e.consumption > 3000
    );
    
    if (hasGridEnergy) {
        suggestions.push("Switch to a green energy provider or purchase renewable energy certificates to offset grid electricity usage.");
    }
    
    if (hasDieselGenerator) {
        suggestions.push("Replace diesel generators with battery storage systems charged by renewable energy where feasible.");
    }
    
    if (hasHighConsumption) {
        suggestions.push("Conduct an energy audit to identify high consumption areas and implement targeted efficiency measures.");
    }
    
    return suggestions;
}

/**
 * Generate general suggestions as simple text
 */
export function generateGeneralSuggestions(): string[] {
    return [
        "Conduct a detailed life cycle assessment to identify further carbon reduction opportunities.",
        "Establish a carbon monitoring system for ongoing tracking and reporting.",
        "Train your workforce on sustainable construction practices to improve overall efficiency.",
        "Implement a waste management plan to minimize landfill waste and maximize recycling.",
        "Consider circular economy principles in your design and procurement processes.",
        "Set science-based targets for emissions reduction aligned with global climate goals.",
        "Engage with suppliers to reduce upstream emissions in your supply chain."
    ];
}

/**
 * Generate structured material suggestions with impact assessment and implementation details
 */
export function generateStructuredMaterialSuggestions({ materials }: { materials: (Material | SustainableMaterial)[]; }): Suggestion[] {
    if (!materials || materials.length === 0) return [];
    
    const suggestions: Suggestion[] = [
        {
            category: SuggestionCategory.MATERIAL,
            text: "Consider replacing concrete with engineered wood products for appropriate applications.",
            impact: ImpactLevel.HIGH,
            estimatedSavings: {
                carbon: 0.35,
                cost: 0.05
            },
            implementationTimeframe: Timeframe.MEDIUM_TERM,
            implementationComplexity: ComplexityLevel.MODERATE,
            tags: ["concrete", "wood", "embodied carbon"]
        },
        {
            category: SuggestionCategory.MATERIAL,
            text: "Look into low-carbon cement alternatives that can reduce emissions by up to 30%.",
            impact: ImpactLevel.MEDIUM,
            estimatedSavings: {
                carbon: 0.3
            },
            implementationTimeframe: Timeframe.SHORT_TERM,
            implementationComplexity: ComplexityLevel.SIMPLE,
            tags: ["cement", "low-carbon", "alternatives"]
        },
        {
            category: SuggestionCategory.MATERIAL,
            text: "Source locally produced materials to reduce transportation carbon footprint.",
            impact: ImpactLevel.MEDIUM,
            estimatedSavings: {
                carbon: 0.15,
                cost: 0.1
            },
            implementationTimeframe: Timeframe.IMMEDIATE,
            implementationComplexity: ComplexityLevel.SIMPLE,
            tags: ["local", "transportation", "supply chain"]
        }
    ];
    
    // Add specific suggestions based on material properties
    const hasConcrete = materials.some(m => m.name.toLowerCase().includes('concrete'));
    const hasSteel = materials.some(m => m.name.toLowerCase().includes('steel'));
    const hasLowRecycledContent = materials.some(m => 
        'recycledContent' in m && typeof m.recycledContent === 'number' && m.recycledContent < 30
    );
    
    if (hasConcrete) {
        suggestions.push({
            category: SuggestionCategory.MATERIAL,
            text: "Consider using geopolymer concrete which can reduce carbon emissions by up to 80% compared to traditional concrete.",
            impact: ImpactLevel.HIGH,
            estimatedSavings: {
                carbon: 0.8
            },
            implementationTimeframe: Timeframe.MEDIUM_TERM,
            implementationComplexity: ComplexityLevel.MODERATE,
            references: ["https://doi.org/10.1016/j.jclepro.2018.10.084"],
            tags: ["concrete", "geopolymer", "innovative materials"]
        });
    }
    
    if (hasSteel) {
        suggestions.push({
            category: SuggestionCategory.MATERIAL,
            text: "Specify steel with high recycled content to reduce embodied carbon.",
            impact: ImpactLevel.MEDIUM,
            estimatedSavings: {
                carbon: 0.25
            },
            implementationTimeframe: Timeframe.SHORT_TERM,
            implementationComplexity: ComplexityLevel.SIMPLE,
            tags: ["steel", "recycled content", "embodied carbon"]
        });
    }
    
    if (hasLowRecycledContent) {
        suggestions.push({
            category: SuggestionCategory.MATERIAL,
            text: "Increase the recycled content in your materials to reduce virgin resource consumption.",
            impact: ImpactLevel.MEDIUM,
            estimatedSavings: {
                carbon: 0.2,
                waste: 0.3
            },
            implementationTimeframe: Timeframe.SHORT_TERM,
            implementationComplexity: ComplexityLevel.SIMPLE,
            tags: ["recycled content", "circular economy", "resource efficiency"]
        });
    }
    
    return suggestions;
}

/**
 * Generate structured transport suggestions with impact assessment and implementation details
 */
export function generateStructuredTransportSuggestions(transport: (TransportItem | SustainableTransport)[]): Suggestion[] {
    if (!transport || transport.length === 0) return [];
    
    const suggestions: Suggestion[] = [
        {
            category: SuggestionCategory.TRANSPORT,
            text: "Optimize delivery routes to minimize fuel consumption.",
            impact: ImpactLevel.MEDIUM,
            estimatedSavings: {
                carbon: 0.15,
                cost: 0.2
            },
            implementationTimeframe: Timeframe.SHORT_TERM,
            implementationComplexity: ComplexityLevel.MODERATE,
            tags: ["route optimization", "fuel efficiency", "logistics"]
        },
        {
            category: SuggestionCategory.TRANSPORT,
            text: "Consider using electric vehicles for short-distance material transport.",
            impact: ImpactLevel.HIGH,
            estimatedSavings: {
                carbon: 0.4,
                cost: -0.1 // Initial cost increase
            },
            implementationTimeframe: Timeframe.MEDIUM_TERM,
            implementationComplexity: ComplexityLevel.MODERATE,
            tags: ["electric vehicles", "zero emissions", "air quality"]
        },
        {
            category: SuggestionCategory.TRANSPORT,
            text: "Implement a just-in-time delivery system to reduce unnecessary trips.",
            impact: ImpactLevel.MEDIUM,
            estimatedSavings: {
                carbon: 0.2,
                cost: 0.15
            },
            implementationTimeframe: Timeframe.MEDIUM_TERM,
            implementationComplexity: ComplexityLevel.MODERATE,
            tags: ["just-in-time", "logistics", "efficiency"]
        }
    ];
    
    // Add specific suggestions based on transport properties
    const hasDieselVehicles = transport.some(t => 
        'fuel' in t && typeof t.fuel === 'string' && t.fuel.toLowerCase().includes('diesel')
    );
    const hasLongDistanceTransport = transport.some(t => 
        'distance' in t && typeof t.distance === 'number' && t.distance > 200
    );
    const hasLowEfficiency = transport.some(t => 
        'efficiency' in t && typeof t.efficiency === 'number' && t.efficiency < 0.7
    );
    
    if (hasDieselVehicles) {
        suggestions.push({
            category: SuggestionCategory.TRANSPORT,
            text: "Consider transitioning to biodiesel or renewable diesel to reduce emissions from your diesel fleet.",
            impact: ImpactLevel.MEDIUM,
            estimatedSavings: {
                carbon: 0.3
            },
            implementationTimeframe: Timeframe.SHORT_TERM,
            implementationComplexity: ComplexityLevel.SIMPLE,
            tags: ["biodiesel", "renewable fuels", "diesel alternatives"]
        });
    }
    
    if (hasLongDistanceTransport) {
        suggestions.push({
            category: SuggestionCategory.TRANSPORT,
            text: "For long-distance transport, consider rail or water transport which have lower emissions per ton-mile than trucks.",
            impact: ImpactLevel.HIGH,
            estimatedSavings: {
                carbon: 0.6,
                cost: 0.1
            },
            implementationTimeframe: Timeframe.LONG_TERM,
            implementationComplexity: ComplexityLevel.COMPLEX,
            tags: ["modal shift", "rail transport", "water transport", "long distance"]
        });
    }
    
    if (hasLowEfficiency) {
        suggestions.push({
            category: SuggestionCategory.TRANSPORT,
            text: "Implement a vehicle maintenance program to improve fuel efficiency and reduce emissions.",
            impact: ImpactLevel.MEDIUM,
            estimatedSavings: {
                carbon: 0.15,
                cost: 0.25
            },
            implementationTimeframe: Timeframe.IMMEDIATE,
            implementationComplexity: ComplexityLevel.SIMPLE,
            tags: ["maintenance", "fuel efficiency", "vehicle performance"]
        });
    }
    
    return suggestions;
}

/**
 * Generate structured energy suggestions with impact assessment and implementation details
 */
export function generateStructuredEnergySuggestions(energy: (EnergyItem | SustainableEnergy)[]): Suggestion[] {
    if (!energy || energy.length === 0) return [];
    
    const suggestions: Suggestion[] = [
        {
            category: SuggestionCategory.ENERGY,
            text: "Install solar panels or wind turbines on-site to generate clean energy during construction.",
            impact: ImpactLevel.HIGH,
            estimatedSavings: {
                carbon: 0.5,
                cost: 0.2
            },
            implementationTimeframe: Timeframe.MEDIUM_TERM,
            implementationComplexity: ComplexityLevel.MODERATE,
            tags: ["renewable energy", "solar", "wind", "on-site generation"]
        },
        {
            category: SuggestionCategory.ENERGY,
            text: "Use energy-efficient machinery and equipment during construction.",
            impact: ImpactLevel.MEDIUM,
            estimatedSavings: {
                carbon: 0.25,
                cost: 0.15,
                energy: 0.3
            },
            implementationTimeframe: Timeframe.SHORT_TERM,
            implementationComplexity: ComplexityLevel.SIMPLE,
            tags: ["energy efficiency", "equipment", "machinery"]
        },
        {
            category: SuggestionCategory.ENERGY,
            text: "Implement an energy management system to monitor and optimize energy usage.",
            impact: ImpactLevel.MEDIUM,
            estimatedSavings: {
                carbon: 0.2,
                cost: 0.25,
                energy: 0.3
            },
            implementationTimeframe: Timeframe.SHORT_TERM,
            implementationComplexity: ComplexityLevel.MODERATE,
            tags: ["energy management", "monitoring", "optimization"]
        }
    ];
    
    // Add specific suggestions based on energy properties
    const hasGridEnergy = energy.some(e => 
        'source' in e && typeof e.source === 'string' && e.source.toLowerCase().includes('grid')
    );
    const hasDieselGenerator = energy.some(e => 
        'source' in e && typeof e.source === 'string' && e.source.toLowerCase().includes('diesel')
    );
    const hasHighConsumption = energy.some(e => 
        'consumption' in e && typeof e.consumption === 'number' && e.consumption > 3000
    );
    
    if (hasGridEnergy) {
        suggestions.push({
            category: SuggestionCategory.ENERGY,
            text: "Switch to a green energy provider or purchase renewable energy certificates to offset grid electricity usage.",
            impact: ImpactLevel.HIGH,
            estimatedSavings: {
                carbon: 0.8
            },
            implementationTimeframe: Timeframe.IMMEDIATE,
            implementationComplexity: ComplexityLevel.SIMPLE,
            tags: ["green energy", "renewable energy certificates", "grid electricity"]
        });
    }
    
    if (hasDieselGenerator) {
        suggestions.push({
            category: SuggestionCategory.ENERGY,
            text: "Replace diesel generators with battery storage systems charged by renewable energy where feasible.",
            impact: ImpactLevel.HIGH,
            estimatedSavings: {
                carbon: 0.7,
                cost: -0.1 // Initial cost increase
            },
            implementationTimeframe: Timeframe.MEDIUM_TERM,
            implementationComplexity: ComplexityLevel.COMPLEX,
            tags: ["battery storage", "diesel generators", "renewable energy"]
        });
    }
    
    if (hasHighConsumption) {
        suggestions.push({
            category: SuggestionCategory.ENERGY,
            text: "Conduct an energy audit to identify high consumption areas and implement targeted efficiency measures.",
            impact: ImpactLevel.MEDIUM,
            estimatedSavings: {
                carbon: 0.3,
                cost: 0.35,
                energy: 0.4
            },
            implementationTimeframe: Timeframe.SHORT_TERM,
            implementationComplexity: ComplexityLevel.MODERATE,
            tags: ["energy audit", "efficiency measures", "high consumption"]
        });
    }
    
    return suggestions;
}

/**
 * Generate structured general suggestions with impact assessment and implementation details
 */
export function generateStructuredGeneralSuggestions(): Suggestion[] {
    return [
        {
            category: SuggestionCategory.GENERAL,
            text: "Conduct a detailed life cycle assessment to identify further carbon reduction opportunities.",
            impact: ImpactLevel.HIGH,
            implementationTimeframe: Timeframe.MEDIUM_TERM,
            implementationComplexity: ComplexityLevel.COMPLEX,
            tags: ["life cycle assessment", "carbon reduction", "analysis"]
        },
        {
            category: SuggestionCategory.GENERAL,
            text: "Establish a carbon monitoring system for ongoing tracking and reporting.",
            impact: ImpactLevel.MEDIUM,
            implementationTimeframe: Timeframe.SHORT_TERM,
            implementationComplexity: ComplexityLevel.MODERATE,
            tags: ["carbon monitoring", "reporting", "tracking"]
        },
        {
            category: SuggestionCategory.GENERAL,
            text: "Train your workforce on sustainable construction practices to improve overall efficiency.",
            impact: ImpactLevel.MEDIUM,
            estimatedSavings: {
                carbon: 0.15,
                waste: 0.2,
                energy: 0.15
            },
            implementationTimeframe: Timeframe.SHORT_TERM,
            implementationComplexity: ComplexityLevel.SIMPLE,
            tags: ["training", "workforce", "sustainable practices"]
        },
        {
            category: SuggestionCategory.WASTE,
            text: "Implement a waste management plan to minimize landfill waste and maximize recycling.",
            impact: ImpactLevel.MEDIUM,
            estimatedSavings: {
                waste: 0.6
            },
            implementationTimeframe: Timeframe.SHORT_TERM,
            implementationComplexity: ComplexityLevel.MODERATE,
            tags: ["waste management", "recycling", "landfill diversion"]
        },
        {
            category: SuggestionCategory.GENERAL,
            text: "Consider circular economy principles in your design and procurement processes.",
            impact: ImpactLevel.HIGH,
            implementationTimeframe: Timeframe.LONG_TERM,
            implementationComplexity: ComplexityLevel.COMPLEX,
            tags: ["circular economy", "design", "procurement"]
        },
        {
            category: SuggestionCategory.GENERAL,
            text: "Set science-based targets for emissions reduction aligned with global climate goals.",
            impact: ImpactLevel.HIGH,
            implementationTimeframe: Timeframe.MEDIUM_TERM,
            implementationComplexity: ComplexityLevel.MODERATE,
            tags: ["science-based targets", "emissions reduction", "climate goals"]
        },
        {
            category: SuggestionCategory.GENERAL,
            text: "Engage with suppliers to reduce upstream emissions in your supply chain.",
            impact: ImpactLevel.MEDIUM,
            implementationTimeframe: Timeframe.MEDIUM_TERM,
            implementationComplexity: ComplexityLevel.MODERATE,
            tags: ["supply chain", "upstream emissions", "supplier engagement"]
        }
    ];
}

/**
 * Convert structured suggestions to simple text suggestions
 */
export function convertToTextSuggestions(suggestions: Suggestion[]): string[] {
    return suggestions.map(suggestion => suggestion.text);
}

/**
 * Calculate detailed sustainability metrics
 */
export function calculateSustainabilityMetrics(data: {
    materials?: (Material | SustainableMaterial)[];
    transport?: (TransportItem | SustainableTransport)[];
    energy?: (EnergyItem | SustainableEnergy)[];
}): SustainabilityMetrics {
    const { materials = [], transport = [], energy = [] } = data;
    
    // Initialize metrics
    let estimatedCarbonSavings = 0;
    let estimatedCostSavings = 0;
    let estimatedWaterSavings = 0;
    let estimatedEnergyReduction = 0;
    let estimatedWasteReduction = 0;
    
    let sustainabilityScore = 50; // Default middle score
    let materialScore = 50;
    let transportScore = 50;
    let energyScore = 50;
    
    // Improvement areas based on data analysis
    const improvementAreas: string[] = [];
    
    // Analyze materials
    if (materials.length > 0) {
        // Check for sustainable materials
        const sustainableMaterialCount = materials.filter(m => 
            'sustainabilityScore' in m || 
            ('recycledContent' in m && typeof m.recycledContent === 'number' && m.recycledContent > 50) ||
            ('locallySourced' in m && m.locallySourced === true)
        ).length;
        
        const sustainableMaterialRatio = sustainableMaterialCount / materials.length;
        materialScore = 50 + sustainableMaterialRatio * 50;
        sustainabilityScore += sustainableMaterialRatio * 10;
        
        if (sustainableMaterialRatio < 0.3) {
            improvementAreas.push("Material selection");
        }
        
        // Estimate carbon savings from sustainable materials
        materials.forEach(m => {
            if ('embodiedCarbon' in m && typeof m.embodiedCarbon === 'number') {
                // Assume industry average is 1.0
                const savings = Math.max(0, 1.0 - m.embodiedCarbon);
                estimatedCarbonSavings += savings;
            }
            
            // Estimate water savings
            if ('waterFootprint' in m && typeof m.waterFootprint === 'number') {
                // Assume industry average is 100
                const savings = Math.max(0, 100 - m.waterFootprint) / 100;
                estimatedWaterSavings += savings;
            }
            
            // Estimate waste reduction
            if ('recyclability' in m && typeof m.recyclability === 'number') {
                estimatedWasteReduction += m.recyclability / 100;
            }
        });
    } else {
        improvementAreas.push("Material data collection");
    }
    
    // Analyze transport
    if (transport.length > 0) {
        // Check for sustainable transport
        const sustainableTransportCount = transport.filter(t => 
            'carbonFootprint' in t || 
            ('isElectric' in t && t.isElectric === true) ||
            ('routeOptimization' in t && t.routeOptimization === true)
        ).length;
        
        const sustainableTransportRatio = sustainableTransportCount / transport.length;
        transportScore = 50 + sustainableTransportRatio * 50;
        sustainabilityScore += sustainableTransportRatio * 10;
        
        if (sustainableTransportRatio < 0.3) {
            improvementAreas.push("Transport efficiency");
        }
        
        // Estimate carbon savings from efficient transport
        transport.forEach(t => {
            if ('emissionsFactor' in t && typeof t.emissionsFactor === 'number') {
                // Assume industry average is 1.0
                const savings = Math.max(0, 1.0 - t.emissionsFactor);
                estimatedCarbonSavings += savings;
            }
            
            // Estimate cost savings from efficient transport
            if ('efficiency' in t && typeof t.efficiency === 'number') {
                // Assume industry average is 0.7
                const savings = Math.max(0, t.efficiency - 0.7) / 0.3;
                estimatedCostSavings += savings * 0.1;
            }
        });
    } else {
        improvementAreas.push("Transport data collection");
    }
    
    // Analyze energy
    if (energy.length > 0) {
        // Check for renewable energy
        const renewableEnergyCount = energy.filter(e => 
            ('renewable' in e && e.renewable === true) ||
            ('source' in e && typeof e.source === 'string' && 
             ['solar', 'wind', 'geothermal', 'biomass'].some(r => e.source.toLowerCase().includes(r)))
        ).length;
        
        const renewableEnergyRatio = renewableEnergyCount / energy.length;
        energyScore = 50 + renewableEnergyRatio * 50;
        sustainabilityScore += renewableEnergyRatio * 15;
        
        if (renewableEnergyRatio < 0.3) {
            improvementAreas.push("Renewable energy adoption");
        }
        
        // Estimate carbon savings from renewable energy
        energy.forEach(e => {
            if ('carbonIntensity' in e && typeof e.carbonIntensity === 'number') {
                // Assume grid average is 0.5
                const savings = Math.max(0, 0.5 - e.carbonIntensity);
                estimatedCarbonSavings += savings;
            }
            
            // Estimate energy reduction
            if ('efficiency' in e && typeof e.efficiency === 'number') {
                // Assume industry average is 0.8
                const reduction = Math.max(0, e.efficiency - 0.8) / 0.2;
                estimatedEnergyReduction += reduction;
            }
            
            // Estimate cost savings from efficient energy
            if ('costPerUnit' in e && typeof e.costPerUnit === 'number' && 
                'consumption' in e && typeof e.consumption === 'number') {
                // Assume industry average cost is 0.15 per unit
                const savings = Math.max(0, 0.15 - e.costPerUnit) / 0.15;
                estimatedCostSavings += savings * 0.2;
            }
        });
    } else {
        improvementAreas.push("Energy data collection");
    }
    
    // Cap the scores at 100
    sustainabilityScore = Math.min(100, Math.max(0, sustainabilityScore));
    materialScore = Math.min(100, Math.max(0, materialScore));
    transportScore = Math.min(100, Math.max(0, transportScore));
    energyScore = Math.min(100, Math.max(0, energyScore));
    
    // Ensure savings are between 0 and 1 for consistency
    estimatedCarbonSavings = Math.min(1, Math.max(0, estimatedCarbonSavings));
    estimatedCostSavings = Math.min(1, Math.max(0, estimatedCostSavings));
    estimatedWaterSavings = Math.min(1, Math.max(0, estimatedWaterSavings));
    estimatedEnergyReduction = Math.min(1, Math.max(0, estimatedEnergyReduction));
    estimatedWasteReduction = Math.min(1, Math.max(0, estimatedWasteReduction));
    
    return {
        sustainabilityScore,
        estimatedCarbonSavings,
        estimatedCostSavings,
        estimatedWaterSavings,
        estimatedEnergyReduction,
        estimatedWasteReduction,
        materialScore,
        transportScore,
        energyScore,
        improvementAreas,
        industryAverage: 60, // Example value
        bestInClass: 85, // Example value
        percentileRanking: sustainabilityScore > 60 ? (sustainabilityScore - 60) / 25 * 100 : 0,
        regulatoryCompliance: {
            status: ComplianceStatus.PARTIALLY_COMPLIANT,
            standards: ["ISO 14001", "GHG Protocol"],
            gaps: improvementAreas.length > 0 ? improvementAreas : undefined
        }
    };
}

/**
 * Generate basic sustainability report with simple suggestions
 */
export function generateBasicSustainabilityReport(data: {
    materials?: (Material | SustainableMaterial)[];
    transport?: (TransportItem | SustainableTransport)[];
    energy?: (EnergyItem | SustainableEnergy)[];
}): {
    suggestions: string[];
    metrics: {
        estimatedCarbonSavings: number;
        sustainabilityScore: number;
        improvementAreas: string[];
    };
} {
    const { materials = [], transport = [], energy = [] } = data;
    
    // Generate all structured suggestions
    const materialSuggestions = generateStructuredMaterialSuggestions({ materials });
    const transportSuggestions = generateStructuredTransportSuggestions(transport);
    const energySuggestions = generateStructuredEnergySuggestions(energy);
    const generalSuggestions = generateStructuredGeneralSuggestions();
    
    // Calculate metrics
    const metrics = calculateSustainabilityMetrics(data);
    
    // Convert structured suggestions to text suggestions
    const allSuggestions = [
        ...convertToTextSuggestions(materialSuggestions),
        ...convertToTextSuggestions(transportSuggestions),
        ...convertToTextSuggestions(energySuggestions),
        ...convertToTextSuggestions(generalSuggestions)
    ];
    
    return {
        suggestions: allSuggestions,
        metrics: {
            estimatedCarbonSavings: metrics.estimatedCarbonSavings,
            sustainabilityScore: metrics.sustainabilityScore,
            improvementAreas: metrics.improvementAreas
        }
    };
}

/**
 * Generate detailed sustainability report with structured suggestions and comprehensive metrics
 */
export function generateDetailedSustainabilityReport(data: {
    materials?: (Material | SustainableMaterial)[];
    transport?: (TransportItem | SustainableTransport)[];
    energy?: (EnergyItem | SustainableEnergy)[];
}): SustainabilityReport {
    const { materials = [], transport = [], energy = [] } = data;
    
    // Generate all structured suggestions
    const materialSuggestions = generateStructuredMaterialSuggestions({ materials });
    const transportSuggestions = generateStructuredTransportSuggestions(transport);
    const energySuggestions = generateStructuredEnergySuggestions(energy);
    const generalSuggestions = generateStructuredGeneralSuggestions();
    
    // Calculate metrics
    const metrics = calculateSustainabilityMetrics(data);
    
    // Combine all suggestions
    const allSuggestions = [
        ...materialSuggestions,
        ...transportSuggestions,
        ...energySuggestions,
        ...generalSuggestions
    ];
    
    // Generate a summary based on the metrics and suggestions
    const summary = `Sustainability Report: Overall score ${metrics.sustainabilityScore.toFixed(1)}/100. 
        Identified ${allSuggestions.length} improvement opportunities across materials, 
        transport, energy, and general practices. Estimated carbon savings potential: 
        ${(metrics.estimatedCarbonSavings * 100).toFixed(1)}%.`;
    
    // Create and return the detailed report
    return {
        suggestions: allSuggestions,
        metrics: metrics,
        summary: summary,
        timestamp: new Date().toISOString(),
        reportId: `SR-${Date.now()}`
    };
}
