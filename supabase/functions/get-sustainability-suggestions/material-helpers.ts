/**
 * Material-related helper functions for sustainability analysis
 * 
 * This module provides utility functions for analyzing material data,
 * calculating sustainability metrics, and generating recommendations
 * related to construction materials.
 */

import type { Material, SustainableMaterial } from 'interfaces/material';

/**
 * Calculate the percentage of sustainable materials in a collection
 * 
 * @param materials Array of material data
 * @returns Percentage of materials that meet sustainability criteria
 */
export function calculateSustainableMaterialPercentage(materials: (Material | SustainableMaterial)[]): number {
  if (materials.length === 0) return 0;
  
  const sustainableMaterialCount = materials.filter(m => 
    'sustainabilityScore' in m || 
    ('recycledContent' in m && typeof m.recycledContent === 'number' && m.recycledContent > 50) ||
    ('locallySourced' in m && m.locallySourced === true)
  ).length;
  
  return (sustainableMaterialCount / materials.length) * 100;
}

/**
 * Identify materials with high environmental impact
 * 
 * @param materials Array of material data
 * @returns Array of material names with high embodied carbon
 */
export function identifyHighImpactMaterials(materials: (Material | SustainableMaterial)[]): string[] {
  return materials
    .filter(m => 'embodiedCarbon' in m && typeof m.embodiedCarbon === 'number' && m.embodiedCarbon > 0.8)
    .map(m => m.name);
}

/**
 * Generate alternative material recommendations
 * 
 * @param materials Array of material data
 * @returns Array of material alternatives with potential savings
 */
export function generateMaterialAlternatives(materials: (Material | SustainableMaterial)[]): {
  material: string;
  alternatives: string[];
  potentialSavings: {
    carbon: number;
    cost?: number;
  };
}[] {
  return materials
    .filter(m => 'embodiedCarbon' in m && typeof m.embodiedCarbon === 'number' && m.embodiedCarbon > 0.8)
    .map(m => ({
      material: m.name,
      alternatives: m.alternatives || ["Sustainable alternative 1", "Sustainable alternative 2"],
      potentialSavings: {
        carbon: 0.3,
        cost: 0.1
      }
    }));
}

/**
 * Calculate the average embodied carbon for a collection of materials
 * 
 * @param materials Array of material data
 * @returns Average embodied carbon value
 */
export function calculateAverageEmbodiedCarbon(materials: (Material | SustainableMaterial)[]): number {
  if (materials.length === 0) return 0;
  
  const materialsWithEmbodiedCarbon = materials.filter(m => 
    'embodiedCarbon' in m && typeof m.embodiedCarbon === 'number');
  
  if (materialsWithEmbodiedCarbon.length === 0) return 0;
  
  const totalEmbodiedCarbon = materialsWithEmbodiedCarbon.reduce((sum, m) => 
    sum + ('embodiedCarbon' in m && typeof m.embodiedCarbon === 'number' ? m.embodiedCarbon : 0), 0);
  
  return totalEmbodiedCarbon / materialsWithEmbodiedCarbon.length;
}

/**
 * Calculate the total weight of materials
 * 
 * @param materials Array of material data
 * @returns Total weight of all materials
 */
export function calculateTotalMaterialWeight(materials: (Material | SustainableMaterial)[]): number {
  return materials.reduce((sum, m) => 
    sum + (('quantity' in m && typeof m.quantity === 'number') ? m.quantity : 0), 0);
}

/**
 * Calculate the percentage of recycled content across all materials
 * 
 * @param materials Array of material data
 * @returns Average recycled content percentage
 */
export function calculateRecycledContentPercentage(materials: (Material | SustainableMaterial)[]): number {
  if (materials.length === 0) return 0;
  
  const materialsWithRecycledContent = materials.filter(m => 
    'recycledContent' in m && typeof m.recycledContent === 'number');
  
  if (materialsWithRecycledContent.length === 0) return 0;
  
  const totalRecycledContent = materialsWithRecycledContent.reduce((sum, m) => 
    sum + ('recycledContent' in m && typeof m.recycledContent === 'number' ? m.recycledContent : 0), 0);
  
  return totalRecycledContent / materialsWithRecycledContent.length;
}

/**
 * Calculate the percentage of locally sourced materials
 * 
 * @param materials Array of material data
 * @returns Percentage of locally sourced materials
 */
export function calculateLocalContentPercentage(materials: (Material | SustainableMaterial)[]): number {
  if (materials.length === 0) return 0;
  
  const locallySourcedCount = materials.filter(m => 
    'locallySourced' in m && m.locallySourced === true).length;
  
  return (locallySourcedCount / materials.length) * 100;
}

/**
 * Group materials by their category
 * 
 * @param materials Array of material data
 * @returns Object with counts of materials by category
 */
export function groupMaterialsByCategory(materials: (Material | SustainableMaterial)[]): Record<string, number> {
  const categories: Record<string, number> = {};
  
  materials.forEach(m => {
    if ('type' in m && typeof m.type === 'string') {
      const category = m.type.toLowerCase();
      categories[category] = (categories[category] || 0) + 1;
    }
  });
  
  return categories;
}

/**
 * Group materials by their embodied carbon level
 * 
 * @param materials Array of material data
 * @returns Object with counts of materials by carbon impact level
 */
export function groupMaterialsByEmbodiedCarbon(materials: (Material | SustainableMaterial)[]): Record<string, number> {
  const levels: Record<string, number> = {
    high: 0,
    medium: 0,
    low: 0
  };
  
  materials.forEach(m => {
    if ('embodiedCarbon' in m && typeof m.embodiedCarbon === 'number') {
      if (m.embodiedCarbon > 0.7) {
        levels.high++;
      } else if (m.embodiedCarbon > 0.4) {
        levels.medium++;
      } else {
        levels.low++;
      }
    }
  });
  
  return levels;
}

/**
 * Calculate material completeness score based on available data
 * 
 * @param materials Array of material data
 * @returns Completeness score between 0 and 1
 */
export function calculateMaterialDataCompleteness(materials: (Material | SustainableMaterial)[]): number {
  if (materials.length === 0) return 0;
  
  let totalScore = 0;
  
  materials.forEach(m => {
    let itemScore = 0;
    
    // Check for essential properties
    if ('name' in m && typeof m.name === 'string') itemScore += 0.2;
    if ('embodiedCarbon' in m && typeof m.embodiedCarbon === 'number') itemScore += 0.2;
    
    // Check for additional properties
    if ('recycledContent' in m && typeof m.recycledContent === 'number') itemScore += 0.15;
    if ('locallySourced' in m) itemScore += 0.15;
    if ('quantity' in m && typeof m.quantity === 'number') itemScore += 0.1;
    if ('unit' in m && typeof m.unit === 'string') itemScore += 0.05;
    if ('cost' in m && typeof m.cost === 'number') itemScore += 0.05;
    if ('alternatives' in m && Array.isArray(m.alternatives)) itemScore += 0.05;
    if ('certifications' in m && Array.isArray(m.certifications)) itemScore += 0.05;
    
    totalScore += itemScore;
  });
  
  return totalScore / materials.length;
}
