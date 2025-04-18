import { MATERIAL_FACTORS as BASE_MATERIAL_FACTORS } from '@/lib/carbonCalculations';

export interface ExtendedMaterialData {
  name: string;
  factor: number;
  unit: string;
  region?: string;
  alternativeTo?: string;
  notes?: string;
  tags?: string[];
}

export const REGIONS = [
  "Global",
  "Australia",
  "North America",
  "Europe",
  "Asia",
  "South America",
  "Africa"
];

export const MATERIAL_FACTORS = BASE_MATERIAL_FACTORS;

export const EXTENDED_MATERIALS: Record<string, ExtendedMaterialData> = {
  ...BASE_MATERIAL_FACTORS as Record<string, ExtendedMaterialData>,
  
  // Recycled alternatives
  recycledSteel: {
    name: "Recycled Steel",
    factor: 0.63,
    unit: "kg",
    region: "Global, Australia",
    alternativeTo: "steel",
    notes: "Using recycled steel can reduce emissions by up to 60% compared to virgin steel.",
    tags: ["recycled", "metal", "structural"]
  },
  
  // Renamed materials (removing "Australian")
  bluesteelRebar: {
    name: "BlueSteel Rebar",
    factor: 0.95,
    unit: "kg",
    region: "Australia",
    alternativeTo: "steel",
    notes: "Lower carbon reinforcement steel produced using clean energy sources.",
    tags: ["steel", "structural"]
  },
  ausTimber: {
    name: "Hardwood",
    factor: 0.35,
    unit: "kg",
    region: "Australia",
    alternativeTo: "timber",
    notes: "Sustainably sourced from forests with strong carbon storage properties.",
    tags: ["sustainable", "hardwood"]
  },
  ausBrick: {
    name: "Clay Brick",
    factor: 0.22,
    unit: "kg",
    region: "Australia",
    alternativeTo: "brick",
    notes: "Locally produced bricks with lower transport emissions and improved thermal properties.",
    tags: ["thermal", "durable"]
  },
  
  // Sustainable alternatives
  bamboo: {
    name: "Bamboo",
    factor: 0.18,
    unit: "kg",
    region: "Asia, Australia",
    alternativeTo: "timber",
    notes: "Fast-growing, renewable material with excellent carbon sequestration properties.",
    tags: ["renewable", "sustainable", "fast-growing"]
  },
  hempcrete: {
    name: "Hempcrete",
    factor: 0.035,
    unit: "kg",
    region: "Europe, North America, Australia",
    alternativeTo: "concrete",
    notes: "Carbon-negative building material that actually sequesters carbon during its lifetime.",
    tags: ["carbon-negative", "insulation", "walls"]
  },
  
  // More materials (renamed to remove "Australian")
  recycledConcrete: {
    name: "Recycled Concrete Aggregate",
    factor: 0.043,
    unit: "kg",
    region: "Australia",
    alternativeTo: "concrete",
    notes: "Made from crushed construction waste, reducing landfill and lowering carbon footprint.",
    tags: ["recycled", "concrete"]
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
  
  // Construction fuels
  diesel: {
    name: "Construction Diesel Fuel",
    factor: 2.68, // kg CO2e per liter
    unit: "L",
    region: "Australia",
    notes: "Standard diesel fuel used in construction machinery and generators in Australia.",
    tags: ["fuel", "equipment", "construction"]
  },
  biodiesel: {
    name: "Biodiesel B20",
    factor: 2.14, // kg CO2e per liter (20% lower than regular diesel)
    unit: "L",
    region: "Australia",
    alternativeTo: "diesel",
    notes: "20% biodiesel blend available for construction equipment in Australia, reducing carbon footprint.",
    tags: ["fuel", "equipment", "sustainable"]
  },
  
  // Plumbing materials (renamed)
  pvcPipe: {
    name: "PVC Pipes",
    factor: 0.24,
    unit: "kg",
    region: "Australia",
    notes: "Common plumbing material with moderate carbon footprint.",
    tags: ["plumbing", "pipes"]
  },
  pprPipe: {
    name: "PP-R Pipes",
    factor: 0.18,
    unit: "kg",
    region: "Australia",
    alternativeTo: "pvcPipe",
    notes: "Lower carbon alternative to PVC piping systems used in plumbing.",
    tags: ["plumbing", "pipes"]
  },
  copperPipe: {
    name: "Copper Pipes",
    factor: 2.1,
    unit: "kg",
    region: "Australia",
    notes: "Premium plumbing material with higher carbon footprint but excellent durability.",
    tags: ["plumbing", "pipes", "durable"]
  },
  recycledCopperPipe: {
    name: "Recycled Copper Pipes",
    factor: 0.87,
    unit: "kg",
    region: "Australia",
    alternativeTo: "copperPipe",
    notes: "Recycled copper pipes that significantly reduce embodied carbon compared to virgin copper.",
    tags: ["plumbing", "pipes", "recycled"]
  },
  
  // Insulation materials (renamed)
  glasswoolInsulation: {
    name: "Glass Wool Insulation",
    factor: 0.58,
    unit: "kg",
    region: "Australia",
    notes: "Common thermal insulation in homes, often containing recycled glass.",
    tags: ["insulation", "thermal"]
  },
  rockwoolInsulation: {
    name: "Rockwool Insulation",
    factor: 0.63,
    unit: "kg",
    region: "Australia",
    alternativeTo: "glasswoolInsulation",
    notes: "Fire-resistant mineral wool insulation.",
    tags: ["insulation", "fire-resistant"]
  },
  sheepWoolInsulation: {
    name: "Sheep Wool Insulation",
    factor: 0.22,
    unit: "kg",
    region: "Australia",
    alternativeTo: "glasswoolInsulation",
    notes: "Natural insulation from sheep farms with excellent moisture management properties.",
    tags: ["insulation", "natural", "renewable"]
  },
  
  // Electrical materials (renamed)
  copperWire: {
    name: "Copper Wiring",
    factor: 1.8,
    unit: "kg",
    region: "Australia",
    notes: "Standard electrical wiring for buildings.",
    tags: ["electrical", "wiring"]
  },
  aluminumWire: {
    name: "Aluminum Wiring",
    factor: 1.2,
    unit: "kg",
    region: "Australia",
    alternativeTo: "copperWire",
    notes: "Alternative wiring material with lower embodied carbon but different conductivity characteristics.",
    tags: ["electrical", "wiring"]
  },
  
  // Finishes (renamed)
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
    tags: ["finishes", "paint", "natural"]
  },
  
  // Handover materials (renamed)
  lowFlowFixtures: {
    name: "Low-Flow Water Fixtures",
    factor: 2.5, // kg CO2e per fixture
    unit: "item",
    region: "Australia",
    notes: "Water-efficient taps and showerheads that reduce water consumption and related carbon.",
    tags: ["fixtures", "water-saving", "handover"]
  },
  smartMeters: {
    name: "Smart Energy Meters",
    factor: 8.3, // kg CO2e per meter
    unit: "item",
    region: "Australia",
    notes: "Digital meters that help occupants monitor and reduce energy consumption.",
    tags: ["electrical", "monitoring", "handover"]
  },
  
  // Energy sources for building operations (renamed)
  solarPVSystem: {
    name: "Solar PV System",
    factor: 30, // kg CO2e per m²
    unit: "m²",
    region: "Australia",
    notes: "Photovoltaic system for on-site renewable energy generation. Factor represents embodied carbon per m² of panel area.",
    tags: ["renewable", "energy", "rooftop"]
  },
  batteryStorage: {
    name: "Battery Storage System",
    factor: 120, // kg CO2e per kWh capacity
    unit: "kWh",
    region: "Australia",
    notes: "Lithium-ion battery storage for solar energy. High embodied carbon but enables renewable energy use.",
    tags: ["energy", "storage", "battery"]
  },
  
  // Other common materials (renamed)
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
  }
};
