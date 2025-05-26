import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/carbonFactors';
import { guessCategoryFromName, generateDescriptionFromName } from './materialUtils';

const DEMO_DELAY = 800;

/**
 * Creates a fallback material with default values
 */
export function createFallbackMaterial(id: string): ExtendedMaterialData {
  return {
    id,
    name: 'Unknown Material',
    factor: 1,
    unit: 'kg',
    region: 'Australia',
    tags: ['construction'],
    sustainabilityScore: 50,
    recyclability: 'Medium',
    category: 'Other',
    description: 'A construction material with unknown properties.',
    notes: '',
    carbon_footprint_kgco2e_kg: 1,
    carbon_footprint_kgco2e_tonne: 1000
  };
}

/**
 * Generates fallback materials when the database is unavailable
 */
export function generateFallbackMaterials(): Promise<ExtendedMaterialData[]> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const materials: ExtendedMaterialData[] = [];
      
      // Convert MATERIAL_FACTORS to ExtendedMaterialData format
      Object.entries(MATERIAL_FACTORS).forEach(([key, value]) => {
        materials.push({
          id: key,
          name: value.name || key,
          factor: value.factor,
          carbon_footprint_kgco2e_kg: value.factor,
          unit: value.unit || 'kg',
          region: 'Australia',
          tags: ['construction'],
          sustainabilityScore: Math.floor(Math.random() * 40) + 60,
          recyclability: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as 'High' | 'Medium' | 'Low',
          category: guessCategoryFromName(value.name || key),
          description: generateDescriptionFromName(value.name || key),
          notes: ''
        });
      });
      
      // Add alternative materials
      materials.push(
        {
          id: 'alt-concrete-1',
          name: 'Low-Carbon Concrete',
          factor: 0.13,
          carbon_footprint_kgco2e_kg: 0.13,
          unit: 'kg',
          region: 'Australia',
          tags: ['construction', 'sustainable', 'alternative'],
          sustainabilityScore: 85,
          recyclability: 'Medium',
          alternativeTo: 'concrete',
          category: 'Structural',
          description: 'A sustainable alternative to traditional concrete that reduces carbon emissions by using alternative cementitious materials.',
          notes: ''
        },
        {
          id: 'alt-steel-1',
          name: 'Recycled Steel',
          factor: 0.7,
          carbon_footprint_kgco2e_kg: 0.7,
          unit: 'kg',
          region: 'Australia',
          tags: ['construction', 'recycled', 'alternative'],
          sustainabilityScore: 90,
          recyclability: 'High',
          alternativeTo: 'steel',
          category: 'Structural',
          description: '100% recycled steel with significantly lower embodied carbon compared to virgin steel production.',
          notes: ''
        },
        {
          id: 'alt-insulation-1',
          name: 'Sheep\'s Wool Insulation',
          factor: 0.8,
          carbon_footprint_kgco2e_kg: 0.8,
          unit: 'kg',
          region: 'Australia',
          tags: ['construction', 'natural', 'alternative'],
          sustainabilityScore: 95,
          recyclability: 'High',
          alternativeTo: 'insulation',
          category: 'Insulation',
          description: 'Natural insulation material made from sheep\'s wool with excellent thermal and acoustic properties.',
          notes: ''
        },
        {
          id: 'alt-timber-1',
          name: 'Cross-Laminated Timber (CLT)',
          factor: 0.42,
          carbon_footprint_kgco2e_kg: 0.42,
          unit: 'kg',
          region: 'Australia',
          tags: ['construction', 'sustainable', 'alternative'],
          sustainabilityScore: 88,
          recyclability: 'High',
          alternativeTo: 'timber',
          category: 'Timber',
          description: 'Engineered wood product with high strength-to-weight ratio and carbon sequestration benefits.',
          notes: ''
        },
        {
          id: 'alt-brick-1',
          name: 'Hempcrete Blocks',
          factor: 0.38,
          carbon_footprint_kgco2e_kg: 0.38,
          unit: 'kg',
          region: 'Australia',
          tags: ['construction', 'sustainable', 'alternative'],
          sustainabilityScore: 92,
          recyclability: 'High',
          alternativeTo: 'brick',
          category: 'Masonry',
          description: 'Made from hemp fibers and lime binder, offering excellent insulation and negative carbon footprint.',
          notes: ''
        },
        {
          id: 'alt-glass-1',
          name: 'Triple-Glazed Low-E Glass',
          factor: 0.95,
          carbon_footprint_kgco2e_kg: 0.95,
          unit: 'kg',
          region: 'Australia',
          tags: ['construction', 'energy-efficient', 'alternative'],
          sustainabilityScore: 78,
          recyclability: 'Medium',
          alternativeTo: 'glass',
          category: 'Glass',
          description: 'Advanced glazing with low emissivity coating for superior thermal performance.',
          notes: ''
        },
        {
          id: 'alt-aluminum-1',
          name: 'Recycled Aluminum',
          factor: 0.55,
          carbon_footprint_kgco2e_kg: 0.55,
          unit: 'kg',
          region: 'Australia',
          tags: ['construction', 'recycled', 'alternative'],
          sustainabilityScore: 87,
          recyclability: 'High',
          alternativeTo: 'aluminum',
          category: 'Aluminum',
          description: 'Aluminum produced from recycled material requiring significantly less energy than virgin production.',
          notes: ''
        },
        {
          id: 'alt-insulation-2',
          name: 'Cellulose Insulation',
          factor: 0.26,
          carbon_footprint_kgco2e_kg: 0.26,
          unit: 'kg',
          region: 'Australia',
          tags: ['construction', 'recycled', 'alternative'],
          sustainabilityScore: 91,
          recyclability: 'High',
          alternativeTo: 'insulation',
          category: 'Insulation',
          description: 'Made from recycled paper products, treated for fire and pest resistance.',
          notes: ''
        },
        {
          id: 'alt-concrete-2',
          name: 'Geopolymer Concrete',
          factor: 0.18,
          carbon_footprint_kgco2e_kg: 0.18,
          unit: 'kg',
          region: 'Australia',
          tags: ['construction', 'innovative', 'alternative'],
          sustainabilityScore: 89,
          recyclability: 'Medium',
          alternativeTo: 'concrete',
          category: 'Structural',
          description: 'Made from industrial waste materials like fly ash, offering superior durability and lower carbon footprint.',
          notes: ''
        }
      );
      
      resolve(materials);
    }, DEMO_DELAY);
  });
} 