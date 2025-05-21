
/**
 * Material Fetch Service
 * Handles fetching material data from API and database sources
 */
import { supabase } from '@/integrations/supabase/client';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/carbonFactors';
import { cacheMaterials } from '../cache';

const DEMO_DELAY = 800; // Simulate network delay in demo mode

/**
 * Fetches materials from the database or generates demo data
 */
export async function fetchMaterials(forceRefresh = true): Promise<ExtendedMaterialData[]> {
  try {
    console.log(`Fetching materials (forceRefresh: ${forceRefresh})`);
    
    // Try to get materials from Supabase
    const { data, error } = await supabase
      .from('materials_view')
      .select('*');
      
    if (error) {
      console.error('Error fetching materials from database:', error);
      return generateFallbackMaterials();
    }
    
    if (data && data.length > 0) {
      console.log(`Fetched ${data.length} materials from database`);
      
      // Process and augment the data
      const processedMaterials = processAndValidateMaterials(data);
      
      // Cache the materials
      await cacheMaterials(processedMaterials);
      
      return processedMaterials;
    }
    
    // If no data, use fallback data
    console.log('No materials found in database, using fallback data');
    return generateFallbackMaterials();
  } catch (error) {
    console.error('Error in fetchMaterials:', error);
    return generateFallbackMaterials();
  }
}

/**
 * Fetches material categories and their relationships
 */
export async function fetchMaterialCategories(): Promise<any[]> {
  try {
    // Fetch material categories from the database
    const { data, error } = await supabase
      .from('material_categories')
      .select('*');
      
    if (error) {
      console.error('Error fetching material categories:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchMaterialCategories:', error);
    return [];
  }
}

/**
 * Fetches materials with a specific tag
 */
export async function fetchMaterialsByTag(tag: string): Promise<ExtendedMaterialData[]> {
  try {
    // In a real database, this would use an array contains query
    // For now, fetch all materials and filter
    const allMaterials = await fetchMaterials(false);
    
    return allMaterials.filter(material => 
      material.tags && material.tags.includes(tag)
    );
  } catch (error) {
    console.error(`Error fetching materials with tag ${tag}:`, error);
    return [];
  }
}

/**
 * Fetches materials by category
 */
export async function fetchMaterialsByCategory(category: string): Promise<ExtendedMaterialData[]> {
  try {
    // Try to get materials from Supabase
    const { data, error } = await supabase
      .from('materials_view')
      .select('*')
      .eq('category', category);
      
    if (error) {
      console.error(`Error fetching materials in category ${category}:`, error);
      return [];
    }
    
    if (data && data.length > 0) {
      return processAndValidateMaterials(data);
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching materials in category ${category}:`, error);
    return [];
  }
}

/**
 * Fetches and processes the latest sustainability data for materials
 */
export async function fetchSustainabilityData(): Promise<Record<string, {
  sustainabilityScore: number;
  recycledContent?: number;
  locallySourced?: boolean;
  recyclability: 'High' | 'Medium' | 'Low';
}>> {
  try {
    // This would typically fetch from a real API
    // For now, return some sample data
    
    // Generate sample sustainability data for common materials
    const sustainabilityData: Record<string, any> = {};
    
    // Loop through material factors and add sustainability data
    Object.keys(MATERIAL_FACTORS).forEach(key => {
      const material = MATERIAL_FACTORS[key];
      
      // Generate believable sustainability data based on material type
      let sustainabilityScore = 50; // Default middle score
      let recyclability: 'High' | 'Medium' | 'Low' = 'Medium';
      
      // Adjust scores based on material type
      const materialName = material.name || key;
      const materialNameLower = materialName.toLowerCase();
      
      // Wood products are generally more sustainable
      if (materialNameLower.includes('timber') || materialNameLower.includes('wood')) {
        sustainabilityScore += 30;
        recyclability = 'High';
      } 
      // Concrete has variable sustainability
      else if (materialNameLower.includes('concrete')) {
        // Standard concrete is less sustainable
        if (materialNameLower.includes('standard')) {
          sustainabilityScore -= 20;
          recyclability = 'Medium';
        } 
        // Low carbon concrete is more sustainable
        else if (materialNameLower.includes('low carbon')) {
          sustainabilityScore += 15;
          recyclability = 'Medium';
        }
      }
      // Steel can be recycled
      else if (materialNameLower.includes('steel')) {
        if (materialNameLower.includes('recycled')) {
          sustainabilityScore += 25;
          recyclability = 'High';
        } else {
          sustainabilityScore -= 5;
          recyclability = 'High'; // Still highly recyclable
        }
      }
      // Aluminum has high embodied energy but is recyclable
      else if (materialNameLower.includes('aluminum')) {
        sustainabilityScore -= 10;
        recyclability = 'High';
      }
      // Insulation materials
      else if (materialNameLower.includes('insulation')) {
        // Natural insulation is more sustainable
        if (
          materialNameLower.includes('wool') || 
          materialNameLower.includes('cellulose') ||
          materialNameLower.includes('cotton')
        ) {
          sustainabilityScore += 25;
          recyclability = 'High';
        } 
        // Synthetic insulation is less sustainable
        else {
          sustainabilityScore -= 5;
          recyclability = 'Low';
        }
      }
      
      // Add random variation
      sustainabilityScore += Math.floor(Math.random() * 20) - 10;
      
      // Ensure score is between 0-100
      sustainabilityScore = Math.min(100, Math.max(0, sustainabilityScore));
      
      // Add to data object
      sustainabilityData[key] = {
        sustainabilityScore,
        recyclability,
        recycledContent: recyclability === 'High' ? Math.floor(Math.random() * 80) + 20 : undefined,
        locallySourced: Math.random() > 0.5
      };
    });
    
    return sustainabilityData;
  } catch (error) {
    console.error('Error fetching sustainability data:', error);
    return {};
  }
}

/**
 * Processes and validates materials from the database
 */
function processAndValidateMaterials(materials: any[]): ExtendedMaterialData[] {
  return materials.map(material => {
    // Ensure required fields are present
    return {
      ...material,
      id: material.id || `material-${Math.random().toString(36).substring(7)}`,
      name: material.name || 'Unknown Material',
      factor: material.factor || material.carbon_footprint_kgco2e_kg || 1,
      unit: material.unit || 'kg',
      region: material.region || 'Australia',
      tags: material.tags || [],
      sustainabilityScore: material.sustainabilityscore || 
        material.sustainability_score || 
        Math.floor(Math.random() * 40) + 60,
      recyclability: material.recyclability || 
        (['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as 'High' | 'Medium' | 'Low')
    };
  });
}

/**
 * Generates fallback materials when the database is unavailable
 */
function generateFallbackMaterials(): Promise<ExtendedMaterialData[]> {
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
          description: generateDescriptionFromName(value.name || key)
        });
      });
      
      // Add some alternative materials
      materials.push(
        {
          id: 'alt-concrete-1',
          name: 'Low-Carbon Concrete',
          factor: 0.13, // Lower carbon footprint
          carbon_footprint_kgco2e_kg: 0.13,
          unit: 'kg',
          region: 'Australia',
          tags: ['construction', 'sustainable', 'alternative'],
          sustainabilityScore: 85,
          recyclability: 'Medium',
          alternativeTo: 'concrete',
          category: 'Structural',
          description: 'A sustainable alternative to traditional concrete that reduces carbon emissions by using alternative cementitious materials.'
        },
        {
          id: 'alt-steel-1',
          name: 'Recycled Steel',
          factor: 0.7, // Lower carbon footprint
          carbon_footprint_kgco2e_kg: 0.7,
          unit: 'kg',
          region: 'Australia',
          tags: ['construction', 'recycled', 'alternative'],
          sustainabilityScore: 90,
          recyclability: 'High',
          alternativeTo: 'steel',
          category: 'Structural',
          description: '100% recycled steel with significantly lower embodied carbon compared to virgin steel production.'
        },
        {
          id: 'alt-insulation-1',
          name: 'Sheep's Wool Insulation',
          factor: 0.8,
          carbon_footprint_kgco2e_kg: 0.8,
          unit: 'kg',
          region: 'Australia',
          tags: ['construction', 'natural', 'alternative'],
          sustainabilityScore: 95,
          recyclability: 'High',
          alternativeTo: 'insulation',
          category: 'Insulation',
          description: 'Natural insulation material made from sheep's wool with excellent thermal and acoustic properties.'
        }
      );
      
      // Cache the generated materials
      cacheMaterials(materials).catch(console.error);
      
      resolve(materials);
    }, DEMO_DELAY);
  });
}

/**
 * Guesses a category based on material name
 */
function guessCategoryFromName(name: string): string {
  const nameLower = name.toLowerCase();
  
  if (
    nameLower.includes('concrete') || 
    nameLower.includes('cement') ||
    nameLower.includes('mortar')
  ) {
    return 'Concrete';
  }
  
  if (
    nameLower.includes('steel') || 
    nameLower.includes('metal') ||
    nameLower.includes('iron')
  ) {
    return 'Steel';
  }
  
  if (
    nameLower.includes('timber') || 
    nameLower.includes('wood')
  ) {
    return 'Timber';
  }
  
  if (
    nameLower.includes('glass') || 
    nameLower.includes('window')
  ) {
    return 'Glass';
  }
  
  if (
    nameLower.includes('insulation') || 
    nameLower.includes('wool') ||
    nameLower.includes('foam')
  ) {
    return 'Insulation';
  }
  
  if (
    nameLower.includes('brick') || 
    nameLower.includes('block') ||
    nameLower.includes('masonry')
  ) {
    return 'Masonry';
  }
  
  if (
    nameLower.includes('aluminum') || 
    nameLower.includes('aluminium')
  ) {
    return 'Aluminum';
  }
  
  return 'Other';
}

/**
 * Generates a description based on material name
 */
function generateDescriptionFromName(name: string): string {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('concrete')) {
    return 'Concrete is a composite material composed of fine and coarse aggregate bonded together with a fluid cement that hardens over time.';
  }
  
  if (nameLower.includes('steel')) {
    return 'Steel is an alloy of iron and carbon and other elements. It is one of the most common construction materials.';
  }
  
  if (nameLower.includes('timber') || nameLower.includes('wood')) {
    return 'Timber is wood prepared for use in building and carpentry. It's a renewable resource with good structural properties.';
  }
  
  if (nameLower.includes('glass')) {
    return 'Glass is a non-crystalline, amorphous solid that is often transparent and has widespread practical, technological, and decorative use.';
  }
  
  if (nameLower.includes('insulation')) {
    return 'Insulation materials reduce heat transfer between objects in thermal contact or in range of radiative influence.';
  }
  
  if (nameLower.includes('brick')) {
    return 'Brick is a type of block used to build walls, pavements and other elements in masonry construction.';
  }
  
  if (nameLower.includes('aluminum') || nameLower.includes('aluminium')) {
    return 'Aluminum is a lightweight, corrosion-resistant metal commonly used in construction for windows, doors, and facades.';
  }
  
  return `${name} is a construction material used in building projects.`;
}
