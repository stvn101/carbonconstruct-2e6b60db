
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
      unit: 'kg',
      category: 'Concrete',
      region: 'Australia',
      tags: ['structural', 'sustainable', 'low-carbon'],
      sustainabilityScore: 75,
      recyclability: 'Medium',
      alternativeTo: 'Standard Concrete'
    },
    {
      id: 'concrete-geopolymer',
      name: 'Geopolymer Concrete',
      factor: 0.05,
      unit: 'kg',
      category: 'Concrete',
      region: 'Australia',
      tags: ['structural', 'sustainable', 'innovative'],
      sustainabilityScore: 85,
      recyclability: 'High',
      alternativeTo: 'Standard Concrete'
    },
    
    // Steel alternatives
    {
      id: 'steel-recycled',
      name: 'Recycled Steel',
      factor: 0.73,
      unit: 'kg',
      category: 'Steel',
      region: 'Australia',
      tags: ['structural', 'recycled'],
      sustainabilityScore: 65,
      recyclability: 'High',
      alternativeTo: 'Standard Steel'
    },
    {
      id: 'steel-high-tensile',
      name: 'High Tensile Steel',
      factor: 1.2,
      unit: 'kg',
      category: 'Steel',
      region: 'Australia',
      tags: ['structural', 'high-strength'],
      sustainabilityScore: 45,
      recyclability: 'High',
      alternativeTo: 'Standard Steel'
    },
    
    // Timber alternatives
    {
      id: 'timber-bamboo',
      name: 'Bamboo',
      factor: 0.25,
      unit: 'kg',
      category: 'Timber',
      region: 'Australia',
      tags: ['structural', 'natural', 'sustainable'],
      sustainabilityScore: 90,
      recyclability: 'High',
      alternativeTo: 'Timber (Pine)'
    },
    {
      id: 'timber-clt',
      name: 'Cross Laminated Timber',
      factor: 0.42,
      unit: 'kg',
      category: 'Timber',
      region: 'Australia',
      tags: ['structural', 'engineered', 'innovative'],
      sustainabilityScore: 80,
      recyclability: 'Medium',
      alternativeTo: 'Timber (Pine)'
    },
    
    // Glass alternatives
    {
      id: 'glass-low-e',
      name: 'Low-E Glass',
      factor: 0.95,
      unit: 'kg',
      category: 'Glass',
      region: 'Australia',
      tags: ['finishing', 'energy-efficient'],
      sustainabilityScore: 60,
      recyclability: 'Medium',
      alternativeTo: 'Standard Glass'
    },
    
    // Masonry alternatives
    {
      id: 'brick-recycled',
      name: 'Recycled Brick',
      factor: 0.12,
      unit: 'kg',
      category: 'Masonry',
      region: 'Australia',
      tags: ['structural', 'recycled'],
      sustainabilityScore: 75,
      recyclability: 'High',
      alternativeTo: 'Clay Brick'
    },
    {
      id: 'hempcrete',
      name: 'Hempcrete',
      factor: 0.08,
      unit: 'kg',
      category: 'Masonry',
      region: 'Australia',
      tags: ['structural', 'natural', 'innovative', 'sustainable'],
      sustainabilityScore: 95,
      recyclability: 'High',
      alternativeTo: 'Clay Brick'
    },
    
    // Insulation options
    {
      id: 'insulation-fiberglass',
      name: 'Fiberglass Insulation',
      factor: 1.35,
      unit: 'kg',
      category: 'Insulation',
      region: 'Australia',
      tags: ['energy-efficient', 'common'],
      sustainabilityScore: 40,
      recyclability: 'Low',
    },
    {
      id: 'insulation-cellulose',
      name: 'Cellulose Insulation',
      factor: 0.15,
      unit: 'kg',
      category: 'Insulation',
      region: 'Australia',
      tags: ['energy-efficient', 'recycled', 'sustainable'],
      sustainabilityScore: 85,
      recyclability: 'High',
      alternativeTo: 'Fiberglass Insulation'
    }
  ];
  
  // Combine basic fallbacks with alternatives
  return [...basicFallbacks, ...alternatives];
};
