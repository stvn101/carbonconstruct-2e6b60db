
/**
 * Functions for creating comprehensive fallback materials from multiple sources
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/materials';
import { createMaterial, getCategoryFromName, getRecyclability, getHardCodedFallbackMaterials } from './materialFallbacks';

/**
 * Creates a comprehensive set of fallback materials by combining multiple sources
 */
export const createComprehensiveFallbackMaterials = (): ExtendedMaterialData[] => {
  try {
    console.log('Creating comprehensive fallback materials');
    
    // Start with base materials from MATERIAL_FACTORS
    const factorMaterials = Object.entries(MATERIAL_FACTORS).map(([key, value]) => {
      const category = getCategoryFromName(key);
      const isAlt = key.toLowerCase().includes('recycled') || 
                   key.toLowerCase().includes('low-carbon') || 
                   key.toLowerCase().includes('sustainable');
                   
      // Generate tags based on material properties
      const tags = ['construction'];
      if (isAlt) tags.push('sustainable');
      if (key.toLowerCase().includes('recycled')) tags.push('recycled');
      if (category) tags.push(category.toLowerCase());
      
      // More varied sustainability scores based on material type
      let sustainabilityScore = 70; // Default
      if (isAlt) sustainabilityScore = Math.floor(Math.random() * 15) + 80; // 80-95
      else if (key.includes('plastic')) sustainabilityScore = Math.floor(Math.random() * 15) + 55; // 55-70
      else if (key.includes('timber') || key.includes('wood')) sustainabilityScore = Math.floor(Math.random() * 15) + 75; // 75-90
      else sustainabilityScore = Math.floor(Math.random() * 30) + 60; // 60-90
      
      return {
        name: value.name || key,
        factor: value.factor || 0,
        unit: value.unit || 'kg',
        region: 'Australia',
        tags: tags,
        sustainabilityScore,
        recyclability: getRecyclability(key),
        alternativeTo: isAlt ? key.replace(/recycled |low-carbon |sustainable /i, '') : undefined,
        notes: '',
        category
      };
    });
    
    // Additional materials for variety
    const additionalMaterials = [
      createMaterial('Recycled Concrete', 0.073, 'Concrete', ['recycled', 'construction', 'concrete'], 88),
      createMaterial('Low-Carbon Steel', 0.98, 'Metals', ['sustainable', 'construction', 'metals'], 85),
      createMaterial('Bamboo Flooring', 0.21, 'Wood', ['sustainable', 'construction', 'wood'], 92),
      createMaterial('Green Concrete', 0.083, 'Concrete', ['sustainable', 'construction', 'concrete'], 87),
      createMaterial('Australian Pine', 0.38, 'Wood', ['construction', 'wood', 'local'], 82),
      createMaterial('Structural Steel', 1.54, 'Metals', ['construction', 'metals', 'structural'], 68),
      createMaterial('Reinforced Concrete', 0.159, 'Concrete', ['construction', 'concrete', 'structural'], 65),
      createMaterial('Aluminum Framing', 8.1, 'Metals', ['construction', 'metals'], 55),
      createMaterial('Cork Flooring', 0.78, 'Wood', ['sustainable', 'construction', 'wood'], 89),
      createMaterial('Hemp Insulation', 0.35, 'Insulation', ['sustainable', 'construction', 'insulation'], 91),
      createMaterial('Sheep Wool Insulation', 0.42, 'Insulation', ['sustainable', 'construction', 'insulation'], 93),
      createMaterial('Rammed Earth', 0.04, 'Earth', ['sustainable', 'construction', 'earth'], 95),
      createMaterial('Brick Veneer', 0.27, 'Ceramics', ['construction', 'ceramics'], 72),
      createMaterial('Plasterboard', 0.38, 'Interior', ['construction', 'interior'], 68),
      createMaterial('Ceramic Tiles', 0.78, 'Ceramics', ['construction', 'ceramics'], 70),
      createMaterial('Laminate Flooring', 2.1, 'Interior', ['construction', 'interior'], 65),
      createMaterial('Glass Windows', 0.96, 'Glass', ['construction', 'glass'], 68),
      createMaterial('PVC Piping', 2.41, 'Plastics', ['construction', 'plastics'], 55),
      createMaterial('Solar Panels', 1.2, 'Energy', ['sustainable', 'construction', 'energy'], 88),
    ];
    
    // Combine both sources
    const combinedMaterials = [...factorMaterials, ...additionalMaterials];
    console.log(`Created ${combinedMaterials.length} comprehensive fallback materials`);
    
    return combinedMaterials;
  } catch (staticError) {
    console.error('Error creating comprehensive fallback materials:', staticError);
    return getHardCodedFallbackMaterials();
  }
};
