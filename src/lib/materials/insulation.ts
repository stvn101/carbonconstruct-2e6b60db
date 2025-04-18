import { ExtendedMaterialData, MATERIAL_TYPES } from './types';

export const INSULATION_MATERIALS: Record<string, ExtendedMaterialData> = {
  glasswoolInsulation: {
    name: "Glass Wool Insulation",
    factor: 0.58,
    unit: "kg",
    region: "Australia",
    notes: "Common thermal insulation in homes, often containing recycled glass.",
    tags: [MATERIAL_TYPES.INSULATION, "thermal"]
  },
  rockwoolInsulation: {
    name: "Rockwool Insulation",
    factor: 0.63,
    unit: "kg",
    region: "Australia",
    alternativeTo: "glasswoolInsulation",
    notes: "Fire-resistant mineral wool insulation.",
    tags: [MATERIAL_TYPES.INSULATION, "fire-resistant"]
  },
  sheepWoolInsulation: {
    name: "Sheep Wool Insulation",
    factor: 0.22,
    unit: "kg",
    region: "Australia",
    alternativeTo: "glasswoolInsulation",
    notes: "Natural insulation from sheep farms with excellent moisture management properties.",
    tags: [MATERIAL_TYPES.INSULATION, MATERIAL_TYPES.NATURAL, MATERIAL_TYPES.RENEWABLE]
  },
};
