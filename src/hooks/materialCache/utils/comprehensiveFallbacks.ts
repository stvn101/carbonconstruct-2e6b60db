
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
      carbon_footprint_kgco2e_kg: 0.07,
      carbon_footprint_kgco2e_tonne: 70,
      category: 'Concrete',
      region: 'Australia',
      tags: ['structural', 'sustainable', 'low-carbon'],
      sustainabilityscore: 75,
      recyclability: 'Medium',
      unit: 'kg',
      alternativeto: 'Standard Concrete'
    },
    {
      id: 'concrete-geopolymer',
      name: 'Geopolymer Concrete',
      carbon_footprint_kgco2e_kg: 0.05,
      carbon_footprint_kgco2e_tonne: 50,
      category: 'Concrete',
      region: 'Australia',
      tags: ['structural', 'sustainable', 'innovative'],
      sustainabilityscore: 85,
      recyclability: 'High',
      unit: 'kg',
      alternativeto: 'Standard Concrete'
    },
    
    // Steel alternatives
    {
      id: 'steel-recycled',
      name: 'Recycled Steel',
      carbon_footprint_kgco2e_kg: 0.73,
      carbon_footprint_kgco2e_tonne: 730,
      category: 'Steel',
      region: 'Australia',
      tags: ['structural', 'recycled'],
      sustainabilityscore: 65,
      recyclability: 'Very High',
      unit: 'kg',
      alternativeto: 'Standard Steel'
    },
    {
      id: 'steel-high-tensile',
      name: 'High Tensile Steel',
      carbon_footprint_kgco2e_kg: 1.2,
      carbon_footprint_kgco2e_tonne: 1200,
      category: 'Steel',
      region: 'Australia',
      tags: ['structural', 'high-strength'],
      sustainabilityscore: 45,
      recyclability: 'High',
      unit: 'kg',
      alternativeto: 'Standard Steel'
    },
    
    // Timber alternatives
    {
      id: 'timber-bamboo',
      name: 'Bamboo',
      carbon_footprint_kgco2e_kg: 0.25,
      carbon_footprint_kgco2e_tonne: 250,
      category: 'Timber',
      region: 'Australia',
      tags: ['structural', 'natural', 'sustainable'],
      sustainabilityscore: 90,
      recyclability: 'High',
      unit: 'kg',
      alternativeto: 'Timber (Pine)'
    },
    {
      id: 'timber-clt',
      name: 'Cross Laminated Timber',
      carbon_footprint_kgco2e_kg: 0.42,
      carbon_footprint_kgco2e_tonne: 420,
      category: 'Timber',
      region: 'Australia',
      tags: ['structural', 'engineered', 'innovative'],
      sustainabilityscore: 80,
      recyclability: 'Medium',
      unit: 'kg',
      alternativeto: 'Timber (Pine)'
    },
    
    // Glass alternatives
    {
      id: 'glass-low-e',
      name: 'Low-E Glass',
      carbon_footprint_kgco2e_kg: 0.95,
      carbon_footprint_kgco2e_tonne: 950,
      category: 'Glass',
      region: 'Australia',
      tags: ['finishing', 'energy-efficient'],
      sustainabilityscore: 60,
      recyclability: 'Medium',
      unit: 'kg',
      alternativeto: 'Standard Glass'
    },
    
    // Masonry alternatives
    {
      id: 'brick-recycled',
      name: 'Recycled Brick',
      carbon_footprint_kgco2e_kg: 0.12,
      carbon_footprint_kgco2e_tonne: 120,
      category: 'Masonry',
      region: 'Australia',
      tags: ['structural', 'recycled'],
      sustainabilityscore: 75,
      recyclability: 'High',
      unit: 'kg',
      alternativeto: 'Clay Brick'
    },
    {
      id: 'hempcrete',
      name: 'Hempcrete',
      carbon_footprint_kgco2e_kg: 0.08,
      carbon_footprint_kgco2e_tonne: 80,
      category: 'Masonry',
      region: 'Australia',
      tags: ['structural', 'natural', 'innovative', 'sustainable'],
      sustainabilityscore: 95,
      recyclability: 'Very High',
      unit: 'kg',
      alternativeto: 'Clay Brick'
    },
    
    // Insulation options
    {
      id: 'insulation-fiberglass',
      name: 'Fiberglass Insulation',
      carbon_footprint_kgco2e_kg: 1.35,
      carbon_footprint_kgco2e_tonne: 1350,
      category: 'Insulation',
      region: 'Australia',
      tags: ['energy-efficient', 'common'],
      sustainabilityscore: 40,
      recyclability: 'Low',
      unit: 'kg'
    },
    {
      id: 'insulation-cellulose',
      name: 'Cellulose Insulation',
      carbon_footprint_kgco2e_kg: 0.15,
      carbon_footprint_kgco2e_tonne: 150,
      category: 'Insulation',
      region: 'Australia',
      tags: ['energy-efficient', 'recycled', 'sustainable'],
      sustainabilityscore: 85,
      recyclability: 'High',
      unit: 'kg',
      alternativeto: 'Fiberglass Insulation'
    }
  ];
  
  // Combine basic fallbacks with alternatives
  return [...basicFallbacks, ...alternatives];
};
