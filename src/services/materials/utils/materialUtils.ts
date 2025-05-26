/**
 * Utility functions for material data processing
 */

/**
 * Normalize recyclability to one of the supported values
 */
export function normalizeRecyclability(value?: string): 'High' | 'Medium' | 'Low' {
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
export function guessCategoryFromName(name: string): string {
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
export function generateDescriptionFromName(name: string): string {
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