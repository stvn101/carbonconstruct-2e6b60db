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
};
