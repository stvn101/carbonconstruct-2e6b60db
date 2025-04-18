import { ExtendedMaterialData, MATERIAL_TYPES } from './types';

export const OTHER_MATERIALS: Record<string, ExtendedMaterialData> = {
  blueboard: {
    name: "Blueboard Cladding",
    factor: 0.47,
    unit: "kg",
    region: "Australia",
    notes: "Fiber cement sheet commonly used in construction as external cladding.",
    tags: ["cladding", "exterior"]
  },
  colourbond: {
    name: "Colourbond Steel Roofing",
    factor: 2.7,
    unit: "kg",
    region: "Australia",
    notes: "Popular roofing material with good durability and solar reflectance.",
    tags: ["roofing", "metal"]
  },
};
