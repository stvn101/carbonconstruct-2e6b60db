import { ExtendedMaterialData, MATERIAL_TYPES } from './types';

export const ELECTRICAL_MATERIALS: Record<string, ExtendedMaterialData> = {
  copperWire: {
    name: "Copper Wiring",
    factor: 1.8,
    unit: "kg",
    region: "Australia",
    notes: "Standard electrical wiring for buildings.",
    tags: [MATERIAL_TYPES.ELECTRICAL, "wiring"]
  },
  aluminumWire: {
    name: "Aluminum Wiring",
    factor: 1.2,
    unit: "kg",
    region: "Australia",
    alternativeTo: "copperWire",
    notes: "Alternative wiring material with lower embodied carbon but different conductivity characteristics.",
    tags: [MATERIAL_TYPES.ELECTRICAL, "wiring"]
  },
};
