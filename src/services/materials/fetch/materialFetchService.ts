
/**
 * Service for fetching material data from various sources
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseMaterials } from '../cache/materialDataMapping';
import { processDataInBatches } from '../materialDataProcessor';

// Default materials to use when no DB connection is available
const DEFAULT_MATERIALS: ExtendedMaterialData[] = [
  {
    id: 'concrete',
    name: 'Standard Concrete',
    factor: 0.159,
    unit: 'kg',
    region: 'Australia',
    category: 'Concrete',
    sustainabilityScore: 40,
    recyclability: 'Medium',
    tags: ['concrete', 'foundation', 'structure'],
    description: 'Standard construction concrete with typical Portland cement content.'
  },
  {
    id: 'steel',
    name: 'Structural Steel',
    factor: 1.46,
    unit: 'kg', 
    region: 'Australia',
    category: 'Steel',
    sustainabilityScore: 60,
    recyclability: 'High',
    tags: ['steel', 'structure', 'framing'],
    description: 'Standard structural steel used in building frames and reinforcement.'
  },
  {
    id: 'timber',
    name: 'Timber (Softwood)',
    factor: 0.2,
    unit: 'kg',
    region: 'Australia',
    category: 'Wood',
    sustainabilityScore: 85,
    recyclability: 'High',
    tags: ['timber', 'wood', 'framing'],
    description: 'Sustainably sourced softwood timber for construction.'
  }
];

/**
 * Fetches material data from the database
 * @param forceRefresh Force a refresh from the database (bypassing cache)
 * @returns Array of material data
 */
export async function fetchMaterials(forceRefresh = false): Promise<ExtendedMaterialData[]> {
  try {
    console.log('Fetching materials from database');

    // Try to fetch from database if possible
    const { data: dbMaterials, error } = await supabase
      .from('materials')
      .select('*');
    
    if (error) {
      console.error('Error fetching materials from database:', error);
      console.log('Using default materials');
      return DEFAULT_MATERIALS;
    }
    
    // Process the results in batches to prevent UI freezing
    const processedMaterials = await processDataInBatches(
      dbMaterials,
      async (batch) => {
        return mapDatabaseMaterials(batch);
      }
    );
    
    console.log(`Fetched ${processedMaterials.length} materials from database`);
    
    // If no materials returned, use defaults
    if (!processedMaterials || processedMaterials.length === 0) {
      console.log('No materials found in database, using defaults');
      return DEFAULT_MATERIALS;
    }
    
    return processedMaterials;
  } catch (error) {
    console.error('Error in fetchMaterials:', error);
    return DEFAULT_MATERIALS;
  }
}

/**
 * Fetches material categories from the database
 * @returns Array of category names
 */
export async function fetchMaterialCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('material_categories')
      .select('name');
    
    if (error) {
      console.error('Error fetching material categories:', error);
      // Default categories if fetch fails
      return ['Concrete', 'Steel', 'Wood', 'Insulation', 'Glass', 'Brick'];
    }
    
    return data.map(category => category.name);
  } catch (error) {
    console.error('Error in fetchMaterialCategories:', error);
    return ['Concrete', 'Steel', 'Wood', 'Insulation', 'Glass', 'Brick'];
  }
}
