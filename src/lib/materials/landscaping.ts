
import { ExtendedMaterialData, MATERIAL_TYPES } from './types';

export const LANDSCAPING_MATERIALS: Record<string, ExtendedMaterialData> = {
  pavers: {
    name: "Concrete Pavers",
    factor: 0.18,
    unit: "kg",
    region: "Australia",
    notes: "Precast concrete pavers for paths, patios and driveways.",
    tags: [MATERIAL_TYPES.LANDSCAPING, MATERIAL_TYPES.CONCRETE, "pavers"]
  },
  naturalStone: {
    name: "Natural Stone Paving",
    factor: 0.13,
    unit: "kg",
    region: "Australia",
    notes: "Natural stone tiles and pavers for landscaping.",
    tags: [MATERIAL_TYPES.LANDSCAPING, MATERIAL_TYPES.NATURAL, "pavers"]
  },
  woodMulch: {
    name: "Wood Mulch",
    factor: 0.03,
    unit: "kg",
    region: "Australia",
    notes: "Organic wood mulch for garden beds.",
    tags: [MATERIAL_TYPES.LANDSCAPING, MATERIAL_TYPES.WOOD, MATERIAL_TYPES.NATURAL]
  },
  topSoil: {
    name: "Topsoil",
    factor: 0.003,
    unit: "kg",
    region: "Australia",
    notes: "Nutrient-rich topsoil for landscaping and garden beds.",
    tags: [MATERIAL_TYPES.LANDSCAPING, MATERIAL_TYPES.NATURAL, "soil"]
  },
  compositeDeck: {
    name: "Composite Decking",
    factor: 2.17,
    unit: "kg",
    region: "Australia",
    notes: "Wood-plastic composite decking boards.",
    tags: [MATERIAL_TYPES.LANDSCAPING, "decking", "composite"]
  },
  retainingWall: {
    name: "Concrete Retaining Wall Blocks",
    factor: 0.14,
    unit: "kg",
    region: "Australia",
    notes: "Precast concrete blocks for landscape retaining walls.",
    tags: [MATERIAL_TYPES.LANDSCAPING, MATERIAL_TYPES.CONCRETE, "retaining"]
  },
  irrigationPipe: {
    name: "PVC Irrigation Pipe",
    factor: 2.41,
    unit: "kg",
    region: "Australia",
    notes: "PVC pipes used in landscape irrigation systems.",
    tags: [MATERIAL_TYPES.LANDSCAPING, "irrigation", "pipe"]
  }
};
