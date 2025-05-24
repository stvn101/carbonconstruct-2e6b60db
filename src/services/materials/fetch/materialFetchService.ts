/**
 * Material Fetch Service
 * Handles fetching material data from API and database sources
 */
import { supabase } from '@/integrations/supabase/client';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/carbonFactors';
import { cacheMaterials } from '../cache';
import { adaptSupabaseMaterialToExtended } from '@/hooks/materialCache/utils/typeAdapters';
import { toast } from 'sonner';

const DEMO_DELAY = 800; // Simulate network delay in demo mode
const MAX_RETRIES = 3; // Maximum number of retries for fetching materials

/**
 * Fetches materials from all available sources with fallbacks
 */
export async function fetchMaterials(forceRefresh = true): Promise<ExtendedMaterialData[]> {
  try {
    console.log(`Fetching materials (forceRefresh: ${forceRefresh})`);
    
    // Try multiple strategies in sequence with materials_view as priority
    const materials = await fetchWithStrategies();
    
    if (materials && materials.length > 0) {
      console.log(`Successfully fetched ${materials.length} materials`);
      
      // Cache the materials
      await cacheMaterials(materials);
      
      return materials;
    }
    
    // If all strategies fail, use fallback data
    console.warn('All fetch strategies failed, using fallback materials');
    return generateFallbackMaterials();
  } catch (error) {
    console.error('Error in fetchMaterials:', error);
    return generateFallbackMaterials();
  }
}

/**
 * Try multiple strategies to fetch materials - Updated to prioritize materials_view
 */
async function fetchWithStrategies(): Promise<ExtendedMaterialData[]> {
  let materials: ExtendedMaterialData[] = [];
  let errors = [];
  
  // PRIORITY STRATEGY: Try materials_view first (contains all 153 materials)
  try {
    console.log('Priority Strategy: Fetching from materials_view (153 materials expected)');
    materials = await fetchMaterialsFromView();
    if (materials && materials.length > 0) {
      console.log(`Priority Strategy successful: Got ${materials.length} materials from materials_view`);
      return materials;
    }
  } catch (error) {
    console.warn('Priority Strategy (materials_view) failed:', error);
    errors.push({ strategy: 'materials_view_priority', error });
  }
  
  // Fallback Strategy 1: Try materials_backup table (should have 153 materials)
  try {
    console.log('Fallback Strategy 1: Fetching from materials_backup table');
    materials = await fetchMaterialsFromBackupTable();
    if (materials && materials.length > 0) {
      console.log(`Fallback Strategy 1 successful: Got ${materials.length} materials from backup`);
      return materials;
    }
  } catch (error) {
    console.warn('Fallback Strategy 1 (materials_backup) failed:', error);
    errors.push({ strategy: 'materials_backup', error });
  }
  
  // Fallback Strategy 2: Try direct materials table access (70 materials)
  try {
    console.log('Fallback Strategy 2: Fetching directly from materials table');
    materials = await fetchMaterialsFromTable();
    if (materials && materials.length > 0) {
      console.log(`Fallback Strategy 2 successful: Got ${materials.length} materials from main table`);
      return materials;
    }
  } catch (error) {
    console.warn('Fallback Strategy 2 (materials_table) failed:', error);
    errors.push({ strategy: 'materials_table', error });
  }
  
  // Log detailed errors to help diagnose the issue
  console.error('All fetch strategies failed:', errors);
  
  // Return empty array if all strategies fail
  return [];
}

/**
 * Fetches materials from the materials_view
 */
export async function fetchMaterialsFromView(): Promise<ExtendedMaterialData[]> {
  try {
    const { data, error } = await supabase
      .from('materials_view')
      .select('*');

    if (error) {
      console.error('Error fetching from materials_view:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No materials found in materials_view');
      return [];
    }

    console.log(`Successfully fetched ${data.length} materials from materials_view`);
    // Convert the data to the expected format
    return processAndValidateMaterials(data);
  } catch (error) {
    console.error('Error in fetchMaterialsFromView:', error);
    throw error;
  }
}

/**
 * Fetches materials directly from the materials table
 */
export async function fetchMaterialsFromTable(): Promise<ExtendedMaterialData[]> {
  try {
    const { data, error } = await supabase
      .from('materials')
      .select(`
        id,
        material,
        description,
        co2e_min,
        co2e_max,
        co2e_avg,
        sustainability_score,
        sustainability_notes,
        applicable_standards,
        ncc_requirements,
        category_id
      `);

    if (error) {
      console.error('Error fetching from materials table:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No materials found in materials table');
      return [];
    }

    console.log(`Successfully fetched ${data.length} materials from materials table`);
    // Map data from materials table to ExtendedMaterialData format
    return data.map(item => ({
      id: item.id.toString(),
      name: item.material || 'Unknown Material',
      factor: item.co2e_avg || 1,
      unit: 'kg',
      region: 'Australia',
      tags: item.applicable_standards ? [item.applicable_standards] : [],
      sustainabilityScore: item.sustainability_score || 50,
      recyclability: 'Medium' as 'High' | 'Medium' | 'Low',
      notes: item.sustainability_notes || '',
      category: guessCategoryFromName(item.material || ''),
      carbon_footprint_kgco2e_kg: item.co2e_avg || 0,
      carbon_footprint_kgco2e_tonne: item.co2e_avg ? item.co2e_avg * 1000 : 0,
      description: item.description || item.sustainability_notes || ''
    }));
  } catch (error) {
    console.error('Error in fetchMaterialsFromTable:', error);
    throw error;
  }
}

/**
 * Fetches materials from the materials_backup table
 */
export async function fetchMaterialsFromBackupTable(): Promise<ExtendedMaterialData[]> {
  try {
    const { data, error } = await supabase
      .from('materials_backup')
      .select('*');

    if (error) {
      console.error('Error fetching from materials_backup:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No materials found in materials_backup');
      return [];
    }

    console.log(`Successfully fetched ${data.length} materials from materials_backup`);
    // Process the backup table data
    return processAndValidateMaterials(data);
  } catch (error) {
    console.error('Error in fetchMaterialsFromBackupTable:', error);
    throw error;
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
    const processedMaterial: ExtendedMaterialData = {
      id: material.id || `material-${Math.random().toString(36).substring(7)}`,
      name: material.name || material.material || 'Unknown Material',
      factor: material.factor || material.carbon_footprint_kgco2e_kg || material.co2e_avg || 1,
      unit: material.unit || 'kg',
      region: material.region || 'Australia',
      tags: material.tags || [],
      sustainabilityScore: material.sustainabilityScore || 
        material.sustainability_score || 
        material.sustainabilityscore ||
        Math.floor(Math.random() * 40) + 60,
      recyclability: normalizeRecyclability(material.recyclability),
      description: material.description || material.notes || material.sustainability_notes || '',
      category: material.category || guessCategoryFromName(material.name || material.material || 'Unknown Material'),
      notes: material.notes || material.sustainability_notes || '',
      carbon_footprint_kgco2e_kg: material.carbon_footprint_kgco2e_kg || material.factor || material.co2e_avg || 0,
      carbon_footprint_kgco2e_tonne: material.carbon_footprint_kgco2e_tonne || 
        (material.carbon_footprint_kgco2e_kg ? material.carbon_footprint_kgco2e_kg * 1000 : null) ||
        (material.factor ? material.factor * 1000 : 0)
    };
    
    return processedMaterial;
  });
}

/**
 * Normalize recyclability to one of the supported values
 */
function normalizeRecyclability(value?: string): 'High' | 'Medium' | 'Low' {
  if (!value) return 'Medium';
  
  // Check if it's already one of the valid values
  if (['High', 'Medium', 'Low'].includes(value)) {
    return value as 'High' | 'Medium' | 'Low';
  }
  
  // Otherwise, normalize string
  const normalized = value.toLowerCase();
  if (normalized.includes('high')) return 'High';
  if (normalized.includes('low')) return 'Low';
  return 'Medium';
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
    return 'Timber is wood prepared for use in building and carpentry. It\'s a renewable resource with good structural properties.';
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
          description: generateDescriptionFromName(value.name || key),
          notes: ''
        });
      });
      
      // Add some alternative materials with specific data
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
          description: 'A sustainable alternative to traditional concrete that reduces carbon emissions by using alternative cementitious materials.',
          notes: ''
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
