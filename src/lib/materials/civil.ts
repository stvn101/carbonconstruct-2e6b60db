
import { ExtendedMaterialData, MATERIAL_TYPES } from './types';

export const CIVIL_MATERIALS: Record<string, ExtendedMaterialData> = {
  lowCarbonConcrete: {
    name: "Low-Carbon Concrete",
    factor: 0.068,
    unit: "kg",
    region: "Australia",
    alternativeTo: "concrete",
    notes: "Concrete with supplementary cementitious materials reducing carbon footprint.",
    tags: [MATERIAL_TYPES.CONCRETE, MATERIAL_TYPES.SUSTAINABLE, MATERIAL_TYPES.CIVIL]
  },
  recycledAggregate: {
    name: "Recycled Concrete Aggregate",
    factor: 0.003,
    unit: "kg",
    region: "Australia",
    alternativeTo: "aggregates",
    notes: "Crushed recycled concrete used as aggregate in new concrete or road base.",
    tags: [MATERIAL_TYPES.RECYCLED, MATERIAL_TYPES.AGGREGATE, MATERIAL_TYPES.CIVIL]
  },
  permablePavement: {
    name: "Permeable Pavement",
    factor: 0.054,
    unit: "kg",
    region: "Australia",
    alternativeTo: "asphaltPavement",
    notes: "Allows water infiltration, reducing runoff and improving stormwater management.",
    tags: [MATERIAL_TYPES.SUSTAINABLE, MATERIAL_TYPES.PAVEMENT, MATERIAL_TYPES.CIVIL]
  },
  bioretentionSoil: {
    name: "Bioretention Soil Media",
    factor: 0.009,
    unit: "kg",
    region: "Australia",
    notes: "Engineered soil for bioretention systems and rain gardens.",
    tags: [MATERIAL_TYPES.CIVIL, MATERIAL_TYPES.LANDSCAPING, "stormwater"]
  },
  geofoam: {
    name: "EPS Geofoam",
    factor: 4.39,
    unit: "kg", 
    region: "Australia",
    notes: "Lightweight fill material for embankments and retaining walls.",
    tags: [MATERIAL_TYPES.CIVIL, "lightweight-fill"]
  },
  highStrengthConcrete: {
    name: "High-Strength Concrete",
    factor: 0.132,
    unit: "kg",
    region: "Australia",
    notes: "Specialized concrete for high load applications, bridges and tall structures.",
    tags: [MATERIAL_TYPES.CONCRETE, MATERIAL_TYPES.CIVIL, MATERIAL_TYPES.STRUCTURAL]
  },
  bentonite: {
    name: "Bentonite Clay",
    factor: 0.24,
    unit: "kg",
    region: "Australia",
    notes: "Used in slurry walls, foundations, and waterproofing applications.",
    tags: [MATERIAL_TYPES.CIVIL, MATERIAL_TYPES.WATERPROOFING, MATERIAL_TYPES.NATURAL]
  },
  highwayBarrier: {
    name: "Concrete Highway Barrier",
    factor: 0.156,
    unit: "kg",
    region: "Australia",
    notes: "Precast concrete barriers for highway safety applications.",
    tags: [MATERIAL_TYPES.CONCRETE, MATERIAL_TYPES.PRECAST, MATERIAL_TYPES.CIVIL]
  },
  drainagePipe: {
    name: "HDPE Drainage Pipe",
    factor: 1.93,
    unit: "kg",
    region: "Australia",
    notes: "High-density polyethylene pipes for stormwater and drainage systems.",
    tags: [MATERIAL_TYPES.CIVIL, "drainage", "stormwater"]
  }
};
