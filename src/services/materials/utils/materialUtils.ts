
export function guessCategoryFromName(name: string): string {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('concrete') || lowerName.includes('cement')) return 'Concrete';
  if (lowerName.includes('steel') || lowerName.includes('metal')) return 'Steel';
  if (lowerName.includes('timber') || lowerName.includes('wood')) return 'Timber';
  if (lowerName.includes('brick') || lowerName.includes('masonry')) return 'Masonry';
  if (lowerName.includes('glass')) return 'Glass';
  if (lowerName.includes('insulation')) return 'Insulation';
  
  return 'Other';
}

export function generateDescriptionFromName(name: string): string {
  return `Material: ${name}`;
}

export function normalizeRecyclability(recyclability: string): 'High' | 'Medium' | 'Low' {
  const lower = recyclability.toLowerCase();
  if (lower.includes('high') || lower.includes('excellent') || lower.includes('very')) return 'High';
  if (lower.includes('low') || lower.includes('poor') || lower.includes('minimal')) return 'Low';
  return 'Medium';
}
