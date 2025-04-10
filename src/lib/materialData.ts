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
  
  // Australian specific materials
  bluesteelRebar: {
    name: "BlueSteel Rebar (Australian)",
    factor: 0.95,
    unit: "kg",
    region: "Australia",
    alternativeTo: "steel",
    notes: "Lower carbon Australian reinforcement steel produced using clean energy sources.",
    tags: ["australian", "steel", "structural"]
  },
  ausTimber: {
    name: "Australian Hardwood",
    factor: 0.35,
    unit: "kg",
    region: "Australia",
    alternativeTo: "timber",
    notes: "Sustainably sourced from Australian forests with strong carbon storage properties.",
    tags: ["australian", "sustainable", "hardwood"]
  },
  ausBrick: {
    name: "Australian Clay Brick",
    factor: 0.22,
    unit: "kg",
    region: "Australia",
    alternativeTo: "brick",
    notes: "Locally produced bricks with lower transport emissions and improved thermal properties.",
    tags: ["australian", "thermal", "durable"]
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
  
  // More Australian materials
  recycledConcrete: {
    name: "Recycled Concrete Aggregate (AUS)",
    factor: 0.043,
    unit: "kg",
    region: "Australia",
    alternativeTo: "concrete",
    notes: "Made from crushed construction waste, reducing landfill and lowering carbon footprint.",
    tags: ["australian", "recycled", "concrete"]
  },
  greenConcrete: {
    name: "Green Concrete (Geopolymer)",
    factor: 0.062,
    unit: "kg",
    region: "Australia",
    alternativeTo: "concrete",
    notes: "Australian-developed geopolymer concrete using industrial waste materials instead of Portland cement.",
    tags: ["australian", "low-carbon", "innovative"]
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
  
  // Plumbing materials
  pvcPipe: {
    name: "PVC Pipes (AUS)",
    factor: 0.24,
    unit: "kg",
    region: "Australia",
    notes: "Common Australian plumbing material with moderate carbon footprint.",
    tags: ["australian", "plumbing", "pipes"]
  },
  pprPipe: {
    name: "PP-R Pipes (AUS)",
    factor: 0.18,
    unit: "kg",
    region: "Australia",
    alternativeTo: "pvcPipe",
    notes: "Lower carbon alternative to PVC piping systems used in Australian plumbing.",
    tags: ["australian", "plumbing", "pipes"]
  },
  copperPipe: {
    name: "Copper Pipes (AUS)",
    factor: 2.1,
    unit: "kg",
    region: "Australia",
    notes: "Premium Australian plumbing material with higher carbon footprint but excellent durability.",
    tags: ["australian", "plumbing", "pipes", "durable"]
  },
  recycledCopperPipe: {
    name: "Recycled Copper Pipes (AUS)",
    factor: 0.87,
    unit: "kg",
    region: "Australia",
    alternativeTo: "copperPipe",
    notes: "Recycled copper pipes that significantly reduce embodied carbon compared to virgin copper.",
    tags: ["australian", "plumbing", "pipes", "recycled"]
  },
  
  // Insulation materials
  glasswoolInsulation: {
    name: "Glass Wool Insulation (AUS)",
    factor: 0.58,
    unit: "kg",
    region: "Australia",
    notes: "Common thermal insulation in Australian homes, often containing recycled glass.",
    tags: ["australian", "insulation", "thermal"]
  },
  rockwoolInsulation: {
    name: "Rockwool Insulation (AUS)",
    factor: 0.63,
    unit: "kg",
    region: "Australia",
    alternativeTo: "glasswoolInsulation",
    notes: "Fire-resistant mineral wool insulation manufactured in Australia.",
    tags: ["australian", "insulation", "fire-resistant"]
  },
  sheepWoolInsulation: {
    name: "Sheep Wool Insulation (AUS)",
    factor: 0.22,
    unit: "kg",
    region: "Australia",
    alternativeTo: "glasswoolInsulation",
    notes: "Natural insulation from Australian sheep farms with excellent moisture management properties.",
    tags: ["australian", "insulation", "natural", "renewable"]
  },
  
  // Electrical materials
  copperWire: {
    name: "Copper Wiring (AUS)",
    factor: 1.8,
    unit: "kg",
    region: "Australia",
    notes: "Standard electrical wiring for Australian buildings.",
    tags: ["australian", "electrical", "wiring"]
  },
  aluminumWire: {
    name: "Aluminum Wiring (AUS)",
    factor: 1.2,
    unit: "kg",
    region: "Australia",
    alternativeTo: "copperWire",
    notes: "Alternative wiring material with lower embodied carbon but different conductivity characteristics.",
    tags: ["australian", "electrical", "wiring"]
  },
  
  // Finishes
  lowVocPaint: {
    name: "Low VOC Paint (AUS)",
    factor: 1.6,
    unit: "kg",
    region: "Australia",
    notes: "Environmentally friendly paint with low volatile organic compounds, suitable for sustainable buildings.",
    tags: ["australian", "finishes", "paint", "low-emission"]
  },
  limewashPaint: {
    name: "Natural Limewash (AUS)",
    factor: 0.7,
    unit: "kg",
    region: "Australia",
    alternativeTo: "lowVocPaint",
    notes: "Traditional natural finish with very low embodied carbon and breathable properties.",
    tags: ["australian", "finishes", "paint", "natural"]
  },
  
  // Handover materials
  lowFlowFixtures: {
    name: "Low-Flow Water Fixtures (AUS)",
    factor: 2.5, // kg CO2e per fixture
    unit: "item",
    region: "Australia",
    notes: "Water-efficient taps and showerheads that reduce water consumption and related carbon.",
    tags: ["australian", "fixtures", "water-saving", "handover"]
  },
  smartMeters: {
    name: "Smart Energy Meters (AUS)",
    factor: 8.3, // kg CO2e per meter
    unit: "item",
    region: "Australia",
    notes: "Digital meters that help occupants monitor and reduce energy consumption.",
    tags: ["australian", "electrical", "monitoring", "handover"]
  },
  
  // Australian energy sources for building operations
  solarPVSystem: {
    name: "Solar PV System (AUS)",
    factor: 30, // kg CO2e per m²
    unit: "m²",
    region: "Australia",
    notes: "Photovoltaic system for on-site renewable energy generation. Factor represents embodied carbon per m² of panel area.",
    tags: ["australian", "renewable", "energy", "rooftop"]
  },
  batteryStorage: {
    name: "Battery Storage System (AUS)",
    factor: 120, // kg CO2e per kWh capacity
    unit: "kWh",
    region: "Australia",
    notes: "Lithium-ion battery storage for solar energy. High embodied carbon but enables renewable energy use.",
    tags: ["australian", "energy", "storage", "battery"]
  },
  
  // Other common Australian materials
  blueboard: {
    name: "Blueboard Cladding (AUS)",
    factor: 0.47,
    unit: "kg",
    region: "Australia",
    notes: "Fiber cement sheet commonly used in Australian construction as external cladding.",
    tags: ["australian", "cladding", "exterior"]
  },
  colourbond: {
    name: "Colourbond Steel Roofing (AUS)",
    factor: 2.7,
    unit: "kg",
    region: "Australia",
    notes: "Popular Australian roofing material with good durability and solar reflectance.",
    tags: ["australian", "roofing", "metal"]
  }
};
