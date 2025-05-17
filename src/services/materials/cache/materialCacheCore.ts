
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

/**
 * Core service for managing material cache
 */
class MaterialCacheService {
  private materials: ExtendedMaterialData[] = [];
  private lastUpdated: Date | null = null;
  
  /**
   * Get all materials from cache
   */
  getMaterials(): ExtendedMaterialData[] {
    return [...this.materials];
  }
  
  /**
   * Set materials in cache
   */
  setMaterials(materials: ExtendedMaterialData[]): boolean {
    try {
      this.materials = [...materials];
      return true;
    } catch (error) {
      console.error('Error setting materials in cache:', error);
      return false;
    }
  }
  
  /**
   * Get last updated timestamp
   */
  getLastUpdated(): Date | null {
    return this.lastUpdated;
  }
  
  /**
   * Set last updated timestamp
   */
  setLastUpdated(date: Date): void {
    this.lastUpdated = date;
  }
  
  /**
   * Get count of materials in cache
   */
  getMaterialsCount(): number {
    return this.materials.length;
  }
  
  /**
   * Clear the cache
   */
  clearCache(): void {
    this.materials = [];
    this.lastUpdated = null;
  }
}

// Export singleton instance
const materialCacheService = new MaterialCacheService();
export default materialCacheService;
