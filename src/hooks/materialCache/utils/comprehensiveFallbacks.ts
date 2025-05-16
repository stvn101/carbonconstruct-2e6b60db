
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { createBasicFallbackMaterials } from './basicFallbacks';

// More comprehensive fallbacks with alternatives for each material type
export const createComprehensiveFallbackMaterials = (): ExtendedMaterialData[] => {
  // Start with basic fallbacks
  const basicFallbacks = createBasicFallbackMaterials();
  
  // Add alternatives for each major category
  const alternatives: ExtendedMaterialData[] = [
    // Concrete alternatives
    {
      id: 'concrete-low-carbon',
      name: 'Low Carbon Concrete',
      factor: 0.07,
      carbon_footprint_kgco2e_kg: 0.07,
      carbon_footprint_kgco2e_tonne: 70,
      category: 'Concrete',
      region: 'Australia',
      tags: ['structural', 'sustainable', 'low-carbon'],
      sustainabilityScore: 75,
      recyclability: 'Medium',
      unit: 'kg',
      alternativeTo: 'Standard Concrete'
    },
    {
      id: 'concrete-geopolymer',
      name: 'Geopolymer Concrete',
      factor: 0.05,
      carbon_footprint_kgco2e_kg: 0.05,
      carbon_footprint_kgco2e_tonne: 50,
      category: 'Concrete',
      region: 'Australia',
      tags: ['structural', 'sustainable', 'innovative'],
      sustainabilityScore: 85,
      recyclability: 'High',
      unit: 'kg',
      alternativeTo: 'Standard Concrete'
    },
    
    // Steel alternatives
    {
      id: 'steel-recycled',
      name: 'Recycled Steel',
      factor: 0.73,
      carbon_footprint_kgco2e_kg: 0.73,
      carbon_footprint_kgco2e_tonne: 730,
      category: 'Steel',
      region: 'Australia',
      tags: ['structural', 'recycled'],
      sustainabilityScore: 65,
      recyclability: 'High',
      unit: 'kg',
      alternativeTo: 'Standard Steel'
    },
    {
      id: 'steel-high-tensile',
      name: 'High Tensile Steel',
      factor: 1.2,
      carbon_footprint_kgco2e_kg: 1.2,
      carbon_footprint_kgco2e_tonne: 1200,
      category: 'Steel',
      region: 'Australia',
      tags: ['structural', 'high-strength'],
      sustainabilityScore: 45,
      recyclability: 'High',
      unit: 'kg',
      alternativeTo: 'Standard Steel'
    },
    
    // Timber alternatives
    {
      id: 'timber-bamboo',
      name: 'Bamboo',
      factor: 0.25,
      carbon_footprint_kgco2e_kg: 0.25,
      carbon_footprint_kgco2e_tonne: 250,
      category: 'Timber',
      region: 'Australia',
      tags: ['structural', 'natural', 'sustainable'],
      sustainabilityScore: 90,
      recyclability: 'High',
      unit: 'kg',
      alternativeTo: 'Timber (Pine)'
    },
    {
      id: 'timber-clt',
      name: 'Cross Laminated Timber',
      factor: 0.42,
      carbon_footprint_kgco2e_kg: 0.42,
      carbon_footprint_kgco2e_tonne: 420,
      category: 'Timber',
      region: 'Australia',
      tags: ['structural', 'engineered', 'innovative'],
      sustainabilityScore: 80,
      recyclability: 'Medium',
      unit: 'kg',
      alternativeTo: 'Timber (Pine)'
    },
    
    // Glass alternatives
    {
      id: 'glass-low-e',
      name: 'Low-E Glass',
      factor: 0.95,
      carbon_footprint_kgco2e_kg: 0.95,
      carbon_footprint_kgco2e_tonne: 950,
      category: 'Glass',
      region: 'Australia',
      tags: ['finishing', 'energy-efficient'],
      sustainabilityScore: 60,
      recyclability: 'Medium',
      unit: 'kg',
      alternativeTo: 'Standard Glass'
    },
    
    // Masonry alternatives
    {
      id: 'brick-recycled',
      name: 'Recycled Brick',
      factor: 0.12,
      carbon_footprint_kgco2e_kg: 0.12,
      carbon_footprint_kgco2e_tonne: 120,
      category: 'Masonry',
      region: 'Australia',
      tags: ['structural', 'recycled'],
      sustainabilityScore: 75,
      recyclability: 'High',
      unit: 'kg',
      alternativeTo: 'Clay Brick'
    },
    {
      id: 'hempcrete',
      name: 'Hempcrete',
      factor: 0.08,
      carbon_footprint_kgco2e_kg: 0.08,
      carbon_footprint_kgco2e_tonne: 80,
      category: 'Masonry',
      region: 'Australia',
      tags: ['structural', 'natural', 'innovative', 'sustainable'],
      sustainabilityScore: 95,
      recyclability: 'High',
      unit: 'kg',
      alternativeTo: 'Clay Brick'
    },
    
    // Insulation options
    {
      id: 'insulation-fiberglass',
      name: 'Fiberglass Insulation',
      factor: 1.35,
      carbon_footprint_kgco2e_kg: 1.35,
      carbon_footprint_kgco2e_tonne: 1350,
      category: 'Insulation',
      region: 'Australia',
      tags: ['energy-efficient', 'common'],
      sustainabilityScore: 40,
      recyclability: 'Low',
      unit: 'kg'
    },
    {
      id: 'insulation-cellulose',
      name: 'Cellulose Insulation',
      factor: 0.15,
      carbon_footprint_kgco2e_kg: 0.15,
      carbon_footprint_kgco2e_tonne: 150,
      category: 'Insulation',
      region: 'Australia',
      tags: ['energy-efficient', 'recycled', 'sustainable'],
      sustainabilityScore: 85,
      recyclability: 'High',
      unit: 'kg',
      alternativeTo: 'Fiberglass Insulation'
    }
  ];
  
  // Combine basic fallbacks with alternatives
  return [...basicFallbacks, ...alternatives];
};
