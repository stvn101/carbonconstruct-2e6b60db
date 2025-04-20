import { ExtendedMaterialData, MATERIAL_TYPES } from './types';

export const ALTERNATIVE_MATERIALS: Record<string, ExtendedMaterialData> = {
  recycledSteel: {
    name: "Recycled Steel",
    factor: 0.63,
    unit: "kg",
    region: "Global, Australia",
    alternativeTo: "steel",
    notes: "Using recycled steel can reduce emissions by up to 60% compared to virgin steel.",
    tags: [MATERIAL_TYPES.RECYCLED, MATERIAL_TYPES.METAL, MATERIAL_TYPES.STRUCTURAL]
  },
  
  // Regional materials
  bluesteelRebar: {
    name: "BlueSteel Rebar",
    factor: 0.95,
    unit: "kg",
    region: "Australia",
    alternativeTo: "steel",
    notes: "Lower carbon reinforcement steel produced using clean energy sources.",
    tags: [MATERIAL_TYPES.STEEL, MATERIAL_TYPES.STRUCTURAL]
  },
  hardwood: {
    name: "Hardwood",
    factor: 0.35,
    unit: "kg",
    region: "Australia",
    alternativeTo: "timber",
    notes: "Sustainably sourced from forests with strong carbon storage properties.",
    tags: [MATERIAL_TYPES.SUSTAINABLE, MATERIAL_TYPES.WOOD]
  },
  clayBrick: {
    name: "Clay Brick",
    factor: 0.22,
    unit: "kg",
    region: "Australia",
    alternativeTo: "brick",
    notes: "Locally produced bricks with lower transport emissions and improved thermal properties.",
    tags: [MATERIAL_TYPES.THERMAL, MATERIAL_TYPES.DURABLE]
  },
  
  // Sustainable alternatives
  bamboo: {
    name: "Bamboo",
    factor: 0.18,
    unit: "kg",
    region: "Asia, Australia",
    alternativeTo: "timber",
    notes: "Fast-growing, renewable material with excellent carbon sequestration properties.",
    tags: [MATERIAL_TYPES.RENEWABLE, MATERIAL_TYPES.SUSTAINABLE, "fast-growing"]
  },
  hempcrete: {
    name: "Hempcrete",
    factor: 0.035,
    unit: "kg",
    region: "Europe, North America, Australia",
    alternativeTo: "concrete",
    notes: "Carbon-negative building material that actually sequesters carbon during its lifetime.",
    tags: ["carbon-negative", MATERIAL_TYPES.INSULATION, "walls"]
  },
  
  // More materials
  recycledConcrete: {
    name: "Recycled Concrete Aggregate",
    factor: 0.043,
    unit: "kg",
    region: "Australia",
    alternativeTo: "concrete",
    notes: "Made from crushed construction waste, reducing landfill and lowering carbon footprint.",
    tags: [MATERIAL_TYPES.RECYCLED, MATERIAL_TYPES.CONCRETE]
  },
  greenConcrete: {
    name: "Green Concrete (Geopolymer)",
    factor: 0.062,
    unit: "kg",
    region: "Australia",
    alternativeTo: "concrete",
    notes: "Geopolymer concrete using industrial waste materials instead of Portland cement.",
    tags: ["low-carbon", "innovative"]
  },
  
  // Additional eco alternatives
  recycledAluminum: {
    name: "Recycled Aluminum",
    factor: 1.98,
    unit: "kg",
    region: "Global, Australia",
    alternativeTo: "aluminum",
    notes: "Using recycled aluminum reduces emissions by up to 95% compared to virgin aluminum.",
    tags: [MATERIAL_TYPES.RECYCLED, MATERIAL_TYPES.METAL]
  },
  biobasedPVC: {
    name: "Bio-based PVC",
    factor: 1.12,
    unit: "kg",
    region: "Australia",
    alternativeTo: "plastic",
    notes: "PVC made partially from renewable resources, reducing fossil fuel dependency.",
    tags: [MATERIAL_TYPES.SUSTAINABLE, "innovative"]
  },
  reclaimedBrick: {
    name: "Reclaimed Brick",
    factor: 0.06,
    unit: "kg",
    region: "Australia",
    alternativeTo: "brick",
    notes: "Salvaged bricks from demolition sites, minimal processing required.",
    tags: [MATERIAL_TYPES.RECYCLED, MATERIAL_TYPES.DURABLE]
  },
  crossLaminatedTimber: {
    name: "Cross Laminated Timber",
    factor: 0.31,
    unit: "kg",
    region: "Australia",
    alternativeTo: "steel",
    notes: "Engineered wood product that can replace steel in some structural applications.",
    tags: [MATERIAL_TYPES.WOOD, MATERIAL_TYPES.STRUCTURAL]
  },
  recycledGlass: {
    name: "Recycled Glass",
    factor: 0.45,
    unit: "kg",
    region: "Australia",
    alternativeTo: "glass",
    notes: "Glass made from recycled cullet, reducing energy consumption.",
    tags: [MATERIAL_TYPES.RECYCLED, "glass"]
  },
  hempInsulation: {
    name: "Hemp Insulation",
    factor: 0.28,
    unit: "kg",
    region: "Australia",
    alternativeTo: "insulation",
    notes: "Natural insulation material with excellent thermal properties.",
    tags: [MATERIAL_TYPES.NATURAL, MATERIAL_TYPES.INSULATION]
  }
};
