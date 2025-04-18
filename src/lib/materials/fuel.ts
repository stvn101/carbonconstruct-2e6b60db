import { ExtendedMaterialData, MATERIAL_TYPES } from './types';

export const FUEL_MATERIALS: Record<string, ExtendedMaterialData> = {
  diesel: {
    name: "Construction Diesel Fuel",
    factor: 2.68,
    unit: "L",
    region: "Australia",
    notes: "Standard diesel fuel used in construction machinery and generators in Australia.",
    tags: [MATERIAL_TYPES.FUEL, "equipment", "construction"]
  },
  biodiesel: {
    name: "Biodiesel B20",
    factor: 2.14,
    unit: "L",
    region: "Australia",
    alternativeTo: "diesel",
    notes: "20% biodiesel blend available for construction equipment in Australia, reducing carbon footprint.",
    tags: [MATERIAL_TYPES.FUEL, "equipment", MATERIAL_TYPES.SUSTAINABLE]
  },
};
