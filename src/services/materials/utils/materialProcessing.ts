
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MaterialView } from '../types/databaseTypes';
import { normalizeRecyclability } from './materialUtils';

export function processAndValidateMaterials(materials: MaterialView[]): ExtendedMaterialData[] {
  return materials.map(item => ({
    id: item.id || 'unknown',
    name: item.name || 'Unknown Material',
    factor: item.factor || 1,
    unit: item.unit || 'kg',
    region: item.region || 'Australia',
    tags: item.tags || [],
    sustainabilityScore: item.sustainabilityscore || 50,
    recyclability: normalizeRecyclability(item.recyclability || 'Medium'),
    notes: item.notes || '',
    category: item.category || 'Other',
    carbon_footprint_kgco2e_kg: item.carbon_footprint_kgco2e_kg || 0,
    carbon_footprint_kgco2e_tonne: item.carbon_footprint_kgco2e_tonne || 0,
    description: item.notes || ''
  }));
}
