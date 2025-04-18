
export interface MaterialData {
  name: string;
  factor: number;
  unit: string;
}

export interface ExtendedMaterialData extends MaterialData {
  region?: string;
  alternativeTo?: string;
  notes?: string;
  tags?: string[];
}

export interface MaterialOption {
  id: string;
  name: string;
}

export interface FilterProps {
  searchTerm: string;
  selectedRegion: string;
  selectedAlternative: string;
  selectedTag: string;
}

export interface MaterialsByRegion {
  [key: string]: number;
}
