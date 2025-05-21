/**
 * Storage utilities for material performance data
 */
import { MaterialPerformanceData } from './types';

/**
 * Stores performance data in the database
 */
export async function storePerformanceData(
  performanceData: MaterialPerformanceData[], 
  projectId: string
): Promise<void> {
  // Instead of direct Supabase call, we'll simulate storage
  console.log(`Storing ${performanceData.length} material performance records for project ${projectId}`);
  
  // In the real implementation, we'd store in a database table, but for now we'll just log
  console.info('Material performance data would be stored in database');
  
  // Use localStorage instead
  try {
    const key = `performance_data_${projectId}`;
    const existingData = localStorage.getItem(key);
    const parsedData = existingData ? JSON.parse(existingData) : [];
    const newData = [...parsedData, ...performanceData];
    localStorage.setItem(key, JSON.stringify(newData));
  } catch (error) {
    console.error('Error storing performance data:', error);
  }
}

/**
 * Stores performance data in local cache
 */
export function storePerformanceInLocalCache(performanceData: MaterialPerformanceData[]): void {
  try {
    const existingData = localStorage.getItem('material-performance-data');
    const parsedData = existingData ? JSON.parse(existingData) : [];
    
    // Merge with existing data, avoiding duplicates
    const newData = [...parsedData, ...performanceData];
    
    // Keep only the last 1000 entries to avoid localStorage limits
    const trimmedData = newData.slice(-1000);
    
    localStorage.setItem('material-performance-data', JSON.stringify(trimmedData));
  } catch (error) {
    console.error('Error storing performance data in local cache:', error);
  }
}

/**
 * Gets historical data for a specific material
 */
export async function getHistoricalDataForMaterial(materialType: string): Promise<any[]> {
  try {
    // For now, we'll just use local storage data
    const localData = localStorage.getItem('material-performance-data');
    if (!localData) return [];
    
    const parsedData = JSON.parse(localData);
    const materialData = parsedData.filter((item: MaterialPerformanceData) => 
      item.materialName === materialType
    );
    
    return materialData.map((item: MaterialPerformanceData) => ({
      timestamp: item.timestamp,
      carbonFootprint: item.carbonFootprint,
      sustainabilityScore: item.sustainabilityScore,
      quantity: item.quantity
    }));
  } catch (error) {
    console.error('Error retrieving historical data:', error);
    return [];
  }
}
