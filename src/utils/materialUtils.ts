
interface EnrichedMaterial {
  type: string;
  factor: number;
  category: string;
  alternativeToStandard: boolean;
  carbonReduction: number;
  sustainabilityScore: number;
  locallySourced: boolean;
  recyclability: "High" | "Medium" | "Low";
}

import { Material, MATERIAL_FACTORS } from "@/lib/carbonCalculations";

export function getCategory(materialType: string): string {
  const lowerType = materialType.toLowerCase();
  if (lowerType.includes('concrete')) return 'Concrete';
  if (lowerType.includes('steel') || lowerType.includes('metal')) return 'Metals';
  if (lowerType.includes('wood') || lowerType.includes('timber')) return 'Wood';
  if (lowerType.includes('glass')) return 'Glass';
  if (lowerType.includes('plastic')) return 'Plastics';
  if (lowerType.includes('insulation')) return 'Insulation';
  if (lowerType.includes('brick') || lowerType.includes('ceramic') || lowerType.includes('tile')) return 'Ceramics';
  return 'Other';
}

export function getReductionPercent(altMaterial: string, standardMaterial: string): number {
  const altMaterialKey = altMaterial as Material;
  const standardMaterialKey = standardMaterial as Material;
  
  const altFactor = MATERIAL_FACTORS[altMaterialKey]?.factor || 0;
  const standardFactor = MATERIAL_FACTORS[standardMaterialKey]?.factor || altFactor;
  
  if (standardFactor === 0) return 0;
  return ((standardFactor - altFactor) / standardFactor) * 100;
}

export function getSustainabilityScore(materialType: string, factor: number): number {
  const baseScore = 100 - (factor * 5);
  const lowerType = materialType.toLowerCase();
  let bonus = 0;
  if (lowerType.includes('recycled')) bonus += 20;
  if (lowerType.includes('sustainable')) bonus += 15;
  if (lowerType.includes('low-carbon')) bonus += 25;
  
  return Math.max(10, Math.min(100, baseScore + bonus));
}

export function getRecyclability(materialType: string): string {
  const lowerType = materialType.toLowerCase();
  if (lowerType.includes('steel') || lowerType.includes('metal') || lowerType.includes('recycled')) return 'High';
  if (lowerType.includes('wood') || lowerType.includes('paper')) return 'High';
  if (lowerType.includes('concrete')) return 'Medium';
  if (lowerType.includes('plastic')) return 'Low';
  
  const random = Math.random();
  if (random < 0.33) return 'Low';
  if (random < 0.66) return 'Medium';
  return 'High';
}

export interface EnrichedMaterial {
  type: string;
  factor: number;
  category: string;
  alternativeToStandard: boolean;
  carbonReduction: number;
  sustainabilityScore: number;
  locallySourced: boolean;
  recyclability: "High" | "Medium" | "Low";
}

export const createExtendedMaterialDB = (): EnrichedMaterial[] => {
  return Object.entries(MATERIAL_FACTORS).map(([key, value]) => {
    const isAlt = key.toLowerCase().includes('recycled') || key.toLowerCase().includes('low-carbon');
    const standardName = isAlt ? key.replace(/recycled |low-carbon |sustainable /i, '') : key;
    
    return {
      type: key,
      factor: value.factor,
      category: getCategory(key),
      alternativeToStandard: isAlt,
      carbonReduction: isAlt ? Math.round(getReductionPercent(key, standardName)) : 0,
      sustainabilityScore: Math.round(getSustainabilityScore(key, value.factor)),
      locallySourced: Math.random() > 0.5,
      recyclability: getRecyclability(key) as "High" | "Medium" | "Low",
    };
  });
};
