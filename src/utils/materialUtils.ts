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
  if (lowerType.includes('pipe') || lowerType.includes('plumbing')) return 'Plumbing';
  if (lowerType.includes('earth') || lowerType.includes('soil')) return 'Earthworks';
  return 'Other';
}

export function getReductionPercent(altMaterial: string, standardMaterial: string): number {
  const altMaterialKey = altMaterial as Material;
  const standardMaterialKey = standardMaterial as Material;
  
  const altFactor = MATERIAL_FACTORS[altMaterialKey]?.factor || 0;
  const standardFactor = MATERIAL_FACTORS[standardMaterialKey]?.factor || altFactor;
  
  if (standardFactor === 0) return 0;
  return Math.round(((standardFactor - altFactor) / standardFactor) * 100);
}

export function getSustainabilityScore(materialType: string, factor: number): number {
  const baseScore = 100 - (factor * 5);
  const lowerType = materialType.toLowerCase();
  let bonus = 0;
  if (lowerType.includes('recycled')) bonus += 20;
  if (lowerType.includes('sustainable')) bonus += 15;
  if (lowerType.includes('low-carbon')) bonus += 25;
  if (lowerType.includes('natural')) bonus += 15;
  if (lowerType.includes('australian')) bonus += 10; // Bonus for locally sourced materials
  
  return Math.max(10, Math.min(100, baseScore + bonus));
}

export function getRecyclability(materialType: string): "High" | "Medium" | "Low" {
  const lowerType = materialType.toLowerCase();
  if (lowerType.includes('steel') || lowerType.includes('metal') || lowerType.includes('recycled')) return 'High';
  if (lowerType.includes('wood') || lowerType.includes('paper')) return 'High';
  if (lowerType.includes('concrete')) return 'Medium';
  if (lowerType.includes('plastic')) return 'Low';
  if (lowerType.includes('glass')) return 'High';
  if (lowerType.includes('earth') || lowerType.includes('soil')) return 'Medium';
  if (lowerType.includes('brick') || lowerType.includes('ceramic')) return 'Medium';
  
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
    const isAlt = key.toLowerCase().includes('recycled') || 
                key.toLowerCase().includes('low-carbon') || 
                key.toLowerCase().includes('sustainable');
    const standardName = isAlt ? key.replace(/recycled |low-carbon |sustainable /i, '') : key;
    const isAustralian = key.toLowerCase().includes('aus') || key.toLowerCase().includes('australian');
    
    return {
      type: key,
      factor: value.factor,
      category: getCategory(key),
      alternativeToStandard: isAlt,
      carbonReduction: isAlt ? Math.round(getReductionPercent(key, standardName)) : 0,
      sustainabilityScore: Math.round(getSustainabilityScore(key, value.factor)),
      locallySourced: isAustralian || Math.random() > 0.6, // 40% chance of being locally sourced if not explicitly Australian
      recyclability: getRecyclability(key),
    };
  });
};

export const getCategoryAverages = (materials: EnrichedMaterial[]) => {
  const categoryMap: Record<string, { count: number, totalFactor: number, totalScore: number }> = {};
  
  materials.forEach(material => {
    if (!categoryMap[material.category]) {
      categoryMap[material.category] = { count: 0, totalFactor: 0, totalScore: 0 };
    }
    
    categoryMap[material.category].count += 1;
    categoryMap[material.category].totalFactor += material.factor;
    categoryMap[material.category].totalScore += material.sustainabilityScore;
  });
  
  return Object.entries(categoryMap).map(([category, data]) => ({
    name: category,
    emissionFactor: +(data.totalFactor / data.count).toFixed(2),
    sustainabilityScore: +(data.totalScore / data.count).toFixed(0)
  }));
};
