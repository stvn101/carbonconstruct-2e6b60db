import { ExtendedMaterialData, MATERIAL_TYPES } from './types';

export const FINISH_MATERIALS: Record<string, ExtendedMaterialData> = {
  lowVocPaint: {
    name: "Low VOC Paint",
    factor: 1.6,
    unit: "kg",
    region: "Australia",
    notes: "Environmentally friendly paint with low volatile organic compounds, suitable for sustainable buildings.",
    tags: ["finishes", "paint", "low-emission"]
  },
  limewashPaint: {
    name: "Natural Limewash",
    factor: 0.7,
    unit: "kg",
    region: "Australia",
    alternativeTo: "lowVocPaint",
    notes: "Traditional natural finish with very low embodied carbon and breathable properties.",
    tags: ["finishes", "paint", MATERIAL_TYPES.NATURAL]
  },
};
