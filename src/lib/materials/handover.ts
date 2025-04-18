import { ExtendedMaterialData, MATERIAL_TYPES } from './types';

export const HANDOVER_MATERIALS: Record<string, ExtendedMaterialData> = {
  lowFlowFixtures: {
    name: "Low-Flow Water Fixtures",
    factor: 2.5, // kg CO2e per fixture
    unit: "item",
    region: "Australia",
    notes: "Water-efficient taps and showerheads that reduce water consumption and related carbon.",
    tags: ["fixtures", "water-saving", MATERIAL_TYPES.HANDOVER]
  },
  smartMeters: {
    name: "Smart Energy Meters",
    factor: 8.3, // kg CO2e per meter
    unit: "item",
    region: "Australia",
    notes: "Digital meters that help occupants monitor and reduce energy consumption.",
    tags: [MATERIAL_TYPES.ELECTRICAL, "monitoring", MATERIAL_TYPES.HANDOVER]
  },
};
