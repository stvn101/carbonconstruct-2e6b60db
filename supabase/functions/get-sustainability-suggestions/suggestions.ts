import { Material, SustainableMaterial } from 'interfaces/material';
import { TransportItem, SustainableTransport } from 'interfaces/transport';
import { EnergyItem, SustainableEnergy } from 'interfaces/energy';

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

// Generate comprehensive sustainability report
export function generateSustainabilityReport(data: {
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
    
    // Generate all suggestions
    const materialSuggestions = generateMaterialSuggestions({ materials });
    const transportSuggestions = generateTransportSuggestions(transport);
    const energySuggestions = generateEnergySuggestions(energy);
    const generalSuggestions = generateGeneralSuggestions();
    
    // Calculate estimated carbon savings (simplified example)
    let estimatedCarbonSavings = 0;
    let sustainabilityScore = 50; // Default middle score
    
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
        });
    } else {
        improvementAreas.push("Energy data collection");
    }
    
    // Cap the sustainability score at 100
    sustainabilityScore = Math.min(100, Math.max(0, sustainabilityScore));
    
    // Combine all suggestions
    const allSuggestions = [
        ...materialSuggestions,
        ...transportSuggestions,
        ...energySuggestions,
        ...generalSuggestions
    ];
    
    return {
        suggestions: allSuggestions,
        metrics: {
            estimatedCarbonSavings,
            sustainabilityScore,
            improvementAreas
        }
    };
}
