import { Material, SustainableMaterial, MaterialCategory as _MaterialCategory } from './Material.ts';

/**
 * Interface for detailed material metrics
 */
export interface MaterialMetrics {
  totalMaterials: number;
  sustainableMaterialPercentage: number;
  averageEmbodiedCarbon: number;
  averageRecycledContent: number;
  locallySourcedPercentage: number;
  highImpactMaterials: string[];
  materialsByCategory: Record<string, number>;
  certificationCoverage: number;
  totalWeight?: number;
  carbonIntensity?: number;
  waterIntensity?: number;
  resourceEfficiency?: number;
  circularityPotential?: number;
  reusePotential?: number;
  recyclabilityRate?: number;
  biodegradablePercentage?: number;
  averageLifespan?: number;
}

/**
 * Calculate detailed material metrics
 */
export function calculateDetailedMaterialMetrics(materials: (Material | SustainableMaterial)[]): MaterialMetrics {
  if (!materials || materials.length === 0) {
    return {
      totalMaterials: 0,
      sustainableMaterialPercentage: 0,
      averageEmbodiedCarbon: 0,
      averageRecycledContent: 0,
      locallySourcedPercentage: 0,
      highImpactMaterials: [],
      materialsByCategory: {},
      certificationCoverage: 0,
      resourceEfficiency: 0,
      circularityPotential: 0,
      recyclabilityRate: 0
    };
  }

  // Count total materials
  const totalMaterials = materials.length;

  // Calculate sustainable material percentage
  const sustainableMaterialCount = materials.filter(m => 
    'sustainabilityScore' in m || 
    ('recycledContent' in m && typeof m.recycledContent === 'number' && m.recycledContent > 50) ||
    ('locallySourced' in m && m.locallySourced === true)
  ).length;
  const sustainableMaterialPercentage = (sustainableMaterialCount / totalMaterials) * 100;

  // Calculate average embodied carbon
  const materialsWithEmbodiedCarbon = materials.filter(m => 
    'embodiedCarbon' in m && typeof m.embodiedCarbon === 'number'
  );
  const averageEmbodiedCarbon = materialsWithEmbodiedCarbon.length > 0 
    ? materialsWithEmbodiedCarbon.reduce((sum, m) => sum + (m.embodiedCarbon as number), 0) / materialsWithEmbodiedCarbon.length
    : 0;

  // Calculate average recycled content
  const materialsWithRecycledContent = materials.filter(m => 
    'recycledContent' in m && typeof m.recycledContent === 'number'
  );
  const averageRecycledContent = materialsWithRecycledContent.length > 0
    ? materialsWithRecycledContent.reduce((sum, m) => sum + (m.recycledContent as number), 0) / materialsWithRecycledContent.length
    : 0;

  // Calculate locally sourced percentage
  const locallySourcedCount = materials.filter(m => 
    'locallySourced' in m && m.locallySourced === true
  ).length;
  const locallySourcedPercentage = (locallySourcedCount / totalMaterials) * 100;

  // Identify high impact materials
  const highImpactMaterials = materials
    .filter(m => 'embodiedCarbon' in m && typeof m.embodiedCarbon === 'number' && m.embodiedCarbon > 0.8)
    .map(m => m.name);

  // Count materials by category
  const materialsByCategory: Record<string, number> = {};
  materials.forEach(m => {
    if ('type' in m && typeof m.type === 'string') {
      materialsByCategory[m.type] = (materialsByCategory[m.type] || 0) + 1;
    }
  });

  // Calculate certification coverage
  const materialsWithCertifications = materials.filter(m => 
    'certifications' in m && Array.isArray(m.certifications) && m.certifications.length > 0
  ).length;
  const certificationCoverage = (materialsWithCertifications / totalMaterials) * 100;

  // Calculate total weight if available
  let totalWeight: number | undefined;
  const materialsWithQuantity = materials.filter(m => 
    'quantity' in m && typeof m.quantity === 'number'
  );
  if (materialsWithQuantity.length > 0) {
    totalWeight = materialsWithQuantity.reduce((sum, m) => sum + (m.quantity as number), 0);
  }

  // Calculate carbon intensity if weight is available
  let carbonIntensity: number | undefined;
  if (totalWeight && totalWeight > 0 && materialsWithEmbodiedCarbon.length > 0) {
    const totalEmbodiedCarbon = materialsWithEmbodiedCarbon.reduce((sum, m) => {
      const quantity = 'quantity' in m && typeof m.quantity === 'number' ? m.quantity : 1;
      return sum + ((m.embodiedCarbon as number) * quantity);
    }, 0);
    carbonIntensity = totalEmbodiedCarbon / totalWeight;
  }

  // Calculate water intensity if available
  let waterIntensity: number | undefined;
  const materialsWithWaterFootprint = materials.filter(m => 
    'waterFootprint' in m && typeof m.waterFootprint === 'number'
  );
  if (totalWeight && totalWeight > 0 && materialsWithWaterFootprint.length > 0) {
    const totalWaterFootprint = materialsWithWaterFootprint.reduce((sum, m) => {
      const quantity = 'quantity' in m && typeof m.quantity === 'number' ? m.quantity : 1;
      return sum + ((m.waterFootprint as number) * quantity);
    }, 0);
    waterIntensity = totalWaterFootprint / totalWeight;
  }

  // Calculate resource efficiency
  const resourceEfficiency = (averageRecycledContent / 100) * 0.7 + (locallySourcedPercentage / 100) * 0.3;

  // Calculate circularity potential
  const materialsWithRecyclability = materials.filter(m => 
    'recyclability' in m && typeof m.recyclability === 'number'
  );
  const averageRecyclability = materialsWithRecyclability.length > 0
    ? materialsWithRecyclability.reduce((sum, m) => sum + (m.recyclability as number), 0) / materialsWithRecyclability.length
    : 0;

  const materialsWithRenewableContent = materials.filter(m => 
    'renewableContent' in m && typeof m.renewableContent === 'number'
  );
  const averageRenewableContent = materialsWithRenewableContent.length > 0
    ? materialsWithRenewableContent.reduce((sum, m) => sum + (m.renewableContent as number), 0) / materialsWithRenewableContent.length
    : 0;

  const circularityPotential = (averageRecyclability / 100) * 0.5 + (averageRenewableContent / 100) * 0.3 + (averageRecycledContent / 100) * 0.2;

  // Calculate reuse potential
  const reusePotential = (averageRecyclability / 100) * 0.7 + (1 - (averageEmbodiedCarbon / 2)) * 0.3;

  // Calculate recyclability rate
  const recyclabilityRate = averageRecyclability;

  // Calculate biodegradable percentage
  const biodegradableMaterials = materials.filter(m => 
    'biodegradable' in m && m.biodegradable === true
  ).length;
  const biodegradablePercentage = (biodegradableMaterials / totalMaterials) * 100;

  // Calculate average lifespan
  const materialsWithLifespan = materials.filter(m => 
    'lifespan' in m && typeof m.lifespan === 'number'
  );
  const averageLifespan = materialsWithLifespan.length > 0
    ? materialsWithLifespan.reduce((sum, m) => sum + (m.lifespan as number), 0) / materialsWithLifespan.length
    : undefined;

  return {
    totalMaterials,
    sustainableMaterialPercentage,
    averageEmbodiedCarbon,
    averageRecycledContent,
    locallySourcedPercentage,
    highImpactMaterials,
    materialsByCategory,
    certificationCoverage,
    totalWeight,
    carbonIntensity,
    waterIntensity,
    resourceEfficiency,
    circularityPotential,
    reusePotential,
    recyclabilityRate,
    biodegradablePercentage,
    averageLifespan
  };
}

/**
 * Generate material alternatives with potential savings
 */
export function generateMaterialAlternatives(materials: (Material | SustainableMaterial)[]): {
  material: string;
  alternatives: string[];
  potentialSavings: {
    carbon: number;
    cost?: number;
    water?: number;
  };
}[] {
  if (!materials || materials.length === 0) return [];

  return materials
    .filter(m => 'embodiedCarbon' in m && typeof m.embodiedCarbon === 'number' && m.embodiedCarbon > 0.5)
    .map(m => {
      // Calculate potential savings based on material properties
      const carbonSavings = Math.min(0.8, ('embodiedCarbon' in m && typeof m.embodiedCarbon === 'number') ? m.embodiedCarbon * 0.7 : 0.3);
      
      // Calculate potential cost savings if cost is available
      let costSavings: number | undefined;
      if ('cost' in m && typeof m.cost === 'number') {
        // Assume 10-20% cost savings for sustainable alternatives
        costSavings = m.cost > 100 ? 0.2 : 0.1;
      }
      
      // Calculate potential water savings if water footprint is available
      let waterSavings: number | undefined;
      if ('waterFootprint' in m && typeof m.waterFootprint === 'number') {
        waterSavings = 0.3; // Assume 30% water savings for sustainable alternatives
      }

      return {
        material: m.name,
        alternatives: m.alternatives || [
          `Sustainable ${m.name.toLowerCase()}`,
          `Recycled ${m.name.toLowerCase()}`,
          `Low-carbon ${m.name.toLowerCase()}`
        ],
        potentialSavings: {
          carbon: carbonSavings,
          ...(costSavings !== undefined && { cost: costSavings }),
          ...(waterSavings !== undefined && { water: waterSavings })
        }
      };
    });
}

/**
 * Calculate material circularity index
 * This is a more comprehensive measure of material circularity based on multiple factors
 */
export function calculateMaterialCircularityIndex(materials: (Material | SustainableMaterial)[]): {
  circularityIndex: number;
  inputFactors: {
    recycledContentFactor: number;
    renewableContentFactor: number;
    reuseFactors: number;
  };
  useFactors: {
    lifespanFactor: number;
    intensityFactor: number;
  };
  outputFactors: {
    recyclabilityFactor: number;
    biodegradabilityFactor: number;
    wasteFactors: number;
  };
} {
  if (!materials || materials.length === 0) {
    return {
      circularityIndex: 0,
      inputFactors: {
        recycledContentFactor: 0,
        renewableContentFactor: 0,
        reuseFactors: 0
      },
      useFactors: {
        lifespanFactor: 0,
        intensityFactor: 0
      },
      outputFactors: {
        recyclabilityFactor: 0,
        biodegradabilityFactor: 0,
        wasteFactors: 0
      }
    };
  }

  // Calculate input factors
  const recycledContentFactor = materials.reduce((sum, m) => 
    sum + (('recycledContent' in m && typeof m.recycledContent === 'number') ? m.recycledContent / 100 : 0), 
    0) / materials.length;

  const renewableContentFactor = materials.reduce((sum, m) => 
    sum + (('renewableContent' in m && typeof m.renewableContent === 'number') ? m.renewableContent / 100 : 0), 
    0) / materials.length;

  // Assume reuse factors based on material properties
  const reuseFactors = 0.2; // Placeholder value

  // Calculate use factors
  const lifespanFactor = materials.reduce((sum, m) => 
    sum + (('lifespan' in m && typeof m.lifespan === 'number') ? Math.min(1, m.lifespan / 50) : 0.5), 
    0) / materials.length;

  // Assume intensity factor based on material efficiency
  const intensityFactor = 0.6; // Placeholder value

  // Calculate output factors
  const recyclabilityFactor = materials.reduce((sum, m) => 
    sum + (('recyclability' in m && typeof m.recyclability === 'number') ? m.recyclability / 100 : 0), 
    0) / materials.length;

  const biodegradabilityFactor = materials.reduce((sum, m) => 
    sum + (('biodegradable' in m && m.biodegradable === true) ? 1 : 0), 
    0) / materials.length;

  // Assume waste factors based on material properties
  const wasteFactors = 1 - (recyclabilityFactor * 0.7 + biodegradabilityFactor * 0.3);

  // Calculate overall circularity index
  const inputScore = (recycledContentFactor * 0.4 + renewableContentFactor * 0.4 + reuseFactors * 0.2);
  const useScore = (lifespanFactor * 0.6 + intensityFactor * 0.4);
  const outputScore = (recyclabilityFactor * 0.5 + biodegradabilityFactor * 0.3 + (1 - wasteFactors) * 0.2);

  const circularityIndex = (inputScore * 0.3 + useScore * 0.2 + outputScore * 0.5) * 100;

  return {
    circularityIndex,
    inputFactors: {
      recycledContentFactor,
      renewableContentFactor,
      reuseFactors
    },
    useFactors: {
      lifespanFactor,
      intensityFactor
    },
    outputFactors: {
      recyclabilityFactor,
      biodegradabilityFactor,
      wasteFactors
    }
  };
}
