
// Use Record type instead of array to allow string keys
interface IndexData<T> {
  [key: string]: T[];
}

// Function to create a material index for faster lookups
export function createMaterialIndex<T>(materials: T[]): IndexData<T> {
  const index: IndexData<T> = {};
  
  for (const material of materials) {
    const key = String(material);
    if (!index[key]) {
      index[key] = [];
    }
    index[key].push(material);
  }
  
  return index;
}

// Function to create a category index
export function createCategoryIndex<T extends { category?: string }>(items: T[]): IndexData<T> {
  const index: IndexData<T> = {};
  
  for (const item of items) {
    const category = item.category || 'uncategorized';
    if (!index[category]) {
      index[category] = [];
    }
    index[category].push(item);
  }
  
  return index;
}

// Function to create a region index
export function createRegionIndex<T extends { region?: string }>(items: T[]): IndexData<T> {
  const index: IndexData<T> = {};
  
  for (const item of items) {
    const region = item.region || 'unknown';
    if (!index[region]) {
      index[region] = [];
    }
    index[region].push(item);
  }
  
  return index;
}

// Function to create a tag index
export function createTagIndex<T extends { tags?: string[] }>(items: T[]): Record<string, T[]> {
  const index: Record<string, T[]> = {};
  
  for (const item of items) {
    const tags = item.tags || [];
    for (const tag of tags) {
      if (!index[tag]) {
        index[tag] = [];
      }
      index[tag].push(item);
    }
  }
  
  return index;
}

// Function to search through an index
export function searchIndex<T>(
  index: IndexData<T>,
  searchTerm: string,
  getSearchableText: (item: T) => string
): T[] {
  const results: T[] = [];
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  // Search through all items in the index
  Object.values(index).forEach(items => {
    items.forEach(item => {
      const searchableText = getSearchableText(item).toLowerCase();
      if (searchableText.includes(lowerSearchTerm)) {
        results.push(item);
      }
    });
  });
  
  return results;
}
